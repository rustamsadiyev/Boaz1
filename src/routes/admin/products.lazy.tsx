import Admin from '@/pages/admin'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/admin/products')({
  component: Admin,
})
