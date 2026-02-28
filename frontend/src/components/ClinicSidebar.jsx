import { Link, useLocation } from 'react-router-dom';

export default function ClinicSidebar({ onLogout, clinic }) {
    const location = useLocation();

    // Specific navigation for Clinic Staff
    const navItems = [
        { name: 'Overview', path: '/clinic-dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        // ⚠️ NEW: Branch Management Link
        { name: 'Branches', path: '/clinic-branches', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
        { name: 'Patients', path: '/patients', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { name: 'Appointments', path: '/appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { name: 'Inventory', path: '/inventory', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
        { name: 'Billing', path: '/billing', icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z' },
    ];

    return (
        <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen shrink-0 border-r border-slate-800 transition-all duration-300">
            {/* Clinic Branding Area */}
            <div className="h-20 flex items-center px-6 bg-slate-950 border-b border-slate-800">
                {clinic?.logo_path ? (
                    <img src={`http://127.0.0.1:8000/storage/${clinic.logo_path}`} className="h-10 w-10 rounded object-cover mr-3 bg-white p-0.5" alt="logo" />
                ) : (
                    <div className="h-10 w-10 rounded bg-sky-600 flex items-center justify-center text-white font-bold mr-3 text-xl">
                        {clinic?.name?.charAt(0) || 'C'}
                    </div>
                )}
                <div>
                    <h1 className="text-white font-bold text-sm tracking-wide leading-tight truncate w-36" title={clinic?.name}>
                        {clinic?.name || 'Clinic Panel'}
                    </h1>
                    <p className="text-[10px] text-sky-400 font-semibold tracking-widest uppercase">Workspace</p>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Operations</p>
                {navItems.map((item) => {
                    // Check if current path includes the item path to keep it active for sub-pages
                    const isActive = location.pathname.includes(item.path);
                    return (
                        <Link key={item.name} to={item.path} className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${isActive ? 'bg-sky-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
                            <svg className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                            </svg>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/50">
                <button onClick={onLogout} className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Secure Logout
                </button>
            </div>
        </div>
    );
}