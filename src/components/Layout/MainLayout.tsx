import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(() => localStorage.getItem('sidebar-hidden') !== 'true');
    const toggleSidebar = () => setSidebarOpen(current => {
        localStorage.setItem('sidebar-hidden', String(current));
        return !current;
    });

    return (
        <div className={`app-frame ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
            {sidebarOpen && <Sidebar />}
            <main className="app-main">
                <button className="sidebar-toggle" onClick={toggleSidebar} aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'} aria-expanded={sidebarOpen} title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}>
                    <Menu size={17} />
                </button>
                <Outlet />
            </main>
        </div>
    );
};
