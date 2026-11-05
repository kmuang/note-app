import { useState, useRef } from 'react';
import { BrowserRouter, Routes, Route, Outlet as SplitOutlet, useLocation, Link, Navigate } from 'react-router-dom';
import { NoteProvider } from './context/NoteContext';
import { MainLayout } from './components/Layout/MainLayout';
import { NoteList } from './components/Notes/NoteList';
import { NoteEditor } from './components/Notes/NoteEditor';

function App() {
  return (
    <NoteProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* 
               We handle the list in the SplitLayout manually.
               The Outlet handles the detail view.
            */}
            <Route element={<SplitLayout />}>
              <Route index element={<WelcomePanel />} />
              <Route path="note/:id" element={<NoteEditor />} />
              <Route path="new" element={<NoteEditor />} />
              <Route path="archived" element={<Navigate to="/" replace />} />
              <Route path="archived/:id" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </NoteProvider>
  );
}

const SplitLayout = () => {
  const location = useLocation();
  const [listWidth, setListWidth] = useState(() => Number(localStorage.getItem('note-list-width')) || 356);
  const resizing = useRef(false);
  // On mobile, if we are at /note/:id or /new, we might want to hide the list.
  // CSS media queries can handle hiding columns.

  // Determine if we are on a detail view
  const isDetailView = location.pathname.includes('/note/') || location.pathname === '/new' || (location.pathname.startsWith('/archived/') && location.pathname !== '/archived');

    return (
    <div className="split-layout" style={{ '--list-width': `${listWidth}px` } as React.CSSProperties}>
      {/* Middle Column: Note List */}
      {/* Hide on mobile if viewing detail */}
      <div className={`list-column ${isDetailView ? 'mobile-hidden' : ''}`}>
        <NoteList />
      </div>

      <div
        className={`list-resizer ${isDetailView ? 'mobile-hidden' : ''}`}
        role="separator"
        aria-label="Resize notes list"
        aria-orientation="vertical"
        aria-valuemin={260}
        aria-valuemax={560}
        aria-valuenow={listWidth}
        tabIndex={0}
        onPointerDown={event => {
          resizing.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={event => {
          if (!resizing.current) return;
          const bounds = event.currentTarget.parentElement?.getBoundingClientRect();
          if (!bounds) return;
          const next = Math.min(560, Math.max(260, event.clientX - bounds.left));
          setListWidth(next);
          localStorage.setItem('note-list-width', String(next));
        }}
        onPointerUp={() => { resizing.current = false; }}
        onKeyDown={event => {
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
          event.preventDefault();
          const next = Math.min(560, Math.max(260, listWidth + (event.key === 'ArrowRight' ? 20 : -20)));
          setListWidth(next);
          localStorage.setItem('note-list-width', String(next));
        }}
      />

      {/* Right Column: Note Detail */}
      {/* On mobile, show only if detail view. On desktop, always show (or show placeholder). */}
      <div className={`detail-column ${isDetailView ? '' : 'mobile-hidden'}`}>
        <SplitOutlet />
      </div>
    </div>
  )
}

const WelcomePanel = () => {
  const location = useLocation();
  const tag = new URLSearchParams(location.search).get('tag');
  return <div className="welcome-panel">
    <div className="welcome-mark">✳</div>
    <p className="eyebrow">A QUIETER PLACE FOR YOUR THOUGHTS</p>
    <h2>{tag ? `Notes tagged ${tag}` : 'Make room for a new idea.'}</h2>
    <p>Choose a note from your library or start a fresh page.</p>
    <Link to="/new" className="welcome-cta">Create a note <span>→</span></Link>
  </div>;
};

export default App;
