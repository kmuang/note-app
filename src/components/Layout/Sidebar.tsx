import { useEffect, useRef, useState } from 'react';
import { FileText, Hash, Plus } from 'lucide-react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useNotes } from '../../context/NoteContext';

export const Sidebar = () => {
    const location = useLocation();
    const [params] = useSearchParams();
    const { notes, updateNote } = useNotes();
    const tags = [...new Set(notes.flatMap(note => note.tags))].sort((a, b) => a.localeCompare(b));
    const activeTag = params.get('tag');
    const [editingTag, setEditingTag] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const editInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingTag) editInput.current?.focus();
    }, [editingTag]);

    const saveTag = () => {
        if (!editingTag) return;
        const nextTag = editValue.trim();
        if (nextTag && nextTag !== editingTag) {
            notes.filter(note => note.tags.includes(editingTag)).forEach(note => {
                const updatedTags = [...new Set(note.tags.map(tag => tag === editingTag ? nextTag : tag))];
                updateNote(note.id, { tags: updatedTags });
            });
        }
        setEditingTag(null);
    };

    return (
        <aside className="sidebar">
            <Link to="/" className="brand" aria-label="Note App home">
                <span className="brand-mark"><img src="/logo.jpeg" alt="" /></span>
                <span>Note App</span>
            </Link>

            <Link to="/new" className="new-note-button"><Plus size={17} /> New note <kbd>⌘ N</kbd></Link>

            <nav className="side-nav" aria-label="Main navigation">
                <Link to="/" className={`nav-link ${location.pathname === '/' || location.pathname.startsWith('/note/') ? 'active' : ''}`}>
                    <FileText size={17} /><span>All notes</span><span className="nav-count">{notes.filter(n => !n.isArchived).length}</span>
                </Link>
            </nav>

            <div className="sidebar-section">
                <div className="section-label">Your tags</div>
                {tags.length ? tags.map(tag => (
                    <div key={tag} className="tag-nav-wrap" onContextMenu={event => {
                        event.preventDefault();
                        setEditValue(tag);
                        setEditingTag(tag);
                    }}>
                        {editingTag === tag ? (
                            <div className="tag-nav tag-editing"><Hash size={15} /><input ref={editInput} aria-label={`Rename ${tag} tag`} value={editValue} onChange={event => setEditValue(event.target.value)} onBlur={saveTag} onKeyDown={event => {
                                if (event.key === 'Enter') { event.preventDefault(); saveTag(); }
                                if (event.key === 'Escape') setEditingTag(null);
                            }} /></div>
                        ) : (
                            <Link to={`/?tag=${encodeURIComponent(tag)}`} className={`tag-nav ${activeTag === tag ? 'active' : ''}`} title="Right-click to rename this tag">
                                <Hash size={15} /><span>{tag}</span>
                            </Link>
                        )}
                    </div>
                )) : <p className="sidebar-hint">Tags from your notes will show up here.</p>}
            </div>

            <div className="sidebar-footer"><span className="avatar">N</span><span><strong>Your workspace</strong><small>Personal notes</small></span></div>
        </aside>
    );
};
