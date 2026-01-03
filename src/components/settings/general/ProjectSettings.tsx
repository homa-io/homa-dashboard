"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Loader2, Building } from "lucide-react"
import { SETTING_KEYS } from "@/services/settings.service"
import { getSettingsAction, updateSettingsAction } from "@/actions/settings.actions"

export function ProjectSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [projectName, setProjectName] = useState("")

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      const settings = await getSettingsAction()
      setProjectName(settings[SETTING_KEYS.PROJECT_NAME] || "")
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

      await updateSettingsAction({
        [SETTING_KEYS.PROJECT_NAME]: projectName,
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
          <Building className="w-5 h-5" />
          <CardTitle className="text-base sm:text-lg">Project Settings</CardTitle>
        </div>
        <CardDescription className="text-xs sm:text-sm">
          Configure your project identity and branding.
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

        <div className="space-y-2">
          <Label htmlFor="project-name" className="text-xs sm:text-sm font-medium text-muted-foreground">
            Project Name
          </Label>
          <Input
            id="project-name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="My Project"
            className="text-sm h-9 sm:h-10"
          />
          <p className="text-xs text-muted-foreground">
            The name of your project. This will be displayed in various places throughout the application.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} disabled={saving} className="text-sm h-9 sm:h-10">
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? "Saving..." : "Save Project Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
