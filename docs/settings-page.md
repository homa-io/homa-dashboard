# Settings Page Documentation

The Settings page provides a comprehensive interface for configuring various aspects of the Homa Dashboard application. It features a vertical tab navigation system with six main sections.

## Page Structure

### Navigation
- **Location**: `/settings`
- **Sidebar Link**: Already linked in the left navigation sidebar under "Settings"
- **Layout**: Vertical tab navigation with content area

### Tab Structure

The settings page uses a clean vertical tab layout with the following tabs:

1. **General** - Basic application settings and preferences
2. **Customer Attributes** - Manage custom fields and attributes for customers
3. **Ticket Attributes** - Configure ticket fields, statuses, and priorities
4. **Integrations** - Connect with external services and APIs
5. **Plugins** - Manage installed plugins and extensions
6. **Canned Messages** - Pre-written responses and message templates

## Tab Details

### 1. General Settings

**Purpose**: Configure basic application settings and localization

**Features**:
- Application name and company name configuration
- Application description
- Maintenance mode toggle
- User registration toggle
- Language selection (English, Spanish, French, German)
- Timezone configuration (UTC, EST, PST, CET)

**Components Used**:
- Input fields for text configuration
- Textarea for description
- Switch toggles for boolean settings
- Select dropdowns for choices

### 2. Customer Attributes

**Purpose**: Manage custom fields and customer categorization

**Features**:
- **Custom Fields Management**:
  - Add/remove custom fields
  - Configure field name, display label, type, and required status
  - Field types: Text, Number, Email, Select, Boolean
  - Real-time field configuration
- **Customer Tags**:
  - Predefined tags: VIP, Enterprise, SMB, Trial, Churned, Prospect
  - Add/remove custom tags
  - Tag removal with confirmation

**Components Used**:
- Dynamic form fields
- Select dropdowns for field types
- Switch toggles for required fields
- Badge components for tags
- Add/Remove buttons

### 3. Ticket Attributes

**Purpose**: Configure ticket workflow and categorization

**Features**:
- **Ticket Statuses**:
  - Default statuses: Open (blue), In Progress (yellow), Resolved (green), Closed (gray)
  - Custom status creation
  - Color assignment for each status
  - Protection for default statuses
- **Priority Levels**:
  - Default priorities: Low (green), Medium (yellow), High (orange), Urgent (red)
  - Color customization
  - Priority level management

**Components Used**:
- Color-coded status indicators
- Select dropdowns for color selection
- Add/Remove functionality
- Input fields for custom names

### 4. Integrations

**Purpose**: Manage external service connections and API settings

**Features**:
- **Pre-built Integrations**:
  - Slack (notifications and ticket management)
  - Zapier (workflow automation)
  - WhatsApp Business (customer support)
  - Stripe (payment and customer data sync)
- **Integration Management**:
  - Connection status indicators
  - Connect/Disconnect functionality
  - Configuration options for connected services
- **API Settings**:
  - API base URL configuration
  - API access toggle
  - Webhook URL configuration

**Components Used**:
- Integration cards with logos and descriptions
- Connection status badges
- Action buttons for management
- Configuration forms

### 5. Plugins

**Purpose**: Manage installed plugins and browse available extensions

**Features**:
- **Installed Plugins**:
  - Auto-Response Bot (v1.2.3)
  - Customer Satisfaction Survey (v2.1.0)
  - Advanced Analytics (v1.0.5)
- **Plugin Management**:
  - Enable/disable toggles
  - Version information
  - Configuration, update, and uninstall options
- **Plugin Store**:
  - Placeholder for future plugin marketplace
  - Browse functionality preparation

**Components Used**:
- Plugin cards with metadata
- Switch toggles for activation
- Dropdown menus for actions
- Version badges
- Coming soon placeholder

### 6. Canned Messages

**Purpose**: Create and manage pre-written response templates

**Features**:
- **Message Templates**:
  - Title and category assignment
  - Rich content editing
  - Variable support for personalization: `{customer_name}`, `{ticket_id}`, `{agent_name}`
  - Default templates: Welcome Message, Ticket Received, Issue Resolved
- **Message Categories**:
  - Default categories: General, Greetings, Confirmations, Closures, Technical
  - Custom category creation
  - Category-based organization
- **Template Variables**:
  - Dynamic content insertion
  - Customer personalization
  - Ticket context variables

**Components Used**:
- Form inputs for title and category
- Textarea for message content
- Category management with badges
- Add/Remove functionality
- Variable documentation

## Technical Implementation

### State Management
- Uses React `useState` for tab navigation and form data
- Local state management for dynamic content (custom fields, messages, etc.)
- Form state preservation during tab switches

### UI Components
- **Shadcn/UI Components**: Card, Button, Input, Label, Switch, Select, Textarea, Badge
- **Lucide Icons**: Comprehensive icon set for visual consistency
- **Custom Components**: Vertical tab navigation, dynamic forms

### Responsive Design
- Desktop-optimized layout with vertical navigation
- Flexible content area that adapts to content
- Mobile responsiveness considerations

### Form Handling
- Real-time form updates
- Add/Remove functionality for dynamic content
- Form validation preparation
- Save functionality hooks

## Future Enhancements

### Planned Features
1. **Form Validation**: Client-side and server-side validation
2. **Real-time Save**: Auto-save functionality for form changes
3. **Import/Export**: Settings backup and restore
4. **Advanced Permissions**: Role-based settings access
5. **Plugin Store**: Full marketplace integration
6. **API Integration**: Connect settings to backend services
7. **Audit Trail**: Track settings changes
8. **Bulk Operations**: Mass update capabilities

### Technical Improvements
1. **Service Layer Integration**: Connect to backend APIs
2. **Form Libraries**: Implement React Hook Form or Formik
3. **Validation Schemas**: Zod or Yup validation
4. **Optimistic Updates**: Immediate UI feedback
5. **Error Handling**: Comprehensive error states
6. **Loading States**: Better user feedback
7. **Undo/Redo**: Settings change history

## Usage Guidelines

### Navigation
- Click any tab in the vertical navigation to switch sections
- Each tab maintains its own state during the session
- Use "Save Changes" buttons to persist modifications

### Adding Custom Fields
1. Navigate to "Customer Attributes" tab
2. Click "Add Custom Field" button
3. Configure field name, label, type, and requirements
4. Use the trash icon to remove unwanted fields

### Managing Integrations
1. Go to "Integrations" tab
2. Use "Connect" button for new integrations
3. "Configure" connected services for customization
4. "Disconnect" to remove integrations

### Creating Canned Messages
1. Access "Canned Messages" tab
2. Click "Add Canned Message" for new templates
3. Use variables like `{customer_name}` for personalization
4. Organize messages by categories

The settings page provides a comprehensive administrative interface that scales with the application's needs while maintaining a clean and intuitive user experience.