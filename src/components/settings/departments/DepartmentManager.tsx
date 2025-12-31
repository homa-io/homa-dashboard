"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, RefreshCw, Search, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { departmentService } from "@/services/department.service"
import { DepartmentForm } from "./DepartmentForm"
import { DepartmentList } from "./DepartmentList"
import type { Department, DepartmentCreateRequest } from "@/types/department.types"

export function DepartmentManager() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [suspendingId, setSuspendingId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null)

  const fetchDepartments = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await departmentService.list({ search: searchQuery || undefined })
      setDepartments(response.data || [])
    } catch (err: any) {
      setError(err.message || "Failed to load departments")
      console.error("Error fetching departments:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchDepartments()
    }, 300)
    return () => clearTimeout(debounce)
  }, [searchQuery])

  const handleAdd = () => {
    setEditingDepartment(null)
    setIsFormOpen(true)
  }

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    setIsFormOpen(true)
  }

  const handleSave = async (data: DepartmentCreateRequest) => {
    if (editingDepartment) {
      await departmentService.update(editingDepartment.id, data)
    } else {
      await departmentService.create(data)
    }
    await fetchDepartments()
  }

  const handleDeleteClick = (department: Department) => {
    setDepartmentToDelete(department)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!departmentToDelete) return

    try {
      setDeletingId(departmentToDelete.id)
      await departmentService.delete(departmentToDelete.id)
      await fetchDepartments()
    } catch (err: any) {
      alert(err.message || "Failed to delete department")
    } finally {
      setDeletingId(null)
      setDeleteDialogOpen(false)
      setDepartmentToDelete(null)
    }
  }

  const handleSuspend = async (department: Department) => {
    try {
      setSuspendingId(department.id)
      const newStatus = department.status === "active"
      await departmentService.suspend(department.id, newStatus)
      await fetchDepartments()
    } catch (err: any) {
      alert(err.message || "Failed to update department status")
    } finally {
      setSuspendingId(null)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 sm:mb-2">Departments</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
          Manage departments to organize conversations and assign team members.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base sm:text-lg">Department List</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Create and manage departments for your organization.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDepartments}
              disabled={loading}
              className="text-xs h-9"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={handleAdd} className="text-xs sm:text-sm h-9 sm:h-10">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
              Add Department
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {error && (
            <div className="text-center py-8 text-red-500">
              <p>{error}</p>
              <Button variant="outline" onClick={fetchDepartments} className="mt-4">
                Retry
              </Button>
            </div>
          )}

          {!error && (
            <DepartmentList
              departments={departments}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onSuspend={handleSuspend}
              deletingId={deletingId}
              suspendingId={suspendingId}
            />
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">About Departments</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            How departments help organize your team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Organize Conversations:</strong> Departments group related conversations together,
              making it easier to manage and route messages.
            </p>
            <p>
              <strong className="text-foreground">Assign Team Members:</strong> Add users and bots to departments.
              When a new message arrives, it will be automatically assigned to the team members in that department.
            </p>
            <p>
              <strong className="text-foreground">Suspend When Needed:</strong> Temporarily disable a department
              without deleting it. Suspended departments won't receive new conversations.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Form Modal */}
      <DepartmentForm
        department={editingDepartment}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingDepartment(null)
        }}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Department</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{departmentToDelete?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingId !== null}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deletingId !== null}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingId !== null && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
