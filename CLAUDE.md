# AI-Frontend Calendar App

A React + TypeScript calendar application with integrated note-taking functionality.

## Project Overview

This is a clean, responsive calendar app that allows users to:
- View monthly calendars with Monday-Sunday layout
- Click dates to open a notes panel in split-view
- Create, edit, and delete notes for specific dates
- Notes persist in localStorage across browser sessions
- Responsive design: split-view on desktop, drawer on mobile

## Tech Stack

- **React** 19.1.1
- **TypeScript** 5.8.3
- **Vite** 7.1.2 (build tool)
- **date-fns** 4.1.0 (date utilities)
- **CSS** (no UI framework, custom styles)

## Architecture

### Core Components
- `Calendar` - Monthly calendar grid with date selection
- `NotesPanel` - Split-view notes interface with list + editor
- `TopBar` - App header with title

### Key Features
- **Date Management**: Uses ISO date keys (YYYY-MM-DD) for note storage
- **State Management**: Custom React hooks with localStorage persistence
- **Responsive Layout**: 50/50 split on desktop, full-screen drawer on mobile
- **Keyboard Shortcuts**: Ctrl+N (new note), Esc (close), arrows (navigate)
- **Auto-save**: 300ms debounced saving with visual feedback

### File Structure
```
src/
├── components/
│   ├── Calendar.tsx       # Main calendar component
│   ├── NotesPanel.tsx     # Notes interface
│   └── TopBar.tsx         # App header
├── hooks/
│   ├── useKeyboardNavigation.ts  # Calendar keyboard controls
│   └── useNotesState.ts          # Notes state management
├── types/
│   ├── calendar.ts        # Calendar-related types
│   └── notes.ts          # Notes data types
├── utils/
│   ├── calendarHelpers.ts # Date matrix generation
│   ├── dateHelpers.ts     # Date formatting utilities
│   └── notesStorage.ts    # localStorage persistence
└── App.tsx               # Main app with split-view logic
```

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

### Environment
- Node.js: v22.19.0
- npm: 10.8.3

## UI/UX Details

### Calendar Features
- **Week Layout**: Monday-Sunday columns
- **Month-only Display**: Only current month dates shown (no overflow)
- **Column Coloring**: Subtle weekday tints, red weekends
- **Today Highlighting**: Blue background with dot indicator
- **Selection State**: Selected dates get blue border

### Notes Panel
- **Split View**: Animates from full-width to 50% on date click
- **Mobile Drawer**: Full-screen overlay with backdrop on <1024px
- **Notes List**: Previews sorted by last updated
- **Auto-save Editor**: Debounced saves with status display
- **CRUD Operations**: Create, update, delete with confirmations

### Accessibility
- ARIA labels and roles throughout
- Keyboard navigation support
- Focus management for modal states
- Screen reader friendly structure

## Data Model

```typescript
interface Note {
  id: string          // UUID
  dateKey: string     // "YYYY-MM-DD"
  content: string     // Note text
  createdAt: string   // ISO timestamp
  updatedAt: string   // ISO timestamp
}
```

Notes are stored in localStorage under key `aiFrontend.notes.v1` with automatic persistence on changes.

## Current Status

✅ **Complete Features:**
- Full calendar navigation (keyboard + mouse)
- Date selection and highlighting
- Notes CRUD with localStorage
- Split-view layout with animations
- Mobile-responsive drawer
- Keyboard shortcuts
- Auto-save functionality
- Accessibility compliance

🎯 **Ready for:**
- Additional note features (tags, search, export)
- Calendar events/appointments
- Theming and customization
- Backend integration
- PWA capabilities