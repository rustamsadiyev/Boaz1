import { createFileRoute } from '@tanstack/react-router'
import Basket from '@/pages/basket'

export const Route = createFileRoute('/_main/basket')({
  component: Basket,
})