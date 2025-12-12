import React from 'react';
import { Home, Archive, Tag, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link, useLocation } from 'react-router-dom';

const tags = [
    "Cooking", "Dev", "Fitness", "Health", "Personal", "React", "Recipes", "Shopping", "Travel", "TypeScript"
];

export const Sidebar = () => {
    const location = useLocation();

    return (
        <aside className="w-[280px] min-h-screen bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col p-4 hidden md:flex">
            <div className="flex items-center gap-3 mb-8 px-2">
                {/* Logo Icon mockup */}
                <div className="text-[var(--accent-blue)]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 19C17 19 20 16 20 12C20 8 17 5 12 5C9 5 6 6 4 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M4 8V18C6 19 9 20 12 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M4 8L3.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
                <h1 className="text-xl font-bold font-serif italic">Notes</h1>
            </div>

            <nav className="space-y-1 mb-8">
                <NavLink to="/" icon={<Home size={18} />} label="All Notes" active={location.pathname === '/' || location.pathname.startsWith('/note/')} />
                <NavLink to="/archived" icon={<Archive size={18} />} label="Archived Notes" active={location.pathname === '/archived'} />
            </nav>

            <div className="flex-1">
                <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3 px-2">Tags</h3>
                <div className="space-y-0.5 max-h-[400px] overflow-y-auto">
                    {tags.map(tag => (
                        <button key={tag} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-white hover:shadow-sm rounded-md transition-all text-left group">
                            <Tag size={16} className="text-[var(--text-secondary)] group-hover:text-[var(--accent-blue)]" />
                            <span>{tag}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-color)] mt-auto space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-white hover:shadow-sm rounded-md transition-all text-left">
                    <Settings size={18} className="text-[var(--text-secondary)]" /> Settings
                </button>
            </div>
        </aside>
    );
};

interface NavLinkProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    active?: boolean;
}

const NavLink = ({ to, icon, label, active }: NavLinkProps) => {
    return (
        <Link
            to={to}
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                active
                    ? "bg-white text-[var(--accent-blue)] shadow-sm"
                    : "text-[var(--text-secondary)] hover:bg-white hover:text-[var(--text-primary)] hover:shadow-sm"
            )}
        >
            <span className={cn("transition-colors", active ? "text-[var(--accent-blue)]" : "text-[var(--text-secondary)] group-hover:text-[var(--accent-blue)]")}>
                {icon}
            </span>
            {label}
            {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)]" />}
        </Link>
    )
}
