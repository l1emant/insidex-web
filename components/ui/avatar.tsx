"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

/**
 * Renders a styled Avatar root element for user avatars.
 *
 * The component wraps Radix's Avatar Root, applying default size and rounded styles while forwarding all props.
 *
 * @returns A Radix Avatar Root element with preset styling and any additional props applied
 */
function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders an avatar image element with preset sizing and a data-slot for integration.
 *
 * @param className - Additional class names appended to the base sizing classes
 * @returns A Radix Avatar Image element with "aspect-square" sizing, full size, and all other props forwarded
 */
function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

/**
 * Renders a styled avatar fallback element displayed when the avatar image is unavailable.
 *
 * The element applies default avatar fallback styling and merges any provided `className` and props.
 *
 * @returns A React element representing the Radix Avatar Fallback with default styles and forwarded props.
 */
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
