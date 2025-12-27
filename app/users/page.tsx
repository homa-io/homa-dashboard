"use client"

import { useState, useCallback, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Loader2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { CreateUserModal, EditUserModal } from "@/components/users"
import { getUsers, deleteUser, blockUser, unblockUser } from "@/services/users"
import { toast } from "@/hooks/use-toast"
import type { User, UserType, UserStatus } from "@/types/user"

export default function UsersPage() {
  // Data state
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Filters
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const params: any = {
        page,
        page_size: pageSize,
      }

      if (debouncedSearchQuery) params.search = debouncedSearchQuery
      if (typeFilter !== "all") params.type = typeFilter as UserType
      if (statusFilter !== "all") params.status = statusFilter as UserStatus

      const response = await getUsers(params)

      if (response.success && response.data) {
        setUsers(response.data.users)
        setTotalUsers(response.data.total)
        setTotalPages(response.data.total_pages)
      } else {
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [page, pageSize, debouncedSearchQuery, typeFilter, statusFilter])

  // Load users on mount and when filters change
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setPage(1) // Reset to first page on search
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Helper functions
  const getInitials = useCallback((name: string, lastName: string) => {
    return `${name[0] || ''}${lastName[0] || ''}`.toUpperCase()
  }, [])

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }, [])

  const handleEditUser = useCallback((userId: string) => {
    setSelectedUserId(userId)
    setEditModalOpen(true)
  }, [])

  const handleDeleteUser = useCallback((userId: string, userName: string) => {
    setUserToDelete({ id: userId, name: userName })
    setDeleteDialogOpen(true)
  }, [])

  const confirmDelete = async () => {
    if (!userToDelete) return

    setIsDeleting(true)
    try {
      const response = await deleteUser(userToDelete.id)

      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "User deleted successfully",
        })
        setDeleteDialogOpen(false)
        setUserToDelete(null)
        fetchUsers()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleBlockUser = async (userId: string, userName: string) => {
    try {
      const response = await blockUser(userId)

      if (response.success) {
        toast({
          title: "Success",
          description: `${userName} has been blocked`,
        })
        fetchUsers()
      } else {
        toast({
          title: "Error",
          description: "Failed to block user",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error blocking user:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleUnblockUser = async (userId: string, userName: string) => {
    try {
      const response = await unblockUser(userId)

      if (response.success) {
        toast({
          title: "Success",
          description: `${userName} has been unblocked`,
        })
        fetchUsers()
      } else {
        toast({
          title: "Error",
          description: "Failed to unblock user",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error unblocking user:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Users Management
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
            Manage system users, roles, and permissions
          </p>
        </div>
        <Button
          className="w-full sm:w-auto"
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1 min-w-0 sm:flex-initial sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full sm:w-[350px]"
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="agent">Agents</SelectItem>
            <SelectItem value="administrator">Administrators</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isLoading ? (
            'Loading users...'
          ) : (
            `Showing ${users.length} of ${totalUsers} users (Page ${page} of ${totalPages})`
          )}
        </p>
        {totalPages > 1 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12 border rounded-md">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-md">
          <div className="text-center">
            <UserIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No users found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery
                ? 'Try adjusting your search or add a new user.'
                : 'Get started by adding your first user.'}
            </p>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden lg:table-cell">Created At</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        {user.avatar && <AvatarImage src={user.avatar} alt={user.display_name} />}
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                          {getInitials(user.name, user.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">
                          {user.display_name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {user.name} {user.last_name}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant={user.type === "administrator" ? "default" : "secondary"}
                      className="capitalize"
                    >
                      {user.type === "administrator" ? (
                        <><Shield className="h-3 w-3 mr-1" />{user.type}</>
                      ) : (
                        user.type
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant={user.status === "active" ? "default" : "destructive"}
                      className="capitalize"
                    >
                      {user.status === "active" ? (
                        <><ShieldCheck className="h-3 w-3 mr-1" />Active</>
                      ) : (
                        <><ShieldAlert className="h-3 w-3 mr-1" />Blocked</>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(user.created_at)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        {user.status === "active" ? (
                          <DropdownMenuItem
                            onClick={() => handleBlockUser(user.id, user.display_name)}
                          >
                            <ShieldAlert className="h-4 w-4 mr-2" />
                            Block User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleUnblockUser(user.id, user.display_name)}
                          >
                            <ShieldCheck className="h-4 w-4 mr-2" />
                            Unblock User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteUser(user.id, user.display_name)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modals */}
      <CreateUserModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={fetchUsers}
      />

      <EditUserModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        userId={selectedUserId}
        onSuccess={fetchUsers}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user "{userToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
