"use client"

import { useState, useMemo } from "react"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  Calendar,
  DollarSign,
  Ticket,
  Edit3,
  Save,
  X,
  MapPin,
  Tag,
  User,
  Globe
} from "lucide-react"
import { mockCustomers, mockCustomerTickets, mockCustomFields } from "@/data/mockCustomers"
import { Customer, CustomerTicket, CustomField } from "@/types/customer.types"
import { CustomBadge } from "@/components/ui/custom-badge"

const statusColors = {
  active: 'green',
  inactive: 'red',
  pending: 'yellow'
} as const

const ticketStatusColors = {
  open: 'red',
  'in-progress': 'yellow',
  resolved: 'green',
  closed: 'gray'
} as const

const priorityColors = {
  low: 'green',
  medium: 'yellow',
  high: 'red',
  urgent: 'red'
} as const

interface CustomerDetailPageProps {
  params: {
    id: string
  }
  searchParams: {
    edit?: string
  }
}

export default function CustomerDetailPage({ params, searchParams }: CustomerDetailPageProps) {
  const customer = mockCustomers.find(c => c.id === params.id)
  const customerTickets = mockCustomerTickets[params.id] || []
  const isEditMode = searchParams.edit === 'true'
  
  const [editData, setEditData] = useState<Customer>(customer || {} as Customer)
  const [isEditing, setIsEditing] = useState(isEditMode)

  if (!customer) {
    notFound()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const handleSave = () => {
    // In a real app, this would make an API call
    console.log('Saving customer data:', editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData(customer)
    setIsEditing(false)
  }

  const updateEditData = (field: string, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }))
  }

  const updateCustomField = (fieldName: string, value: any) => {
    setEditData(prev => ({
      ...prev,
      customFields: { ...prev.customFields, [fieldName]: value }
    }))
  }

  const updateAddress = (field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      address: { ...prev.address!, [field]: value }
    }))
  }

  const displayData = isEditing ? editData : customer

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.location.href = '/customers'}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={displayData.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                {getInitials(displayData.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {displayData.name}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <CustomBadge variant={statusColors[displayData.status]}>
                  {displayData.status}
                </CustomBadge>
                <p className="text-base text-gray-600 dark:text-gray-300">
                  Customer since {formatDate(displayData.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Customer
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Customer Information */}
        <div className="md:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editData.name}
                      onChange={(e) => updateEditData('name', e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white font-medium">{displayData.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  {isEditing ? (
                    <Select value={editData.status} onValueChange={(value) => updateEditData('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <CustomBadge variant={statusColors[displayData.status]}>
                      {displayData.status}
                    </CustomBadge>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editData.email}
                      onChange={(e) => updateEditData('email', e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{displayData.email}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editData.phone || ''}
                      onChange={(e) => updateEditData('phone', e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{displayData.phone || 'Not provided'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                {isEditing ? (
                  <Input
                    id="company"
                    value={editData.company || ''}
                    onChange={(e) => updateEditData('company', e.target.value)}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{displayData.company || 'Not provided'}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {displayData.address ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    {isEditing ? (
                      <Input
                        id="street"
                        value={editData.address?.street || ''}
                        onChange={(e) => updateAddress('street', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{displayData.address.street}</p>
                    )}
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      {isEditing ? (
                        <Input
                          id="city"
                          value={editData.address?.city || ''}
                          onChange={(e) => updateAddress('city', e.target.value)}
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">{displayData.address.city}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      {isEditing ? (
                        <Input
                          id="state"
                          value={editData.address?.state || ''}
                          onChange={(e) => updateAddress('state', e.target.value)}
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">{displayData.address.state}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      {isEditing ? (
                        <Input
                          id="zipCode"
                          value={editData.address?.zipCode || ''}
                          onChange={(e) => updateAddress('zipCode', e.target.value)}
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">{displayData.address.zipCode}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    {isEditing ? (
                      <Input
                        id="country"
                        value={editData.address?.country || ''}
                        onChange={(e) => updateAddress('country', e.target.value)}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{displayData.address.country}</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No address information provided</p>
              )}
            </CardContent>
          </Card>

          {/* Custom Fields */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Custom Fields
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockCustomFields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  {isEditing ? (
                    field.type === 'select' ? (
                      <Select 
                        value={editData.customFields[field.name]?.toString() || ''} 
                        onValueChange={(value) => updateCustomField(field.name, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.type === 'boolean' ? (
                      <Select 
                        value={editData.customFields[field.name]?.toString() || 'false'} 
                        onValueChange={(value) => updateCustomField(field.name, value === 'true')}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : field.type === 'number' ? (
                      <Input
                        id={field.name}
                        type="number"
                        value={editData.customFields[field.name] || ''}
                        onChange={(e) => updateCustomField(field.name, Number(e.target.value))}
                        placeholder={field.placeholder}
                      />
                    ) : (
                      <Input
                        id={field.name}
                        value={editData.customFields[field.name] || ''}
                        onChange={(e) => updateCustomField(field.name, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    )
                  ) : (
                    <p className="text-gray-900 dark:text-white">
                      {field.type === 'boolean' 
                        ? (displayData.customFields[field.name] ? 'Yes' : 'No')
                        : field.type === 'number' && field.name === 'annual_revenue'
                        ? formatCurrency(displayData.customFields[field.name] || 0)
                        : (displayData.customFields[field.name] || 'Not set')
                      }
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Tickets</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">{displayData.totalTickets}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Customer Value</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(displayData.value)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last Activity</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(displayData.lastActivity)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {displayData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Tickets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Tickets</span>
                <Badge variant="outline">{customerTickets.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {customerTickets.length > 0 ? (
                customerTickets.map((ticket) => (
                  <div key={ticket.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {ticket.title}
                      </h4>
                      <CustomBadge variant={priorityColors[ticket.priority]} className="text-xs ml-2">
                        {ticket.priority}
                      </CustomBadge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <CustomBadge variant={ticketStatusColors[ticket.status]} className="text-xs">
                        {ticket.status}
                      </CustomBadge>
                      <span>{formatDate(ticket.createdAt)}</span>
                    </div>
                    {ticket.assignee && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Assigned to: {ticket.assignee}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No tickets found</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}