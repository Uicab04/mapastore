"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Package } from "lucide-react"

interface UserProfile {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
}

interface Order {
  id: string
  date: string
  total: number
  items: number
  status: "pending" | "shipped" | "delivered"
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })
  const [orders, setOrders] = useState<Order[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("userProfile")
    if (stored) {
      setProfile(JSON.parse(stored))
    }

    const storedOrders = localStorage.getItem("orders")
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders))
    }
  }, [])

  const handleSaveProfile = () => {
    setIsSaving(true)
    localStorage.setItem("userProfile", JSON.stringify(profile))
    setTimeout(() => {
      setIsSaving(false)
      alert("Perfil guardado exitosamente")
    }, 500)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Pendiente</span>
      case "shipped":
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">En tránsito</span>
      case "delivered":
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Entregado</span>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">Mi Perfil</h1>

        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList>
            <TabsTrigger value="profile">Información Personal</TabsTrigger>
            <TabsTrigger value="orders">Mis Pedidos</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Dirección de Envío
                </CardTitle>
                <CardDescription>Actualiza tu información de envío</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      placeholder="juan@ejemplo.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    name="address"
                    value={profile.address}
                    onChange={handleInputChange}
                    placeholder="Calle Principal 123"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      name="city"
                      value={profile.city}
                      onChange={handleInputChange}
                      placeholder="Madrid"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Provincia</Label>
                    <Input
                      id="state"
                      name="state"
                      value={profile.state}
                      onChange={handleInputChange}
                      placeholder="Madrid"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Código Postal</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={profile.zipCode}
                      onChange={handleInputChange}
                      placeholder="28001"
                    />
                  </div>
                </div>

                <Button onClick={handleSaveProfile} disabled={isSaving} className="w-full">
                  {isSaving ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground text-lg">No tienes pedidos aún</p>
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Pedido #{order.id}</p>
                        <p className="text-lg font-semibold">${order.total.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{order.items} artículos</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {new Date(order.date).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">{getStatusBadge(order.status)}</div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
