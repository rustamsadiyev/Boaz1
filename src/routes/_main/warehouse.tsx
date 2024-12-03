import { createFileRoute } from '@tanstack/react-router'
import Warehouse from '@/pages/warehouse'

export const Route = createFileRoute('/_main/warehouse')({
  component: Warehouse,
})