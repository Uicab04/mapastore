"use client"

import { useState } from "react"
import { ShoppingCart, Settings, User, LogOut, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import LoginDialog from "./login-dialog"

interface NavigationProps {
  currentPage: string
  setCurrentPage: (page: string) => void
  isLoggedIn: boolean
  userRole: "user" | "admin"
  setUserRole: (role: "user" | "admin") => void
  setIsLoggedIn: (logged: boolean) => void
}

export default function Navigation({
  currentPage,
  setCurrentPage,
  isLoggedIn,
  userRole,
  setUserRole,
  setIsLoggedIn,
}: NavigationProps) {
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  // Update cart count when it changes
  const updateCartCount = () => {
    const cart = localStorage.getItem("cart")
    if (cart) {
      const items = JSON.parse(cart)
      setCartCount(items.reduce((sum: number, item: any) => sum + item.quantity, 0))
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button onClick={() => setCurrentPage("home")} className="text-2xl font-bold hover:opacity-90">
          Poster Store
        </button>

        <div className="flex items-center gap-4">
          {/* Cart Button */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                updateCartCount()
                setCurrentPage("cart")
              }}
              className="text-primary-foreground hover:bg-primary/80"
            >
              <ShoppingCart className="w-5 h-5" />
            </Button>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {!isLoggedIn ? (
                <DropdownMenuItem
                  onClick={() => setShowLoginDialog(true)}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Iniciar sesión
                </DropdownMenuItem>
              ) : (
                <>
                  {userRole === "user" && (
                    <DropdownMenuItem
                      onClick={() => setCurrentPage("profile")}
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Mi Perfil
                    </DropdownMenuItem>
                  )}
                  {userRole === "admin" && (
                    <DropdownMenuItem
                      onClick={() => setCurrentPage("admin")}
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Panel de Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      localStorage.removeItem("userRole")
                      setIsLoggedIn(false)
                      setUserRole("user")
                      setCurrentPage("home")
                    }}
                    className="cursor-pointer flex items-center gap-2 text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        setIsLoggedIn={setIsLoggedIn}
        setUserRole={setUserRole}
      />
    </nav>
  )
}
