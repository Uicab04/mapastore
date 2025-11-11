"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Minus, Plus } from "lucide-react"

interface CartItem {
  id: string
  title: string
  price: number
  image: string
  quantity: number
}

interface CartPageProps {
  setCurrentPage: (page: string) => void
}

export default function CartPage({ setCurrentPage }: CartPageProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    const cart = localStorage.getItem("cart")
    if (cart) {
      setCartItems(JSON.parse(cart))
    }

    const handleCartUpdate = () => {
      const updated = localStorage.getItem("cart")
      if (updated) {
        setCartItems(JSON.parse(updated))
      }
    }

    window.addEventListener("cartUpdated", handleCartUpdate)
    return () => window.removeEventListener("cartUpdated", handleCartUpdate)
  }, [])

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    const updated = cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    setCartItems(updated)
    localStorage.setItem("cart", JSON.stringify(updated))
  }

  const removeItem = (id: string) => {
    const updated = cartItems.filter((item) => item.id !== id)
    setCartItems(updated)
    localStorage.setItem("cart", JSON.stringify(updated))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-foreground mb-4">Carrito de Compras</h1>
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-muted-foreground text-lg mb-4">Tu carrito está vacío</p>
              <Button onClick={() => setCurrentPage("home")}>Seguir comprando</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-foreground mb-8">Carrito de Compras</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-24 h-32 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-primary font-bold text-xl mt-2">${item.price}</p>

                      <div className="flex items-center gap-2 mt-4">
                        <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <span className="text-lg font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                      <Button size="sm" variant="destructive" onClick={() => removeItem(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <div className="h-fit">
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Orden</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Impuesto (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>

                <Button className="w-full mt-4" size="lg" onClick={() => setCurrentPage("checkout")}>
                  Proceder al Checkout
                </Button>
                <Button variant="outline" className="w-full bg-transparent" onClick={() => setCurrentPage("home")}>
                  Seguir comprando
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
