import React from 'react';
import TopBar from './components/TopBar';
import Calendar from './components/Calendar';
import './App.css';

function App() {
  return (
    <div className="app">
      <TopBar />
      <main className="main-content">
        <div className="calendar-container">
          <Calendar />
        </div>
      </main>
    </div>
  );
}

export default App;