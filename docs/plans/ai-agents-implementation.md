# AI Agents Feature - Implementation Plan

## Overview

Create a new AI Agents management section in the dashboard that allows users to create, list, edit, and delete AI agents. Each AI agent is configured with specific settings and can be assigned to departments.

---

## 1. Entity Definition

### AI Agent Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Primary key |
| `name` | `string` | Display name for the agent |
| `bot_id` | `string` | Reference to a User of type 'bot' |
| `handover_enabled` | `boolean` | Enable handover to human agent |
| `handover_user_id` | `string \| null` | User ID to handover to (when enabled) |
| `multi_language` | `boolean` | Respond in user's language |
| `internet_access` | `boolean` | Agent can access internet |
| `tone` | `string` | Response tone (formal/casual/detailed/precise) |
| `use_knowledge_base` | `boolean` | Use RAG knowledge base |
| `unit_conversion` | `boolean` | Convert units to human-readable |
| `instructions` | `string` | Custom instructions (textarea) |
| `status` | `string` | 'active' \| 'inactive' |
| `created_at` | `string` | ISO timestamp |
| `updated_at` | `string` | ISO timestamp |

### Tone Options
- `formal` - Professional and formal responses
- `casual` - Friendly and conversational
- `detailed` - Comprehensive explanations
- `precise` - Short and to-the-point
- `empathetic` - Warm and understanding
- `technical` - Technical terminology preferred

### Relationships
- **AI Agent → Bot**: One-to-one (via `bot_id`)
- **AI Agent → Human User**: Optional (via `handover_user_id`)
- **Department → AI Agent**: Many-to-one (via `department.ai_agent_id`)

---

## 2. File Structure

```
src/
├── types/
│   └── ai-agent.types.ts              # Type definitions
├── services/
│   └── ai-agent.service.ts            # API service layer
├── hooks/
│   └── useAIAgents.ts                 # React Query hooks
├── components/
│   └── settings/
│       └── bot/
│           └── ai-agents/
│               ├── index.ts               # Public exports
│               ├── AIAgentManager.tsx     # Container component
│               ├── AIAgentList.tsx        # Table/list display
│               ├── AIAgentForm.tsx        # Create/Edit modal form
│               └── AIAgentCard.tsx        # Optional: Card view
app/
└── settings/
    └── bot/
        └── page.tsx                   # Route page (AI Agents)
```

---

## 3. Implementation Steps

### Phase 1: Types & Service Layer

#### Step 1.1: Create Type Definitions
**File:** `src/types/ai-agent.types.ts`

```typescript
// Tone options
export type AIAgentTone =
  | 'formal'
  | 'casual'
  | 'detailed'
  | 'precise'
  | 'empathetic'
  | 'technical';

export type AIAgentStatus = 'active' | 'inactive';

// Main entity
export interface AIAgent {
  id: number;
  name: string;
  bot_id: string;
  bot?: {
    id: string;
    name: string;
    display_name: string;
    avatar?: string | null;
  };
  handover_enabled: boolean;
  handover_user_id: string | null;
  handover_user?: {
    id: string;
    name: string;
    display_name: string;
  } | null;
  multi_language: boolean;
  internet_access: boolean;
  tone: AIAgentTone;
  use_knowledge_base: boolean;
  unit_conversion: boolean;
  instructions: string;
  status: AIAgentStatus;
  created_at: string;
  updated_at: string;
}

// Create request
export interface AIAgentCreateRequest {
  name: string;
  bot_id: string;
  handover_enabled: boolean;
  handover_user_id?: string | null;
  multi_language: boolean;
  internet_access: boolean;
  tone: AIAgentTone;
  use_knowledge_base: boolean;
  unit_conversion: boolean;
  instructions: string;
}

// Update request
export interface AIAgentUpdateRequest extends Partial<AIAgentCreateRequest> {
  status?: AIAgentStatus;
}

// List params
export interface AIAgentListParams {
  search?: string;
  status?: AIAgentStatus;
  page?: number;
  limit?: number;
}

// List response
export interface AIAgentListResponse {
  data: AIAgent[];
  total: number;
}
```

#### Step 1.2: Create Service Layer
**File:** `src/services/ai-agent.service.ts`

Functions to implement:
- `getAIAgents(params?: AIAgentListParams)` - List all agents
- `getAIAgent(id: number)` - Get single agent
- `createAIAgent(data: AIAgentCreateRequest)` - Create agent
- `updateAIAgent(id: number, data: AIAgentUpdateRequest)` - Update agent
- `deleteAIAgent(id: number)` - Delete agent

API Endpoints (suggested):
- `GET /api/admin/ai-agents`
- `GET /api/admin/ai-agents/:id`
- `POST /api/admin/ai-agents`
- `PUT /api/admin/ai-agents/:id`
- `DELETE /api/admin/ai-agents/:id`

#### Step 1.3: Create React Query Hooks
**File:** `src/hooks/useAIAgents.ts`

Hooks to implement:
- `useAIAgents(params?)` - Query for list
- `useAIAgent(id)` - Query for single
- `useCreateAIAgent()` - Mutation
- `useUpdateAIAgent()` - Mutation
- `useDeleteAIAgent()` - Mutation

---

### Phase 2: UI Components

#### Step 2.1: Create AIAgentManager (Container)
**File:** `src/components/settings/ai-agents/AIAgentManager.tsx`

Responsibilities:
- Manage list state and pagination
- Handle CRUD operations
- Control modal open/close states
- Orchestrate child components
- Search and filter functionality

State to manage:
- `agents: AIAgent[]`
- `loading: boolean`
- `error: string | null`
- `searchQuery: string`
- `isFormOpen: boolean`
- `editingAgent: AIAgent | null`
- `deletingAgent: AIAgent | null`

#### Step 2.2: Create AIAgentList (Display)
**File:** `src/components/settings/ai-agents/AIAgentList.tsx`

Features:
- Table layout with columns:
  - Name
  - Bot (avatar + name)
  - Tone badge
  - Features (icons for enabled features)
  - Status badge
  - Actions (Edit, Delete)
- Loading skeleton
- Empty state
- Row click to edit

#### Step 2.3: Create AIAgentForm (Modal)
**File:** `src/components/settings/ai-agents/AIAgentForm.tsx`

Form sections:

**Section 1: Basic Info**
- Name (text input, required)
- Bot selection (Select dropdown, filter users by type='bot')

**Section 2: Behavior Settings**
- Handover to human toggle (Switch)
  - Conditional: User selection (when enabled)
- Multi-language toggle (Switch)
- Internet access toggle (Switch)
- Use Knowledge Base toggle (Switch)
- Unit conversion toggle (Switch)

**Section 3: Response Style**
- Tone selection (Select dropdown or radio group)

**Section 4: Instructions**
- Instructions (large Textarea, with placeholder/hint)

Form validation:
- Name required
- Bot required
- Handover user required when handover enabled

---

### Phase 3: Department Integration

#### Step 3.1: Update Department Types
**File:** `src/types/department.types.ts`

Add to `Department` interface:
```typescript
ai_agent_id?: number | null;
ai_agent?: {
  id: number;
  name: string;
} | null;
```

Add to `DepartmentCreateRequest` and `DepartmentUpdateRequest`:
```typescript
ai_agent_id?: number | null;
```

#### Step 3.2: Update Department Form
**File:** `src/components/settings/departments/DepartmentForm.tsx`

Add AI Agent selection:
- Fetch available AI agents
- Select dropdown to choose AI agent
- Display current AI agent in edit mode

#### Step 3.3: Update Department List
**File:** `src/components/settings/departments/DepartmentList.tsx`

- Add column or indicator for assigned AI agent
- Show AI agent name or "No AI Agent" placeholder

#### Step 3.4: Update Department Edit Page
**File:** `src/components/settings/departments/DepartmentEditPage.tsx`

- Add AI Agent selection in the edit form
- Show current assignment

---

### Phase 4: Navigation & Routing

#### Step 4.1: Create Page Route
**File:** `app/settings/bot/page.tsx`

```tsx
import { AIAgentManager } from '@/components/settings/bot/ai-agents';

export default function BotSettingsPage() {
  return <AIAgentManager />;
}
```

#### Step 4.2: Add Navigation Link
Update navigation/sidebar to include "Bot" under Settings.

Look for navigation config files and add:
- Label: "Bot" or "AI Agents"
- Icon: `Bot` or `Sparkles` from lucide-react
- Path: `/settings/bot`

---

## 4. UI/UX Design Notes

### Form Layout Recommendation

```
┌─────────────────────────────────────────────────────────┐
│ Create AI Agent                                    [X]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Name *                                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Customer Support Bot                             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Select Bot *                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🤖 Support Bot v2                            ▼  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ── Behavior Settings ──────────────────────────────   │
│                                                         │
│  ┌──────────────────────────────────────────────┐      │
│  │ 🔄 Handover to Human                    [OFF] │      │
│  │ When enabled, transfers to human if needed    │      │
│  └──────────────────────────────────────────────┘      │
│                                                         │
│  ┌──────────────────────────────────────────────┐      │
│  │ 🌍 Multi-Language                        [ON] │      │
│  │ Respond in user's language                    │      │
│  └──────────────────────────────────────────────┘      │
│                                                         │
│  ┌──────────────────────────────────────────────┐      │
│  │ 🌐 Internet Access                       [OFF]│      │
│  │ Allow agent to search the web                 │      │
│  └──────────────────────────────────────────────┘      │
│                                                         │
│  ┌──────────────────────────────────────────────┐      │
│  │ 📚 Use Knowledge Base                    [ON] │      │
│  │ Use RAG to answer from documents              │      │
│  └──────────────────────────────────────────────┘      │
│                                                         │
│  ┌──────────────────────────────────────────────┐      │
│  │ 📐 Unit Conversion                       [ON] │      │
│  │ Convert units to human-readable format        │      │
│  └──────────────────────────────────────────────┘      │
│                                                         │
│  ── Response Style ─────────────────────────────────   │
│                                                         │
│  Tone                                                   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Casual - Friendly and conversational        ▼  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ── Instructions ───────────────────────────────────   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ You are a helpful customer support agent.      │   │
│  │ Always greet the customer warmly.              │   │
│  │ If you don't know the answer, ask for help.    │   │
│  │                                                 │   │
│  │                                                 │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                          [Cancel]  [Create AI Agent]    │
└─────────────────────────────────────────────────────────┘
```

### List View Features Icons

Show enabled features as small icons in a row:
- 🔄 Handover enabled
- 🌍 Multi-language
- 🌐 Internet access
- 📚 Knowledge base
- 📐 Unit conversion

---

## 5. API Contract (Backend Requirements)

### Endpoints Needed

```
GET    /api/admin/ai-agents
GET    /api/admin/ai-agents/:id
POST   /api/admin/ai-agents
PUT    /api/admin/ai-agents/:id
DELETE /api/admin/ai-agents/:id
```

### Request/Response Examples

**Create AI Agent**
```json
POST /api/admin/ai-agents
{
  "name": "Customer Support",
  "bot_id": "usr_abc123",
  "handover_enabled": true,
  "handover_user_id": "usr_xyz789",
  "multi_language": true,
  "internet_access": false,
  "tone": "casual",
  "use_knowledge_base": true,
  "unit_conversion": true,
  "instructions": "You are a helpful support agent..."
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Customer Support",
    "bot_id": "usr_abc123",
    "bot": {
      "id": "usr_abc123",
      "name": "Support",
      "display_name": "Support Bot"
    },
    "handover_enabled": true,
    "handover_user_id": "usr_xyz789",
    "handover_user": {
      "id": "usr_xyz789",
      "name": "John",
      "display_name": "John Doe"
    },
    "multi_language": true,
    "internet_access": false,
    "tone": "casual",
    "use_knowledge_base": true,
    "unit_conversion": true,
    "instructions": "You are a helpful support agent...",
    "status": "active",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

---

## 6. Implementation Checklist

### Phase 1: Foundation
- [ ] Create `src/types/ai-agent.types.ts`
- [ ] Create `src/services/ai-agent.service.ts`
- [ ] Create `src/hooks/useAIAgents.ts`
- [ ] Add query keys to `src/hooks/query-keys.ts`

### Phase 2: UI Components
- [ ] Create `src/components/settings/bot/ai-agents/` directory
- [ ] Create `AIAgentManager.tsx`
- [ ] Create `AIAgentList.tsx`
- [ ] Create `AIAgentForm.tsx`
- [ ] Create `index.ts` exports

### Phase 3: Routing & Navigation
- [ ] Create `app/settings/bot/page.tsx`
- [ ] Add navigation link to sidebar/settings menu

### Phase 4: Department Integration
- [ ] Update `src/types/department.types.ts` - add ai_agent_id
- [ ] Update `DepartmentForm.tsx` - add AI agent selection
- [ ] Update `DepartmentList.tsx` - show assigned AI agent
- [ ] Update `DepartmentEditPage.tsx` - add AI agent selection

### Phase 5: Testing & Polish
- [ ] Test all CRUD operations
- [ ] Test form validation
- [ ] Test department integration
- [ ] Verify responsive design
- [ ] Add loading states and error handling

---

## 7. Dependencies

### Existing Components to Reuse
- `Dialog` - Modal wrapper
- `Button` - Actions
- `Input` - Text fields
- `Textarea` - Instructions field
- `Select` - Dropdowns
- `Switch` - Toggle fields
- `Badge` - Status/feature indicators
- `Table` - List display
- `Skeleton` - Loading states
- `AlertDialog` - Delete confirmation
- `ScrollArea` - Scrollable lists

### Icons from lucide-react
- `Bot` - Bot indicator
- `Sparkles` - AI indicator
- `Globe` - Internet access
- `Languages` - Multi-language
- `Book` - Knowledge base
- `Ruler` - Unit conversion
- `UserCircle` - Human handover
- `MessageSquare` - Tone/response
- `Settings` - Configuration

---

## 8. Notes

1. **Bot Selection**: The form should fetch users with `type='bot'` only for the bot selection dropdown.

2. **Human Handover User**: Should fetch users with `type='agent'` or `type='administrator'` for the handover selection.

3. **Instructions Field**: Consider adding:
   - Character count
   - Markdown preview option
   - Template suggestions

4. **Validation**:
   - Backend should validate that `bot_id` refers to a valid bot user
   - `handover_user_id` required when `handover_enabled` is true

5. **Delete Behavior**: When deleting an AI agent, departments using it should have their `ai_agent_id` set to null (handled by backend).

6. **Status Toggle**: Consider adding quick status toggle directly from the list view.
