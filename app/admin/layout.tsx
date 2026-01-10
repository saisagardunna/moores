"use client"

import type React from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // No authentication check here - let each page handle its own auth
  return children
}
