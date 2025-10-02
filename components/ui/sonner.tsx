"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
import { useTheme } from "next-themes"
import { ToasterProps, Toaster as Sonner } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  const validTheme = ['light', 'dark', 'system'].includes(theme ?? '')
    ? theme
    : 'system'

  return (
    <Sonner
      theme={validTheme as ToasterProps["theme"]}
      className="toaster group"
      {...props}
    />
  )
}

export default Toaster
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
