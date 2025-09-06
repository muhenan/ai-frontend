import { useState, useEffect, useMemo } from 'react';
import { saveNotesToStorage, loadNotesFromStorage, generateNoteId } from '../utils/notesStorage';
import type { NotesState, NotesActions, Note, DateKey } from '../types/notes';

export function useNotesState(): NotesState & NotesActions {
  const [state, setState] = useState<NotesState>(() => ({
    selectedDateKey: null,
    notesByDate: loadNotesFromStorage(),
    selectedNoteId: null,
    isNotesVisible: false
  }));

  // Save to localStorage whenever notesByDate changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveNotesToStorage(state.notesByDate);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [state.notesByDate]);

  const actions: NotesActions = useMemo(() => ({
    selectDate: (dateKey: DateKey) => {
      setState(prev => ({
        ...prev,
        selectedDateKey: dateKey,
        isNotesVisible: true,
        selectedNoteId: null
      }));
    },

    closeNotes: () => {
      setState(prev => ({
        ...prev,
        isNotesVisible: false,
        selectedNoteId: null
      }));
    },

    createNote: (dateKey: DateKey) => {
      const newNote: Note = {
        id: generateNoteId(),
        dateKey,
        content: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setState(prev => ({
        ...prev,
        notesByDate: {
          ...prev.notesByDate,
          [dateKey]: [...(prev.notesByDate[dateKey] || []), newNote]
        },
        selectedNoteId: newNote.id
      }));
    },

    updateNote: (noteId: string, content: string) => {
      setState(prev => {
        const updatedNotesByDate = { ...prev.notesByDate };
        
        // Find and update the note
        Object.keys(updatedNotesByDate).forEach(dateKey => {
          const notes = updatedNotesByDate[dateKey];
          const noteIndex = notes.findIndex(note => note.id === noteId);
          if (noteIndex !== -1) {
            updatedNotesByDate[dateKey] = [
              ...notes.slice(0, noteIndex),
              {
                ...notes[noteIndex],
                content,
                updatedAt: new Date().toISOString()
              },
              ...notes.slice(noteIndex + 1)
            ];
          }
        });

        return {
          ...prev,
          notesByDate: updatedNotesByDate
        };
      });
    },

    deleteNote: (noteId: string) => {
      setState(prev => {
        const updatedNotesByDate = { ...prev.notesByDate };
        
        // Find and remove the note
        Object.keys(updatedNotesByDate).forEach(dateKey => {
          const notes = updatedNotesByDate[dateKey];
          const filteredNotes = notes.filter(note => note.id !== noteId);
          
          if (filteredNotes.length === 0) {
            delete updatedNotesByDate[dateKey];
          } else {
            updatedNotesByDate[dateKey] = filteredNotes;
          }
        });

        return {
          ...prev,
          notesByDate: updatedNotesByDate,
          selectedNoteId: prev.selectedNoteId === noteId ? null : prev.selectedNoteId
        };
      });
    },

    selectNote: (noteId: string | null) => {
      setState(prev => ({
        ...prev,
        selectedNoteId: noteId
      }));
    }
  }), []);

  return {
    ...state,
    ...actions
  };
}