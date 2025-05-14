"use client"

import { DialogTrigger } from "@/components/ui/dialog"

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
  BarChart2,
  TrendingUp,
  PieChart,
  Activity,
  CalendarIcon,
  User,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

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

// Agregar este array de duraciones permitidas después de la declaración de diasSemana
const duracionesPermitidas = [
  { valor: 30, etiqueta: "30 minutos" },
  { valor: 60, etiqueta: "1 hora" },
  { valor: 90, etiqueta: "1 hora y 30 minutos" },
  { valor: 120, etiqueta: "2 horas" },
  { valor: 150, etiqueta: "2 horas y 30 minutos" },
  { valor: 180, etiqueta: "3 horas" },
  { valor: 210, etiqueta: "3 horas y 30 minutos" },
  { valor: 240, etiqueta: "4 horas" },
  { valor: 270, etiqueta: "4 horas y 30 minutos" },
  { valor: 300, etiqueta: "5 horas" },
  { valor: 330, etiqueta: "5 horas y 30 minutos" },
  { valor: 360, etiqueta: "6 horas" },
]

// Colores para los gráficos
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#F06292",
  "#4DB6AC",
  "#FFD54F",
  "#9575CD",
]

export default function AdminDashboard() {
  const { slug } = useParams()
  const router = useRouter()

  const [servicios, setServicios] = useState<Servicio[]>([])
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [citas, setCitas] = useState<Cita[]>([])
  const [totalCitas, setTotalCitas] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [stats, setStats] = useState({
    porMes: {},
    porEmpleado: {},
    porServicio: {},
    porDia: {},
    porAnio: {},
  })

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const [mes, emp, serv, dia, anio] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/estadisticas/${slug}/citas-por-mes`).then((r) =>
            r.json(),
          ),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/estadisticas/${slug}/citas-por-empleado`).then((r) =>
            r.json(),
          ),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/estadisticas/${slug}/citas-por-servicio`).then((r) =>
            r.json(),
          ),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/estadisticas/${slug}/citas-por-dia-ultimos-7`).then((r) =>
            r.json(),
          ),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/estadisticas/${slug}/citas-por-anio`).then((r) =>
            r.json(),
          ),
        ])
        setStats({ porMes: mes, porEmpleado: emp, porServicio: serv, porDia: dia, porAnio: anio })
      } catch (err) {
        console.error("Error al cargar estadísticas", err)
      }
    }

    if (slug) fetchEstadisticas()
  }, [slug])

  // Modificar el estado nuevoServicio para que duracion sea un número en lugar de string
  const [nuevoServicio, setNuevoServicio] = useState({ nombre: "", duracion: 30, precio: "" })
  const [nuevoEmpleado, setNuevoEmpleado] = useState({ nombre: "" })

  const [servicioSeleccionado, setServicioSeleccionado] = useState<Servicio | null>(null)
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | null>(null)

  // Modificar el estado editarServicio para que duracion sea un número
  const [editarServicio, setEditarServicio] = useState({ nombre: "", duracion: 30, precio: "" })
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

  // Preparar datos para los gráficos
  const prepararDatosGraficos = () => {
    // Datos para gráfico de barras por mes
    const datosPorMes = Object.entries(stats.porMes).map(([mes, cantidad]) => ({
      name: mes,
      citas: cantidad,
    }))

    // Datos para gráfico de pastel por servicio
    const datosPorServicio = Object.entries(stats.porServicio).map(([servicio, cantidad]) => ({
      name: servicio,
      value: cantidad,
    }))

    // Datos para gráfico de barras por empleado
    const datosPorEmpleado = Object.entries(stats.porEmpleado).map(([empleado, cantidad]) => ({
      name: empleado,
      citas: cantidad,
    }))

    // Datos para gráfico de línea por día
    const datosPorDia = Object.entries(stats.porDia).map(([dia, cantidad]) => ({
      name: dia,
      citas: cantidad,
    }))

    return { datosPorMes, datosPorServicio, datosPorEmpleado, datosPorDia }
  }

  const { datosPorMes, datosPorServicio, datosPorEmpleado, datosPorDia } = prepararDatosGraficos()

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
          const [serviciosRes, empleadosRes, citasRes, totalCitasRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/empresa/${slug}/servicios`),
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/empresa/${slug}/empleados`),
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/citas/${slug}`),
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/citas/${slug}/total`),
          ])

          if (!serviciosRes.ok || !empleadosRes.ok || !citasRes.ok || !totalCitasRes.ok) {
            throw new Error("Error al cargar datos")
          }

          const [serviciosData, empleadosData, citasData, totalCitasData] = await Promise.all([
            serviciosRes.json(),
            empleadosRes.json(),
            citasRes.json(),
            totalCitasRes.json(),
          ])

          setServicios(serviciosData)
          setEmpleados(empleadosData)
          setCitas(citasData)
          setTotalCitas(totalCitasData.total)
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
    // Modificar la función crearServicio para que no necesite convertir la duración
    const duracion = nuevoServicio.duracion
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
    // Modificar la función editarServicioSubmit para que no necesite convertir la duración
    const duracion = editarServicio.duracion
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
      // Modificar la función que establece el estado de editarServicio al seleccionar un servicio
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
          {/* Reemplazar la sección de TabsList con esta implementación simplificada */}
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="citas" className="px-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Citas</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="servicios" className="px-4">
              <div className="flex items-center gap-2">
                <Scissors className="h-4 w-4" />
                <span>Servicios</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="empleados" className="px-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Empleados</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="estadisticas" className="px-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                <span>Estadísticas</span>
              </div>
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
                    {/* Reemplazar el input de duración en el formulario de crear servicio (buscar la sección con id="duracion-servicio") */}
                    <div className="grid gap-2">
                      <Label htmlFor="duracion-servicio">Duración</Label>
                      <Select
                        value={nuevoServicio.duracion.toString()}
                        onValueChange={(value) =>
                          setNuevoServicio({ ...nuevoServicio, duracion: Number.parseInt(value) })
                        }
                      >
                        <SelectTrigger id="duracion-servicio">
                          <SelectValue placeholder="Selecciona la duración" />
                        </SelectTrigger>
                        <SelectContent>
                          {duracionesPermitidas.map((duracion) => (
                            <SelectItem key={duracion.valor} value={duracion.valor.toString()}>
                              {duracion.etiqueta}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                                        // Modificar la función que establece el estado de editarServicio al seleccionar un servicio
                                        setEditarServicio({
                                          nombre: s.nombre,
                                          duracion: s.duracion,
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
                                        {/* Reemplazar el input de duración en el formulario de editar servicio */}
                                        <div className="grid gap-2">
                                          <Label htmlFor="edit-duracion">Duración</Label>
                                          <Select
                                            value={editarServicio.duracion.toString()}
                                            onValueChange={(value) =>
                                              setEditarServicio({ ...editarServicio, duracion: Number.parseInt(value) })
                                            }
                                          >
                                            <SelectTrigger id="edit-duracion">
                                              <SelectValue placeholder="Selecciona la duración" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {duracionesPermitidas.map((duracion) => (
                                                <SelectItem key={duracion.valor} value={duracion.valor.toString()}>
                                                  {duracion.etiqueta}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
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

          {/* Sección de Estadísticas */}
          <TabsContent value="estadisticas" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Resumen de Estadísticas */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Resumen de Actividad
                  </CardTitle>
                  <CardDescription>Métricas clave de tu negocio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg">
                      <CalendarIcon className="h-8 w-8 text-primary mb-2" />
                      <p className="text-sm text-muted-foreground">Total Citas</p>
                      <p className="text-2xl font-bold">{totalCitas}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-secondary/5 rounded-lg">
                      <User className="h-8 w-8 text-secondary mb-2" />
                      <p className="text-sm text-muted-foreground">Empleados</p>
                      <p className="text-2xl font-bold">{empleados.length}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg">
                      <Scissors className="h-8 w-8 text-primary mb-2" />
                      <p className="text-sm text-muted-foreground">Servicios</p>
                      <p className="text-2xl font-bold">{servicios.length}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-secondary/5 rounded-lg">
                      <Activity className="h-8 w-8 text-secondary mb-2" />
                      <p className="text-sm text-muted-foreground">Tasa de Ocupación</p>
                      <p className="text-2xl font-bold">
                        {empleados.length > 0 ? Math.round((totalCitas / empleados.length) * 10) / 10 : 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de Citas por Servicio */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    Citas por Servicio
                  </CardTitle>
                  <CardDescription>Distribución de citas según el tipo de servicio</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center h-[300px]">
                  {datosPorServicio.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={datosPorServicio}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => {
                            // Acortar el nombre si es necesario para la etiqueta en el gráfico
                            const displayName = name.length > 12 ? `${name.substring(0, 10)}...` : name
                            return `${(percent * 100).toFixed(0)}%`
                          }}
                        >
                          {datosPorServicio.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} citas`, "Cantidad"]} />
                        <Legend width={280} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <PieChart className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                      <p>No hay datos disponibles</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Gráfico de Citas por Mes */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-primary" />
                    Citas por Mes
                  </CardTitle>
                  <CardDescription>Evolución mensual de las citas</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {datosPorMes.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={datosPorMes} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} citas`, "Cantidad"]} />
                        <Bar dataKey="citas" fill="#0088FE" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BarChart2 className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                      <p>No hay datos disponibles</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Gráfico de Citas por Empleado */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Citas por Empleado
                  </CardTitle>
                  <CardDescription>Distribución de citas por miembro del equipo</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {datosPorEmpleado.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={datosPorEmpleado}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip formatter={(value) => [`${value} citas`, "Cantidad"]} />
                        <Bar dataKey="citas" fill="#00C49F" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                      <p>No hay datos disponibles</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Gráfico de Citas por Día (últimos 7 días) */}
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Citas por Día (últimos 7 días)
                  </CardTitle>
                  <CardDescription>Tendencia de citas en la última semana</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {datosPorDia.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={datosPorDia} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} citas`, "Cantidad"]} />
                        <Legend />
                        <Line type="monotone" dataKey="citas" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                      <p>No hay datos disponibles</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
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
