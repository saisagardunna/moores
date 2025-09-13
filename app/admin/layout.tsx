"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("admin_logged_in") === "true"
      setIsAuthenticated(isLoggedIn)
      setIsLoading(false)

      if (!isLoggedIn && pathname !== "/admin/login") {
        router.push("/admin/login")
      }
    }

    checkAuth()
  }, [router, pathname])

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in")
    router.push("/admin/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated && pathname === "/admin/login") {
    return children
  }

  if (!isAuthenticated) {
    return null
  }

  if (pathname !== "/admin/login") {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Moores Ice Cream Admin</h1>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
        {children}
      </div>
    )
  }

  return children
}
