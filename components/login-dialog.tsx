"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  setIsLoggedIn: (logged: boolean) => void
  setUserRole: (role: "user" | "admin") => void
}

export default function LoginDialog({ open, onOpenChange, setIsLoggedIn, setUserRole }: LoginDialogProps) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    if (email && password) {
      const role = isAdmin ? "admin" : "user"
      localStorage.setItem("userRole", role)
      setUserRole(role)
      setIsLoggedIn(true)
      onOpenChange(false)
      setEmail("")
      setPassword("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Iniciar sesión</DialogTitle>
          <DialogDescription>Accede a tu cuenta o usa las credenciales de demo</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@ejemplo.com"
              type="email"
            />
          </div>

          <div>
            <Label className="mb-2 block">Contraseña</Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Soy administrador</span>
            </label>
          </div>

          <div className="bg-muted p-3 rounded-md text-sm">
            <p className="font-semibold mb-1">Demo:</p>
            <p>Usuario: demo@poster.com</p>
            <p>Contraseña: demo123</p>
            <p className="text-xs mt-2 text-muted-foreground">Marca "Soy administrador" para acceder al panel</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleLogin} className="flex-1">
              Iniciar sesión
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
