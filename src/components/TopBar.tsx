import React from 'react';

const TopBar: React.FC = () => {
  return (
    <header className="top-bar">
      <div className="top-bar-content">
        <h1 className="app-title">AI-Frontend</h1>
        <div className="top-bar-actions">
          {/* Reserved space for future buttons */}
        </div>
      </div>
    </header>
  );
};

export default TopBar;