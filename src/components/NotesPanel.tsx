import React, { useState, useEffect, useCallback, useRef } from 'react';
import { formatDateForDisplay, formatDateTimeForDisplay, formatTimeForDisplay } from '../utils/dateHelpers';
import { generateNoteId } from '../utils/notesStorage';
import type { Note, DateKey, NotesActions } from '../types/notes';

interface NotesPanelProps {
  selectedDateKey: DateKey;
  notes: Note[];
  selectedNoteId: string | null;
  actions: NotesActions;
  onClose: () => void;
  isMobile?: boolean;
}

const NotesPanel: React.FC<NotesPanelProps> = ({
  selectedDateKey,
  notes,
  selectedNoteId,
  actions,
  onClose,
  isMobile = false
}) => {
  const [editorContent, setEditorContent] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  const selectedNote = notes.find(note => note.id === selectedNoteId);
  const sortedNotes = [...notes].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  // Update editor content when selected note changes
  useEffect(() => {
    if (selectedNote) {
      setEditorContent(selectedNote.content);
    } else {
      setEditorContent('');
    }
  }, [selectedNote]);

  // Debounced save function
  const debouncedSave = useCallback((content: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      if (selectedNoteId && content !== selectedNote?.content) {
        actions.updateNote(selectedNoteId, content);
        setSaveStatus(`Saved at ${formatTimeForDisplay(new Date().toISOString())}`);
        setTimeout(() => setSaveStatus(''), 3000);
      }
    }, 300);
  }, [selectedNoteId, selectedNote?.content, actions]);

  const handleEditorChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setEditorContent(newContent);
    if (selectedNoteId) {
      debouncedSave(newContent);
    }
  }, [selectedNoteId, debouncedSave]);

  const handleNewNote = useCallback(() => {
    const newNote: Note = {
      id: generateNoteId(),
      dateKey: selectedDateKey,
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    actions.createNote(selectedDateKey);
    actions.selectNote(newNote.id);
    setTimeout(() => editorRef.current?.focus(), 100);
  }, [selectedDateKey, actions]);

  const handleDeleteNote = useCallback((noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      actions.deleteNote(noteId);
      if (noteId === selectedNoteId) {
        actions.selectNote(null);
      }
    }
  }, [actions, selectedNoteId]);

  const handleNoteSelect = useCallback((noteId: string) => {
    actions.selectNote(noteId);
  }, [actions]);

  const getPreviewText = useCallback((content: string): string => {
    if (!content.trim()) return '(Empty)';
    const firstLine = content.split('\n')[0];
    return firstLine.length > 50 ? firstLine.slice(0, 50) + '...' : firstLine;
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNewNote();
      }
      if (e.key === 'Escape') {
        if (isMobile) {
          onClose();
        } else {
          editorRef.current?.blur();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleNewNote, isMobile, onClose]);

  return (
    <div 
      className={`notes-panel ${isMobile ? 'notes-panel-mobile' : ''}`}
      role="region" 
      aria-label="Notes panel"
      aria-modal={isMobile}
    >
      {/* Header */}
      <div className="notes-header">
        <h2 className="notes-date">{formatDateForDisplay(selectedDateKey)}</h2>
        <div className="notes-actions">
          <button 
            onClick={handleNewNote}
            className="btn-new-note"
            title="New Note (Ctrl+N)"
          >
            New Note
          </button>
          {isMobile && (
            <button 
              onClick={onClose}
              className="btn-close"
              aria-label="Close notes panel"
            >
              ×
            </button>
          )}
          {!isMobile && (
            <button 
              onClick={onClose}
              className="btn-collapse"
              aria-label="Collapse notes panel"
            >
              ⇤ Collapse
            </button>
          )}
        </div>
      </div>

      {/* Notes List */}
      <div className="notes-list">
        {sortedNotes.length === 0 ? (
          <div className="notes-empty">
            <p>No notes for this date yet.</p>
            <button onClick={handleNewNote} className="btn-new-note-cta">
              Create your first note
            </button>
          </div>
        ) : (
          sortedNotes.map(note => (
            <div
              key={note.id}
              className={`note-item ${selectedNoteId === note.id ? 'selected' : ''}`}
              onClick={() => handleNoteSelect(note.id)}
              role="button"
              tabIndex={0}
              aria-selected={selectedNoteId === note.id}
            >
              <div className="note-preview">
                {getPreviewText(note.content)}
              </div>
              <div className="note-meta">
                Updated {formatDateTimeForDisplay(note.updatedAt)}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNote(note.id);
                }}
                className="btn-delete-note"
                aria-label="Delete note"
                title="Delete note"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      {/* Editor */}
      <div className="notes-editor">
        {selectedNote && (
          <>
            <div className="editor-header">
              <span className="editor-label">
                Note for {formatDateForDisplay(selectedDateKey)}
              </span>
              {saveStatus && (
                <span className="save-status">{saveStatus}</span>
              )}
              <button
                onClick={() => handleDeleteNote(selectedNote.id)}
                className="btn-delete-note"
                aria-label="Delete this note"
                title="Delete this note"
              >
                🗑️
              </button>
            </div>
            <textarea
              ref={editorRef}
              value={editorContent}
              onChange={handleEditorChange}
              placeholder="Start typing your note..."
              className="editor-textarea"
              aria-label={`Note editor for ${formatDateForDisplay(selectedDateKey)}`}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default NotesPanel;