import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  ArrowLeft,
  BookOpen,
  Play,
  HelpCircle,
  Download,
  FileText,
  Video,
  Users,
  Calendar,
  Settings,
  BarChart3,
  MessageSquare,
} from "lucide-react"

export default function AyudaPage() {
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
          <Link href="/">
            <Button variant="outline" size="sm" className="rounded-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tighter gradient-heading mb-2">Centro de Ayuda</h1>
            <p className="text-muted-foreground">Todo lo que necesitas saber para aprovechar al máximo Citas Ya</p>
          </div>

          <Tabs defaultValue="manuales" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="manuales" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Manuales de Usuario
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Videos Explicativos
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Preguntas Frecuentes
              </TabsTrigger>
            </TabsList>

            {/* Manuales de Usuario */}
            <TabsContent value="manuales" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="card-hover border-primary/10">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Settings className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Guía de Configuración Inicial</CardTitle>
                        <CardDescription>Primeros pasos para configurar tu cuenta</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Aprende a configurar tu empresa, servicios y empleados desde cero.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="#" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Descargar PDF
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="card-hover border-primary/10">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Gestión de Citas</CardTitle>
                        <CardDescription>Cómo administrar las reservas</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Manual completo para gestionar citas, horarios y disponibilidad.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="#" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Descargar PDF
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="card-hover border-primary/10">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Administración de Empleados</CardTitle>
                        <CardDescription>Gestión del personal y horarios</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Guía para añadir empleados, asignar servicios y configurar horarios.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="#" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Descargar PDF
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="card-hover border-primary/10">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <BarChart3 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Reportes y Estadísticas</CardTitle>
                        <CardDescription>Análisis de datos y métricas</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Cómo interpretar y utilizar los reportes para mejorar tu negocio.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="#" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Descargar PDF
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="card-hover border-primary/10">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Manual Completo</CardTitle>
                        <CardDescription>Guía completa del sistema</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Manual completo con todas las funcionalidades del sistema.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="#" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Descargar PDF
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="card-hover border-secondary/10">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-secondary/10 rounded-lg">
                        <MessageSquare className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Soporte Personalizado</CardTitle>
                        <CardDescription>Ayuda directa de nuestro equipo</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      ¿Necesitas ayuda específica? Contacta directamente con nuestro equipo.
                    </p>
                    <Button className="w-full bg-secondary hover:bg-secondary/90" asChild>
                      <Link href="https://wa.me/584147507522" target="_blank" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Contactar Soporte
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Videos Explicativos */}
            <TabsContent value="videos" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="card-hover border-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5 text-primary" />
                      Configuración Inicial del Sistema
                    </CardTitle>
                    <CardDescription>Duración: 8 minutos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <Play className="h-12 w-12 text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Video Tutorial</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Aprende paso a paso cómo configurar tu cuenta, añadir servicios y configurar empleados.
                    </p>
                    <Button variant="outline" className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Ver Video
                    </Button>
                  </CardContent>
                </Card>

                <Card className="card-hover border-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5 text-primary" />
                      Gestión de Citas y Reservas
                    </CardTitle>
                    <CardDescription>Duración: 6 minutos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <Play className="h-12 w-12 text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Video Tutorial</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Cómo visualizar, filtrar y gestionar las citas programadas en tu negocio.
                    </p>
                    <Button variant="outline" className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Ver Video
                    </Button>
                  </CardContent>
                </Card>

                <Card className="card-hover border-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5 text-primary" />
                      Configuración de Horarios
                    </CardTitle>
                    <CardDescription>Duración: 5 minutos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <Play className="h-12 w-12 text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Video Tutorial</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Aprende a configurar horarios de trabajo para tus empleados y servicios.
                    </p>
                    <Button variant="outline" className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Ver Video
                    </Button>
                  </CardContent>
                </Card>

                <Card className="card-hover border-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5 text-primary" />
                      Análisis y Reportes
                    </CardTitle>
                    <CardDescription>Duración: 7 minutos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <Play className="h-12 w-12 text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Video Tutorial</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Cómo interpretar las estadísticas y usar los reportes para mejorar tu negocio.
                    </p>
                    <Button variant="outline" className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Ver Video
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-secondary/20 bg-gradient-to-r from-secondary/5 to-primary/5">
                <CardHeader>
                  <CardTitle className="text-center">¿Necesitas un video específico?</CardTitle>
                  <CardDescription className="text-center">
                    Podemos crear tutoriales personalizados para tu equipo
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="bg-secondary hover:bg-secondary/90" asChild>
                    <Link href="https://wa.me/584147507522" target="_blank">
                      Solicitar Video Personalizado
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preguntas Frecuentes */}
            <TabsContent value="faq" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-primary">Configuración y Uso</h3>
                  <Accordion type="single" collapsible className="space-y-2">
                    <AccordionItem value="item-1" className="border border-primary/10 rounded-lg px-4">
                      <AccordionTrigger className="text-left">
                        ¿Cómo configuro mi primera cuenta en Citas Ya?
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Después del pago de implementación, recibirás tus credenciales por WhatsApp. Ingresa al panel
                        administrativo, configura tu información de empresa, añade tus servicios y empleados, y
                        establece los horarios de trabajo.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className="border border-primary/10 rounded-lg px-4">
                      <AccordionTrigger className="text-left">
                        ¿Puedo modificar los servicios después de crearlos?
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Sí, puedes editar el nombre, duración y precio de cualquier servicio desde el panel
                        administrativo. Los cambios se aplicarán inmediatamente para nuevas reservas.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3" className="border border-primary/10 rounded-lg px-4">
                      <AccordionTrigger className="text-left">
                        ¿Cómo asigno servicios específicos a mis empleados?
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        En la sección de empleados, selecciona "Editar" en el empleado deseado. Podrás marcar qué
                        servicios puede realizar cada empleado y configurar sus horarios de trabajo.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4" className="border border-primary/10 rounded-lg px-4">
                      <AccordionTrigger className="text-left">
                        ¿Los clientes reciben confirmación automática?
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Sí, cada vez que un cliente agenda una cita, recibe automáticamente un correo de confirmación
                        con todos los detalles: servicio, fecha, hora y profesional asignado.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 text-primary">Facturación y Soporte</h3>
                  <Accordion type="single" collapsible className="space-y-2">
                    <AccordionItem value="item-5" className="border border-primary/10 rounded-lg px-4">
                      <AccordionTrigger className="text-left">¿Cuándo se cobra la mensualidad?</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        La mensualidad de $20 USD se cobra cada 30 días a partir de la fecha de activación de tu cuenta.
                        Te notificaremos por WhatsApp antes del vencimiento.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6" className="border border-primary/10 rounded-lg px-4">
                      <AccordionTrigger className="text-left">
                        ¿Qué pasa si no pago la mensualidad a tiempo?
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Tienes un período de gracia de 5 días. Después de este tiempo, el acceso se suspende
                        temporalmente hasta que se regularice el pago. No se pierden los datos.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-7" className="border border-primary/10 rounded-lg px-4">
                      <AccordionTrigger className="text-left">¿Cómo contacto al soporte técnico?</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Puedes contactarnos por WhatsApp al +58 414 750 7522 de lunes a viernes de 9:00 a 18:00. También
                        puedes seguirnos en Instagram @citasya.ve para novedades.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-8" className="border border-primary/10 rounded-lg px-4">
                      <AccordionTrigger className="text-left">
                        ¿Puedo cancelar el servicio en cualquier momento?
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Sí, puedes cancelar con 30 días de anticipación. El servicio continuará activo hasta el final
                        del período pagado. Puedes solicitar una copia de tus datos antes de la cancelación.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>

              <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardHeader>
                  <CardTitle className="text-center">¿No encuentras la respuesta que buscas?</CardTitle>
                  <CardDescription className="text-center">
                    Nuestro equipo de soporte está listo para ayudarte con cualquier consulta
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" asChild>
                    <Link href="https://wa.me/584147507522" target="_blank" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      WhatsApp
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="https://instagram.com/citasya.ve" target="_blank" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Instagram
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
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
