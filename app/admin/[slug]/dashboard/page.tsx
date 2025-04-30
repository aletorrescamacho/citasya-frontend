"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Calendar,
  Clock,
  Users,
  Scissors,
  Plus,
  Save,
  Trash2,
  Edit,
  ArrowLeft,
  AlertCircle,
  LogOut,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Servicio {
  id: number
  nombre: string
  duracion: number
  precio: number
}

interface Horario {
  dia: string
  horaInicio: string
  horaFin: string
}

interface Empleado {
  id: number
  nombre: string
  horarios: Horario[]
  servicios: { servicioId: number }[]
}

interface Cita {
  id: number
  clienteNombre: string
  fecha: string
  hora: string
  servicio: { nombre: string }
  empleado?: { nombre: string }
}

const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]

export default function AdminDashboard() {
  const { slug } = useParams()
  const router = useRouter()

  const [servicios, setServicios] = useState<Servicio[]>([])
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [citas, setCitas] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [nuevoServicio, setNuevoServicio] = useState({ nombre: "", duracion: "", precio: "" })
  const [nuevoEmpleado, setNuevoEmpleado] = useState({ nombre: "" })

  const [servicioSeleccionado, setServicioSeleccionado] = useState<Servicio | null>(null)
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | null>(null)

  const [editarServicio, setEditarServicio] = useState({ nombre: "", duracion: "", precio: "" })
  const [editarEmpleado, setEditarEmpleado] = useState({
    nombre: "",
    horarios: [] as Horario[],
    servicios: [] as number[],
  })

  const [servicioEliminarId, setServicioEliminarId] = useState<number | null>(null)
  const [empleadoEliminarId, setEmpleadoEliminarId] = useState<number | null>(null)

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(() => async () => {})
  const [confirmMessage, setConfirmMessage] = useState("")

  // Verificar autenticación
  useEffect(() => {
    const authSlug = localStorage.getItem("auth_empresa_slug")
    if (!authSlug || authSlug !== slug) {
      router.push("/admin/login") // Redirige si no está autenticado
    }
  }, [slug, router])

  useEffect(() => {
    if (slug) {
      const fetchData = async () => {
        setLoading(true)
        setError("")
        try {
          const [serviciosRes, empleadosRes, citasRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/empresa/${slug}/servicios`),
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/empresa/${slug}/empleados`),
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/citas/${slug}`),
          ])

          if (!serviciosRes.ok || !empleadosRes.ok || !citasRes.ok) {
            throw new Error("Error al cargar datos")
          }

          const [serviciosData, empleadosData, citasData] = await Promise.all([
            serviciosRes.json(),
            empleadosRes.json(),
            citasRes.json(),
          ])

          setServicios(serviciosData)
          setEmpleados(empleadosData)
          setCitas(citasData)
        } catch (err) {
          setError("Error al cargar datos. Por favor, intenta nuevamente.")
          console.error(err)
        } finally {
          setLoading(false)
        }
      }

      fetchData()
    }
  }, [slug])

  const cerrarSesion = () => {
    localStorage.removeItem("auth_empresa_slug")
    router.push("/admin/login")
  }

  const crearServicio = async () => {
    const duracion = Number.parseInt(nuevoServicio.duracion)
    const precio = Number.parseFloat(nuevoServicio.precio)
    if (!nuevoServicio.nombre || isNaN(duracion) || duracion < 1 || isNaN(precio) || precio < 0) {
      setError("Datos inválidos para servicio")
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/servicio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevoServicio.nombre, duracion, precio, empresaSlug: slug }),
      })

      if (!response.ok) {
        throw new Error("Error al crear servicio")
      }

      location.reload()
    } catch (err) {
      setError("Error al crear servicio. Por favor, intenta nuevamente.")
      console.error(err)
    }
  }

  const crearEmpleado = async () => {
    if (!nuevoEmpleado.nombre) {
      setError("Nombre de empleado requerido")
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/empleado`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevoEmpleado.nombre, empresaSlug: slug }),
      })

      if (!response.ok) {
        throw new Error("Error al crear empleado")
      }

      location.reload()
    } catch (err) {
      setError("Error al crear empleado. Por favor, intenta nuevamente.")
      console.error(err)
    }
  }

  const editarServicioSubmit = async () => {
    if (!servicioSeleccionado) return
    const duracion = Number.parseInt(editarServicio.duracion)
    const precio = Number.parseFloat(editarServicio.precio)
    if (!editarServicio.nombre || isNaN(duracion) || duracion < 1 || isNaN(precio) || precio < 0) {
      setError("Datos inválidos al editar servicio")
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/servicio/${servicioSeleccionado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: editarServicio.nombre, duracion, precio }),
      })

      if (!response.ok) {
        throw new Error("Error al editar servicio")
      }

      location.reload()
    } catch (err) {
      setError("Error al editar servicio. Por favor, intenta nuevamente.")
      console.error(err)
    }
  }

  const eliminarServicio = async (id: number) => {
    if (!id) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/servicio/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar servicio")
      }

      location.reload()
    } catch (err) {
      setError("Error al eliminar servicio. Por favor, intenta nuevamente.")
      console.error(err)
    }
  }

  const eliminarEmpleado = async (id: number) => {
    if (!id) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/empleado/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar empleado")
      }

      location.reload()
    } catch (err) {
      setError("Error al eliminar empleado. Por favor, intenta nuevamente.")
      console.error(err)
    }
  }

  const seleccionarEmpleado = (id: number) => {
    const empleado = empleados.find((e) => e.id === id)
    if (empleado) {
      setEmpleadoSeleccionado(empleado)
      setEditarEmpleado({
        nombre: empleado.nombre,
        horarios: empleado.horarios || [],
        servicios: empleado.servicios?.map((s) => s.servicioId) || [],
      })
    }
  }

  const editarEmpleadoSubmit = async () => {
    if (!empleadoSeleccionado) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/empleado/${empleadoSeleccionado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editarEmpleado),
      })

      if (!response.ok) {
        throw new Error("Error al editar empleado")
      }

      location.reload()
    } catch (err) {
      setError("Error al editar empleado. Por favor, intenta nuevamente.")
      console.error(err)
    }
  }

  const agregarHorario = () => {
    setEditarEmpleado((prev) => ({
      ...prev,
      horarios: [...prev.horarios, { dia: "lunes", horaInicio: "08:00", horaFin: "12:00" }],
    }))
  }

  const eliminarHorario = (idx: number) => {
    setEditarEmpleado((prev) => ({
      ...prev,
      horarios: prev.horarios.filter((_, i) => i !== idx),
    }))
  }

  const confirmarAccion = (accion: () => Promise<void>, mensaje: string) => {
    setConfirmAction(() => accion)
    setConfirmMessage(mensaje)
    setConfirmDialogOpen(true)
  }

  const ejecutarAccionConfirmada = async () => {
    await confirmAction()
    setConfirmDialogOpen(false)
  }

  const formatFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr)
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
        <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-primary/10">
                <Image src="/logo-calendar.png" alt="Citas Ya Logo" width={40} height={40} className="object-cover" />
              </div>
              <span className="text-xl font-extrabold gradient-heading">Citas Ya</span>
            </div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Cargando datos...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-primary/10">
              <Image src="/logo-calendar.png" alt="Citas Ya Logo" width={40} height={40} className="object-cover" />
            </div>
            <span className="text-xl font-extrabold gradient-heading">Citas Ya</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">
              Empresa: <span className="text-primary font-semibold">{slug as string}</span>
            </span>
            <Link href="/">
              <Button variant="outline" size="sm" className="rounded-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Button>
            </Link>
            <Button variant="destructive" size="sm" className="rounded-full" onClick={cerrarSesion}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tighter gradient-heading mb-2">Panel de Administración</h1>
          <p className="text-muted-foreground">Gestiona los servicios, empleados y citas de tu negocio</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="citas" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="citas" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Citas</span>
            </TabsTrigger>
            <TabsTrigger value="servicios" className="flex items-center gap-2">
              <Scissors className="h-4 w-4" />
              <span>Servicios</span>
            </TabsTrigger>
            <TabsTrigger value="empleados" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Empleados</span>
            </TabsTrigger>
          </TabsList>

          {/* Sección de Citas */}
          <TabsContent value="citas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Citas Programadas
                </CardTitle>
                <CardDescription>Visualiza todas las citas programadas en tu negocio</CardDescription>
              </CardHeader>
              <CardContent>
                {citas.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Hora</TableHead>
                          <TableHead>Servicio</TableHead>
                          <TableHead>Empleado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {citas.map((c) => (
                          <TableRow key={c.id}>
                            <TableCell className="font-medium">{c.clienteNombre}</TableCell>
                            <TableCell>{formatFecha(c.fecha)}</TableCell>
                            <TableCell>{c.hora}</TableCell>
                            <TableCell>{c.servicio.nombre}</TableCell>
                            <TableCell>{c.empleado?.nombre || "(sin asignar)"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                    <p>No hay citas programadas</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sección de Servicios */}
          <TabsContent value="servicios" className="space-y-6">
            {/* Crear Servicio */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Crear Nuevo Servicio
                </CardTitle>
                <CardDescription>Añade un nuevo servicio a tu catálogo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nombre-servicio">Nombre del servicio</Label>
                    <Input
                      id="nombre-servicio"
                      placeholder="Ej: Corte de cabello"
                      onChange={(e) => setNuevoServicio({ ...nuevoServicio, nombre: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="duracion-servicio">Duración (minutos)</Label>
                      <Input
                        id="duracion-servicio"
                        type="number"
                        min={1}
                        placeholder="30"
                        onChange={(e) => setNuevoServicio({ ...nuevoServicio, duracion: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="precio-servicio">Precio</Label>
                      <Input
                        id="precio-servicio"
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="25.00"
                        onChange={(e) => setNuevoServicio({ ...nuevoServicio, precio: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={crearServicio} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Servicio
                </Button>
              </CardFooter>
            </Card>

            {/* Lista de Servicios */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="h-5 w-5 text-primary" />
                  Servicios Disponibles
                </CardTitle>
                <CardDescription>Gestiona los servicios que ofreces</CardDescription>
              </CardHeader>
              <CardContent>
                {servicios.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Duración</TableHead>
                          <TableHead>Precio</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {servicios.map((s) => (
                          <TableRow key={s.id}>
                            <TableCell className="font-medium">{s.nombre}</TableCell>
                            <TableCell>{s.duracion} min</TableCell>
                            <TableCell>${s.precio.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => {
                                        setServicioSeleccionado(s)
                                        setEditarServicio({
                                          nombre: s.nombre,
                                          duracion: s.duracion.toString(),
                                          precio: s.precio.toString(),
                                        })
                                      }}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Editar Servicio</DialogTitle>
                                      <DialogDescription>
                                        Modifica los detalles del servicio seleccionado
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid gap-2">
                                        <Label htmlFor="edit-nombre">Nombre</Label>
                                        <Input
                                          id="edit-nombre"
                                          value={editarServicio.nombre}
                                          onChange={(e) =>
                                            setEditarServicio({ ...editarServicio, nombre: e.target.value })
                                          }
                                        />
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                          <Label htmlFor="edit-duracion">Duración (min)</Label>
                                          <Input
                                            id="edit-duracion"
                                            type="number"
                                            min={1}
                                            value={editarServicio.duracion}
                                            onChange={(e) =>
                                              setEditarServicio({ ...editarServicio, duracion: e.target.value })
                                            }
                                          />
                                        </div>
                                        <div className="grid gap-2">
                                          <Label htmlFor="edit-precio">Precio</Label>
                                          <Input
                                            id="edit-precio"
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            value={editarServicio.precio}
                                            onChange={(e) =>
                                              setEditarServicio({ ...editarServicio, precio: e.target.value })
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button onClick={editarServicioSubmit}>
                                        <Save className="h-4 w-4 mr-2" />
                                        Guardar Cambios
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() =>
                                    confirmarAccion(async () => {
                                      await eliminarServicio(s.id)
                                    }, `¿Estás seguro de que deseas eliminar el servicio "${s.nombre}"?`)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Scissors className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                    <p>No hay servicios disponibles</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sección de Empleados */}
          <TabsContent value="empleados" className="space-y-6">
            {/* Crear Empleado */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Añadir Nuevo Empleado
                </CardTitle>
                <CardDescription>Registra un nuevo miembro del equipo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nombre-empleado">Nombre del empleado</Label>
                    <Input
                      id="nombre-empleado"
                      placeholder="Nombre completo"
                      onChange={(e) => setNuevoEmpleado({ nombre: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={crearEmpleado} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Empleado
                </Button>
              </CardFooter>
            </Card>

            {/* Lista de Empleados */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Equipo de Trabajo
                </CardTitle>
                <CardDescription>Gestiona tu personal y sus horarios</CardDescription>
              </CardHeader>
              <CardContent>
                {empleados.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Servicios</TableHead>
                          <TableHead>Horarios</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {empleados.map((e) => (
                          <TableRow key={e.id}>
                            <TableCell className="font-medium">{e.nombre}</TableCell>
                            <TableCell>
                              {e.servicios && e.servicios.length > 0 ? (
                                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                  {e.servicios.length} servicios
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-xs">Sin servicios asignados</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {e.horarios && e.horarios.length > 0 ? (
                                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                  {e.horarios.length} horarios
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-xs">Sin horarios definidos</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="icon" onClick={() => seleccionarEmpleado(e.id)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-3xl">
                                    <DialogHeader>
                                      <DialogTitle>Editar Empleado</DialogTitle>
                                      <DialogDescription>
                                        Modifica los detalles, horarios y servicios del empleado
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-6 py-4">
                                      <div className="grid gap-2">
                                        <Label htmlFor="edit-nombre-empleado">Nombre</Label>
                                        <Input
                                          id="edit-nombre-empleado"
                                          value={editarEmpleado.nombre}
                                          onChange={(e) =>
                                            setEditarEmpleado({ ...editarEmpleado, nombre: e.target.value })
                                          }
                                        />
                                      </div>

                                      <div>
                                        <div className="flex items-center justify-between mb-2">
                                          <Label className="text-base font-medium">Horarios</Label>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={agregarHorario}
                                            className="h-8 px-2 text-xs"
                                          >
                                            <Plus className="h-3.5 w-3.5 mr-1" />
                                            Añadir horario
                                          </Button>
                                        </div>

                                        {editarEmpleado.horarios.length > 0 ? (
                                          <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                                            {editarEmpleado.horarios.map((h, idx) => (
                                              <div
                                                key={idx}
                                                className="flex items-center gap-2 p-2 rounded-md border bg-muted/30"
                                              >
                                                <Select
                                                  value={h.dia}
                                                  onValueChange={(value: string) => {
                                                    const nuevos = [...editarEmpleado.horarios]
                                                    nuevos[idx].dia = value
                                                    setEditarEmpleado({ ...editarEmpleado, horarios: nuevos })
                                                  }}
                                                >
                                                  <SelectTrigger className="w-[120px]">
                                                    <SelectValue placeholder="Día" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    {diasSemana.map((d) => (
                                                      <SelectItem key={d} value={d}>
                                                        {d.charAt(0).toUpperCase() + d.slice(1)}
                                                      </SelectItem>
                                                    ))}
                                                  </SelectContent>
                                                </Select>

                                                <div className="flex items-center gap-1">
                                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                                  <Input
                                                    type="time"
                                                    value={h.horaInicio}
                                                    onChange={(e) => {
                                                      const nuevos = [...editarEmpleado.horarios]
                                                      nuevos[idx].horaInicio = e.target.value
                                                      setEditarEmpleado({ ...editarEmpleado, horarios: nuevos })
                                                    }}
                                                    className="w-[110px]"
                                                  />
                                                </div>

                                                <div className="flex items-center gap-1">
                                                  <span className="text-muted-foreground">a</span>
                                                  <Input
                                                    type="time"
                                                    value={h.horaFin}
                                                    onChange={(e) => {
                                                      const nuevos = [...editarEmpleado.horarios]
                                                      nuevos[idx].horaFin = e.target.value
                                                      setEditarEmpleado({ ...editarEmpleado, horarios: nuevos })
                                                    }}
                                                    className="w-[110px]"
                                                  />
                                                </div>

                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  onClick={() => eliminarHorario(idx)}
                                                  className="ml-auto h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <div className="text-center py-6 border rounded-md bg-muted/30">
                                            <Clock className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
                                            <p className="text-sm text-muted-foreground">No hay horarios definidos</p>
                                          </div>
                                        )}
                                      </div>

                                      <div>
                                        <Label className="text-base font-medium mb-2 block">
                                          Servicios que realiza
                                        </Label>
                                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
                                          {servicios.map((s) => (
                                            <div
                                              key={s.id}
                                              className="flex items-center space-x-2 p-2 rounded-md border"
                                            >
                                              <Checkbox
                                                id={`servicio-${s.id}`}
                                                checked={editarEmpleado.servicios.includes(s.id)}
                                                onCheckedChange={(checked: boolean) => {
                                                  const nuevos = checked
                                                    ? [...editarEmpleado.servicios, s.id]
                                                    : editarEmpleado.servicios.filter((id) => id !== s.id)
                                                  setEditarEmpleado({ ...editarEmpleado, servicios: nuevos })
                                                }}
                                              />
                                              <Label
                                                htmlFor={`servicio-${s.id}`}
                                                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                              >
                                                {s.nombre}
                                              </Label>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button onClick={editarEmpleadoSubmit}>
                                        <Save className="h-4 w-4 mr-2" />
                                        Guardar Cambios
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() =>
                                    confirmarAccion(async () => {
                                      await eliminarEmpleado(e.id)
                                    }, `¿Estás seguro de que deseas eliminar al empleado "${e.nombre}"?`)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                    <p>No hay empleados registrados</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Diálogo de confirmación */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar acción</DialogTitle>
            <DialogDescription>{confirmMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={ejecutarAccionConfirmada}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
