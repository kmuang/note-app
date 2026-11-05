import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Note {
    id: string;
    title: string;
    content: string;
    tags: string[];
    fontFamily?: 'system' | 'serif' | 'mono';
    fontSize?: number;
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
        title: 'IT Careers and Job Paths',
        content: `IT teams keep the technology people and businesses rely on working well. Common career paths include:

Help desk and service desk
- Troubleshoot user issues, manage requests, and document solutions.

Systems and network administration
- Maintain servers, identity, endpoints, connectivity, and access.

Cybersecurity and cloud operations
- Reduce risk, monitor systems, respond to incidents, and manage cloud services.

Useful foundations: clear communication, careful troubleshooting, basic networking, operating systems, and a habit of documenting your work.`,
        tags: ['IT', 'Careers'],
        lastEdited: '2024-10-29T10:00:00.000Z',
        isArchived: false,
    },
    {
        id: '2',
        title: 'Data Center Hardware Components',
        content: `Core data center components and what they do:

- Compute: rack servers, CPUs, memory, and accelerators run workloads.
- Storage: SSDs, hard drives, and storage arrays keep application data.
- Network: switches, routers, and fiber links connect systems.
- Power: UPS units, PDUs, and generators provide resilient electricity.
- Cooling: CRAC/CRAH units, chillers, and airflow management remove heat.
- Racks and cabling: organize equipment and provide structured connections.

Track each asset by rack, unit position, serial number, power feed, and network connections.`,
        tags: ['Data Center', 'Hardware'],
        lastEdited: '2024-10-28T14:30:00.000Z',
        isArchived: false,
    },
    {
        id: '3',
        title: 'Software Development Lifecycle',
        content: `A repeatable path from an idea to supported software:

1. Discover the user need and define success.
2. Plan a small, testable change.
3. Design the behavior and interfaces.
4. Implement in version control with review.
5. Test automatically and check key user flows.
6. Release gradually and monitor the result.
7. Fix issues and use feedback to plan the next iteration.

Keep changes small, write down important decisions, and make it easy to roll back a release.`,
        tags: ['Software', 'Development'],
        lastEdited: '2024-10-27T09:15:00.000Z',
        isArchived: false,
    },
    {
        id: '4',
        title: 'IT Operations Runbook',
        content: `A practical checklist for keeping day-to-day IT services reliable.\n\nIncident response\n- Record the impact, affected users, and start time.\n- Check monitoring and recent changes before changing production.\n- Share regular status updates and document the resolution.\n\nRoutine maintenance\n- Review endpoint, identity, and backup alerts.\n- Apply security updates through the approved change process.\n- Confirm critical services have a tested recovery path.\n\nKeep ownership, escalation contacts, and system links current.`,
        tags: ['IT', 'Operations'],
        lastEdited: '2026-10-25T14:00:00.000Z',
        isArchived: false,
    },
    {
        id: '5',
        title: 'Data Center Operations',
        content: `Operations notes for a safe, available, and efficient data center.\n\nDaily checks\n- Review temperature, humidity, power, and cooling alerts.\n- Check UPS, generator, and power distribution status.\n- Confirm network links and critical equipment are healthy.\n\nChange and access control\n- Log rack work, cabling changes, and equipment moves.\n- Verify approvals and use two-person checks for high-impact work.\n- Keep rack diagrams, asset records, and port maps updated.\n\nFor incidents, capture timestamps, alarms, actions, and recovery results.`,
        tags: ['Data Center', 'Infrastructure'],
        lastEdited: '2026-10-25T13:00:00.000Z',
        isArchived: false,
    },
    {
        id: '6',
        title: 'Networking Fundamentals for IT',
        content: `Networking basics that help with IT troubleshooting:

- IP addresses identify devices on a network; subnets define local ranges.
- DNS translates hostnames into IP addresses.
- DHCP assigns network settings to clients.
- Switches connect devices within a local network; routers connect networks.
- Firewalls allow or block traffic based on security rules.
- VLANs separate traffic into logical network segments.

Troubleshoot from the user outward: check link and Wi-Fi, address assignment, gateway reachability, DNS, then the target service. Record what you tested and the result.`,
        tags: ['IT', 'Networking'],
        lastEdited: '2026-10-25T12:00:00.000Z',
        isArchived: false,
    },
    {
        id: '7',
        title: 'Software Development Essentials',
        content: `A few practices that make software easier to build and maintain:

- Use version control branches and focused commits.
- Break work into small functions and components with clear responsibilities.
- Review changes for correctness, readability, and security.
- Test important behavior, including edge cases and failures.
- Keep dependencies updated and configuration out of source code.
- Add useful logs and monitor errors after release.

Before starting, clarify the expected behavior. After finishing, explain what changed and how it was verified.`,
        tags: ['Software', 'Engineering'],
        lastEdited: '2026-10-25T11:00:00.000Z',
        isArchived: false,
    },
    {
        id: '8',
        title: 'Cybersecurity Essentials',
        content: `Security practices that reduce everyday risk:\n\n- Use a unique password manager generated password for each account.\n- Turn on multi-factor authentication, especially for email and admin access.\n- Keep operating systems, browsers, and applications updated.\n- Treat unexpected links and attachments with care.\n- Give each account only the access it needs.\n- Back up important data and test restoring it.\n\nIf you suspect an incident, report it quickly and preserve useful details such as times, messages, and affected devices.`,
        tags: ['Security', 'IT'],
        lastEdited: '2026-10-25T10:00:00.000Z',
        isArchived: false,
    },
    {
        id: '9',
        title: 'Linux Command Line Basics',
        content: `Useful commands for navigating and inspecting a Linux system:\n\n- pwd: print the current directory.\n- ls -la: list files, including hidden files and permissions.\n- cd: change directory.\n- grep: find matching text in files.\n- tail -f: watch a log as new lines arrive.\n- df -h: check filesystem space.\n- systemctl status SERVICE: inspect a service.\n\nRead a command's manual with man COMMAND. Before using sudo or commands that change files, check the target and understand the effect.`,
        tags: ['Linux', 'IT'],
        lastEdited: '2026-10-25T09:00:00.000Z',
        isArchived: false,
    },
    {
        id: '10',
        title: 'Cloud Computing Concepts',
        content: `Cloud services are commonly grouped into three models:\n\n- IaaS provides virtual machines, networks, and storage to manage.\n- PaaS provides a managed runtime for deploying applications.\n- SaaS provides a complete application to its users.\n\nPlan for identity and access, network boundaries, backups, monitoring, and cost controls. Choose a region that meets latency and data requirements, and avoid leaving unused resources running.`,
        tags: ['Cloud', 'Infrastructure'],
        lastEdited: '2026-10-25T08:00:00.000Z',
        isArchived: false,
    },
    {
        id: '11',
        title: 'Database Design Basics',
        content: `A few foundations for reliable relational databases:\n\n- Model entities as tables and give each row a stable primary key.\n- Use foreign keys to express relationships between records.\n- Choose column types and constraints that reflect valid data.\n- Add indexes for common queries, then measure their impact.\n- Use transactions when several updates must succeed together.\n- Back up data and test restore procedures.\n\nKeep schema changes in version control and review how they affect existing data.`,
        tags: ['Database', 'Software'],
        lastEdited: '2026-10-25T07:00:00.000Z',
        isArchived: false,
    },
    {
        id: '12',
        title: 'API Design and HTTP',
        content: `A clear API makes it easier for systems to work together:\n\n- Use nouns for resource paths and HTTP methods for actions.\n- Return meaningful status codes and consistent error shapes.\n- Validate input at the boundary and avoid exposing secrets.\n- Document authentication, parameters, and response examples.\n- Plan pagination and rate limits for growing workloads.\n- Version changes that could break existing clients.\n\nFor debugging, inspect the request method, URL, headers, payload, status, and response body.`,
        tags: ['API', 'Development'],
        lastEdited: '2026-10-25T06:00:00.000Z',
        isArchived: false,
    },
    {
        id: '13',
        title: 'Git Workflow Cheatsheet',
        content: `A simple Git workflow for focused changes:\n\n1. Pull the latest shared changes.\n2. Create a branch for one task.\n3. Review git status before staging files.\n4. Commit a small change with a clear message.\n5. Push the branch and open it for review.\n6. Resolve feedback, then merge using the team's process.\n\nHandy commands: git status, git diff, git log --oneline, git switch -c NAME, and git restore FILE.`,
        tags: ['Git', 'Software'],
        lastEdited: '2026-10-25T05:00:00.000Z',
        isArchived: false,
    },
    {
        id: '14',
        title: 'CI/CD and Deployment',
        content: `A CI/CD pipeline helps teams ship changes consistently:\n\n- Install dependencies from a lockfile.\n- Run linting, type checks, and automated tests.\n- Build a repeatable release artifact.\n- Deploy to a staging environment for review.\n- Release gradually and monitor health signals.\n- Keep a tested rollback path.\n\nStore credentials in the platform's secret manager, never in source code or build logs.`,
        tags: ['DevOps', 'Deployment'],
        lastEdited: '2026-10-25T04:00:00.000Z',
        isArchived: false,
    },
    {
        id: '15',
        title: 'IT Troubleshooting Method',
        content: `A structured approach makes technical problems easier to solve:\n\n1. Ask what changed and who is affected.\n2. Reproduce the issue and capture the exact error.\n3. Check scope: one user, one device, or a shared service.\n4. Test one likely cause at a time.\n5. Apply the smallest safe fix and verify recovery.\n6. Record the cause, resolution, and prevention step.\n\nAvoid changing several things at once; that makes it harder to identify what solved the problem.`,
        tags: ['IT', 'Troubleshooting'],
        lastEdited: '2026-10-25T03:00:00.000Z',
        isArchived: false,
    },
];

export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notes, setNotes] = useState<Note[]>(() => {
        const saved = localStorage.getItem('notes');
        const didAddStarterNotes = localStorage.getItem('starter-notes-v4') === 'true';
        if (saved) {
            let parsed: Note[] = JSON.parse(saved);
            if (!didAddStarterNotes) {
                const oldSampleTitles = ['React Performance Optimization', 'Japan Travel Planning', 'Favorite Pasta Recipes'];
                parsed = parsed.map(note => {
                    const replacement = INITIAL_NOTES.find(starter => starter.id === note.id);
                    return replacement && oldSampleTitles.includes(note.title) ? replacement : note;
                });
                localStorage.setItem('starter-notes-v4', 'true');
                return [...parsed, ...INITIAL_NOTES.filter(starter => ['6', '7', '8', '9', '10', '11', '12', '13', '14', '15'].includes(starter.id) && !parsed.some(note => note.id === starter.id))];
            }
            return parsed;
        }
        localStorage.setItem('starter-notes-v4', 'true');
        return INITIAL_NOTES;
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
