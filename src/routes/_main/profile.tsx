import { createFileRoute } from '@tanstack/react-router'
import Profile from '@/pages/profile'

export const Route = createFileRoute('/_main/profile')({
  component: Profile,
})