import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotes } from '../../context/NoteContext';
import { ChevronLeft, Trash2, Archive, Clock, Tag as TagIcon, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';

export const NoteEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { notes, addNote, updateNote, deleteNote, archiveNote, unarchiveNote } = useNotes();
    const isNew = !id;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [lastEdited, setLastEdited] = useState<string | null>(null);
    const [isArchived, setIsArchived] = useState(false);

    useEffect(() => {
        if (!isNew && id) {
            const note = notes.find(n => n.id === id);
            if (note) {
                setTitle(note.title);
                setContent(note.content);
                setTags(note.tags.join(', '));
                setLastEdited(note.lastEdited);
                setIsArchived(note.isArchived);
            } else {
                navigate('/'); // Note not found
            }
        } else {
            // Reset for new note
            setTitle('');
            setContent('');
            setTags('');
            setLastEdited(null);
            setIsArchived(false);
        }
    }, [id, notes, isNew, navigate]);

    const handleSave = () => {
        const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);

        if (isNew) {
            addNote({
                title: title || 'Untitled Note',
                content,
                tags: tagList,
            });
            navigate('/');
        } else if (id) {
            updateNote(id, {
                title: title || 'Untitled Note',
                content,
                tags: tagList,
            });
            // Stay on page or show success toast? For now, stay.
        }
    };

    const handleArchive = () => {
        if (id) {
            archiveNote(id);
            navigate('/');
        }
    };

    const handleUnarchive = () => {
        if (id) {
            unarchiveNote(id);
            navigate('/archived');
        }
    }

    const handleDelete = () => {
        if (id) {
            if (confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
                deleteNote(id);
                navigate('/');
            }
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <header className="px-4 py-4 md:px-8 border-b border-[var(--border-color)] flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    <ChevronLeft size={20} />
                    <span className="text-sm font-medium">Go Back</span>
                </button>

                <div className="flex items-center gap-3">
                    {!isNew && (
                        <>
                            <button onClick={handleDelete} className="p-2 text-[var(--text-secondary)] hover:text-red-500 transition-colors" title="Delete Note">
                                <Trash2 size={18} />
                            </button>
                            {isArchived ? (
                                <button onClick={handleUnarchive} className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" title="Unarchive Note">
                                    <RotateCcw size={18} />
                                </button>
                            ) : (
                                <button onClick={handleArchive} className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" title="Archive Note">
                                    <Archive size={18} />
                                </button>
                            )}
                        </>
                    )}

                    <button onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-[var(--accent-blue)] hover:text-[var(--accent-blue-hover)] transition-colors">
                        Save Note
                    </button>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-3xl mx-auto px-4 py-8 md:px-8">
                    <input
                        type="text"
                        placeholder="Enter Title..."
                        className="w-full text-3xl md:text-4xl font-bold text-[var(--text-primary)] placeholder-gray-300 border-none focus:ring-0 focus:outline-none bg-transparent mb-6"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <div className="grid grid-cols-[100px_1fr] gap-y-4 mb-8 text-sm">
                        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                            <TagIcon size={16} />
                            <span>Tags</span>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="text"
                                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-[var(--text-primary)] placeholder-gray-300 p-0"
                                placeholder="Add tags separated by comma (e.g. Dev, React)"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                            />
                        </div>

                        {lastEdited && (
                            <>
                                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                    <Clock size={16} />
                                    <span>Last edited</span>
                                </div>
                                <div className="text-[var(--text-primary)]">
                                    {format(new Date(lastEdited), 'dd MMM yyyy')}
                                </div>
                            </>
                        )}
                    </div>

                    <hr className="border-[var(--border-color)] mb-8" />

                    <textarea
                        className="w-full h-[calc(100vh-400px)] resize-none bg-transparent border-none focus:ring-0 focus:outline-none text-base md:text-lg text-[var(--text-primary)] leading-relaxed placeholder-gray-300"
                        placeholder="Start typing your note here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};
