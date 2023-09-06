/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user: {
      email: string
      name: string
      photo_url: string
      username: string
    }
  }
}
