"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Image, Download, ExternalLink } from "lucide-react"

interface SharedFile {
  id: string
  name: string
  size: string
  type: 'pdf' | 'image' | 'document' | 'other'
  sharedWith: string
  sharedDate: string
  url?: string
}

interface SharedFilesProps {
  files: SharedFile[]
}

export function SharedFiles({ files }: SharedFilesProps) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-red-600" />
      case 'image':
        return <Image className="w-4 h-4 text-blue-600" />
      case 'document':
        return <FileText className="w-4 h-4 text-blue-600" />
      default:
        return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  const getFileColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-50 border-red-200'
      case 'image':
        return 'bg-blue-50 border-blue-200'
      case 'document':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-2 pt-3 px-3">
        <CardTitle className="text-xs font-medium">Files Shared</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 px-3 pb-3">
        {files.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            No files shared yet
          </p>
        ) : (
          files.map((file) => (
            <div key={file.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-muted/50">
              {/* File Icon */}
              <div className={`p-1.5 rounded border ${getFileColor(file.type)}`}>
                {getFileIcon(file.type)}
              </div>
              
              {/* File Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium truncate">{file.name}</p>
                  <div className="flex gap-0.5 ml-1">
                    {file.url && (
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <Download className="w-2.5 h-2.5" />
                    </Button>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {file.size} • {file.sharedWith} • {file.sharedDate}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
      
      {/* Show More Button at bottom */}
      {files.length > 0 && (
        <div className="px-3 pb-3 pt-0">
          <Button variant="ghost" size="sm" className="w-full h-6 text-xs text-blue-600">
            Show More
          </Button>
        </div>
      )}
    </Card>
  )
}