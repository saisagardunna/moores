"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Edit, Eye, Phone, MapPin, Calendar, ShoppingCart, DollarSign, TrendingUp, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Client {
  _id: string
  name: string
  phone: string
  stallName: string
  email?: string
  createdAt: string
  updatedAt: string
  totalOrders?: number
  totalSpent?: number
  lastOrderDate?: string
  totalOwed?: number
  schedule?: string
  deadline?: string
}

interface Order {
  _id: string
  clientName: string
  iceCreams: Array<{ name: string; quantity: number }>
  totalAmount: number
  orderDate: string
  paymentStatus: string
  status: string
  isPaid?: boolean
}

export function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [clientOrders, setClientOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewingClientId, setViewingClientId] = useState<string | null>(null)
  const [viewError, setViewError] = useState<string | null>(null)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [editForm, setEditForm] = useState({ 
    name: "", 
    phone: "", 
    stallName: "", 
    email: "",
    totalOwed: 0,
    schedule: "",
    deadline: ""
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/clients")
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      const data = await response.json()
      console.log("Fetched clients:", data)
      if (data.success) {
        setClients(data.clients.map((client: Client) => ({
          ...client,
          totalOrders: client.totalOrders ?? 0,
          totalSpent: client.totalSpent ?? 0,
          totalOwed: client.totalOwed ?? 0,
          createdAt: client.createdAt || new Date().toISOString(),
          lastOrderDate: client.lastOrderDate || undefined,
        })))
      } else {
        throw new Error(data.message || "Failed to fetch clients")
      }
    } catch (error) {
      console.error("Error fetching clients:", error)
      toast({
        title: "Error",
        description: "Failed to load clients. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchClientOrders = async (clientId: string) => {
    try {
      setViewError(null)
      setClientOrders([])
      const response = await fetch(`/api/clients/${clientId}/orders`)
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      const data = await response.json()
      console.log("Fetched orders for client:", data)
      if (data.success) {
        const orders = (data.orders || []).map((order: Order) => ({
          ...order,
          totalAmount: order.totalAmount ?? 0,
          orderDate: order.orderDate || new Date().toISOString(),
          paymentStatus: order.paymentStatus || "unknown",
          status: order.status || "unknown",
          iceCreams: order.iceCreams || [],
        }))
        setClientOrders(orders)
        const owed = orders.reduce((sum: number, order: Order) => {
          return sum + (order.paymentStatus !== "completed" ? (order.totalAmount || 0) : 0)
        }, 0)
        setSelectedClient(prev => prev ? { ...prev, totalOwed: owed } : null)
      } else {
        throw new Error(data.message || "Failed to load orders")
      }
    } catch (error) {
      console.error("Error fetching client orders:", error)
      setViewError(error instanceof Error ? error.message : "Unknown error")
      toast({
        title: "Load Failed",
        description: `Couldn't load orders: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      setViewingClientId(null)
    }
  }

  const handleViewClient = async (client: Client) => {
    setViewingClientId(client._id)
    setSelectedClient(client)
    await fetchClientOrders(client._id)
  }

  const handleEditClient = (client: Client) => {
    setEditingClient(client)
    setEditForm({
      name: client.name || "",
      phone: client.phone || "",
      stallName: client.stallName || "",
      email: client.email || "",
      totalOwed: client.totalOwed || 0,
      schedule: client.schedule || "",
      deadline: client.deadline ? new Date(client.deadline).toISOString().split("T")[0] : "",
    })
  }

  const handleUpdateClient = async () => {
    if (!editingClient) return
    try {
      const response = await fetch(`/api/clients/${editingClient._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editForm, totalOwed: Number(editForm.totalOwed) || 0 }),
      })
      const data = await response.json()
      if (data.success) {
        toast({
          title: "Client Updated",
          description: "Client information has been updated successfully.",
        })
        setEditingClient(null)
        setEditForm({ name: "", phone: "", stallName: "", email: "", totalOwed: 0, schedule: "", deadline: "" })
        await fetchClients()
      } else {
        throw new Error(data.message || "Failed to update client")
      }
    } catch (error) {
      console.error("Error updating client:", error)
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update client information.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return "Invalid Date"
    }
  }

  const formatCurrency = (amount?: number) => {
    return `₹${(amount ?? 0).toLocaleString("en-IN")}`
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin" />
            <p>Loading clients...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Client Management ({clients.length})
          </CardTitle>
          <CardDescription>
            Manage customer information, view order history, and track client relationships
          </CardDescription>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Clients Yet</h3>
              <p>Client information will appear here once orders are placed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{clients.length}</div>
                    <p className="text-xs text-muted-foreground">Total Clients</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {clients.reduce((sum, client) => sum + (client.totalOrders ?? 0), 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">Total Orders</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {formatCurrency(clients.reduce((sum, client) => sum + (client.totalSpent ?? 0), 0))}
                    </div>
                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                  </CardContent>
                </Card>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Stall Name</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Total Owed</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client._id}>
                      <TableCell className="font-medium">{client.name || "Unknown"}</TableCell>
                      <TableCell>{client.phone || "N/A"}</TableCell>
                      <TableCell>{client.stallName || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{client.totalOrders ?? 0}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(client.totalSpent)}</TableCell>
                      <TableCell>{formatCurrency(client.totalOwed)}</TableCell>
                      <TableCell>{client.deadline ? formatDate(client.deadline) : "None"}</TableCell>
                      <TableCell>{formatDate(client.lastOrderDate)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleViewClient(client)}
                                disabled={viewingClientId === client._id}
                              >
                                {viewingClientId === client._id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Eye className="w-3 h-3" />
                                )}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>Client Details - {selectedClient?.name || "Unknown"}</DialogTitle>
                                <DialogDescription>View client information and order history</DialogDescription>
                              </DialogHeader>
                              {viewError && (
                                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-md text-destructive mb-4">
                                  {viewError}
                                </div>
                              )}
                              {selectedClient && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Contact Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div className="flex items-center gap-2">
                                          <Users className="w-4 h-4 text-muted-foreground" />
                                          <span>{selectedClient.name || "Unknown"}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Phone className="w-4 h-4 text-muted-foreground" />
                                          <span>{selectedClient.phone || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <MapPin className="w-4 h-4 text-muted-foreground" />
                                          <span>{selectedClient.stallName || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Calendar className="w-4 h-4 text-muted-foreground" />
                                          <span>Joined {formatDate(selectedClient.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                                          <span>Owed: {formatCurrency(selectedClient.totalOwed)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Calendar className="w-4 h-4 text-muted-foreground" />
                                          <span>Schedule: {selectedClient.schedule || "None"}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                                          <span>Deadline: {formatDate(selectedClient.deadline)}</span>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Order Summary</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div className="flex justify-between">
                                          <span>Total Orders:</span>
                                          <Badge>{clientOrders.length}</Badge>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Total Spent:</span>
                                          <span className="font-medium">
                                            {formatCurrency(
                                              clientOrders.reduce((sum, order) => sum + (order.totalAmount ?? 0), 0)
                                            )}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Last Order:</span>
                                          <span>
                                            {clientOrders.length > 0 ? formatDate(clientOrders[0].orderDate) : "Never"}
                                          </span>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Order History</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      {clientOrders.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                          <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                          <p>No orders found for this client.</p>
                                        </div>
                                      ) : (
                                        <div className="space-y-4">
                                          {clientOrders.map((order) => (
                                            <div key={order._id} className="border rounded-lg p-4">
                                              <div className="flex justify-between items-start mb-3">
                                                <div>
                                                  <p className="font-medium">Order #{order._id.slice(-6)}</p>
                                                  <p className="text-sm text-muted-foreground">
                                                    {formatDate(order.orderDate)}
                                                  </p>
                                                </div>
                                                <div className="text-right">
                                                  <p className="font-medium">{formatCurrency(order.totalAmount)}</p>
                                                  <div className="flex gap-2">
                                                    <Badge
                                                      variant={
                                                        order.paymentStatus === "completed"
                                                          ? "default"
                                                          : order.paymentStatus === "overdue"
                                                            ? "destructive"
                                                            : "secondary"
                                                      }
                                                    >
                                                      {order.paymentStatus}
                                                    </Badge>
                                                    <Badge variant="outline">{order.status}</Badge>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="space-y-1">
                                                <p className="text-sm font-medium">Ice Creams:</p>
                                                <div className="flex flex-wrap gap-2">
                                                  {(order.iceCreams || []).map((item, index) => (
                                                    <Badge key={index} variant="secondary">
                                                      {item.name || "Unknown"} ({item.quantity || 0})
                                                    </Badge>
                                                  ))}
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => handleEditClient(client)}>
                                <Edit className="w-3 h-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Client - {editingClient?.name || "Unknown"}</DialogTitle>
                                <DialogDescription>Update client contact information</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-name">Full Name</Label>
                                  <Input
                                    id="edit-name"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-phone">Phone Number</Label>
                                  <Input
                                    id="edit-phone"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-stall">Stall Name</Label>
                                  <Input
                                    id="edit-stall"
                                    value={editForm.stallName}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, stallName: e.target.value }))}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-email">Email (Optional)</Label>
                                  <Input
                                    id="edit-email"
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-owed">Total Amount Owed (₹)</Label>
                                  <Input
                                    id="edit-owed"
                                    type="number"
                                    value={editForm.totalOwed}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, totalOwed: Number(e.target.value) || 0 }))}
                                    placeholder="e.g., 5000"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-schedule">Schedule</Label>
                                  <Input
                                    id="edit-schedule"
                                    value={editForm.schedule}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, schedule: e.target.value }))}
                                    placeholder="e.g., Weekly on Mon/Wed, 10AM-2PM"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-deadline">Deadline (Payment/Delivery)</Label>
                                  <Input
                                    id="edit-deadline"
                                    type="date"
                                    value={editForm.deadline}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, deadline: e.target.value }))}
                                  />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => setEditingClient(null)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={handleUpdateClient}>Update Client</Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}