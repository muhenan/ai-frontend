import { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import Calendar from './components/Calendar';
import NotesPanel from './components/NotesPanel';
import { useNotesState } from './hooks/useNotesState';
import './App.css';

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const notesState = useNotesState();

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const currentNotes = notesState.selectedDateKey 
    ? notesState.notesByDate[notesState.selectedDateKey] || []
    : [];

  return (
    <div className="app">
      <TopBar />
      <main className={`main-content ${notesState.isNotesVisible ? 'split-view' : ''}`}>
        <div className={`calendar-container ${notesState.isNotesVisible && !isMobile ? 'calendar-split' : ''}`}>
          <Calendar 
            selectedDateKey={notesState.selectedDateKey}
            onDateClick={notesState.selectDate}
          />
        </div>
        
        {notesState.isNotesVisible && notesState.selectedDateKey && (
          <div className={`notes-container ${isMobile ? 'notes-mobile' : ''}`}>
            <NotesPanel
              selectedDateKey={notesState.selectedDateKey}
              notes={currentNotes}
              selectedNoteId={notesState.selectedNoteId}
              actions={notesState}
              onClose={notesState.closeNotes}
              isMobile={isMobile}
            />
          </div>
        )}
      </main>
      
      {/* Mobile overlay backdrop */}
      {notesState.isNotesVisible && isMobile && (
        <div 
          className="mobile-overlay"
          onClick={notesState.closeNotes}
        />
      )}
    </div>
  );
}

export default App;