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
    <div className="flex-1 space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-8 pt-4 sm:pt-6 min-h-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4 w-full lg:w-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.location.href = '/customers'}
            className="flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
              <AvatarImage src={displayData.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm sm:text-lg font-semibold">
                {getInitials(displayData.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
                {displayData.name}
              </h2>
              <div className="flex flex-col gap-2 mt-1 sm:mt-2">
                <CustomBadge variant={statusColors[displayData.status]} className="flex-shrink-0 self-start">
                  {displayData.status}
                </CustomBadge>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  <span className="hidden sm:inline">Customer since </span>
                  <span className="sm:hidden">Since </span>
                  <span className="break-words">
                    {new Date(displayData.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 w-full lg:w-auto">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="w-full lg:w-auto">
              <Edit3 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Edit Customer</span>
              <span className="sm:hidden">Edit</span>
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel} className="flex-1 lg:flex-initial">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1 lg:flex-initial">
                <Save className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Save Changes</span>
                <span className="sm:hidden">Save</span>
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Customer Information */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {/* Name and Status - Stack on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="name" className="text-xs sm:text-sm font-medium text-muted-foreground">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editData.name}
                      onChange={(e) => updateEditData('name', e.target.value)}
                      className="text-sm"
                    />
                  ) : (
                    <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">{displayData.name}</p>
                  )}
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="status" className="text-xs sm:text-sm font-medium text-muted-foreground">Status</Label>
                  {isEditing ? (
                    <Select value={editData.status} onValueChange={(value) => updateEditData('status', value)}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div>
                      <CustomBadge variant={statusColors[displayData.status]}>
                        {displayData.status}
                      </CustomBadge>
                    </div>
                  )}
                </div>
              </div>

              {/* Email and Phone - Stack on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="email" className="text-xs sm:text-sm font-medium text-muted-foreground">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editData.email}
                      onChange={(e) => updateEditData('email', e.target.value)}
                      className="text-sm"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-900 dark:text-white truncate">{displayData.email}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="phone" className="text-xs sm:text-sm font-medium text-muted-foreground">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editData.phone || ''}
                      onChange={(e) => updateEditData('phone', e.target.value)}
                      className="text-sm"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-900 dark:text-white">{displayData.phone || 'Not provided'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Company */}
              <div className="space-y-1.5 sm:space-y-2 pt-2 sm:pt-0">
                <Label htmlFor="company" className="text-xs sm:text-sm font-medium text-muted-foreground">Company</Label>
                {isEditing ? (
                  <Input
                    id="company"
                    value={editData.company || ''}
                    onChange={(e) => updateEditData('company', e.target.value)}
                    className="text-sm"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-900 dark:text-white">{displayData.company || 'Not provided'}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {displayData.address ? (
                <>
                  {/* Street Address */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="street" className="text-xs sm:text-sm font-medium text-muted-foreground">Street Address</Label>
                    {isEditing ? (
                      <Input
                        id="street"
                        value={editData.address?.street || ''}
                        onChange={(e) => updateAddress('street', e.target.value)}
                        className="text-sm"
                      />
                    ) : (
                      <p className="text-sm sm:text-base text-gray-900 dark:text-white break-words">{displayData.address.street}</p>
                    )}
                  </div>

                  {/* City, State, ZIP - Stack on mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="city" className="text-xs sm:text-sm font-medium text-muted-foreground">City</Label>
                      {isEditing ? (
                        <Input
                          id="city"
                          value={editData.address?.city || ''}
                          onChange={(e) => updateAddress('city', e.target.value)}
                          className="text-sm"
                        />
                      ) : (
                        <p className="text-sm sm:text-base text-gray-900 dark:text-white">{displayData.address.city}</p>
                      )}
                    </div>
                    
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="state" className="text-xs sm:text-sm font-medium text-muted-foreground">State / Province</Label>
                      {isEditing ? (
                        <Input
                          id="state"
                          value={editData.address?.state || ''}
                          onChange={(e) => updateAddress('state', e.target.value)}
                          className="text-sm"
                        />
                      ) : (
                        <p className="text-sm sm:text-base text-gray-900 dark:text-white">{displayData.address.state}</p>
                      )}
                    </div>
                    
                    <div className="space-y-1.5 sm:space-y-2 sm:col-span-2 lg:col-span-1">
                      <Label htmlFor="zipCode" className="text-xs sm:text-sm font-medium text-muted-foreground">ZIP / Postal Code</Label>
                      {isEditing ? (
                        <Input
                          id="zipCode"
                          value={editData.address?.zipCode || ''}
                          onChange={(e) => updateAddress('zipCode', e.target.value)}
                          className="text-sm"
                        />
                      ) : (
                        <p className="text-sm sm:text-base text-gray-900 dark:text-white">{displayData.address.zipCode}</p>
                      )}
                    </div>
                  </div>

                  {/* Country */}
                  <div className="space-y-1.5 sm:space-y-2 pt-2 sm:pt-0">
                    <Label htmlFor="country" className="text-xs sm:text-sm font-medium text-muted-foreground">Country</Label>
                    {isEditing ? (
                      <Input
                        id="country"
                        value={editData.address?.country || ''}
                        onChange={(e) => updateAddress('country', e.target.value)}
                        className="text-sm"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="text-sm sm:text-base text-gray-900 dark:text-white">{displayData.address.country}</span>
                      </div>
                    )}
                  </div>

                  {/* Full Address Display on Mobile */}
                  {!isEditing && (
                    <div className="sm:hidden pt-3 mt-3 border-t">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Full Address</p>
                      <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                        {displayData.address.street}<br />
                        {displayData.address.city}, {displayData.address.state} {displayData.address.zipCode}<br />
                        {displayData.address.country}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No address information provided</p>
              )}
            </CardContent>
          </Card>

          {/* Custom Fields */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Tag className="h-4 w-4 sm:h-5 sm:w-5" />
                Custom Fields
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {mockCustomFields.map((field) => (
                  <div key={field.id} className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor={field.name} className="text-xs sm:text-sm font-medium text-muted-foreground">
                      {field.label}
                    </Label>
                    {isEditing ? (
                      field.type === 'select' ? (
                        <Select 
                          value={editData.customFields[field.name]?.toString() || ''} 
                          onValueChange={(value) => updateCustomField(field.name, value)}
                        >
                          <SelectTrigger className="text-sm">
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
                          <SelectTrigger className="text-sm">
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
                          className="text-sm"
                        />
                      ) : (
                        <Input
                          id={field.name}
                          value={editData.customFields[field.name] || ''}
                          onChange={(e) => updateCustomField(field.name, e.target.value)}
                          placeholder={field.placeholder}
                          className="text-sm"
                        />
                      )
                    ) : (
                      <p className="text-sm sm:text-base text-gray-900 dark:text-white">
                        {field.type === 'boolean' 
                          ? (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              displayData.customFields[field.name] 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {displayData.customFields[field.name] ? 'Yes' : 'No'}
                            </span>
                          )
                          : field.type === 'number' && field.name === 'annual_revenue'
                          ? (
                            <span className="font-semibold">
                              {formatCurrency(displayData.customFields[field.name] || 0)}
                            </span>
                          )
                          : (displayData.customFields[field.name] || <span className="text-muted-foreground text-xs sm:text-sm">Not set</span>)
                        }
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6 lg:order-2 order-1">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 sm:gap-6 lg:gap-4">
                <div className="flex sm:flex-col lg:flex-row items-center sm:items-start lg:items-center justify-between sm:justify-start lg:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Tickets</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{displayData.totalTickets}</span>
                </div>
                <div className="flex sm:flex-col lg:flex-row items-center sm:items-start lg:items-center justify-between sm:justify-start lg:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Customer Value</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(displayData.value)}</span>
                </div>
                <div className="flex sm:flex-col lg:flex-row items-center sm:items-start lg:items-center justify-between sm:justify-start lg:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last Activity</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 sm:mt-1 lg:mt-0">{formatDate(displayData.lastActivity)}</span>
                </div>
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
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate flex-1">
                        {ticket.title}
                      </h4>
                      <CustomBadge variant={priorityColors[ticket.priority]} className="text-xs self-start">
                        {ticket.priority}
                      </CustomBadge>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-gray-500 dark:text-gray-400 gap-2">
                      <CustomBadge variant={ticketStatusColors[ticket.status]} className="text-xs">
                        {ticket.status}
                      </CustomBadge>
                      <span className="text-xs">{formatDate(ticket.createdAt)}</span>
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