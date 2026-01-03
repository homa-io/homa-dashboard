"use client"

import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, PauseCircle, PlayCircle, Users, Bot, Sparkles } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Department } from "@/types/department.types"

interface DepartmentListProps {
  departments: Department[]
  loading: boolean
  onEdit: (department: Department) => void
  onDelete: (department: Department) => void
  onSuspend: (department: Department) => void
  deletingId: number | null
  suspendingId: number | null
}

export function DepartmentList({
  departments,
  loading,
  onEdit,
  onDelete,
  onSuspend,
  deletingId,
  suspendingId,
}: DepartmentListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    )
  }

  if (departments.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">No departments found</p>
        <p className="text-sm">Create a department to organize your team and conversations.</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden sm:table-cell">Description</TableHead>
            <TableHead className="hidden md:table-cell">AI Agent</TableHead>
            <TableHead>Assigned Users</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((department) => (
            <TableRow key={department.id}>
              <TableCell className="font-medium">
                <Link
                  href={`/settings/departments/edit/${department.id}`}
                  className="hover:underline hover:text-primary transition-colors"
                >
                  {department.name}
                </Link>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground max-w-[200px] truncate">
                {department.description || "-"}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {department.ai_agent ? (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-blue-500" />
                    <span className="text-sm">{department.ai_agent.name}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {department.users && department.users.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {department.users.slice(0, 3).map((user) => (
                        <Badge key={user.id} variant="secondary" className="text-xs">
                          {user.type === 'bot' ? <Bot className="h-3 w-3 mr-1" /> : null}
                          {user.display_name || `${user.name} ${user.last_name}`}
                        </Badge>
                      ))}
                      {department.users.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{department.users.length - 3} more
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">No users</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={department.status === "active" ? "default" : "secondary"}
                  className={department.status === "active" ? "bg-green-500/10 text-green-600 border-green-500/20" : ""}
                >
                  {department.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(department)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onSuspend(department)}
                      disabled={suspendingId === department.id}
                    >
                      {department.status === "active" ? (
                        <>
                          <PauseCircle className="h-4 w-4 mr-2" />
                          Suspend
                        </>
                      ) : (
                        <>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(department)}
                      disabled={deletingId === department.id}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
