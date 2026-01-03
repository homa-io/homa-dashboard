// HTTP Methods
export type ToolMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

// Body types
export type ToolBodyType = 'JSON' | 'FormValue' | 'Custom'

// Authorization types
export type ToolAuthType = 'None' | 'Bearer' | 'BasicAuth' | 'APIKey'

// Parameter value types
export type ToolParamValueType = 'Variable' | 'Constant' | 'ByModel'

// Parameter data types
export type ToolParamDataType = 'string' | 'int' | 'float' | 'bool'

// Tool parameter definition
export interface ToolParam {
  key: string
  value: string
  value_type: ToolParamValueType
  data_type: ToolParamDataType
  example: string
  required: boolean
}

// AI Agent Tool
export interface AIAgentTool {
  id: number
  ai_agent_id: number
  name: string
  description: string
  endpoint: string
  method: ToolMethod
  query_params: ToolParam[] | null
  header_params: ToolParam[] | null
  body_type: ToolBodyType
  body_params: ToolParam[] | null
  authorization_type: ToolAuthType
  authorization_header: string
  authorization_value: string
  response_instructions: string
  created_at: string
  updated_at: string
}

// Create/Update request
export interface AIAgentToolRequest {
  name: string
  description?: string
  endpoint: string
  method: ToolMethod
  query_params?: ToolParam[] | null
  header_params?: ToolParam[] | null
  body_type?: ToolBodyType
  body_params?: ToolParam[] | null
  authorization_type?: ToolAuthType
  authorization_header?: string
  authorization_value?: string
  response_instructions?: string
}

// Options for dropdowns
export const METHOD_OPTIONS: { value: ToolMethod; label: string }[] = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'PATCH', label: 'PATCH' },
  { value: 'DELETE', label: 'DELETE' },
]

export const BODY_TYPE_OPTIONS: { value: ToolBodyType; label: string; description: string }[] = [
  { value: 'JSON', label: 'JSON', description: 'Send data as JSON body' },
  { value: 'FormValue', label: 'Form Data', description: 'Send as form-urlencoded' },
  { value: 'Custom', label: 'Custom', description: 'Custom body format' },
]

export const AUTH_TYPE_OPTIONS: { value: ToolAuthType; label: string; description: string }[] = [
  { value: 'None', label: 'No Auth', description: 'No authentication required' },
  { value: 'Bearer', label: 'Bearer Token', description: 'Bearer token authentication' },
  { value: 'BasicAuth', label: 'Basic Auth', description: 'Username and password' },
  { value: 'APIKey', label: 'API Key', description: 'API key in header' },
]

export const VALUE_TYPE_OPTIONS: { value: ToolParamValueType; label: string; description: string }[] = [
  { value: 'Constant', label: 'Constant', description: 'Fixed value' },
  { value: 'Variable', label: 'Variable', description: 'Runtime variable' },
  { value: 'ByModel', label: 'AI Decides', description: 'AI agent decides the value' },
]

export const DATA_TYPE_OPTIONS: { value: ToolParamDataType; label: string }[] = [
  { value: 'string', label: 'String' },
  { value: 'int', label: 'Integer' },
  { value: 'float', label: 'Float' },
  { value: 'bool', label: 'Boolean' },
]

// Default empty param
export const createEmptyParam = (): ToolParam => ({
  key: '',
  value: '',
  value_type: 'Constant',
  data_type: 'string',
  example: '',
  required: false,
})

// Default empty tool
export const createEmptyTool = (): Omit<AIAgentTool, 'id' | 'ai_agent_id' | 'created_at' | 'updated_at'> => ({
  name: '',
  description: '',
  endpoint: '',
  method: 'GET',
  query_params: [],
  header_params: [],
  body_type: 'JSON',
  body_params: [],
  authorization_type: 'None',
  authorization_header: '',
  authorization_value: '',
  response_instructions: '',
})
