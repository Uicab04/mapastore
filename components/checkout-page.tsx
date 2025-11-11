"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
}

interface CheckoutPageProps {
  setCurrentPage: (page: string) => void
}

export default function CheckoutPage({ setCurrentPage }: CheckoutPageProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [shippingMethod, setShippingMethod] = useState("standard")

  useEffect(() => {
    const cart = localStorage.getItem("cart")
    if (cart) {
      setCartItems(JSON.parse(cart))
    }
  }, [])

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const shipping = shippingMethod === "express" ? 15 : 5
  const total = subtotal + tax + shipping

  const handlePlaceOrder = () => {
    const profile = localStorage.getItem("userProfile")
    if (!profile) {
      alert("Por favor completa tu perfil primero")
      setCurrentPage("profile")
      return
    }

    setIsProcessing(true)

    setTimeout(() => {
      const orderId = Date.now().toString()
      const order = {
        id: orderId,
        date: new Date().toISOString(),
        total: total,
        items: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        status: "pending" as const,
      }

      const existingOrders = localStorage.getItem("orders")
      const orders = existingOrders ? JSON.parse(existingOrders) : []
      orders.push(order)
      localStorage.setItem("orders", JSON.stringify(orders))

      localStorage.removeItem("cart")
      setIsProcessing(false)
      setOrderPlaced(true)

      setTimeout(() => {
        setCurrentPage("home")
      }, 2000)
    }, 1500)
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-8 pb-16">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="text-center">
            <CardContent className="pt-12 pb-12">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-2xl font-bold mb-2">¡Pedido Confirmado!</h2>
              <p className="text-muted-foreground mb-4">
                Tu pedido ha sido procesado exitosamente. Te enviaremos un correo de confirmación.
              </p>
              <p className="text-sm font-semibold text-green-600 mb-2">¡Tu pedido está en camino! ✓</p>
              <p className="text-sm text-muted-foreground">Redirigiendo a inicio...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Order Items */}
          <div className="md:col-span-2 space-y-4">
            {/* Shipping Method */}
            <Card>
              <CardHeader>
                <CardTitle>Método de Envío</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-muted">
                  <input
                    type="radio"
                    name="shipping"
                    value="standard"
                    checked={shippingMethod === "standard"}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="ml-3 flex-1">
                    <span className="font-semibold">Envío Estándar (5-7 días)</span>
                    <span className="text-sm text-muted-foreground block">$5.00</span>
                  </span>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-muted">
                  <input
                    type="radio"
                    name="shipping"
                    value="express"
                    checked={shippingMethod === "express"}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="ml-3 flex-1">
                    <span className="font-semibold">Envío Exprés (2-3 días)</span>
                    <span className="text-sm text-muted-foreground block">$15.00</span>
                  </span>
                </label>
              </CardContent>
            </Card>

            {/* Payment Method */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Método de Pago</CardTitle>
                <CardDescription>Selecciona tu opción de pago</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-muted">
                  <input type="radio" name="payment" value="paypal" defaultChecked className="w-4 h-4" />
                  <span className="ml-3">PayPal - Pago seguro sin tarjeta</span>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-muted">
                  <input type="radio" name="payment" value="bank" className="w-4 h-4" />
                  <span className="ml-3">Transferencia Bancaria</span>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-muted">
                  <input type="radio" name="payment" value="crypto" className="w-4 h-4" />
                  <span className="ml-3">Criptomonedas</span>
                </label>
              </CardContent>
            </Card> */}
          </div>

          {/* Order Summary */}
          <div className="h-fit">
            <Card>
              <CardHeader>
                <CardTitle>Resumen Final</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.title} x{item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Impuesto</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={isProcessing}>
                  {isProcessing ? "Procesando..." : "Completar Compra"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
