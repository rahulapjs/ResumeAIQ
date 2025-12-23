import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, Briefcase, FileText, Settings } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { to: '/', icon: Home, label: 'Dashboard' },
        { to: '/analysis', icon: FileText, label: 'Analysis' },
        { to: '/chat', icon: MessageSquare, label: 'Q&A Chat' },
        { to: '/match', icon: Briefcase, label: 'Job Match' },
    ];

    return (
        <aside className="glass-panel sidebar-container">
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                <h1 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                    ResumeIQ
                </h1>
            </div>

            <nav style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span style={{ fontWeight: 500 }}>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                <button className="nav-item" style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: '1rem' }}>
                    <Settings size={20} />
                    <span style={{ fontWeight: 500 }}>Settings</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
