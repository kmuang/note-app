import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
    return (
        <div className="flex min-h-screen bg-[var(--bg-primary)] h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 h-full overflow-hidden flex flex-col">
                <Outlet />
            </main>
        </div>
    );
};
