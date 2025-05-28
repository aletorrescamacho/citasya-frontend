import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TerminosPage() {
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tighter gradient-heading mb-2">Términos y Condiciones</h1>
            <p className="text-muted-foreground">Última actualización: Enero 2025</p>
          </div>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">1. Aceptación de los Términos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Al acceder y utilizar el sistema de agendamiento Citas Ya, usted acepta estar sujeto a estos términos y
                condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro
                servicio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">2. Descripción del Servicio</h2>
              <p className="text-muted-foreground leading-relaxed">
                Citas Ya es una plataforma de software como servicio (SaaS) que permite a las empresas gestionar sus
                citas y reservas de manera eficiente. Nuestro servicio incluye:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Sistema de agendamiento online 24/7</li>
                <li>Panel administrativo para gestión de servicios y empleados</li>
                <li>Confirmaciones automáticas por correo electrónico</li>
                <li>Análisis y reportes de actividad</li>
                <li>Soporte técnico especializado</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">3. Registro y Cuentas de Usuario</h2>
              <p className="text-muted-foreground leading-relaxed">
                Para utilizar nuestros servicios, las empresas deben solicitar su creación de credenciales en el sistema. Usted es
                responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades que
                ocurran bajo su cuenta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">4. Pagos y Facturación</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nuestro servicio opera bajo un modelo de suscripción mensual con un costo de implementación inicial:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Costo de implementación: $20 USD (pago único)</li>
                <li>Costo de mantenimiento: $20 USD (pago mensual)</li>
                <li>Los pagos se reportan a través de nuestro Whatsapp</li>
                <li>Las tarifas están sujetas a cambios con previo aviso de 30 días</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">5. Uso Aceptable</h2>
              <p className="text-muted-foreground leading-relaxed">
                Usted se compromete a utilizar nuestro servicio únicamente para fines legítimos y comerciales. Está
                prohibido:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Usar el servicio para actividades ilegales o no autorizadas</li>
                <li>Intentar acceder a sistemas o datos no autorizados</li>
                <li>Interferir con el funcionamiento normal del servicio</li>
                <li>Compartir credenciales de acceso con terceros no autorizados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">6. Propiedad Intelectual</h2>
              <p className="text-muted-foreground leading-relaxed">
                Todos los derechos de propiedad intelectual del software, diseño, contenido y materiales de Citas Ya son
                propiedad exclusiva de nuestra empresa. Los usuarios reciben una licencia limitada y no exclusiva para
                usar el servicio según estos términos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">7. Limitación de Responsabilidad</h2>
              <p className="text-muted-foreground leading-relaxed">
                Citas Ya no será responsable por daños indirectos, incidentales, especiales o consecuentes que resulten
                del uso o la imposibilidad de usar nuestro servicio. Nuestra responsabilidad total no excederá el monto
                pagado por el servicio en los últimos 12 meses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">8. Terminación</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cualquiera de las partes puede terminar este acuerdo en cualquier momento con previo aviso de 30 días.
                En caso de terminación, el acceso al servicio cesará al final del período de facturación actual.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">9. Modificaciones</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán
                notificados a través de nuestro sitio web y por correo electrónico con al menos 30 días de anticipación.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">10. Contacto</h2>
              <p className="text-muted-foreground leading-relaxed">
                Si tiene preguntas sobre estos términos y condiciones, puede contactarnos a través de:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>WhatsApp: +58 414 750 7522</li>
                <li>Instagram: @citasya.ve</li>
              </ul>
            </section>
          </div>
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
