/**
 * Centralized search and filtering utilities
 * Consolidates search logic used across multiple components
 */

import type { Customer } from '@/types/customer.types'

export interface SearchableCustomer {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  tags: string[]
}

export interface SearchOptions {
  caseSensitive?: boolean
  exactMatch?: boolean
  searchFields?: string[]
}

/**
 * Normalize search query by removing extra spaces and converting to lowercase
 */
export const normalizeQuery = (query: string): string => {
  return query.trim().toLowerCase()
}

/**
 * Split full name into first and last name parts
 */
export const parseFullName = (name: string): { firstName: string; lastName: string } => {
  const parts = name.trim().split(/\s+/)
  const firstName = parts[0] || ''
  const lastName = parts.slice(1).join(' ')
  return { firstName: firstName.toLowerCase(), lastName: lastName.toLowerCase() }
}

/**
 * Check if a text field matches the search query
 */
export const matchesField = (
  fieldValue: string | undefined, 
  query: string, 
  options: SearchOptions = {}
): boolean => {
  if (!fieldValue) return false
  
  const searchValue = options.caseSensitive ? fieldValue : fieldValue.toLowerCase()
  const searchQuery = options.caseSensitive ? query : query.toLowerCase()
  
  if (options.exactMatch) {
    return searchValue === searchQuery
  }
  
  return searchValue.includes(searchQuery)
}

/**
 * Search customers by multiple fields (name, email, phone)
 */
export const searchCustomers = (
  customers: Customer[], 
  query: string, 
  options: SearchOptions = {}
): Customer[] => {
  if (!query.trim()) return customers
  
  const normalizedQuery = normalizeQuery(query)
  
  return customers.filter(customer => {
    // Search in name (including first/last name separately)
    const { firstName, lastName } = parseFullName(customer.name)
    if (firstName.includes(normalizedQuery) || 
        lastName.includes(normalizedQuery) || 
        matchesField(customer.name, normalizedQuery, options)) {
      return true
    }
    
    // Search in email
    if (matchesField(customer.email, normalizedQuery, options)) {
      return true
    }
    
    // Search in phone
    if (matchesField(customer.phone, normalizedQuery, options)) {
      return true
    }
    
    // Search in company
    if (matchesField(customer.company, normalizedQuery, options)) {
      return true
    }
    
    // Search in tags
    if (customer.tags.some(tag => 
        matchesField(tag, normalizedQuery, options)
    )) {
      return true
    }
    
    return false
  })
}

/**
 * Generic search function for any object with string fields
 */
export const searchObjects = <T extends Record<string, string | string[] | undefined>>(
  objects: T[],
  query: string,
  searchFields: (keyof T)[],
  options: SearchOptions = {}
): T[] => {
  if (!query.trim()) return objects
  
  const normalizedQuery = normalizeQuery(query)
  
  return objects.filter(obj =>
    searchFields.some(field => {
      const value = obj[field]
      if (typeof value === 'string') {
        return matchesField(value, normalizedQuery, options)
      }
      if (Array.isArray(value)) {
        return value.some(item => 
          typeof item === 'string' && matchesField(item, normalizedQuery, options)
        )
      }
      return false
    })
  )
}

/**
 * Highlight search matches in text
 */
export const highlightMatches = (
  text: string, 
  query: string, 
  highlightClass: string = 'bg-yellow-200 dark:bg-yellow-800'
): string => {
  if (!query.trim()) return text
  
  const normalizedQuery = normalizeQuery(query)
  const regex = new RegExp(`(${normalizedQuery})`, 'gi')
  
  return text.replace(regex, `<mark class="${highlightClass}">$1</mark>`)
}

/**
 * Get search result summary
 */
export const getSearchSummary = (
  total: number, 
  filtered: number, 
  query: string
): string => {
  if (!query.trim()) {
    return `Showing ${total} results`
  }
  
  if (filtered === 0) {
    return `No results found for "${query}"`
  }
  
  return `Showing ${filtered} of ${total} results for "${query}"`
}

/**
 * Sort search results by relevance
 * Items with matches in name/title get higher priority
 */
export const sortByRelevance = <T extends { name?: string; title?: string; email?: string }>(
  items: T[], 
  query: string
): T[] => {
  if (!query.trim()) return items
  
  const normalizedQuery = normalizeQuery(query)
  
  return [...items].sort((a, b) => {
    const aScore = getRelevanceScore(a, normalizedQuery)
    const bScore = getRelevanceScore(b, normalizedQuery)
    return bScore - aScore
  })
}

/**
 * Calculate relevance score for search result ranking
 */
const getRelevanceScore = (
  item: { name?: string; title?: string; email?: string }, 
  query: string
): number => {
  let score = 0
  
  // Exact matches get highest score
  if (item.name?.toLowerCase() === query) score += 100
  if (item.title?.toLowerCase() === query) score += 100
  if (item.email?.toLowerCase() === query) score += 100
  
  // Starts with query gets high score
  if (item.name?.toLowerCase().startsWith(query)) score += 50
  if (item.title?.toLowerCase().startsWith(query)) score += 50
  if (item.email?.toLowerCase().startsWith(query)) score += 30
  
  // Contains query gets medium score
  if (item.name?.toLowerCase().includes(query)) score += 10
  if (item.title?.toLowerCase().includes(query)) score += 10
  if (item.email?.toLowerCase().includes(query)) score += 5
  
  return score
}