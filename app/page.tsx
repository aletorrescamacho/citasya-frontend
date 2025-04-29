import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Instagram, MessageSquare, Calendar, Clock, Users, BarChart } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-primary/10">
              <Image src="/logo-calendar.png" alt="Citas Ya Logo" width={40} height={40} className="object-cover" />
            </div>
            <span className="text-xl font-extrabold gradient-heading">Citas Ya</span>
          </div>
          <nav className="hidden gap-6 md:flex">
            <Link href="#servicios" className="text-sm font-medium transition-colors hover:text-primary">
              Servicios
            </Link>
            <Link href="#precios" className="text-sm font-medium transition-colors hover:text-primary">
              Precios
            </Link>
            <Link href="#contacto" className="text-sm font-medium transition-colors hover:text-primary">
              Contacto
            </Link>
            <Link href="#afiliados" className="text-sm font-medium transition-colors hover:text-primary">
              Empresas Afiliadas
            </Link>
          </nav>
          <Link href="/admin/login">
            <Button className="rounded-full">Iniciar Sesión como Admin</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden py-12 md:py-24 lg:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(20,184,166,0.15),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(244,63,94,0.1),transparent_50%)]"></div>
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm text-teal-600 mb-4">
                  <span className="flex h-2 w-2 rounded-full bg-teal-600 mr-2"></span>
                  Sistema de Agendamiento
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none gradient-heading">
                    Gestiona tus Citas con Estilo
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Optimiza la gestión de citas de tu negocio con nuestra plataforma intuitiva y eficiente. Ahorra
                    tiempo y mejora la experiencia de tus clientes.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
                  <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-white">
                    Solicitar Demo
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full border-primary/20 hover:bg-primary/5">
                    Conocer Más
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl"></div>
                  <Image
                    src="/calendar-app-interface.png"
                    alt="Citas Ya Interface"
                    width={550}
                    height={400}
                    className="relative rounded-2xl shadow-2xl object-cover border border-white/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="servicios" className="w-full py-12 md:py-24 lg:py-32 relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent -z-10"></div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent -z-10"></div>
          <div className="absolute inset-0 -z-20 decorative-dots opacity-30"></div>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary">
                Nuestros Servicios
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-heading">
                  Soluciones Completas
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Ofrecemos todo lo que necesitas para la gestión eficiente de citas en tu negocio
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="card-hover border-primary/10 bg-gradient-to-b from-white to-primary/5">
                <CardHeader className="pb-2">
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Agendamiento Online</CardTitle>
                  <CardDescription>Sistema de reservas 24/7</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Permite a tus clientes agendar citas en cualquier momento del día, sin necesidad de llamadas
                    telefónicas.
                  </p>
                </CardContent>
              </Card>
              <Card className="card-hover border-primary/10 bg-gradient-to-b from-white to-primary/5">
                <CardHeader className="pb-2">
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Recordatorios Automáticos</CardTitle>
                  <CardDescription>Reduce las inasistencias</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Envía recordatorios automáticos por email o SMS para reducir las cancelaciones de última hora.</p>
                </CardContent>
              </Card>
              <Card className="card-hover border-primary/10 bg-gradient-to-b from-white to-primary/5">
                <CardHeader className="pb-2">
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Panel Administrativo</CardTitle>
                  <CardDescription>Control total de tu agenda</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Gestiona horarios, servicios y personal desde un panel intuitivo y fácil de usar.</p>
                </CardContent>
              </Card>
              <Card className="card-hover border-primary/10 bg-gradient-to-b from-white to-primary/5">
                <CardHeader className="pb-2">
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <BarChart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Análisis y Reportes</CardTitle>
                  <CardDescription>Datos para decisiones</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Obtén estadísticas detalladas sobre tus citas y clientes para optimizar tu negocio.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="precios" className="w-full py-12 md:py-24 lg:py-32 relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.1),transparent_50%)]"></div>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary">
                Precios Transparentes
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-heading">
                  Inversión Inteligente
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Sin sorpresas, conoce nuestros costos de implementación y mantenimiento
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-8">
              <Card className="card-hover border-2 border-primary/20 overflow-hidden">
                <div className="h-2 w-full bg-gradient-to-r from-primary to-primary/70"></div>
                <CardHeader>
                  <CardTitle>Costo de Implementación</CardTitle>
                  <CardDescription>Pago único</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-4xl font-bold gradient-heading">$XXX USD</div>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3 text-primary"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      Configuración inicial del sistema
                    </li>
                    <li className="flex items-center">
                      <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3 text-primary"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      Personalización de la plataforma
                    </li>
                    <li className="flex items-center">
                      <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3 text-primary"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      Capacitación del personal
                    </li>
                    <li className="flex items-center">
                      <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3 text-primary"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      Migración de datos existentes
                    </li>
                  </ul>
                  <Button className="w-full rounded-full mt-4">Solicitar Cotización</Button>
                </CardContent>
              </Card>
              <Card className="card-hover border-2 border-secondary/20 overflow-hidden relative">
                <div className="absolute top-2 right-2 rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                  Recomendado
                </div>
                <div className="h-2 w-full bg-gradient-to-r from-secondary/70 to-secondary"></div>
                <CardHeader>
                  <CardTitle>Costo de Mantenimiento</CardTitle>
                  <CardDescription>Pago mensual</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className="text-4xl font-bold"
                    style={{
                      background: "linear-gradient(to right, #e11d48, #f43f5e)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    $XX USD
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-secondary/10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3 text-secondary"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      Actualizaciones del sistema
                    </li>
                    <li className="flex items-center">
                      <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-secondary/10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3 text-secondary"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      Soporte técnico 24/7
                    </li>
                    <li className="flex items-center">
                      <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-secondary/10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3 text-secondary"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      Copias de seguridad automáticas
                    </li>
                    <li className="flex items-center">
                      <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-secondary/10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3 text-secondary"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      Alojamiento en la nube
                    </li>
                  </ul>
                  <Button className="w-full rounded-full mt-4 bg-secondary hover:bg-secondary/90">Suscribirse</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contacto" className="w-full py-12 md:py-24 lg:py-32 relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_left,rgba(244,63,94,0.1),transparent_50%)]"></div>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-flex items-center rounded-full border border-secondary/20 bg-secondary/5 px-3 py-1 text-sm text-secondary">
                Contáctanos
              </div>
              <div className="space-y-2">
                <h2
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                  style={{
                    background: "linear-gradient(to right, #0d9488, #e11d48)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Estamos para Ayudarte
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Responderemos todas tus preguntas y te ayudaremos a implementar nuestra solución
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-8">
              <Card className="card-hover border-primary/20 bg-gradient-to-br from-white to-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    WhatsApp
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    href="https://wa.me/TUNUMERO"
                    target="_blank"
                    className="inline-flex items-center text-primary hover:underline"
                  >
                    +XX XXX XXX XXXX
                  </Link>
                  <p className="mt-2 text-muted-foreground">Respuesta rápida de lunes a viernes de 9:00 a 18:00</p>
                  <Button variant="outline" className="mt-4 w-full rounded-full border-primary/20 hover:bg-primary/5">
                    Enviar Mensaje
                  </Button>
                </CardContent>
              </Card>
              <Card className="card-hover border-secondary/20 bg-gradient-to-br from-white to-secondary/5">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                      <Instagram className="h-5 w-5 text-secondary" />
                    </div>
                    Instagram
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    href="https://instagram.com/TUINSTAGRAM"
                    target="_blank"
                    className="inline-flex items-center text-secondary hover:underline"
                  >
                    @citasya
                  </Link>
                  <p className="mt-2 text-muted-foreground">
                    Síguenos para conocer nuestras novedades y casos de éxito
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 w-full rounded-full border-secondary/20 hover:bg-secondary/5 text-secondary"
                  >
                    Seguir
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Affiliated Companies Section */}
        <section id="afiliados" className="w-full py-12 md:py-24 lg:py-32 relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,rgba(20,184,166,0.1),transparent_50%)]"></div>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary">
                Empresas Afiliadas
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-heading">
                  Quienes Confían en Nosotros
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Estas empresas ya disfrutan de los beneficios de nuestro sistema de agendamiento
                </p>
              </div>
            </div>

            {/* Espacio para empresas afiliadas (se llenará desde el backend) */}
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 mt-8">
              {/* Este espacio se llenará con datos del backend */}
              <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-primary/25 p-4 transition-all hover:border-primary/50">
                <p className="text-center text-sm text-muted-foreground">
                  Datos de empresas afiliadas desde el backend
                </p>
              </div>
              <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-primary/25 p-4 transition-all hover:border-primary/50">
                <p className="text-center text-sm text-muted-foreground">
                  Datos de empresas afiliadas desde el backend
                </p>
              </div>
              <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-primary/25 p-4 transition-all hover:border-primary/50">
                <p className="text-center text-sm text-muted-foreground">
                  Datos de empresas afiliadas desde el backend
                </p>
              </div>
              <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-primary/25 p-4 transition-all hover:border-primary/50">
                <p className="text-center text-sm text-muted-foreground">
                  Datos de empresas afiliadas desde el backend
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-0 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2 font-bold">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary/10">
              <Image src="/logo-calendar.png" alt="Citas Ya Logo" width={32} height={32} className="object-cover" />
            </div>
            <span className="text-lg font-extrabold gradient-heading">Citas Ya</span>
          </div>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Citas Ya. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Términos
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Privacidad
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
