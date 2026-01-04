/**
 * Reusable CRUD Manager Hook
 * Consolidates common CRUD patterns used across manager components
 * (TagManager, CategoryManager, WebhookManager, etc.)
 */

import { useState, useCallback } from 'react'
import { toast } from '@/hooks/use-toast'

export interface CRUDConfig<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>> {
  // API methods
  fetchItems: () => Promise<T[]>
  createItem?: (data: CreateDTO) => Promise<T>
  updateItem?: (id: string | number, data: UpdateDTO) => Promise<T>
  deleteItem?: (id: string | number) => Promise<void>

  // Callbacks
  onItemCreated?: (item: T) => void
  onItemUpdated?: (item: T) => void
  onItemDeleted?: (id: string | number) => void
  onError?: (error: unknown, operation: string) => void

  // Config
  idField?: keyof T
  entityName?: string
}

export interface CRUDManagerState<T> {
  items: T[]
  isLoading: boolean
  isSaving: boolean
  isDeleting: boolean
  error: string | null
  selectedItem: T | null
  isDialogOpen: boolean
  isDeleteDialogOpen: boolean
}

export interface CRUDManagerActions<T, CreateDTO, UpdateDTO> {
  // Data operations
  fetchItems: () => Promise<void>
  createItem: (data: CreateDTO) => Promise<boolean>
  updateItem: (id: string | number, data: UpdateDTO) => Promise<boolean>
  deleteItem: (id: string | number) => Promise<boolean>

  // UI state
  openDialog: (item?: T) => void
  closeDialog: () => void
  openDeleteDialog: (item: T) => void
  closeDeleteDialog: () => void
  setSelectedItem: (item: T | null) => void
  clearError: () => void
}

export function useCRUDManager<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>>(
  config: CRUDConfig<T, CreateDTO, UpdateDTO>
): [CRUDManagerState<T>, CRUDManagerActions<T, CreateDTO, UpdateDTO>] {
  const {
    fetchItems: apiFetchItems,
    createItem: apiCreateItem,
    updateItem: apiUpdateItem,
    deleteItem: apiDeleteItem,
    onItemCreated,
    onItemUpdated,
    onItemDeleted,
    onError,
    idField = 'id' as keyof T,
    entityName = 'item'
  } = config

  // State
  const [items, setItems] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<T | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Error handler
  const handleError = useCallback((err: unknown, operation: string) => {
    const message = err instanceof Error ? err.message : `Failed to ${operation}`
    setError(message)
    console.error(`${entityName} ${operation} error:`, err)

    if (onError) {
      onError(err, operation)
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: message
      })
    }
  }, [entityName, onError])

  // Fetch items
  const fetchItems = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await apiFetchItems()
      setItems(data)
    } catch (err) {
      handleError(err, 'fetch')
    } finally {
      setIsLoading(false)
    }
  }, [apiFetchItems, handleError])

  // Create item
  const createItem = useCallback(async (data: CreateDTO): Promise<boolean> => {
    if (!apiCreateItem) {
      console.warn('createItem not configured')
      return false
    }

    setIsSaving(true)
    setError(null)

    try {
      const newItem = await apiCreateItem(data)
      setItems(prev => [...prev, newItem])
      setIsDialogOpen(false)
      setSelectedItem(null)

      toast({
        title: 'Success',
        description: `${entityName} created successfully`
      })

      onItemCreated?.(newItem)
      return true
    } catch (err) {
      handleError(err, 'create')
      return false
    } finally {
      setIsSaving(false)
    }
  }, [apiCreateItem, entityName, handleError, onItemCreated])

  // Update item
  const updateItem = useCallback(async (id: string | number, data: UpdateDTO): Promise<boolean> => {
    if (!apiUpdateItem) {
      console.warn('updateItem not configured')
      return false
    }

    setIsSaving(true)
    setError(null)

    try {
      const updatedItem = await apiUpdateItem(id, data)
      setItems(prev => prev.map(item =>
        item[idField] === id ? updatedItem : item
      ))
      setIsDialogOpen(false)
      setSelectedItem(null)

      toast({
        title: 'Success',
        description: `${entityName} updated successfully`
      })

      onItemUpdated?.(updatedItem)
      return true
    } catch (err) {
      handleError(err, 'update')
      return false
    } finally {
      setIsSaving(false)
    }
  }, [apiUpdateItem, idField, entityName, handleError, onItemUpdated])

  // Delete item
  const deleteItem = useCallback(async (id: string | number): Promise<boolean> => {
    if (!apiDeleteItem) {
      console.warn('deleteItem not configured')
      return false
    }

    setIsDeleting(true)
    setError(null)

    try {
      await apiDeleteItem(id)
      setItems(prev => prev.filter(item => item[idField] !== id))
      setIsDeleteDialogOpen(false)
      setSelectedItem(null)

      toast({
        title: 'Success',
        description: `${entityName} deleted successfully`
      })

      onItemDeleted?.(id)
      return true
    } catch (err) {
      handleError(err, 'delete')
      return false
    } finally {
      setIsDeleting(false)
    }
  }, [apiDeleteItem, idField, entityName, handleError, onItemDeleted])

  // UI actions
  const openDialog = useCallback((item?: T) => {
    setSelectedItem(item || null)
    setIsDialogOpen(true)
    setError(null)
  }, [])

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false)
    setSelectedItem(null)
    setError(null)
  }, [])

  const openDeleteDialog = useCallback((item: T) => {
    setSelectedItem(item)
    setIsDeleteDialogOpen(true)
  }, [])

  const closeDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false)
    setSelectedItem(null)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // State object
  const state: CRUDManagerState<T> = {
    items,
    isLoading,
    isSaving,
    isDeleting,
    error,
    selectedItem,
    isDialogOpen,
    isDeleteDialogOpen
  }

  // Actions object
  const actions: CRUDManagerActions<T, CreateDTO, UpdateDTO> = {
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    openDialog,
    closeDialog,
    openDeleteDialog,
    closeDeleteDialog,
    setSelectedItem,
    clearError
  }

  return [state, actions]
}

export default useCRUDManager
