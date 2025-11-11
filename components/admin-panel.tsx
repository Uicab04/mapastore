"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, Edit2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Poster {
  id: string
  title: string
  description: string
  price: number
  image: string
  category: string
}

export default function AdminPanel() {
  const [posters, setPosters] = useState<Poster[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    category: "art",
  })
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("posters")
    if (stored) {
      setPosters(JSON.parse(stored))
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      const updated = posters.map((p) =>
        p.id === editingId ? { ...p, ...formData, price: Number.parseFloat(formData.price) } : p,
      )
      setPosters(updated)
      localStorage.setItem("posters", JSON.stringify(updated))
      setEditingId(null)
    } else {
      const newPoster: Poster = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        image: formData.image || "/abstract-poster.png",
        category: formData.category,
      }
      const updated = [...posters, newPoster]
      setPosters(updated)
      localStorage.setItem("posters", JSON.stringify(updated))
    }

    resetForm()
    setDialogOpen(false)
  }

  const handleEdit = (poster: Poster) => {
    setEditingId(poster.id)
    setFormData({
      title: poster.title,
      description: poster.description,
      price: poster.price.toString(),
      image: poster.image,
      category: poster.category,
    })
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    const updated = posters.filter((p) => p.id !== id)
    setPosters(updated)
    localStorage.setItem("posters", JSON.stringify(updated))
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      image: "",
      category: "art",
    })
    setEditingId(null)
  }

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) resetForm()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Panel de Administración</h1>
        <p className="text-muted-foreground">Gestiona tus pósters y catálogo</p>
      </div>

      <Tabs defaultValue="manage" className="space-y-8">
        <TabsList>
          <TabsTrigger value="manage">Gestionar Pósters</TabsTrigger>
          <TabsTrigger value="add">Agregar Póster</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-4">
          <div className="grid gap-4">
            {posters.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">No hay pósters disponibles</CardContent>
              </Card>
            ) : (
              posters.map((poster) => (
                <Card key={poster.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-4 flex-col sm:flex-row">
                      <img
                        src={poster.image || "/placeholder.svg"}
                        alt={poster.title}
                        className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <CardTitle className="mb-1">{poster.title}</CardTitle>
                        <CardDescription>{poster.description}</CardDescription>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-sm bg-muted px-2 py-1 rounded capitalize">{poster.category}</span>
                          <span className="text-lg font-bold text-primary">${poster.price}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-col sm:flex-row">
                        <Dialog open={dialogOpen && editingId === poster.id} onOpenChange={handleDialogChange}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => handleEdit(poster)} className="gap-2">
                              <Edit2 className="w-4 h-4" />
                              Editar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Póster</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                              <div>
                                <Label>Título</Label>
                                <Input
                                  value={formData.title}
                                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                  required
                                />
                              </div>
                              <div>
                                <Label>Descripción</Label>
                                <Input
                                  value={formData.description}
                                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                  required
                                />
                              </div>
                              <div>
                                <Label>Precio</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={formData.price}
                                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                  required
                                />
                              </div>
                              <div>
                                <Label>Categoría</Label>
                                <select
                                  value={formData.category}
                                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                  className="w-full border border-input rounded-md px-3 py-2 bg-background"
                                >
                                  <option value="art">Art</option>
                                  <option value="landscape">Landscape</option>
                                  <option value="urban">Urban</option>
                                  <option value="space">Space</option>
                                </select>
                              </div>
                              <Button type="submit" className="w-full">
                                Guardar cambios
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(poster.id)}
                          className="gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agregar Nuevo Póster</CardTitle>
              <CardDescription>Rellena el formulario para agregar un póster</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título del Póster</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ej: Sunset Dreams"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripción breve del póster"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price">Precio ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="25.99"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-input rounded-md px-3 py-2 bg-background"
                  >
                    <option value="art">Art</option>
                    <option value="landscape">Landscape</option>
                    <option value="urban">Urban</option>
                    <option value="space">Space</option>
                  </select>
                </div>

                <Button type="submit" className="w-full">
                  Agregar Póster
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
