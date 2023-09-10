"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export const Query = ({ children } : { children: JSX.Element }) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  )
}
