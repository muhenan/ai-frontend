export type DateKey = string; // "YYYY-MM-DD"

export interface Note {
  id: string;          // uuid
  dateKey: DateKey;
  content: string;
  createdAt: string;   // ISO
  updatedAt: string;   // ISO
}

export interface NotesState {
  selectedDateKey: DateKey | null;
  notesByDate: Record<DateKey, Note[]>;
  selectedNoteId: string | null;
  isNotesVisible: boolean;
}

export interface NotesActions {
  selectDate: (dateKey: DateKey) => void;
  closeNotes: () => void;
  createNote: (dateKey: DateKey) => void;
  updateNote: (noteId: string, content: string) => void;
  deleteNote: (noteId: string) => void;
  selectNote: (noteId: string | null) => void;
}