import { type Note } from '../../context/NoteContext';
import { formatDistanceToNowStrict } from 'date-fns';
import { Link, useLocation } from 'react-router-dom';

interface NoteCardProps { note: Note; baseLinkPath?: string }

export const NoteCard = ({ note, baseLinkPath = '/note' }: NoteCardProps) => {
    const location = useLocation();
    const preview = note.content.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    const edited = formatDistanceToNowStrict(new Date(note.lastEdited), { addSuffix: true });
    return (
        <Link to={`${baseLinkPath}/${note.id}`} state={{ from: location.pathname + location.search }} className="note-card">
            <div className="note-card-top"><h2>{note.title || 'Untitled note'}</h2><time>{edited}</time></div>
            <p className="note-preview">{preview || 'No additional text'}</p>
            {note.tags.length > 0 && <div className="note-tags">{note.tags.slice(0, 3).map(tag => <span key={tag} className="note-tag">{tag}</span>)}{note.tags.length > 3 && <span className="tag-overflow">+{note.tags.length - 3}</span>}</div>}
        </Link>
    );
};
