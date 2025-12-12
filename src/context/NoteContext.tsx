import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Note {
    id: string;
    title: string;
    content: string;
    tags: string[];
    lastEdited: string; // ISO String
    isArchived: boolean;
}

interface NoteContextType {
    notes: Note[];
    addNote: (note: Omit<Note, 'id' | 'lastEdited' | 'isArchived'>) => void;
    updateNote: (id: string, updates: Partial<Note>) => void;
    deleteNote: (id: string) => void;
    archiveNote: (id: string) => void;
    unarchiveNote: (id: string) => void;
    getNote: (id: string) => Note | undefined;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

const INITIAL_NOTES: Note[] = [
    {
        id: '1',
        title: 'React Performance Optimization',
        content: `Key performance optimization techniques:

1. Code Splitting
- Use React.lazy() for route-based splitting
- Implement dynamic imports for heavy components

2. Memoization
- useMemo for expensive calculations
- useCallback for function props
- React.memo for component optimization

3. Virtual List Implementation
- Use react-window for long lists
- Implement infinite scrolling

TODO: Benchmark current application and identify bottlenecks`,
        tags: ['Dev', 'React'],
        lastEdited: '2024-10-29T10:00:00.000Z',
        isArchived: false,
    },
    {
        id: '2',
        title: 'Japan Travel Planning',
        content: 'Itinerary planning for Tokyo and Kyoto...',
        tags: ['Travel', 'Personal'],
        lastEdited: '2024-10-28T14:30:00.000Z',
        isArchived: false,
    },
    {
        id: '3',
        title: 'Favorite Pasta Recipes',
        content: 'Carbonara, Cacio e Pepe, and Bolognese recipes...',
        tags: ['Cooking', 'Recipes'],
        lastEdited: '2024-10-27T09:15:00.000Z',
        isArchived: false,
    },
];

export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notes, setNotes] = useState<Note[]>(() => {
        const saved = localStorage.getItem('notes');
        return saved ? JSON.parse(saved) : INITIAL_NOTES;
    });

    useEffect(() => {
        localStorage.setItem('notes', JSON.stringify(notes));
    }, [notes]);

    const addNote = (noteData: Omit<Note, 'id' | 'lastEdited' | 'isArchived'>) => {
        const newNote: Note = {
            ...noteData,
            id: crypto.randomUUID(),
            lastEdited: new Date().toISOString(),
            isArchived: false,
        };
        setNotes(prev => [newNote, ...prev]);
    };

    const updateNote = (id: string, updates: Partial<Note>) => {
        setNotes(prev => prev.map(note =>
            note.id === id ? { ...note, ...updates, lastEdited: new Date().toISOString() } : note
        ));
    };

    const deleteNote = (id: string) => {
        setNotes(prev => prev.filter(note => note.id !== id));
    };

    const archiveNote = (id: string) => {
        updateNote(id, { isArchived: true });
    };

    const unarchiveNote = (id: string) => {
        updateNote(id, { isArchived: false });
    };

    const getNote = (id: string) => notes.find(n => n.id === id);

    return (
        <NoteContext.Provider value={{ notes, addNote, updateNote, deleteNote, archiveNote, unarchiveNote, getNote }}>
            {children}
        </NoteContext.Provider>
    );
};

export const useNotes = () => {
    const context = useContext(NoteContext);
    if (context === undefined) {
        throw new Error('useNotes must be used within a NoteProvider');
    }
    return context;
};
