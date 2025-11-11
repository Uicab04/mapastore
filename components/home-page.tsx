"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Heart } from "lucide-react"

interface Poster {
  id: string
  title: string
  description: string
  price: number
  image: string
  category: string
}

interface HomePageProps {
  setCurrentPage: (page: string) => void
}

export default function HomePage({ setCurrentPage }: HomePageProps) {
  const [posters, setPosters] = useState<Poster[]>([])
  const [filteredPosters, setFilteredPosters] = useState<Poster[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("posters")
    if (stored) {
      const loadedPosters = JSON.parse(stored)
      setPosters(loadedPosters)
      filterPosters(loadedPosters, "all")
    } else {
      const defaultPosters: Poster[] = [
        {
          id: "1",
          title: "Sunset Vibes",
          description: "Beautiful sunset landscape",
          price: 25,
          image: "/sunset-poster.jpg",
          category: "landscape",
        },
        {
          id: "2",
          title: "Urban Dreams",
          description: "Modern city architecture",
          price: 30,
          image: "/urban-city-poster.jpg",
          category: "urban",
        },
        {
          id: "3",
          title: "Nature Call",
          description: "Forest and mountains",
          price: 28,
          image: "/nature-forest-mountains-poster.jpg",
          category: "landscape",
        },
        {
          id: "4",
          title: "Abstract Art",
          description: "Contemporary abstract design",
          price: 35,
          image: "/abstract-colorful-modern-art.jpg",
          category: "art",
        },
        {
          id: "5",
          title: "Cosmic Journey",
          description: "Space and stars",
          price: 32,
          image: "/space-cosmos-stars-universe.jpg",
          category: "space",
        },
        {
          id: "6",
          title: "Minimalist Zen",
          description: "Simple and peaceful",
          price: 22,
          image: "/minimalist-zen-simple-design.jpg",
          category: "art",
        },
      ]
      setPosters(defaultPosters)
      filterPosters(defaultPosters, "all")
    }

    const storedFavorites = localStorage.getItem("favorites")
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [])

  const filterPosters = (items: Poster[], category: string) => {
    if (category === "all") {
      setFilteredPosters(items)
    } else {
      setFilteredPosters(items.filter((p) => p.category === category))
    }
    setSelectedCategory(category)
  }

  const addToCart = (poster: Poster) => {
    const cart = localStorage.getItem("cart")
    const cartItems = cart ? JSON.parse(cart) : []
    const existingItem = cartItems.find((item: any) => item.id === poster.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cartItems.push({ ...poster, quantity: 1 })
    }

    localStorage.setItem("cart", JSON.stringify(cartItems))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const toggleFavorite = (posterId: string) => {
    const updatedFavorites = favorites.includes(posterId)
      ? favorites.filter((id) => id !== posterId)
      : [...favorites, posterId]
    setFavorites(updatedFavorites)
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
  }

  const categories = ["all", "riviera-maya"]

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Tienda de Pósters</h1>
          <p className="text-lg text-muted-foreground">Descubre arte hermoso para tu espacio</p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => filterPosters(posters, cat)}
              className="capitalize"
            >
              {cat === "all" ? "Todos" : "Cancun, Riviera Maya"}
            </Button>
          ))}
        </div>

        {/* Posters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredPosters.map((poster) => (
            <Card key={poster.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img src={poster.image || "/placeholder.svg"} alt={poster.title} className="w-full h-64 object-cover" />
                <button
                  onClick={() => toggleFavorite(poster.id)}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full transition"
                >
                  <Heart
                    className={`w-5 h-5 ${favorites.includes(poster.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                </button>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{poster.title}</CardTitle>
                <CardDescription>{poster.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">${poster.price}</span>
                  <Button onClick={() => addToCart(poster)} size="sm" className="gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Agregar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No hay pósters en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  )
}
