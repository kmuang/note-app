import React, { useMemo, useState } from 'react';
import { useNotes } from '../../context/NoteContext';
import { NoteCard } from './NoteCard';
import { Search, Plus, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NoteListProps {
    archived?: boolean;
}

export const NoteList: React.FC<NoteListProps> = ({ archived = false }) => {
    const { notes } = useNotes();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredNotes = useMemo(() => {
        return notes
            .filter(note => {
                const matchesArchive = archived ? note.isArchived : !note.isArchived;
                const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    note.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
                return matchesArchive && matchesSearch;
            })
            .sort((a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime());
    }, [notes, archived, searchQuery]);

    // Mobile header title
    const title = archived ? 'Archived Notes' : 'All Notes';

    return (
        <div className="h-full flex flex-col bg-white md:bg-[var(--bg-primary)]">
            {/* Mobile Header / Desktop Search Header */}
            <header className="px-4 py-3 md:py-6 md:px-8 border-b border-[var(--border-color)] flex items-center gap-4 bg-[var(--bg-secondary)] md:bg-transparent">
                {/* Mobile Menu Icon (mock) */}
                <div className="md:hidden">
                    <span className="font-bold text-lg font-serif italic text-[var(--text-primary)]">Notes</span>
                </div>

                <div className="flex-1 hidden md:block">
                    <h1 className="text-2xl font-bold mb-4">{title}</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
                        <input
                            type="text"
                            placeholder="Search by title, content, or tags..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border-color)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="md:hidden flex-1 flex justify-end">
                    {/* Mobile Search Icon */}
                    <Search className="text-[var(--text-primary)] mr-4" size={20} />
                    <Settings className="text-[var(--text-primary)]" size={20} />
                </div>
            </header>

            {/* Desktop: Create Note Button Area - Only show for All Notes */}
            {!archived && (
                <div className="hidden md:block px-8 py-4">
                    <Link to="/new" className="block w-full bg-[var(--accent-blue)] hover:bg-[var(--accent-blue-hover)] text-white text-center py-3 rounded-lg font-medium transition-colors shadow-sm">
                        + Create New Note
                    </Link>
                </div>
            )}

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredNotes.length === 0 ? (
                    <div className="p-8 text-center text-[var(--text-secondary)]">
                        {searchQuery ? 'No notes match your search.' : (archived ? 'No archived notes.' : 'No notes yet. Create one!')}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 divide-y divide-[var(--border-color)]">
                        {filteredNotes.map(note => (
                            <NoteCard key={note.id} note={note} baseLinkPath={archived ? '/archived' : '/note'} />
                        ))}
                    </div>
                )}
            </div>

            {/* Mobile Floating Action Button */}
            {!archived && (
                <Link to="/new" className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-[var(--accent-blue)] rounded-full flex items-center justify-center text-white shadow-lg z-10">
                    <Plus size={24} />
                </Link>
            )}
        </div>
    );
};
