import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PrivacidadPage() {
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
            <h1 className="text-3xl font-bold tracking-tighter gradient-heading mb-2">Política de Privacidad</h1>
            <p className="text-muted-foreground">Última actualización: Enero 2025</p>
          </div>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">1. Información que Recopilamos</h2>
              <p className="text-muted-foreground leading-relaxed">
                En Citas Ya recopilamos información necesaria para brindar nuestros servicios de agendamiento. Los tipos
                de información que recopilamos incluyen:
              </p>
              <h3 className="text-lg font-medium text-primary mt-4 mb-2">Información de Empresas:</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Nombre de la empresa y datos de contacto</li>
                <li>Información de servicios ofrecidos</li>
                <li>Datos de empleados y horarios</li>
                <li>Credenciales de acceso al sistema</li>
              </ul>
              <h3 className="text-lg font-medium text-primary mt-4 mb-2">Información de Clientes:</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Nombre completo y número de identificación</li>
                <li>Correo electrónico y número de teléfono</li>
                <li>Historial de citas y preferencias</li>
                <li>Información de pago cuando aplique</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">2. Cómo Utilizamos su Información</h2>
              <p className="text-muted-foreground leading-relaxed">
                Utilizamos la información recopilada para los siguientes propósitos:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Facilitar el agendamiento y gestión de citas</li>
                <li>Enviar confirmaciones y recordatorios automáticos</li>
                <li>Proporcionar soporte técnico y atención al cliente</li>
                <li>Generar reportes y análisis para las empresas</li>
                <li>Mejorar nuestros servicios y funcionalidades</li>
                <li>Cumplir con obligaciones legales y regulatorias</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">3. Compartir Información</h2>
              <p className="text-muted-foreground leading-relaxed">
                No vendemos, alquilamos ni compartimos su información personal con terceros, excepto en las siguientes
                circunstancias:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Con su consentimiento explícito</li>
                <li>Para cumplir con requerimientos legales</li>
                <li>Con proveedores de servicios que nos ayudan a operar la plataforma</li>
                <li>En caso de fusión, adquisición o venta de activos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">4. Seguridad de los Datos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Implementamos medidas de seguridad técnicas y organizativas para proteger su información:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Acceso restringido basado en roles y necesidades</li>
                <li>Monitoreo continuo de seguridad</li>
                <li>Copias de seguridad automáticas y regulares</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">5. Retención de Datos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Conservamos su información personal durante el tiempo necesario para cumplir con los propósitos
                descritos en esta política, a menos que la ley requiera o permita un período de retención más largo. Los
                datos de citas se conservan por un período mínimo de 2 años para fines de historial y análisis.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">6. Sus Derechos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Usted tiene los siguientes derechos respecto a su información personal:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Acceder a la información que tenemos sobre usted</li>
                <li>Solicitar la corrección de datos inexactos</li>
                <li>Solicitar la eliminación de su información</li>
                <li>Oponerse al procesamiento de sus datos</li>
                <li>Solicitar la portabilidad de sus datos</li>
                <li>Retirar su consentimiento en cualquier momento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">7. Cookies y Tecnologías Similares</h2>
              <p className="text-muted-foreground leading-relaxed">
                Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestra plataforma. Estas
                tecnologías nos ayudan a recordar sus preferencias, analizar el uso del sitio y proporcionar
                funcionalidades personalizadas. Puede gestionar sus preferencias de cookies a través de la configuración
                de su navegador.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">8. Transferencias Internacionales</h2>
              <p className="text-muted-foreground leading-relaxed">
                Sus datos pueden ser procesados en servidores ubicados fuera de su país de residencia. Nos aseguramos de
                que cualquier transferencia internacional de datos cumpla con las leyes de protección de datos
                aplicables y se realice con las salvaguardas adecuadas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">9. Menores de Edad</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nuestros servicios están dirigidos a empresas y no recopilamos intencionalmente información personal de
                menores de 18 años. Si descubrimos que hemos recopilado información de un menor, tomaremos medidas para
                eliminar dicha información de nuestros sistemas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">10. Cambios a esta Política</h2>
              <p className="text-muted-foreground leading-relaxed">
                Podemos actualizar esta política de privacidad ocasionalmente. Le notificaremos sobre cambios
                significativos publicando la nueva política en nuestro sitio web y enviando una notificación por correo
                electrónico cuando sea apropiado.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">11. Contacto</h2>
              <p className="text-muted-foreground leading-relaxed">
                Si tiene preguntas sobre esta política de privacidad o desea ejercer sus derechos, puede contactarnos a
                través de:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>WhatsApp: +58 414 750 7522</li>
                <li>Instagram: @citasya.ve</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Nos comprometemos a responder a sus consultas dentro de un plazo razonable y a trabajar con usted para
                resolver cualquier inquietud sobre la privacidad.
              </p>
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
