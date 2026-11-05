import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FilePlus2, Search, X } from 'lucide-react';
import { useNotes } from '../../context/NoteContext';
import { NoteCard } from './NoteCard';

export const NoteList = () => {
    const { notes } = useNotes();
    const [searchQuery, setSearchQuery] = useState('');
    const [params, setParams] = useSearchParams();
    const activeTag = params.get('tag');
    const filteredNotes = useMemo(() => notes
        .filter(note => !activeTag || note.tags.some(tag => tag.toLowerCase() === activeTag.toLowerCase()))
        .filter(note => `${note.title} ${note.content} ${note.tags.join(' ')}`.toLowerCase().includes(searchQuery.trim().toLowerCase()))
        .sort((a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()), [notes, activeTag, searchQuery]);
    const title = activeTag ? `# ${activeTag}` : 'All notes';

    return (
        <section className="note-list-panel">
            <header className="list-header">
                <div className="list-heading-row"><div><p className="eyebrow">YOUR LIBRARY</p><h1>{title}</h1></div>
                    <Link to="/new" className="icon-button create-mobile" aria-label="Create note"><FilePlus2 size={19} /></Link>
                </div>
                <label className="search-box"><Search size={17} /><input aria-label="Search notes" placeholder="Search your notes..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    {searchQuery && <button aria-label="Clear search" onClick={() => setSearchQuery('')}><X size={15} /></button>}
                </label>
                {activeTag && <button className="filter-chip" onClick={() => setParams({})}>Tagged {activeTag}<X size={13} /></button>}
            </header>

            <div className="list-meta"><span>{filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}</span><span>Recently edited</span></div>
            <div className="notes-scroll">
                {filteredNotes.length ? filteredNotes.map(note => <NoteCard key={note.id} note={note} />) : (
                    <div className="empty-state"><span className="empty-icon"><Search size={21} /></span>
                        <h2>{searchQuery || activeTag ? 'No notes found' : 'A little space to think'}</h2>
                        <p>{searchQuery || activeTag ? 'Try another search or clear your tag filter.' : 'Capture an idea before it slips away.'}</p>
                        {!searchQuery && !activeTag && <Link className="text-action" to="/new">Write your first note <span>→</span></Link>}
                    </div>
                )}
            </div>
        </section>
    );
};
