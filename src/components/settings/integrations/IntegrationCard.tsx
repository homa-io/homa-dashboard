"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Settings, TestTube, Trash2, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Integration, INTEGRATION_EMOJIS } from "@/services/integrations.service"

interface IntegrationCardProps {
  integration: Integration
  onConfigure: (integration: Integration) => void
  onTest: (integration: Integration) => void
  onDisconnect: (integration: Integration) => void
  isLoading?: boolean
  testResult?: { success: boolean; message: string } | null
}

export function IntegrationCard({
  integration,
  onConfigure,
  onTest,
  onDisconnect,
  isLoading,
  testResult,
}: IntegrationCardProps) {
  const emoji = INTEGRATION_EMOJIS[integration.type] || "🔌"

  const getStatusBadge = () => {
    switch (integration.status) {
      case "enabled":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        )
      case "error":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            Disabled
          </Badge>
        )
    }
  }

  return (
    <Card className={integration.status === "error" ? "border-red-200 dark:border-red-900" : ""}>
      <CardContent className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-4 sm:py-6">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="text-2xl sm:text-3xl flex-shrink-0">{emoji}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm sm:text-base truncate">{integration.name}</h3>
            {integration.last_error && integration.status === "error" && (
              <p className="text-xs text-red-500 line-clamp-1">{integration.last_error}</p>
            )}
            {integration.tested_at && integration.status === "enabled" && (
              <p className="text-xs text-muted-foreground">
                Last tested: {new Date(integration.tested_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          {getStatusBadge()}

          {testResult && (
            <Badge
              variant={testResult.success ? "secondary" : "destructive"}
              className={
                testResult.success
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              }
            >
              {testResult.success ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Test Passed
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 mr-1" />
                  Test Failed
                </>
              )}
            </Badge>
          )}

          <div className="flex gap-1.5 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none text-xs h-8"
              onClick={() => onConfigure(integration)}
              disabled={isLoading}
            >
              <Settings className="w-3.5 h-3.5 mr-1.5" />
              Configure
            </Button>

            {integration.status !== "disabled" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none text-xs h-8"
                  onClick={() => onTest(integration)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <TestTube className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  Test
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => onDisconnect(integration)}
                  disabled={isLoading}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Disconnect
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
