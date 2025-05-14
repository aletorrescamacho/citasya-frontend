"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, User, Scissors, Mail, Phone, CreditCard, ArrowLeft, CheckCircle2 } from "lucide-react"
import { format, parse } from "date-fns"
import { es } from "date-fns/locale"

interface Servicio {
  id: number
  nombre: string
  duracion: number
  precio: number
}

interface Empleado {
  id: number
  nombre: string
  servicios: { servicioId: number }[]
}

interface HorarioDisponible {
  fecha: string
  horarios: { hora: string; empleadoId: number; empleadoNombre?: string }[]
}

// Definimos un tipo más específico para los horarios únicos
type HoraUnica = string
type HorarioConEmpleado = { hora: string; empleadoId: number } // Ya no necesitamos empleadoNombre aquí
type HorariosParaRenderizar = HoraUnica[] | HorarioConEmpleado[]

export default function ReservaPage() {
  const { slug } = useParams()
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [horarios, setHorarios] = useState<HorarioDisponible[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const [success, setSuccess] = useState(false)
  const [reservaInfo, setReservaInfo] = useState<{
    servicio: string
    fecha: string
    hora: string
    profesional: string
  } | null>(null)

  const [form, setForm] = useState({
    servicioId: "",
    empleadoId: "",
    fecha: "",
    hora: "",
    clienteNombre: "",
    cedula: "",
    correo: "",
    telefono: "",
  })

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/empresa/${slug}/servicios`)
      .then((res) => res.json())
      .then((data) => {
        setServicios(data)
        setLoading(false)
      })
      .catch(() => {
        setError("Error al cargar servicios")
        setLoading(false)
      })
  }, [slug])

  useEffect(() => {
    if (!slug || !form.servicioId) return

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/empresa/${slug}/empleados`)
      .then((res) => res.json())
      .then((data) => setEmpleados(data))
      .catch(() => setEmpleados([]))

    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/empresa/${slug}/fechas-horarios?servicioId=${form.servicioId}`
    if (form.empleadoId) {
      url += `&empleadoId=${form.empleadoId}`
    }
    fetch(url)
      .then((res) => res.json())
      .then((data) => setHorarios(data))
      .catch(() => setHorarios([]))
  }, [slug, form.servicioId, form.empleadoId])

  const empleadosFiltrados = empleados.filter((e) => e.servicios.some((s) => s.servicioId === Number(form.servicioId)))

  // Filtramos las fechas mostradas en el selector de fechas
  const fechasDisponiblesParaEmpleado = form.empleadoId
    ? horarios.filter((dia) => dia.horarios.some((h) => String(h.empleadoId) === form.empleadoId))
    : horarios

  const horariosDelDia = horarios.find((h) => h.fecha === form.fecha)?.horarios || []

  // Separamos la lógica para obtener las horas según si se filtró por empleado
  const horasParaRenderizar: HorariosParaRenderizar = !form.empleadoId
    ? Array.from(new Set(horariosDelDia.map((h) => h?.hora).filter(Boolean))).sort()
    : horariosDelDia
        .filter((h) => h?.hora && String(h.empleadoId) === form.empleadoId)
        .map((h) => ({
          hora: h.hora,
          empleadoId: h.empleadoId,
        }))

  const formatFecha = (fechaStr: string) => {
    try {
      const fecha = parse(fechaStr, "yyyy-MM-dd", new Date())
      return format(fecha, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })
    } catch (error) {
      return fechaStr
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!slug) return
    try {
      setLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/empresa/${slug}/reservar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          servicioId: Number(form.servicioId),
          empleadoId: form.empleadoId ? Number(form.empleadoId) : undefined,
        }),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Error al reservar")
      }

      // Guardar información de la reserva para mostrarla en el mensaje de éxito
      setReservaInfo({
        servicio: servicios.find((s) => s.id === Number(form.servicioId))?.nombre || "",
        fecha: formatFecha(form.fecha),
        hora: form.hora,
        profesional: form.empleadoId
          ? empleados.find((e) => e.id === Number(form.empleadoId))?.nombre || ""
          : "Cualquier empleado",
      })

      // Mostrar mensaje de éxito
      setSuccess(true)

      // Después de 5 segundos, recargar la página
      setTimeout(() => {
        window.location.reload()
      }, 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al reservar")
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  // Si la reserva fue exitosa, mostrar mensaje de confirmación
  if (success && reservaInfo) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
        <header className="container flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <ArrowLeft size={20} />
            <span>Volver al inicio</span>
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-primary/10 overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold gradient-heading mb-2">¡Reserva Confirmada!</h2>
              <p className="text-gray-600 mb-6">Tu cita ha sido agendada exitosamente.</p>

              <div className="bg-primary/5 rounded-lg p-4 border border-primary/10 text-left mb-6">
                <h3 className="font-medium text-primary mb-2">Detalles de tu Cita</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Servicio:</span>
                    <span className="font-medium">{reservaInfo.servicio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fecha:</span>
                    <span className="font-medium">{reservaInfo.fecha}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hora:</span>
                    <span className="font-medium">{reservaInfo.hora}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Profesional:</span>
                    <span className="font-medium">{reservaInfo.profesional}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                Hemos enviado los detalles a tu Whatsapp. Serás redirigido en unos segundos...
              </p>

              <button
                onClick={() => window.location.reload()}
                className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-6 rounded-full transition-colors"
              >
                Reservar otra cita
              </button>
            </div>
          </div>
        </main>

        <footer className="w-full border-t py-6 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
            <div className="flex items-center gap-2 font-bold">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary/10">
                <Image src="/logo-calendar.png" alt="Citas Ya Logo" width={32} height={32} className="object-cover" />
              </div>
              <span className="text-lg font-extrabold gradient-heading">Citas Ya</span>
            </div>
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © 2025 Citas Ya. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <header className="container flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <ArrowLeft size={20} />
          <span>Volver al inicio</span>
        </Link>
      </header>

      <main className="flex-1 container py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tighter gradient-heading mb-2">Reserva tu Cita</h1>
            <p className="text-muted-foreground">Completa el formulario para agendar una cita con {slug as string}</p>
          </div>

          {/* Barra de progreso */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <div
                className={`flex-1 h-2 rounded-l-full ${
                  currentStep >= 1 ? "bg-primary" : "bg-muted"
                } transition-colors`}
              ></div>
              <div className={`flex-1 h-2 ${currentStep >= 2 ? "bg-primary" : "bg-muted"} transition-colors`}></div>
              <div
                className={`flex-1 h-2 rounded-r-full ${
                  currentStep >= 3 ? "bg-primary" : "bg-muted"
                } transition-colors`}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span className={currentStep >= 1 ? "text-primary font-medium" : ""}>Servicio</span>
              <span className={currentStep >= 2 ? "text-primary font-medium" : ""}>Fecha y Hora</span>
              <span className={currentStep >= 3 ? "text-primary font-medium" : ""}>Tus Datos</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">{error}</div>
          )}

          <div className="bg-white rounded-xl shadow-lg border border-primary/10 overflow-hidden">
            <form onSubmit={handleSubmit}>
              {/* Paso 1: Selección de Servicio */}
              {currentStep === 1 && (
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="servicio"
                        className="flex items-center gap-2 text-base font-medium text-gray-700 mb-2"
                      >
                        <Scissors className="h-5 w-5 text-primary" />
                        Selecciona un Servicio
                      </label>
                      <select
                        id="servicio"
                        required
                        value={form.servicioId}
                        onChange={(e) =>
                          setForm({ ...form, servicioId: e.target.value, empleadoId: "", fecha: "", hora: "" })
                        }
                        className="w-full p-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      >
                        <option value="">Seleccionar servicio</option>
                        {servicios.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.nombre} - {s.duracion}min
                          </option>
                        ))}
                      </select>
                    </div>

                    {form.servicioId && (
                      <div>
                        <label
                          htmlFor="empleado"
                          className="flex items-center gap-2 text-base font-medium text-gray-700 mb-2"
                        >
                          <User className="h-5 w-5 text-primary" />
                          Selecciona un Profesional (Opcional)
                        </label>
                        <select
                          id="empleado"
                          value={form.empleadoId}
                          onChange={(e) => setForm({ ...form, empleadoId: e.target.value, fecha: "", hora: "" })}
                          className="w-full p-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        >
                          <option value="">Cualquier empleado</option>
                          {empleadosFiltrados.map((e) => (
                            <option key={e.id} value={e.id}>
                              {e.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {form.servicioId && (
                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                      <h3 className="font-medium text-primary mb-2">Detalles del Servicio</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Servicio:</span>
                          <p className="font-medium">
                            {servicios.find((s) => s.id === Number(form.servicioId))?.nombre}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Duración:</span>
                          <p className="font-medium">
                            {servicios.find((s) => s.id === Number(form.servicioId))?.duracion} minutos
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Precio:</span>
                          <p className="font-medium">
                            ${servicios.find((s) => s.id === Number(form.servicioId))?.precio.toFixed(2)}
                          </p>
                        </div>
                        {form.empleadoId && (
                          <div>
                            <span className="text-muted-foreground">Profesional:</span>
                            <p className="font-medium">
                              {empleados.find((e) => e.id === Number(form.empleadoId))?.nombre}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-6 rounded-full transition-colors"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}

              {/* Paso 2: Selección de Fecha y Hora */}
              {currentStep === 2 && (
                <div className="p-6 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <label htmlFor="fecha" className="text-base font-medium text-gray-700">
                        Selecciona una Fecha
                      </label>
                    </div>
                    <select
                      id="fecha"
                      required
                      value={form.fecha}
                      onChange={(e) => setForm({ ...form, fecha: e.target.value, hora: "" })}
                      className="w-full p-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    >
                      <option value="">Seleccionar fecha</option>
                      {fechasDisponiblesParaEmpleado.map((h) => (
                        <option key={h.fecha} value={h.fecha}>
                          {formatFecha(h.fecha)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {form.fecha && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-primary" />
                        <label className="text-base font-medium text-gray-700">Selecciona una Hora</label>
                      </div>
                      <div className="flex flex-wrap gap-2 my-4">
                        {horasParaRenderizar.length === 0 ? (
                          <div className="text-center py-6 border rounded-md bg-muted/30 w-full">
                            <Clock className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
                            <p className="text-muted-foreground">No hay horarios disponibles para esta fecha</p>
                          </div>
                        ) : (
                          horasParaRenderizar.map((h) => {
                            if (typeof h === "string") {
                              // Caso: "Cualquier empleado" - h es solo la hora
                              return (
                                <button
                                  type="button"
                                  key={h}
                                  className={`px-4 py-2.5 rounded-md border ${
                                    form.hora === h
                                      ? "bg-primary text-white border-primary"
                                      : "bg-white text-primary border-primary/50 hover:bg-primary/5"
                                  } transition-colors`}
                                  onClick={() => setForm({ ...form, hora: h, empleadoId: "" })}
                                >
                                  {h}
                                </button>
                              )
                            } else {
                              // Caso: Empleado específico - h es el objeto con hora y empleadoId
                              return (
                                <button
                                  type="button"
                                  key={`${h.hora}-${h.empleadoId}`}
                                  className={`px-4 py-2.5 rounded-md border ${
                                    form.hora === h.hora && form.empleadoId === String(h.empleadoId)
                                      ? "bg-primary text-white border-primary"
                                      : "bg-white text-primary border-primary/50 hover:bg-primary/5"
                                  } transition-colors`}
                                  onClick={() =>
                                    setForm({
                                      ...form,
                                      hora: h.hora,
                                      empleadoId: String(h.empleadoId),
                                    })
                                  }
                                >
                                  {h.hora}
                                </button>
                              )
                            }
                          })
                        )}
                      </div>
                    </div>
                  )}

                  {form.fecha && form.hora && (
                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                      <h3 className="font-medium text-primary mb-2">Resumen de tu Cita</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Servicio:</span>
                          <p className="font-medium">
                            {servicios.find((s) => s.id === Number(form.servicioId))?.nombre}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Fecha:</span>
                          <p className="font-medium">{formatFecha(form.fecha)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Hora:</span>
                          <p className="font-medium">{form.hora}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Profesional:</span>
                          <p className="font-medium">
                            {form.empleadoId
                              ? empleados.find((e) => e.id === Number(form.empleadoId))?.nombre
                              : "Cualquier empleado"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="border border-gray-300 bg-white text-gray-700 font-medium py-2.5 px-6 rounded-full hover:bg-gray-50 transition-colors"
                    >
                      Anterior
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-6 rounded-full transition-colors"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}

              {/* Paso 3: Información del Cliente */}
              {currentStep === 3 && (
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="clienteNombre"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"
                      >
                        <User className="h-4 w-4 text-primary" />
                        Nombre completo
                      </label>
                      <input
                        id="clienteNombre"
                        placeholder="Ingresa tu nombre completo"
                        required
                        value={form.clienteNombre}
                        onChange={(e) => setForm({ ...form, clienteNombre: e.target.value })}
                        className="w-full p-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="cedula"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"
                      >
                        <CreditCard className="h-4 w-4 text-primary" />
                        Cédula o Identificación
                      </label>
                      <input
                        id="cedula"
                        placeholder="Ingresa tu número de cédula"
                        required
                        value={form.cedula}
                        onChange={(e) => setForm({ ...form, cedula: e.target.value })}
                        className="w-full p-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="correo"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"
                      >
                        <Mail className="h-4 w-4 text-primary" />
                        Correo electrónico
                      </label>
                      <input
                        id="correo"
                        placeholder="ejemplo@correo.com"
                        type="email"
                        required
                        value={form.correo}
                        onChange={(e) => setForm({ ...form, correo: e.target.value })}
                        className="w-full p-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="telefono"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"
                      >
                        <Phone className="h-4 w-4 text-primary" />
                        Teléfono
                      </label>
                      <input
                        id="telefono"
                        placeholder="Ingresa tu número de teléfono"
                        required
                        value={form.telefono}
                        onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                        className="w-full p-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                    <h3 className="font-medium text-primary mb-2">Resumen de tu Cita</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Servicio:</span>
                        <p className="font-medium">{servicios.find((s) => s.id === Number(form.servicioId))?.nombre}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Profesional:</span>
                        <p className="font-medium">
                          {form.empleadoId
                            ? empleados.find((e) => e.id === Number(form.empleadoId))?.nombre
                            : "Cualquier empleado"}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Fecha:</span>
                        <p className="font-medium">{formatFecha(form.fecha)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Hora:</span>
                        <p className="font-medium">{form.hora}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Precio:</span>
                        <p className="font-medium">
                          ${servicios.find((s) => s.id === Number(form.servicioId))?.precio.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="border border-gray-300 bg-white text-gray-700 font-medium py-2.5 px-6 rounded-full hover:bg-gray-50 transition-colors"
                    >
                      Anterior
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`bg-primary text-white font-medium py-2.5 px-6 rounded-full ${
                        loading ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90"
                      } transition-colors`}
                    >
                      {loading ? "Reservando..." : "Confirmar Reserva"}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>

      <footer className="w-full border-t py-6 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <div className="flex items-center gap-2 font-bold">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary/10">
              <Image src="/logo-calendar.png" alt="Citas Ya Logo" width={32} height={32} className="object-cover" />
            </div>
            <span className="text-lg font-extrabold gradient-heading">Citas Ya</span>
          </div>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Citas Ya. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
