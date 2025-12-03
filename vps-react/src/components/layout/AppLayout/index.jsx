import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Topbar from '../Topbar';
import styles from './AppLayout.module.css';

function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className={styles.appContainer}>
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

            <main className={styles.mainContent}>
                <Topbar onMenuToggle={toggleSidebar} />

                <div className={styles.content}>
                    <Outlet />
                </div>

                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div className={styles.overlay} onClick={closeSidebar}></div>
                )}
            </main>
        </div>
    );
}

export default AppLayout;
