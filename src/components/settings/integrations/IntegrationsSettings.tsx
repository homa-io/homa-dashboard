"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"
import { IntegrationCard } from "./IntegrationCard"
import { IntegrationConfigDialog } from "./IntegrationConfigDialog"
import { Integration, IntegrationType, integrationsService } from "@/services/integrations.service"

export function IntegrationsSettings() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [testingId, setTestingId] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({})

  const fetchIntegrations = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch both integration types and configured integrations
      const [types, configured] = await Promise.all([
        integrationsService.getTypes(),
        integrationsService.list()
      ])

      // Create a map of configured integrations by type
      const configuredMap = new Map(configured.map(i => [i.type, i]))

      // Merge types with configured data - show all available types
      const merged: Integration[] = types.map(t => {
        const existing = configuredMap.get(t.type)
        if (existing) {
          return existing
        }
        // Return an unconfigured integration placeholder
        return {
          type: t.type,
          name: t.name,
          status: 'disabled' as const,
          config: {},
        }
      })

      setIntegrations(merged)
    } catch (err: any) {
      console.error("Failed to fetch integrations:", err)
      setError(err.message || "Failed to load integrations")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIntegrations()
  }, [])

  const handleConfigure = (integration: Integration) => {
    setSelectedIntegration(integration)
    setConfigDialogOpen(true)
    // Clear test result for this integration when opening config
    setTestResults((prev) => {
      const { [integration.type]: _, ...rest } = prev
      return rest
    })
  }

  const handleTest = async (integration: Integration) => {
    try {
      setTestingId(integration.type)
      setTestResults((prev) => {
        const { [integration.type]: _, ...rest } = prev
        return rest
      })
      const result = await integrationsService.test(integration.type, integration.config || {})
      setTestResults((prev) => ({
        ...prev,
        [integration.type]: result,
      }))
      // Refresh integrations to get updated tested_at
      await fetchIntegrations()
    } catch (err: any) {
      setTestResults((prev) => ({
        ...prev,
        [integration.type]: {
          success: false,
          message: err.message || "Test failed",
        },
      }))
    } finally {
      setTestingId(null)
    }
  }

  const handleDisconnect = async (integration: Integration) => {
    if (!confirm(`Are you sure you want to disconnect ${integration.name}?`)) {
      return
    }
    try {
      await integrationsService.save(integration.type, {
        status: "disabled",
        config: {},
      })
      await fetchIntegrations()
      // Clear test result
      setTestResults((prev) => {
        const { [integration.type]: _, ...rest } = prev
        return rest
      })
    } catch (err: any) {
      console.error("Failed to disconnect integration:", err)
      alert(err.message || "Failed to disconnect integration")
    }
  }

  const handleSave = async (type: string, status: string, config: Record<string, any>) => {
    await integrationsService.save(type, { status, config })
    await fetchIntegrations()
  }

  const handleDialogTest = async (type: string, config: Record<string, any>) => {
    return await integrationsService.test(type, config)
  }

  const handleCloseDialog = () => {
    setConfigDialogOpen(false)
    setSelectedIntegration(null)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 sm:mb-2">Integrations</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Connect with external services and manage channel integrations.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchIntegrations}
          disabled={loading}
          className="w-full sm:w-auto text-xs h-8"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {loading && integrations.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Loading integrations...</span>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <p className="text-sm text-red-500">{error}</p>
            <Button variant="outline" onClick={fetchIntegrations}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : integrations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <p className="text-sm text-muted-foreground">No integrations available.</p>
            <Button variant="outline" onClick={fetchIntegrations}>
              Refresh
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {integrations.map((integration) => (
            <IntegrationCard
              key={integration.type}
              integration={integration}
              onConfigure={handleConfigure}
              onTest={handleTest}
              onDisconnect={handleDisconnect}
              isLoading={testingId === integration.type}
              testResult={testResults[integration.type]}
            />
          ))}
        </div>
      )}

      <IntegrationConfigDialog
        integration={selectedIntegration}
        isOpen={configDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        onTest={handleDialogTest}
      />
    </div>
  )
}
