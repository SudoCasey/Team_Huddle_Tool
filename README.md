# Morning Huddle Notes Tool

A React-based frontend tool for managing team huddle notes with randomization and export functionality. Perfect for daily team standups and workload tracking.

## Features

- **Team Member Management**: Add and remove team members easily
- **Randomization**: Randomize the order of team members for fair turn-taking
- **Notes System**: Add and edit notes for each team member's workload
- **Export Functionality**: Export notes as TXT or CSV files
- **Modern UI**: Built with Material-UI (MUI) for a clean, professional look
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone or download this project
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

## How to Use

### 1. Add Team Members
- Enter team member names in the "Add Team Member" field
- Click "Add Member" or press Enter to add them to the list
- Remove members using the delete button next to their name

### 2. Randomize Order
- Click the "Randomize Order" button to shuffle team members
- The randomized order will be displayed as numbered chips
- You can randomize multiple times to get a different order

### 3. Add Notes
- Once randomized, each team member will have their own card
- Click "Add Notes" or "Edit Notes" to enter workload information
- Notes are saved automatically when you click "Save"

### 4. Export Notes
- Click "Export Notes" to download the huddle notes
- Choose between TXT or CSV format
- The file will include the date and all notes in the randomized order

## File Formats

### TXT Format
```
Morning Huddle Notes - 12/25/2023
==================================================

1. John Doe
   Notes: Working on user authentication feature

2. Jane Smith
   Notes: Bug fixes for mobile app

3. Mike Johnson
   Notes: Database optimization
```

### CSV Format
```csv
Name,Notes
"John Doe","Working on user authentication feature"
"Jane Smith","Bug fixes for mobile app"
"Mike Johnson","Database optimization"
```

## Integration

This tool is designed to be easily integrated into an existing website as a standalone page. Simply:

1. Copy the component files to your existing React project
2. Install the required MUI dependencies
3. Import and use the `HuddleNotesTool` component in your routing

## Dependencies

- React 18.2.0
- Material-UI (MUI) 5.14.20
- @emotion/react and @emotion/styled for styling
- @mui/icons-material for icons

## Customization

The tool uses MUI theming, so you can easily customize colors and styling by modifying the theme in `App.js`:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Your primary color
    },
    secondary: {
      main: '#dc004e', // Your secondary color
    },
  },
});
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

This project is open source and available under the MIT License. 