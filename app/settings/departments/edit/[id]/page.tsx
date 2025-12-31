"use client"

import { use } from "react"
import { DepartmentEditPage } from "@/components/settings/departments/DepartmentEditPage"

interface DepartmentEditPageProps {
  params: Promise<{ id: string }>
}

export default function DepartmentEdit({ params }: DepartmentEditPageProps) {
  const { id } = use(params)
  return <DepartmentEditPage departmentId={parseInt(id, 10)} />
}
