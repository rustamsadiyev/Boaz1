import { createFileRoute } from '@tanstack/react-router'
import Product from '@/pages/product'

export const Route = createFileRoute('/_main/products/$product')({
  component: Product,
})