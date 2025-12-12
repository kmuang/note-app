import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
              <Route index element={<div className="flex-1 flex items-center justify-center text-[var(--text-secondary)]">Select a note to view</div>} />
              <Route path="note/:id" element={<NoteEditor />} />
              <Route path="new" element={<NoteEditor />} />
              <Route path="archived" element={<div className="flex-1 flex items-center justify-center text-[var(--text-secondary)]">Select an archived note to view</div>} />
              <Route path="archived/:id" element={<NoteEditor />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </NoteProvider>
  );
}

import { Outlet as SplitOutlet, useLocation } from 'react-router-dom';

const SplitLayout = () => {
  const location = useLocation();
  const isArchived = location.pathname.startsWith('/archived');
  // On mobile, if we are at /note/:id or /new, we might want to hide the list.
  // CSS media queries can handle hiding columns.

  // Determine if we are on a detail view
  const isDetailView = location.pathname.includes('/note/') || location.pathname === '/new' || (location.pathname.startsWith('/archived/') && location.pathname !== '/archived');

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Middle Column: Note List */}
      {/* Hide on mobile if viewing detail */}
      <div className={`w-full md:w-[350px] border-r border-[#e5e7eb] flex-shrink-0 bg-white md:flex flex-col ${isDetailView ? 'hidden' : 'flex'}`}>
        {isArchived ? (
          <NoteList archived={true} />
        ) : (
          <NoteList />
        )}
      </div>

      {/* Right Column: Note Detail */}
      {/* On mobile, show only if detail view. On desktop, always show (or show placeholder). */}
      <div className={`flex-1 bg-white h-full overflow-hidden ${isDetailView ? 'block' : 'hidden md:block'}`}>
        <SplitOutlet />
      </div>
    </div>
  )
}

export default App;
