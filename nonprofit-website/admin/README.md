# Admin Interface

This folder contains the modular admin interface for managing The Harambee Initiative website content.

## Structure

```
admin/
├── index.html              # Main admin interface with tabs and layout
├── board-members.js        # Board members management module
├── naming-opportunities.js # Naming opportunities management module
└── README.md              # This documentation
```

## Features

### 👥 Board Members Management
- Add new board members
- Edit existing member information
- Delete board members
- Real-time updates via Azure Function API

### 💰 Naming Opportunities Management
- Add new naming opportunities
- Edit opportunity details (amount, name, description, availability)
- Delete opportunities
- Automatic sorting by amount (highest first)
- Real-time updates via Azure Function API

## Usage

1. Navigate to `/admin/` to access the admin interface
2. Use tabs to switch between different management sections
3. All changes are immediately saved to Azure Function APIs
4. Changes appear instantly on the public website

## Technical Details

### APIs Used
- **Board Members**: `https://harambee-board-api.azurewebsites.net/api/board-members`
- **Naming Opportunities**: `https://harambee-board-api.azurewebsites.net/api/naming-opportunities`

### Architecture
- **Modular Design**: Each admin section is a separate JavaScript class
- **ES6 Classes**: Modern JavaScript with proper encapsulation
- **Event-Driven**: Uses DOM events for form handling
- **Error Handling**: Comprehensive error management with user feedback
- **Responsive**: Mobile-friendly interface

### Adding New Admin Sections

1. Create a new JavaScript module (e.g., `events.js`)
2. Add a new tab in `index.html`
3. Add the corresponding tab content HTML
4. Include the script in the main file
5. Follow the existing pattern for consistent UX

## Maintenance

- Each module is self-contained and can be updated independently
- Shared utilities are in the main `index.html` file
- CSS styles are centralized in the main file
- API endpoints can be easily changed in each module's constructor

## Security Notes

- Currently uses anonymous access to Azure Functions
- For production, consider adding authentication
- All user inputs are sanitized via `escapeHtml()` function
- CORS is properly configured on the backend APIs