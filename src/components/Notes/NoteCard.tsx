import React from 'react';
import { type Note } from '../../context/NoteContext';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface NoteCardProps {
    note: Note;
}

export const NoteCard: React.FC<NoteCardProps & { baseLinkPath?: string }> = ({ note, baseLinkPath = '/note' }) => {
    return (
        <Link
            to={`${baseLinkPath}/${note.id}`}
            className="block p-4 bg-white border-b border-[var(--border-color)] hover:bg-[#f9fafb] transition-colors group cursor-pointer"
        >
            <h3 className="font-bold text-[15px] mb-2 text-[var(--text-primary)] leading-tight group-hover:text-[var(--accent-blue)] transition-colors line-clamp-2">
                {note.title}
            </h3>

            <div className="flex flex-wrap gap-2 mb-3">
                {note.tags.map(tag => (
                    <span key={tag} className="inline-block px-2 py-0.5 rounded-md bg-[#e5e7eb] text-[11px] font-medium text-[var(--text-primary)]">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="text-xs text-[var(--text-secondary)]">
                {format(new Date(note.lastEdited), 'dd MMM yyyy')}
            </div>
        </Link>
    );
};
