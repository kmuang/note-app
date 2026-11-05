import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotes } from '../../context/NoteContext';
import { ArrowLeft, Trash2, Clock, Tag as TagIcon, Check, CaseSensitive, Bold, Table2, ListChecks, Link2, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { format } from 'date-fns';
import { useRef } from 'react';
import { toSafeEditorHtml } from '../../lib/richText';

export const NoteEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { notes, addNote, updateNote, deleteNote } = useNotes();
    const isNew = !id;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [lastEdited, setLastEdited] = useState<string | null>(null);
    const [savedNotice, setSavedNotice] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [fontFamily, setFontFamily] = useState<'system' | 'serif' | 'mono'>('system');
    const [fontSize, setFontSize] = useState(16);
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isNew && id) {
            const note = notes.find(n => n.id === id);
            if (note) {
                setTitle(note.title);
                setContent(toSafeEditorHtml(note.content));
                setTags(note.tags.join(', '));
                setFontFamily(note.fontFamily ?? 'system');
                setFontSize(note.fontSize ?? 16);
                setLastEdited(note.lastEdited);
                setIsDirty(false);
            } else {
                navigate('/'); // Note not found
            }
        } else {
            // Reset for new note
            setTitle('');
            setContent('');
            setTags('');
            setFontFamily('system');
            setFontSize(16);
            setLastEdited(null);
            setIsDirty(false);
        }
    }, [id, notes, isNew, navigate]);

    const handleSave = () => {
        const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
        const formatting = { fontFamily, fontSize };
        const noteContent = toSafeEditorHtml(editorRef.current?.innerHTML ?? content);

        if (isNew) {
            addNote({
                title: title || 'Untitled Note',
                content: noteContent,
                tags: tagList,
                ...formatting,
            });
            navigate('/');
        } else if (id) {
            updateNote(id, {
                title: title || 'Untitled Note',
                content: noteContent,
                tags: tagList,
                ...formatting,
            });
            setSavedNotice(true);
            setIsDirty(false);
            window.setTimeout(() => setSavedNotice(false), 1800);
        }
    };

    const formatSelection = (command: string, value?: string) => {
        editorRef.current?.focus();
        document.execCommand(command, false, value);
        setIsDirty(true);
    };

    const insertTable = () => formatSelection('insertHTML', '<table><tbody><tr><th>Heading</th><th>Details</th></tr><tr><td>Item</td><td>Details</td></tr></tbody></table><p><br></p>');
    const insertChecklist = () => formatSelection('insertHTML', '<ul><li>☐ Task</li></ul><p><br></p>');
    const insertLink = () => {
        const href = window.prompt('Enter a web address');
        if (href && /^(https?:\/\/|mailto:)/i.test(href)) formatSelection('createLink', href);
    };

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
        <div className="editor-shell">
            {/* Header */}
            <header className="editor-toolbar">
                <button onClick={handleCancel} className="back-button">
                    <ArrowLeft size={18} /><span>Back to notes</span>
                </button>

                <div className="flex items-center gap-3">
                    {(lastEdited || isDirty) && <span className="save-state"><span className="save-dot" />{savedNotice ? 'Saved just now' : isDirty ? 'Unsaved changes' : 'Saved'}</span>}
                    <div className="format-controls" aria-label="Text formatting">
                        <CaseSensitive size={16} aria-hidden="true" />
                        <label className="sr-only" htmlFor="note-font">Font</label>
                        <select id="note-font" aria-label="Font" value={fontFamily} onChange={event => { setFontFamily(event.target.value as typeof fontFamily); setIsDirty(true); }}>
                            <option value="system">System</option><option value="serif">Serif</option><option value="mono">Monospace</option>
                        </select>
                        <label className="sr-only" htmlFor="note-size">Text size</label>
                        <select id="note-size" aria-label="Text size" value={fontSize} onChange={event => { setFontSize(Number(event.target.value)); setIsDirty(true); }}>
                            <option value={14}>Small</option><option value={16}>Body</option><option value={18}>Large</option><option value={22}>Title</option><option value={28}>Extra large</option>
                        </select>
                    </div>
                    {!isNew && <button onClick={handleDelete} className="icon-button danger-button" title="Delete note" aria-label="Delete note"><Trash2 size={18} /></button>}

                    <button onClick={handleSave} className="save-button">
                        {savedNotice ? <Check size={16} /> : null}{isNew ? 'Create note' : 'Save changes'}
                    </button>
                </div>
            </header>

            <div className="rich-toolbar" role="toolbar" aria-label="Text formatting">
                <button type="button" title="Bold" aria-label="Bold" onMouseDown={event => event.preventDefault()} onClick={() => formatSelection('bold')}><Bold size={16} /></button>
                <span className="toolbar-divider" />
                <button type="button" title="Insert table" aria-label="Insert table" onMouseDown={event => event.preventDefault()} onClick={insertTable}><Table2 size={16} /></button>
                <button type="button" title="Insert checklist" aria-label="Insert checklist" onMouseDown={event => event.preventDefault()} onClick={insertChecklist}><ListChecks size={16} /></button>
                <button type="button" title="Add link" aria-label="Add link" onMouseDown={event => event.preventDefault()} onClick={insertLink}><Link2 size={16} /></button>
                <label className="color-picker" title="Text color" aria-label="Text color"><span /> <input type="color" aria-label="Text color" defaultValue="#4b654a" onMouseDown={event => event.preventDefault()} onChange={event => formatSelection('foreColor', event.target.value)} /></label>
                <span className="toolbar-divider" />
                <button type="button" title="Align left" aria-label="Align left" onMouseDown={event => event.preventDefault()} onClick={() => formatSelection('justifyLeft')}><AlignLeft size={16} /></button>
                <button type="button" title="Align center" aria-label="Align center" onMouseDown={event => event.preventDefault()} onClick={() => formatSelection('justifyCenter')}><AlignCenter size={16} /></button>
                <button type="button" title="Align right" aria-label="Align right" onMouseDown={event => event.preventDefault()} onClick={() => formatSelection('justifyRight')}><AlignRight size={16} /></button>
            </div>

            {/* Content */}
            <div className="editor-scroll">
                <div className="editor-content">
                    <p className="eyebrow">{isNew ? 'NEW NOTE' : 'YOUR NOTE'}</p>
                    <input
                        type="text"
                        placeholder="Untitled note"
                        aria-label="Note title"
                        className="editor-title"
                        value={title}
                        onChange={(e) => { setTitle(e.target.value); setIsDirty(true); }}
                    />

                    <div className="editor-metadata">
                        <div className="metadata-label">
                            <TagIcon size={16} />
                            <span>Tags</span>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="text"
                                aria-label="Tags, comma separated"
                                className="metadata-input"
                                placeholder="Add tags, separated by commas"
                                value={tags}
                                onChange={(e) => { setTags(e.target.value); setIsDirty(true); }}
                            />
                        </div>

                        {lastEdited && (
                            <>
                                <div className="metadata-label">
                                    <Clock size={16} />
                                    <span>Last edited</span>
                                </div>
                                <div className="metadata-value">
                                    {format(new Date(lastEdited), 'dd MMM yyyy')}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="editor-divider" />

                    <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        className="editor-body"
                        role="textbox"
                        aria-multiline="true"
                        aria-label="Note content"
                        data-placeholder="Start writing..."
                        onInput={() => setIsDirty(true)}
                        dangerouslySetInnerHTML={{ __html: content }}
                        style={{ fontFamily: fontFamily === 'serif' ? 'Newsreader, Georgia, serif' : fontFamily === 'mono' ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : 'inherit', fontSize: `${fontSize}px` }}
                    />
                </div>
            </div>
        </div>
    );
};
