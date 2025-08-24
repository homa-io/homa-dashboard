"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomBadge } from "@/components/ui/custom-badge"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { useState } from "react"

export default function TypographyPage() {
  const [copiedClass, setCopiedClass] = useState<string>("")

  const copyToClipboard = (className: string) => {
    navigator.clipboard.writeText(className)
    setCopiedClass(className)
    setTimeout(() => setCopiedClass(""), 2000)
  }

  const TypographySection = ({ 
    title, 
    description, 
    examples 
  }: { 
    title: string
    description: string
    examples: Array<{ className: string; text: string; element?: string }>
  }) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {examples.map((example, index) => (
          <div key={index} className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <code className="text-sm bg-muted px-2 py-1 rounded">
                {example.className}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(example.className)}
                className="h-8"
              >
                <Copy className="w-4 h-4" />
                {copiedClass === example.className ? "Copied!" : "Copy"}
              </Button>
            </div>
            <div className={example.className}>
              {example.text}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )

  const BadgeSection = ({ 
    title, 
    description, 
    badges 
  }: { 
    title: string
    description: string
    badges: Array<{ variant: any; text: string; className?: string }>
  }) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {badges.map((badge, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {badge.className || `variant="${badge.variant}"`}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(badge.className || `variant="${badge.variant}"`)}
                  className="h-8"
                >
                  <Copy className="w-4 h-4" />
                  {copiedClass === (badge.className || `variant="${badge.variant}"`) ? "Copied!" : "Copy"}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <CustomBadge variant={badge.variant}>{badge.text}</CustomBadge>
                {badge.className && (
                  <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${badge.className}`}>
                    {badge.text}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="heading-1 mb-4">Typography & Badge System</h1>
        <p className="body-large text-muted-foreground">
          A comprehensive guide to typography classes and badge components with copy-paste ready code.
        </p>
      </div>

      {/* Headings */}
      <TypographySection
        title="Headings"
        description="Semantic heading styles with consistent spacing and typography"
        examples={[
          { className: "heading-1", text: "Heading 1 - Main Page Title" },
          { className: "heading-2", text: "Heading 2 - Section Title" },
          { className: "heading-3", text: "Heading 3 - Subsection Title" },
          { className: "heading-4", text: "Heading 4 - Card Title" },
          { className: "heading-5", text: "Heading 5 - Small Title" },
          { className: "heading-6", text: "Heading 6 - Smallest Title" },
        ]}
      />

      {/* Display Text */}
      <TypographySection
        title="Display Text"
        description="Large display text for hero sections and emphasis"
        examples={[
          { className: "display-large", text: "Display Large" },
          { className: "display-medium", text: "Display Medium" },
          { className: "display-small", text: "Display Small" },
        ]}
      />

      {/* Body Text */}
      <TypographySection
        title="Body Text"
        description="Standard text for content and descriptions"
        examples={[
          { className: "body-large", text: "Body Large - Used for important content and lead paragraphs that need more visual weight." },
          { className: "body-medium", text: "Body Medium - The standard body text for most content throughout the application." },
          { className: "body-small", text: "Body Small - Used for secondary content, descriptions, and supplementary information." },
        ]}
      />

      {/* Labels */}
      <TypographySection
        title="Labels"
        description="Label text for form fields, buttons, and navigation"
        examples={[
          { className: "label-large", text: "Label Large" },
          { className: "label-medium", text: "Label Medium" },
          { className: "label-small", text: "Label Small" },
        ]}
      />

      {/* Captions */}
      <TypographySection
        title="Captions"
        description="Small text for metadata, timestamps, and helper text"
        examples={[
          { className: "caption-large", text: "Caption Large - For metadata" },
          { className: "caption-medium", text: "Caption Medium - For timestamps" },
          { className: "caption-small", text: "Caption Small - For helper text" },
        ]}
      />

      {/* Code Text */}
      <TypographySection
        title="Code Text"
        description="Monospace text for code snippets and technical content"
        examples={[
          { className: "code-large", text: "const example = 'code large';" },
          { className: "code-medium", text: "const example = 'code medium';" },
          { className: "code-small", text: "const example = 'code small';" },
        ]}
      />

      {/* Custom Badges */}
      <BadgeSection
        title="Custom Badge Component"
        description="React component with variant props and dot support"
        badges={[
          { variant: "green", text: "Open" },
          { variant: "red", text: "High Priority" },
          { variant: "red-dot", text: "High Priority" },
          { variant: "yellow", text: "Medium Priority" },
          { variant: "yellow-dot", text: "Medium Priority" },
          { variant: "blue", text: "New" },
          { variant: "gray", text: "Sales Department" },
          { variant: "purple", text: "Support Team" },
          { variant: "pink", text: "Marketing" },
        ]}
      />

      {/* CSS Badge Classes */}
      <BadgeSection
        title="CSS Badge Classes (No Border)"
        description="Direct CSS classes that can be applied to any element - no border by default"
        badges={[
          { variant: "green", text: "Open", className: "badge-green" },
          { variant: "red", text: "High Priority", className: "badge-red badge-dot" },
          { variant: "yellow", text: "Medium Priority", className: "badge-yellow badge-dot" },
          { variant: "blue", text: "New", className: "badge-blue" },
          { variant: "gray", text: "Sales Department", className: "badge-gray" },
          { variant: "purple", text: "Support Team", className: "badge-purple" },
          { variant: "pink", text: "Marketing", className: "badge-pink" },
        ]}
      />

      {/* Bordered CSS Badge Classes */}
      <BadgeSection
        title="CSS Badge Classes (Bordered)"
        description="Badge classes with borders for when you need more definition"
        badges={[
          { variant: "green", text: "Open", className: "badge-green-bordered" },
          { variant: "red", text: "High Priority", className: "badge-red-bordered badge-dot" },
          { variant: "yellow", text: "Medium Priority", className: "badge-yellow-bordered badge-dot" },
          { variant: "blue", text: "New", className: "badge-blue-bordered" },
          { variant: "gray", text: "Sales Department", className: "badge-gray-bordered" },
          { variant: "purple", text: "Support Team", className: "badge-purple-bordered" },
          { variant: "pink", text: "Marketing", className: "badge-pink-bordered" },
        ]}
      />

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
          <CardDescription>How to use these classes in your components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border border-border rounded-lg p-4">
            <h3 className="heading-4 mb-2">Component Usage</h3>
            <pre className="code-small bg-muted p-3 rounded overflow-x-auto">
{`import { CustomBadge } from "@/components/ui/custom-badge"

<CustomBadge variant="red-dot">High Priority</CustomBadge>
<CustomBadge variant="green">Open</CustomBadge>`}
            </pre>
          </div>
          
          <div className="border border-border rounded-lg p-4">
            <h3 className="heading-4 mb-2">CSS Class Usage</h3>
            <pre className="code-small bg-muted p-3 rounded overflow-x-auto">
{`<div className="heading-2">Page Title</div>
<p className="body-medium">Content goes here</p>
<span className="badge-red badge-dot">High Priority</span>`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}