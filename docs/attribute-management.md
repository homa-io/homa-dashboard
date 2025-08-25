# Enhanced Attribute Management System

The Settings page now features a comprehensive attribute management system for both Customer Attributes and Ticket Attributes, allowing administrators to create, edit, and manage custom fields with advanced configuration options.

## Overview

The attribute management system provides a unified interface for defining custom attributes that can be applied to customers and tickets. Each attribute has complete configuration options including data types, validation rules, default values, and more.

## Attribute Configuration

### Core Properties

Each custom attribute includes the following properties:

1. **Variable Name** (`varName`)
   - Internal identifier used in code and API calls
   - Recommended format: snake_case (e.g., `customer_tier`, `severity_level`)
   - Must be unique within the entity type
   - Used for database storage and API references

2. **Display Name** (`displayName`)
   - Human-readable label shown in the user interface
   - Used in forms, tables, and reports
   - Example: "Customer Tier", "Severity Level"

3. **Description** (`description`)
   - Optional explanatory text
   - Helps users understand the attribute's purpose
   - Displayed as help text in forms

4. **Type** (`type`)
   - Defines the data type and input method
   - Determines validation rules and storage format
   - Affects how the field is rendered in the UI

5. **Default Value** (`defaultValue`)
   - Optional pre-filled value for new entries
   - Type-appropriate default (string, number, etc.)
   - Used when creating new customers or tickets

6. **Validation Rule** (`validationRule`)
   - Custom validation logic for data entry
   - Format depends on the field type
   - Examples: `min:1,max:100`, `regex:^[A-Z]+$`

7. **Required Flag** (`required`)
   - Boolean indicating if the field is mandatory
   - Affects form validation and data entry
   - Required fields must have values before saving

## Data Types

### 1. Text (`text`)
- **Purpose**: Short text input (single line)
- **Validation Examples**: 
  - `min:3,max:50` - Length constraints
  - `regex:^[A-Za-z\s]+$` - Letters and spaces only
- **Use Cases**: Names, titles, short descriptions
- **Storage**: VARCHAR in database

### 2. Long Text (`longtext`)
- **Purpose**: Multi-line text input
- **Validation Examples**:
  - `min:10,max:1000` - Length constraints
  - `required` - Cannot be empty
- **Use Cases**: Descriptions, notes, comments
- **Storage**: TEXT field in database
- **UI**: Textarea component

### 3. Integer (`integer`)
- **Purpose**: Whole numbers only
- **Validation Examples**:
  - `min:1,max:100` - Range constraints
  - `positive` - Only positive numbers
- **Use Cases**: Quantities, counts, ratings
- **Storage**: INTEGER in database

### 4. Decimal (`decimal`)
- **Purpose**: Numbers with decimal places
- **Validation Examples**:
  - `min:0.1,max:100` - Range with decimals
  - `precision:2` - Two decimal places
- **Use Cases**: Prices, percentages, measurements
- **Storage**: DECIMAL in database

### 5. Date (`date`)
- **Purpose**: Date selection
- **Validation Examples**:
  - `after:2020-01-01` - Must be after specific date
  - `before:today` - Cannot be in future
- **Use Cases**: Deadlines, events, milestones
- **Storage**: DATE in database
- **UI**: Date picker component

### 6. Image (`image`)
- **Purpose**: File upload for images
- **Validation Examples**:
  - `formats:jpg,png,gif` - Allowed file types
  - `max_size:5MB` - File size limit
- **Use Cases**: Avatars, attachments, screenshots
- **Storage**: File path/URL in database
- **UI**: File upload with preview

### 7. Select (`select`)
- **Purpose**: Dropdown selection from predefined options
- **Configuration**: Key-value pairs for options
- **Validation**: Must match one of the defined options
- **Use Cases**: Categories, statuses, classifications
- **Storage**: Selected key in database

## Select Options Configuration

For `select` type attributes, you can define multiple options with:

### Option Structure
- **Key**: Internal value stored in database
- **Label**: Display text shown to users

### Examples
```
Key: "premium" | Label: "Premium Plan"
Key: "basic"   | Label: "Basic Plan"
Key: "trial"   | Label: "Trial Account"
```

### Management Features
- ✅ Add unlimited options
- ✅ Remove unwanted options
- ✅ Edit existing options
- ✅ Reorder options (planned)
- ✅ Import/export options (planned)

## User Interface Features

### Attribute List View
- **Expandable Cards**: Click to view detailed information
- **Type Badges**: Color-coded badges for easy identification
- **Required Indicators**: Visual markers for mandatory fields
- **Quick Actions**: Edit and delete options available
- **Search & Filter**: Find attributes quickly (planned)

### Attribute Editor Dialog
- **Comprehensive Form**: All properties in one interface
- **Real-time Validation**: Immediate feedback on input
- **Type-specific Options**: Dynamic form based on selected type
- **Select Options Manager**: Add/remove dropdown options
- **Preview Mode**: See how the attribute will appear (planned)

### Type-specific UI Elements
- **Text/LongText**: Input fields with character counts
- **Integer/Decimal**: Numeric inputs with validation
- **Date**: Date picker with range constraints
- **Image**: File upload with drag-and-drop
- **Select**: Option manager with key-label pairs

## Sample Configurations

### Customer Attributes Examples

1. **Industry Classification**
   - Variable Name: `industry`
   - Display Name: "Industry"
   - Type: `select`
   - Options: 
     - `tech` → "Technology"
     - `health` → "Healthcare"
     - `finance` → "Finance"
     - `education` → "Education"
   - Required: No

2. **Annual Revenue**
   - Variable Name: `annual_revenue`
   - Display Name: "Annual Revenue"
   - Type: `decimal`
   - Default Value: `0`
   - Validation Rule: `min:0`
   - Required: No

3. **Company Logo**
   - Variable Name: `company_logo`
   - Display Name: "Company Logo"
   - Type: `image`
   - Validation Rule: `formats:jpg,png,max_size:2MB`
   - Required: No

### Ticket Attributes Examples

1. **Severity Level**
   - Variable Name: `severity_level`
   - Display Name: "Severity Level"
   - Type: `select`
   - Options:
     - `low` → "Low Impact"
     - `medium` → "Medium Impact"
     - `high` → "High Impact"
     - `critical` → "Critical Impact"
   - Default Value: `medium`
   - Required: Yes

2. **Estimated Hours**
   - Variable Name: `estimated_hours`
   - Display Name: "Estimated Hours"
   - Type: `decimal`
   - Default Value: `1`
   - Validation Rule: `min:0.1,max:100`
   - Required: No

3. **Due Date**
   - Variable Name: `due_date`
   - Display Name: "Due Date"
   - Type: `date`
   - Validation Rule: `after:today`
   - Required: No

## Technical Implementation

### Data Storage
- Attributes are stored in a configuration table
- Values are stored in separate attribute_values tables
- JSON storage for complex types (select options)
- Referential integrity maintained

### API Integration
- RESTful endpoints for CRUD operations
- Type validation on server side
- Bulk operations for attribute management
- Version control for schema changes

### Form Integration
- Dynamic form generation based on attributes
- Client-side validation using attribute rules
- Type-appropriate input components
- Real-time save functionality

## Validation Rules Format

### Common Patterns
- **Length**: `min:5,max:100`
- **Range**: `min:0,max:1000`
- **Regex**: `regex:^[A-Z][a-z]+$`
- **Required**: `required`
- **Date Range**: `after:2020-01-01,before:2025-12-31`
- **File Types**: `formats:jpg,png,gif`
- **File Size**: `max_size:5MB`

### Type-specific Rules
- **Text/LongText**: Length, regex, required
- **Integer/Decimal**: Min/max values, positive/negative
- **Date**: Before/after constraints, business days
- **Image**: File formats, size limits, dimensions
- **Select**: Must be valid option (automatic)

## Future Enhancements

### Planned Features
1. **Conditional Logic**: Show/hide attributes based on other values
2. **Calculated Fields**: Attributes computed from other attributes
3. **Attribute Groups**: Organize related attributes together
4. **Import/Export**: Bulk management of attribute configurations
5. **Version History**: Track changes to attribute definitions
6. **Permission Control**: Role-based access to attributes
7. **API Documentation**: Auto-generated docs for custom attributes
8. **Validation Builder**: Visual interface for creating validation rules

### Advanced Validation
1. **Cross-field Validation**: Rules involving multiple attributes
2. **Business Rules**: Complex validation logic
3. **Real-time Validation**: API-based validation for dynamic rules
4. **Custom Validators**: Plugin system for custom validation logic

### Integration Features
1. **Webhook Support**: Notify external systems of attribute changes
2. **Export Formats**: JSON, CSV, XML for attribute definitions
3. **Migration Tools**: Update existing data when attributes change
4. **Backup/Restore**: Full attribute configuration backup

## Usage Guidelines

### Best Practices
1. **Naming Convention**: Use clear, consistent variable names
2. **Description Usage**: Always provide helpful descriptions
3. **Validation Rules**: Set appropriate constraints for data quality
4. **Default Values**: Provide sensible defaults when possible
5. **Required Fields**: Minimize required fields for better UX

### Performance Considerations
1. **Attribute Limits**: Recommended maximum of 50 custom attributes per entity
2. **Query Optimization**: Index frequently queried attributes
3. **Data Types**: Choose appropriate types for efficient storage
4. **Validation Complexity**: Balance thorough validation with performance

The enhanced attribute management system provides administrators with powerful tools to customize their dashboard to meet specific business requirements while maintaining data integrity and user experience standards.