import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient()

export const Query = ({ children }: { children: JSX.Element }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
)
