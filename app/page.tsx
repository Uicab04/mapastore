"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import HomePage from "@/components/home-page"
import AdminPanel from "@/components/admin-panel"
import CartPage from "@/components/cart-page"
import ProfilePage from "@/components/profile-page"
import CheckoutPage from "@/components/checkout-page"

export default function Page() {
  const [currentPage, setCurrentPage] = useState("home")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<"user" | "admin">("user")

  useEffect(() => {
    const stored = localStorage.getItem("userRole")
    if (stored) {
      setUserRole(stored as "user" | "admin")
      setIsLoggedIn(true)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        setUserRole={setUserRole}
        setIsLoggedIn={setIsLoggedIn}
      />

      <main className="min-h-screen">
        {currentPage === "home" && <HomePage setCurrentPage={setCurrentPage} />}
        {currentPage === "admin" && isLoggedIn && userRole === "admin" && <AdminPanel />}
        {currentPage === "cart" && <CartPage setCurrentPage={setCurrentPage} />}
        {currentPage === "checkout" && <CheckoutPage setCurrentPage={setCurrentPage} />}
        {currentPage === "profile" && isLoggedIn && <ProfilePage />}
      </main>
    </div>
  )
}
