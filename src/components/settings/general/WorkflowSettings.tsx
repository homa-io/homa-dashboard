"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Loader2, GitBranch } from "lucide-react"
import { settingsService, SETTING_KEYS } from "@/services/settings.service"
import { departmentService } from "@/services/department.service"

interface Department {
  id: number
  name: string
  status: string
}

export function WorkflowSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [departments, setDepartments] = useState<Department[]>([])
  const [defaultDepartment, setDefaultDepartment] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load departments and settings in parallel
      const [deptResponse, settings] = await Promise.all([
        departmentService.list({}),
        settingsService.getSettings(),
      ])

      setDepartments(deptResponse.data?.filter(d => d.status === "active") || [])
      // Use "none" as the value for no default, since Radix Select doesn't allow empty string values
      setDefaultDepartment(settings[SETTING_KEYS.DEFAULT_DEPARTMENT] || "none")
    } catch (err: any) {
      setError(err.message || "Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      // Convert "none" back to empty string for storage
      await settingsService.updateSettings({
        [SETTING_KEYS.DEFAULT_DEPARTMENT]: defaultDepartment === "none" ? "" : defaultDepartment,
      })

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5" />
          <CardTitle className="text-base sm:text-lg">Workflow Settings</CardTitle>
        </div>
        <CardDescription className="text-xs sm:text-sm">
          Configure how conversations are routed and assigned.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
            Settings saved successfully!
          </div>
        )}

        {/* Default Department */}
        <div className="space-y-2">
          <Label htmlFor="default-department" className="text-xs sm:text-sm font-medium text-muted-foreground">
            Default Department
          </Label>
          <Select value={defaultDepartment} onValueChange={setDefaultDepartment}>
            <SelectTrigger className="text-sm h-9 sm:h-10">
              <SelectValue placeholder="Select default department..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No default (manual assignment)</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id.toString()}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            New conversations without a department will be automatically assigned to this department.
            All users in the department will be notified and can handle the conversation.
          </p>
        </div>

        {departments.length === 0 && (
          <div className="p-3 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md">
            No active departments found. Create a department in the Departments settings first.
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} disabled={saving} className="text-sm h-9 sm:h-10">
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? "Saving..." : "Save Workflow Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
