import type { Note, DateKey } from '../types/notes';

const STORAGE_KEY = 'aiFrontend.notes.v1';

export interface StoredNotesData {
  notesByDate: Record<DateKey, Note[]>;
}

export function saveNotesToStorage(notesByDate: Record<DateKey, Note[]>): void {
  try {
    const data: StoredNotesData = { notesByDate };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save notes to localStorage:', error);
  }
}

export function loadNotesFromStorage(): Record<DateKey, Note[]> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};

    const data: StoredNotesData = JSON.parse(stored);
    
    // Validate the structure
    if (!data || typeof data.notesByDate !== 'object') {
      console.warn('Invalid notes data structure in localStorage');
      return {};
    }

    // Validate each note
    const validatedNotes: Record<DateKey, Note[]> = {};
    Object.entries(data.notesByDate).forEach(([dateKey, notes]) => {
      if (Array.isArray(notes)) {
        const validNotes = notes.filter((note): note is Note => {
          return (
            typeof note === 'object' &&
            typeof note.id === 'string' &&
            typeof note.dateKey === 'string' &&
            typeof note.content === 'string' &&
            typeof note.createdAt === 'string' &&
            typeof note.updatedAt === 'string'
          );
        });
        if (validNotes.length > 0) {
          validatedNotes[dateKey] = validNotes;
        }
      }
    });

    return validatedNotes;
  } catch (error) {
    console.warn('Failed to load notes from localStorage:', error);
    return {};
  }
}

export function generateNoteId(): string {
  // Simple UUID v4 implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}