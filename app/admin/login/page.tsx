"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Lock, User } from "lucide-react"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
  
    if (!username || !password) {
      setError("Por favor completa todos los campos")
      return
    }
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario: username,
          llave: password,
        }),
      })
  
      if (!res.ok) {
        throw new Error("Credenciales inválidas")
      }
  
      const data = await res.json()
  
      // Asumiendo que el backend te devuelve { empresaSlug: "tamanaco-spa" }
      const empresaSlug = data.empresaSlug
     

  
      if (!empresaSlug) {
        throw new Error("Error al obtener empresa")
      }
  

      localStorage.setItem("auth_empresa_slug", empresaSlug);

      router.push(`/admin/${empresaSlug}/dashboard`)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Error al iniciar sesión")
    }
  }
  

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <header className="container flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <ArrowLeft size={20} />
          <span>Volver al inicio</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-primary/10">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <div className="relative h-12 w-12 overflow-hidden rounded-full bg-primary/10">
                <Image src="/logo-calendar.png" alt="Citas Ya Logo" width={48} height={48} className="object-cover" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold gradient-heading">Acceso Administrativo</CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder al panel de administración</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="Nombre de usuario"
                    className="pl-10"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Llave de acceso</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Contraseña"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              {error && <div className="text-sm text-destructive text-center">{error}</div>}
              <Button type="submit" className="w-full rounded-full">
                Iniciar Sesión
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-xs text-center text-muted-foreground">
              Este acceso es exclusivo para administradores del sistema.
              <br />
              Si necesitas ayuda, contacta al soporte técnico.
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
