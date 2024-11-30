import Likeds from '@/pages/likeds'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/likeds')({
  component: Likeds,
})