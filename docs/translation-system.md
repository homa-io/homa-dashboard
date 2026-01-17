# Message Translation System

This document explains how the message translation system works in the Homa platform, from sending messages to displaying them to agents.

## Overview

The translation system provides real-time translation between customers and agents who speak different languages. It supports:
- **Incoming translation**: Customer messages translated to agent's language
- **Outgoing translation**: Agent messages translated to customer's language
- **Per-message language detection**: Each message can have a different language

---

## 1. Setup & Configuration

### Agent Settings (stored in user profile)

| Setting | Description |
|---------|-------------|
| `auto_translate_incoming` | Translate customer messages TO agent's language |
| `auto_translate_outgoing` | Translate agent messages TO customer's language |
| `language` | Agent's preferred language (e.g., "en", "fa") |

These settings are configured in the agent's profile settings.

---

## 2. When Conversation Opens

When an agent opens a conversation (e.g., `/conversations?id=54`), the frontend fetches language information:

```
Frontend                              Backend
   |                                     |
   |--GET /language-info--------------->|
   |                                     |
   |  Returns:                           |
   |  - agent_language: "en"             |
   |  - detected_customer_language: "fa" |
   |  - needs_translation: true          |
   |  - auto_translate_incoming: true    |
   |  - auto_translate_outgoing: true    |
   |<------------------------------------|
```

### Response Fields

| Field | Description |
|-------|-------------|
| `agent_language` | The agent's configured language |
| `detected_customer_language` | Most common language from customer messages |
| `needs_translation` | Whether translation is needed for this conversation |
| `auto_translate_incoming` | Agent's incoming translation setting |
| `auto_translate_outgoing` | Agent's outgoing translation setting |
| `per_message_language_detection` | Always `true` - each message detected individually |

---

## 3. Displaying Customer Messages (Incoming)

### Flow

1. Message loads with `language: "fa"` (Persian)
2. Frontend checks: agent speaks "en", message is "fa" → needs translation
3. Frontend batches message IDs (100ms debounce for performance)
4. Calls `POST /conversations/{id}/translations` with message IDs

### Backend Translation Logic

```
For each message:
  1. Check if message.language exists
     - If not: Detect language using AI → Update database

  2. If message.language != agent.language:
     - Check if translation exists in DB (cached)
     - If not: Call AI to translate → Cache in DB

  3. Return { original, translated, from_lang, to_lang }
```

### Display Behavior

- **Default**: Shows TRANSLATED text (so agent can read it)
- Agent clicks the language icon (🌐) → toggles to ORIGINAL text
- A "Translated" badge appears when showing translated content

---

## 4. Agent Sends Message (Outgoing)

When `auto_translate_outgoing` is enabled:

### Flow

```
Agent types: "Hello, how can I help?"
                    |
                    v
Frontend calls: POST /translate-outgoing
                    |
                    v
Backend:
  1. Get customer's dominant language from recent messages
  2. Translate: "en" → "fa" (Persian)
  3. Return: {
       original: "Hello, how can I help?",
       translated: "سلام، چطور می‌تونم کمکتون کنم؟"
     }
                    |
                    v
Message saved with:
  - body: "سلام، چطور می‌تونم کمکتون کنم؟" (translated - what customer sees)
  - Original stored in ConversationMessageTranslation table (type: "outgoing")
```

### Display Behavior for Agent

- **Default**: Shows what agent TYPED (original English)
- Agent clicks the eye icon (👁️) → sees what customer RECEIVED (Persian)

---

## 5. Database Schema

### Messages Table

```sql
messages
├── id
├── body           -- The visible text (translated for outgoing if auto-translate ON)
├── language       -- Detected language code: "fa", "en", etc.
├── conversation_id
├── client_id      -- NULL for agent messages
├── is_agent       -- true for agent/bot messages
└── ...
```

### Translation Cache Table

```sql
conversation_message_translations
├── id
├── message_id
├── conversation_id
├── type           -- "incoming" | "outgoing"
├── content        -- Original or translated text depending on type
├── from_lang      -- Source language
├── to_lang        -- Target language
├── created_at
└── updated_at
```

### Storage Logic

| Message Type | `messages.body` contains | `translations.content` contains |
|-------------|--------------------------|--------------------------------|
| Customer → Agent | Original (customer's language) | Translated (agent's language) |
| Agent → Customer | Translated (customer's language) | Original (what agent typed) |

---

## 6. Message Type Summary

| Message Type | Default View | Toggle Shows | Who Sees What |
|-------------|--------------|--------------|---------------|
| **Customer → Agent** | Translated (agent's language) | Original (customer's language) | Agent sees translated |
| **Agent → Customer** | Original (what agent typed) | Translated (what customer sees) | Customer sees translated |
| **Bot → Agent** | Translated (bots write in customer lang) | Original | Agent sees translated |

---

## 7. Frontend Components

### Key Files

| File | Purpose |
|------|---------|
| `src/hooks/useMessageTranslation.ts` | Main translation hook - manages state, batching, API calls |
| `src/services/translation.service.ts` | API client for translation endpoints |
| `src/components/conversations/MessageBubble.tsx` | Renders messages with translation toggle |

### Hook Usage

```typescript
const {
  languageInfo,        // Language info for the conversation
  translations,        // Translation state for all messages
  needsTranslation,    // Whether translation is needed
  getTranslation,      // Get translation for a specific message
  toggleTranslation,   // Toggle between original/translated
  translateOutgoing,   // Translate outgoing message before sending
} = useMessageTranslation({
  conversationId: 54,
  enabled: true,
})
```

---

## 8. Backend Endpoints

### Translation Controller Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/agent/conversations/{id}/language-info` | Get language info for conversation |
| POST | `/agent/conversations/{id}/translations` | Get translations for message IDs |
| POST | `/agent/conversations/{id}/outgoing-translations` | Get original content for outgoing messages |
| POST | `/agent/conversations/{id}/translate-outgoing` | Translate text before sending |

---

## 9. Key Implementation Details

### Performance Optimizations

1. **Batched Requests**: Frontend batches translation requests within 100ms window
2. **Caching**: Translations stored in DB, never re-translated
3. **Lazy Loading**: Only translates messages when needed (not all at once)
4. **No Retry for Missing**: Messages without outgoing records are tracked to avoid retrying

### Language Detection

1. **Per-message detection**: Each message can have different language
2. **AI-powered**: Uses AI service to detect language from message content
3. **Fallback**: Short messages use conversation's dominant language
4. **Backfill**: Messages without language are detected and updated on-demand

### Customer Language Determination

For outgoing translation, customer language is determined by:
1. Most common language from recent customer messages (last 10)
2. Fallback to client's stored language preference
3. Final fallback to "en" (English)

---

## 10. Troubleshooting

### Translation Not Working

1. Check agent's `auto_translate_incoming` / `auto_translate_outgoing` settings
2. Verify `language` is set in agent's profile
3. Check if conversation has messages with detected language

### Wrong Language Detected

1. Short messages may use fallback language
2. Check `messages.language` column in database
3. Language detection improves with longer messages

### Translation Not Showing

1. Verify `needsTranslation` is true in language info
2. Check browser console for API errors
3. Ensure translation service is properly configured
