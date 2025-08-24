# Dashboard Design Specifications

## Overview
A modern, responsive dashboard layout with an intelligent navigation system that maximizes content space while maintaining easy access to navigation controls.

## Layout Structure

### Core Layout: Two-Column Design
The dashboard consists of two main sections:
1. **Left Navigation Menu** (Collapsible Sidebar)
2. **Main Content Area** (Primary workspace)

## Navigation Menu Specifications

### Default State (Minimized)
- **Width**: 64px (fixed)
- **Behavior**: Shows only icons without labels
- **Icons**: Centered vertically and horizontally within each menu item
- **Visual**: Maintain icon tooltips on hover to show full menu item names

### Expanded State (On Hover)
- **Width**: 240px-280px (configurable based on content)
- **Trigger**: Mouse hover anywhere on the minimized sidebar
- **Position**: Absolute/Fixed positioning to overlay content
- **Z-index**: High value (z-50 or z-[9999]) to ensure it floats above main content
- **Shadow**: Apply drop shadow (shadow-2xl) to create depth and separation from content

### Animation Requirements
- **Duration**: 200-300ms for smooth, responsive feel
- **Easing**: Use ease-in-out or custom cubic-bezier for natural motion
- **Properties to animate**:
  - Width transition
  - Opacity for text labels (fade in/out)
  - Transform translateX if needed for smoother motion
- **Performance**: Use CSS transforms and will-change property for hardware acceleration
- **No flicker**: Ensure smooth transition without any visual jumps or reflows

### Hover Behavior Details
```
Interaction Flow:
1. User hovers over minimized sidebar
2. Sidebar expands with smooth animation
3. Content overlay appears (sidebar floats over main content)
4. User moves mouse away from sidebar
5. Sidebar collapses back to minimized state after small delay (100-200ms)
```

### Critical Implementation Notes
- **No Layout Shift**: The sidebar expansion MUST NOT cause any movement in the main content area
- **Overlay Strategy**: Use absolute/fixed positioning when expanded
- **Backdrop**: Optional semi-transparent backdrop (bg-black/5) behind expanded sidebar
- **Mouse Leave Delay**: Add slight delay before collapsing to prevent accidental closes

## Main Content Area Specifications

### Layout Properties
- **Width Calculation**: 
  - When sidebar minimized: `calc(100% - 64px)`
  - Maintains constant width regardless of sidebar state
- **Padding**: Consistent padding (p-6 or p-8) for content breathing room
- **Max Width**: Optional max-width constraint for better readability on ultra-wide screens
- **Responsive**: Should adapt to different screen sizes

### Content Behavior
- **Static Position**: Content must remain completely stationary during sidebar animations
- **Scroll Independence**: Main content scrolling should be independent of sidebar
- **Focus Management**: Maintain focus state in main content when sidebar expands

## Technical Implementation Guidelines

### CSS/Tailwind Classes Structure

#### Sidebar Container
```
Minimized Classes:
- w-16 (64px width)
- transition-all duration-300 ease-in-out
- fixed or sticky positioning
- h-screen (full height)
- bg-background or bg-card
- border-r
- z-40 (base z-index)

Expanded Classes (on hover):
- w-60 or w-64 (240px-256px)
- z-50 (elevated z-index)
- shadow-2xl
- absolute or fixed (to overlay)
```

#### Menu Items
```
Base Classes:
- flex items-center
- px-3 py-2
- hover:bg-accent
- transition-colors
- cursor-pointer
- relative

Icon Classes:
- Minimized: mx-auto
- Expanded: mr-3

Label Classes:
- Minimized: hidden or opacity-0
- Expanded: opacity-100, visible
- transition-opacity delay-75
- whitespace-nowrap
- overflow-hidden
```

### Component Architecture with shadcn/ui

#### Required shadcn Components
- `Button` - For menu items
- `Tooltip` - For icon tooltips in minimized state
- `ScrollArea` - For scrollable menu content
- `Separator` - For section dividers

#### Custom Hooks Needed
- `useHover` - Track hover state with delay
- `useSidebarState` - Manage sidebar expand/collapse state
- `useMediaQuery` - Handle responsive behavior

### Animation Specifications

#### CSS Variables
```css
--sidebar-width-collapsed: 64px;
--sidebar-width-expanded: 240px;
--animation-duration: 300ms;
--animation-easing: cubic-bezier(0.4, 0.0, 0.2, 1);
--hover-delay-in: 0ms;
--hover-delay-out: 200ms;
```

#### Transition Properties
```
Primary Transitions:
- width: var(--animation-duration) var(--animation-easing)
- transform: var(--animation-duration) var(--animation-easing)
- opacity: calc(var(--animation-duration) * 0.5) var(--animation-easing)
- box-shadow: var(--animation-duration) var(--animation-easing)
```

### State Management

#### Sidebar States
1. **collapsed** (default)
2. **expanding** (transition state)
3. **expanded** (hover active)
4. **collapsing** (transition state)

#### State Triggers
- Mouse enter: collapsed → expanding → expanded
- Mouse leave (with delay): expanded → collapsing → collapsed
- Click toggle (optional): Lock expanded state
- Keyboard navigation: Support for accessibility

### Responsive Behavior

#### Desktop (>1024px)
- Full hover interaction enabled
- Minimized by default
- Smooth animations

#### Tablet (768px - 1024px)
- Optional: Click to toggle instead of hover
- Consider full-width overlay on mobile

#### Mobile (<768px)
- Full drawer behavior
- Slide from left
- Full overlay with backdrop
- Touch gestures support

### Accessibility Requirements

1. **Keyboard Navigation**
   - Tab through menu items
   - Enter/Space to activate
   - Escape to close expanded sidebar

2. **Screen Readers**
   - Proper ARIA labels
   - Announce state changes
   - Role="navigation" on sidebar

3. **Focus Management**
   - Visible focus indicators
   - Focus trap when expanded (optional)
   - Return focus on collapse

### Performance Optimizations

1. **CSS-Only Animations** (preferred)
   - Use CSS transitions over JavaScript animations
   - Leverage GPU acceleration with transform and opacity

2. **Will-Change Property**
   - Apply `will-change: width, transform` during hover
   - Remove after animation completes

3. **Debouncing**
   - Debounce hover events to prevent rapid state changes
   - Use requestAnimationFrame for smooth updates if JS is needed

4. **Code Splitting**
   - Lazy load menu content if extensive
   - Virtualize long menu lists

### Visual Design Tokens

#### Color Palette (Based on Reference Image)

##### Comprehensive Dark Theme Color Palette
```css
/* Background Hierarchy */
--bg-primary: #0A0E27 or rgb(10, 14, 39)          /* Main deep navy background */
--bg-secondary: #0D1230 or rgb(13, 18, 48)        /* Slightly lighter navy */
--bg-tertiary: #1A1F3A or rgb(26, 31, 58)         /* Card/surface background */
--bg-elevated: #232A4E or rgb(35, 42, 78)         /* Elevated elements */
--bg-overlay: rgba(10, 14, 39, 0.95)              /* Modal/overlay background */

/* Background Gradients */
--gradient-primary: linear-gradient(180deg, #0A0E27 0%, #0D1230 100%)
--gradient-secondary: linear-gradient(135deg, #0A0E27 0%, #1A1F3A 100%)
--gradient-accent: linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)

/* Primary Accent Colors */
--accent-purple: #6366F1 or rgb(99, 102, 241)     /* Primary purple accent */
--accent-purple-hover: #7C7FFA                     /* Lighter purple on hover */
--accent-purple-active: #4F52E8                    /* Darker purple when pressed */
--accent-purple-glow: rgba(99, 102, 241, 0.2)     /* Purple glow effect */

/* Secondary Accent Colors */
--accent-violet: #8B5CF6 or rgb(139, 92, 246)     /* Violet for special elements */
--accent-indigo: #4F46E5 or rgb(79, 70, 229)      /* Indigo alternative */
--accent-blue: #3B82F6 or rgb(59, 130, 246)       /* Info/secondary actions */
--accent-cyan: #06B6D4 or rgb(6, 182, 212)        /* Highlights */

/* Success Colors */
--success: #10B981 or rgb(16, 185, 129)           /* Success green */
--success-light: #34D399                           /* Light success */
--success-dark: #059669                            /* Dark success */
--success-bg: rgba(16, 185, 129, 0.1)             /* Success background */

/* Warning Colors */
--warning: #F59E0B or rgb(245, 158, 11)           /* Warning amber */
--warning-light: #FCD34D                           /* Light warning */
--warning-dark: #D97706                            /* Dark warning */
--warning-bg: rgba(245, 158, 11, 0.1)             /* Warning background */

/* Danger/Error Colors */
--danger: #EF4444 or rgb(239, 68, 68)             /* Error red */
--danger-light: #F87171                            /* Light error */
--danger-dark: #DC2626                             /* Dark error */
--danger-bg: rgba(239, 68, 68, 0.1)               /* Error background */

/* Text Hierarchy */
--text-primary: #FFFFFF or rgb(255, 255, 255)      /* Primary white text */
--text-secondary: #94A3B8 or rgb(148, 163, 184)    /* Secondary gray text */
--text-tertiary: #64748B or rgb(100, 116, 139)     /* Tertiary dimmed text */
--text-muted: #475569 or rgb(71, 85, 105)         /* Very muted text */
--text-disabled: #334155 or rgb(51, 65, 85)       /* Disabled state text */

/* Interactive Surface Colors */
--surface-hover: rgba(99, 102, 241, 0.1)          /* Hover state background */
--surface-active: rgba(99, 102, 241, 0.15)        /* Active/selected background */
--surface-disabled: rgba(148, 163, 184, 0.05)     /* Disabled background */
--surface-highlight: rgba(139, 92, 246, 0.1)      /* Special highlight */

/* Border Colors */
--border-default: rgba(148, 163, 184, 0.1)        /* Default subtle border */
--border-hover: rgba(148, 163, 184, 0.2)          /* Hover state border */
--border-active: rgba(99, 102, 241, 0.5)          /* Active/focus border */
--border-accent: #6366F1                           /* Solid accent border */
--border-error: rgba(239, 68, 68, 0.3)            /* Error state border */
--border-success: rgba(16, 185, 129, 0.3)         /* Success state border */

/* Shadow Effects */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4)
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5)
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.6)
--shadow-glow: 0 0 20px rgba(99, 102, 241, 0.4)
--shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.3)

/* Chart/Visualization Colors */
--chart-1: #6366F1                                 /* Primary chart color */
--chart-2: #8B5CF6                                 /* Secondary chart color */
--chart-3: #EC4899                                 /* Pink for contrast */
--chart-4: #14B8A6                                 /* Teal for variety */
--chart-5: #F59E0B                                 /* Amber for highlights */
--chart-6: #3B82F6                                 /* Blue alternative */

/* Special Effects */
--glow-purple: 0 0 20px rgba(99, 102, 241, 0.4)
--glow-violet: 0 0 20px rgba(139, 92, 246, 0.4)
--glow-success: 0 0 15px rgba(16, 185, 129, 0.3)
--glow-error: 0 0 15px rgba(239, 68, 68, 0.3)

/* Scrollbar Colors */
--scrollbar-track: #1A1F3A
--scrollbar-thumb: #475569
--scrollbar-thumb-hover: #64748B

/* Focus Ring Colors */
--focus-ring: rgba(99, 102, 241, 0.5)
--focus-ring-offset: #0A0E27
```

##### Tailwind/shadcn Configuration
```javascript
// For tailwind.config.js extend
colors: {
  sidebar: {
    DEFAULT: '#0A0E27',
    foreground: '#FFFFFF',
    muted: '#94A3B8',
    accent: '#6366F1',
    'accent-hover': '#7C7FFA',
    surface: '#1A1F3A',
  }
}
```

#### Navigation Item States

##### Default State
- Background: Transparent
- Text color: text-secondary (#94A3B8)
- Icon color: text-secondary
- Border: None

##### Hover State
- Background: rgba(99, 102, 241, 0.1) with subtle glow
- Text color: text-primary (#FFFFFF)
- Icon color: accent-purple (#6366F1)
- Transition: All properties 200ms ease
- Optional: Subtle left border accent (2px solid accent-purple)

##### Active/Selected State
- Background: rgba(99, 102, 241, 0.15)
- Text color: text-primary (#FFFFFF)
- Icon color: accent-purple (#6366F1)
- Left border: 3px solid accent-purple
- Optional: Subtle glow effect

#### Spacing
- Menu item padding: 12px vertical, 16px horizontal
- Icon size: 20px (minimized), 20px (expanded)
- Gap between icon and label: 12px
- Section spacing: 24px between groups
- Logo/Header area: 24px padding

#### Typography
- Menu labels: text-sm (14px)
- Font weight: 500 for active, 400 for inactive
- Letter spacing: 0.01em
- Line height: 1.5
- Font family: Inter, system-ui, or similar clean sans-serif

#### Visual Effects

##### Glass Morphism (Optional)
```css
/* For elevated elements */
backdrop-filter: blur(10px);
background: rgba(26, 31, 58, 0.8);
border: 1px solid rgba(99, 102, 241, 0.1);
```

##### Gradient Overlays
```css
/* Subtle gradient for depth */
background: linear-gradient(180deg, 
  rgba(10, 14, 39, 1) 0%, 
  rgba(13, 18, 48, 1) 100%
);
```

##### Shadow Effects
```css
/* Elevated sidebar shadow */
box-shadow: 
  4px 0 24px rgba(0, 0, 0, 0.4),
  inset -1px 0 0 rgba(99, 102, 241, 0.1);
```

### Implementation Checklist

- [ ] Create sidebar container with proper positioning
- [ ] Implement hover detection with delays
- [ ] Add smooth width transition
- [ ] Ensure no layout shift in main content
- [ ] Add icon and label transitions
- [ ] Implement tooltip for minimized state
- [ ] Add keyboard navigation support
- [ ] Test animation performance
- [ ] Verify accessibility compliance
- [ ] Add responsive breakpoints
- [ ] Implement focus management
- [ ] Add optional backdrop
- [ ] Create state management logic
- [ ] Add menu item active states
- [ ] Implement scroll handling for long menus

## Example User Flow

1. **Page Load**: Sidebar renders in minimized state (64px wide)
2. **User Hovers**: Mouse enters sidebar area
3. **Expansion**: Sidebar smoothly expands to 240px, overlaying content
4. **Interaction**: User can click menu items or continue hovering
5. **Mouse Leave**: User moves cursor away from sidebar
6. **Delay**: 200ms delay before collapse begins
7. **Collapse**: Sidebar smoothly returns to 64px width
8. **Ready State**: System ready for next interaction

## Anti-Patterns to Avoid

- ❌ Content jumping or reflowing when sidebar expands
- ❌ Janky or stuttering animations
- ❌ Immediate collapse on mouse leave (add delay)
- ❌ Blocking main content interaction when sidebar is expanded
- ❌ Using JavaScript for animations when CSS suffices
- ❌ Forgetting touch device considerations
- ❌ Missing keyboard navigation support
- ❌ Inconsistent animation timing across different elements

## Ticket List Page Design

### Page Layout Structure
A three-column layout consisting of:
1. **Left Sidebar** (Navigation - collapsible as specified above)
2. **Main Content Area** (Ticket list with search and filters)
3. **Right Sidebar** (Stacked information panels)

### Main Content Area - Ticket List

#### Header Section
```
Structure:
┌────────────────────────────────────────────────────────┐
│ Page Title: "Tickets"                     Actions Bar   │
│ Subtitle: "Manage and track support tickets"           │
├────────────────────────────────────────────────────────┤
│ [Search Bar]                    [Filter] [Sort] [View]  │
└────────────────────────────────────────────────────────┘
```

##### Search Bar Specifications
- **Width**: 60-70% of container or min 400px
- **Height**: 40-44px
- **Style**: 
  - Background: bg-tertiary with subtle border
  - Icon: Search icon on left (20px)
  - Placeholder: "Search tickets by ID, title, or customer..."
  - Border radius: rounded-lg (8px)
  - Focus state: Border color transitions to accent-purple
  - Clear button: X icon appears when text is entered

##### Action Buttons
- **Filter Button**: 
  - Icon + Text: "Filter"
  - Shows active filter count badge
  - Opens dropdown/modal with filter options
- **Sort Button**:
  - Icon + Text: "Sort by: Latest"
  - Dropdown with sort options
- **View Toggle**:
  - Icon buttons for List/Grid/Kanban views
  - Active view highlighted with accent color

#### Ticket List Container

##### List Header Row
```css
/* Sticky header with columns */
Height: 48px
Background: bg-tertiary with bottom border
Position: Sticky top
Columns:
  - Checkbox: 40px
  - ID: 100px
  - Title: flex-1 (expandable)
  - Customer: 200px
  - Status: 120px
  - Priority: 100px
  - Assigned: 150px
  - Updated: 120px
  - Actions: 100px
```

##### Ticket Row Design
```css
/* Individual ticket row */
Height: 64-72px
Background: Transparent (hover: surface-hover)
Border-bottom: 1px solid border-default
Padding: 12px 16px
Transition: All 200ms ease

/* Hover State */
Background: surface-hover
Border-left: 3px solid accent-purple (animated)
Transform: translateX(2px)
Box-shadow: shadow-sm
```

##### Ticket Row Content Layout
1. **Checkbox Column** (40px)
   - Custom checkbox with accent-purple when checked
   - Indeterminate state support

2. **ID Column** (100px)
   - Format: #TK-0001
   - Color: text-secondary
   - Font: Mono or tabular-nums

3. **Title & Tags Column** (flex-1)
   ```
   Ticket Title Text (text-primary, font-medium)
   [Tag1] [Tag2] [Tag3] - Small badges below title
   ```
   - Tags: Small rounded badges with category colors
   - Max 3 tags visible, +N indicator for more

4. **Customer Column** (200px)
   ```
   Avatar + Name Layout:
   [🟣] John Doe
        john@email.com (text-tertiary, text-xs)
   ```

5. **Status Badge** (120px)
   - Pill-shaped badge with status color
   - Options: Open (blue), In Progress (yellow), Resolved (green), Closed (gray)
   - Icon + Text format

6. **Priority Indicator** (100px)
   - Visual indicator + text
   - Critical: Red dot/bar + text
   - High: Orange dot/bar + text
   - Medium: Yellow dot/bar + text
   - Low: Gray dot/bar + text

7. **Assigned Agent** (150px)
   - Avatar + Name
   - Multiple avatars stack with overlap (-8px margin)
   - "Unassigned" state with dashed border avatar

8. **Updated Time** (120px)
   - Relative time: "2 hours ago"
   - Hover shows exact timestamp
   - Color: text-tertiary

9. **Actions Menu** (100px)
   - Three-dot menu icon
   - Dropdown with: View, Edit, Assign, Close, Delete

##### Empty State
```
Center-aligned content:
- Icon: Large ticket or inbox icon (64px)
- Title: "No tickets found"
- Description: "Try adjusting your filters or search terms"
- Action: Button to create new ticket or clear filters
```

##### Loading State
- Skeleton rows matching the row height
- Shimmer animation effect
- Show 5-10 skeleton rows

##### Pagination Footer
```
Layout: Flex between
Left: "Showing 1-20 of 156 tickets"
Right: [Previous] [1] [2] [3] ... [8] [Next]
Height: 56px
Background: bg-secondary
Border-top: 1px solid border-default
```

### Right Sidebar - Stacked Panels

#### Container Specifications
- **Width**: 320-380px (fixed)
- **Position**: Sticky or fixed scrolling
- **Background**: bg-primary
- **Border-left**: 1px solid border-default
- **Padding**: 16px
- **Gap between panels**: 16px

#### Panel Structure
Each panel is a stacked card with:
```css
/* Panel Base Styles */
Background: bg-tertiary
Border-radius: 12px
Padding: 16px
Border: 1px solid border-default
Margin-bottom: 16px

/* Panel Header */
Display: Flex between
Title: Font-medium, text-primary
Action: Icon button or link (text-secondary)
Border-bottom: 1px solid border-default (optional)
Padding-bottom: 12px
Margin-bottom: 12px
```

#### Common Panel Types

##### 1. Statistics Panel
```
Title: "Overview"
Content:
┌─────────────────────────┐
│ Open Tickets      24 ↑  │
│ Avg Response    2.5h ↓  │
│ Resolution      85% →   │
│ Satisfaction    4.8 ⭐  │
└─────────────────────────┘
```
- Metric rows with icon, label, value, trend

##### 2. Activity Feed Panel
```
Title: "Recent Activity"
Content:
• Agent replied to #TK-0052 (2m ago)
• Status changed to Resolved (15m ago)
• New ticket from John Doe (1h ago)
```
- Timeline format with dots/lines
- Clickable items
- Time stamps right-aligned

##### 3. Quick Actions Panel
```
Title: "Quick Actions"
Content:
[+ New Ticket] [📊 Reports]
[👥 Assign]    [🏷️ Bulk Tag]
```
- 2x2 grid of action buttons
- Icons with labels
- Hover effects with accent color

##### 4. Filters Summary Panel
```
Title: "Active Filters" [Clear All]
Content:
× Status: Open, In Progress
× Priority: High, Critical
× Assigned to: Me
× Date: Last 7 days
```
- Removable filter chips
- Clear individual or all filters

##### 5. Agent Performance Panel
```
Title: "Top Agents"
Content:
1. 🟣 Sarah J.  - 45 resolved
2. 🟣 Mike R.   - 38 resolved
3. 🟣 Anna L.   - 32 resolved
```
- Leaderboard format
- Avatar, name, metric

#### Panel Collapse/Expand
- Each panel can be collapsed
- Chevron icon in header rotates
- Smooth height animation
- Collapsed state shows only header

### Responsive Behavior

#### Desktop (>1440px)
- Full three-column layout
- All panels visible
- Optimal spacing

#### Laptop (1024px - 1440px)
- Right sidebar becomes narrower (280px)
- Some panel content may stack

#### Tablet (768px - 1024px)
- Right sidebar hidden by default
- Toggle button to slide in from right
- Overlay with backdrop when open

#### Mobile (<768px)
- Single column layout
- Tickets show as cards
- Sidebar panels move to bottom sheets
- Simplified ticket information

### Interactive States

#### Selection Mode
- Checkbox in header selects all
- Selected rows have accent-purple background tint
- Bulk action bar slides down from top
- Shows: "3 selected" [Assign] [Tag] [Delete] [Cancel]

#### Drag and Drop
- Rows can be dragged to reorder (if enabled)
- Drag handle appears on hover (left side)
- Drop zones highlighted
- Ghost image follows cursor

#### Filter Dropdown
- Multi-select checkboxes
- Search within filters
- Applied count shown
- Clear all option

#### Context Menu
- Right-click on row shows context menu
- Same options as action menu
- Positioned near cursor
- Dismiss on click outside

### Performance Considerations

#### Virtual Scrolling
- For lists >100 items
- Render only visible rows
- Buffer of 5 rows above/below
- Smooth scroll behavior

#### Data Loading
- Progressive loading
- Show skeleton immediately
- Load first 20 items
- Infinite scroll or pagination

#### Optimistic Updates
- Update UI immediately
- Sync with backend
- Rollback on error
- Show sync status indicator

## Testing Criteria

1. **Animation Smoothness**: No frame drops or stuttering
2. **Layout Stability**: Zero CLS (Cumulative Layout Shift)
3. **Responsiveness**: Hover response within 100ms
4. **Cross-browser**: Consistent behavior across Chrome, Firefox, Safari, Edge
5. **Performance**: Maintains 60fps during animations
6. **Accessibility**: Passes WCAG 2.1 Level AA standards