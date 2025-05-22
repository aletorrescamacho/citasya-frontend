"use client"

import type React from "react"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, CreditCard, Search, CheckCircle2, AlertCircle } from "lucide-react"

interface CitaInfo {
  id: string
  servicio: { nombre: string }
  fecha: string
  hora: string
  profesional: string | null
  estado: string
  cedula: string
  clienteNombre: string
  // ... (añade aquí todas las propiedades que esperas en citaInfo)
}

export default function CancelarCitaPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [step, setStep] = useState(1)
  const [citaInfo, setCitaInfo] = useState<CitaInfo | null>(null)
  const [form, setForm] = useState({
    idCita: "",
    cedula: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const buscarCita = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/empresa/${slug}/buscar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idCita: form.idCita, cedula: form.cedula }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData?.error || "No se encontró la cita")
      }

      const data: CitaInfo = await response.json()
      setCitaInfo(data)
      setStep(2)
    } catch (err: any) {
      setError(err.message || "No se encontró ninguna cita con los datos proporcionados.")
    } finally {
      setLoading(false)
    }
  }

  const confirmarCancelacion = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/empresa/${slug}/${form.idCita}/cancelar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cedula: form.cedula }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData?.error || "Error al cancelar la cita")
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Error al cancelar la cita. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const volverAReservar = () => {
    router.push(`/empresa/${slug}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <header className="container flex h-16 items-center px-4">
        <Link
          href={`/empresa/${slug}`}
          className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity"
        >
          <ArrowLeft size={20} />
          <span>Volver a reservas</span>
        </Link>
      </header>

      <main className="flex-1 container py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tighter mb-2">
              <span className="text-red-500">Cancelar</span> <span className="gradient-heading">Cita</span>
            </h1>
            <p className="text-muted-foreground">Completa el formulario para cancelar una cita previamente agendada</p>
          </div>

          {success ? (
            <div className="bg-white rounded-xl shadow-lg border border-primary/10 overflow-hidden p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">¡Cita Cancelada!</h2>
              <p className="text-gray-600 mb-6">
                Tu cita ha sido cancelada exitosamente. Hemos enviado un correo de confirmación.
              </p>
              <button
                onClick={volverAReservar}
                className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-6 rounded-full transition-colors"
              >
                Reservar nueva cita
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-primary/10 overflow-hidden">
              {error && (
                <div className="mx-6 mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {step === 1 && (
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                      <Search className="h-5 w-5 text-primary" />
                      Buscar tu cita
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Ingresa el ID de tu cita y tu número de cédula para encontrar tu reserva
                    </p>
                  </div>

                  <form onSubmit={buscarCita} className="space-y-4">
                    <div>
                      <label htmlFor="idCita" className="block text-sm font-medium text-gray-700 mb-1">
                        ID de la cita
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <input
                          id="idCita"
                          name="idCita"
                          required
                          placeholder="Ej: CIT-12345"
                          value={form.idCita}
                          onChange={handleChange}
                          className="w-full pl-10 p-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        El ID de la cita fue enviado a tu correo electrónico cuando agendaste la reserva
                      </p>
                    </div>

                    <div>
                      <label htmlFor="cedula" className="block text-sm font-medium text-gray-700 mb-1">
                        Cédula o Identificación
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <input
                          id="cedula"
                          name="cedula"
                          required
                          placeholder="Ingresa tu número de cédula"
                          value={form.cedula}
                          onChange={handleChange}
                          className="w-full pl-10 p-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-6 rounded-full transition-colors ${
                          loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {loading ? "Buscando..." : "Buscar Cita"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {step === 2 && citaInfo && (
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Detalles de la cita
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Confirma los detalles de la cita que deseas cancelar
                    </p>
                  </div>

                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/10 mb-6">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">ID de la cita:</span>
                        <p className="font-medium">{citaInfo.id}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Estado:</span>
                        <p className="font-medium">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            {citaInfo.estado}
                          </span>
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cliente:</span>
                        <p className="font-medium">{citaInfo.clienteNombre}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cédula:</span>
                        <p className="font-medium">{citaInfo.cedula}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Servicio:</span>
                        <p className="font-medium">{citaInfo.servicio.nombre}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Profesional:</span>
                        <p className="font-medium">{citaInfo.profesional || "Sin asignar"}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Fecha:</span>
                        <p className="font-medium">{citaInfo.fecha}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Hora:</span>
                        <p className="font-medium">{citaInfo.hora}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-lg p-4 border border-red-200 mb-6">
                    <h3 className="font-medium text-red-700 mb-2 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      Importante
                    </h3>
                    <p className="text-sm text-red-600">
                      Al cancelar esta cita, el horario quedará disponible para otros clientes y no podrás recuperarla.
                      ¿Estás seguro de que deseas cancelar?
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 border border-gray-300 bg-white text-gray-700 font-medium py-2.5 px-6 rounded-full hover:bg-gray-50 transition-colors"
                    >
                      Volver
                    </button>
                    <button
                      type="button"
                      onClick={confirmarCancelacion}
                      disabled={loading}
                      className={`flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-6 rounded-full transition-colors ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? "Procesando..." : "Confirmar Cancelación"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
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
