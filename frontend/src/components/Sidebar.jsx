import { NavLink } from 'react-router-dom';
import ProductLogo from '../assets/logo.png';

export default function Sidebar({ onLogout }) {
    // Tailwind classes for our links
    const baseLinkClasses = "flex items-center px-3 py-2.5 rounded-lg group transition-colors outline-none";
    const activeClasses = "bg-sky-600/10 text-sky-400 font-medium";
    const inactiveClasses = "text-slate-300 hover:bg-slate-800 hover:text-white";

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-20 hidden md:flex shrink-0">
            {/* Branding */}
            <div className="h-16 flex items-center px-6 bg-slate-950/50 border-b border-slate-800 shrink-0">
                <img src={ProductLogo} alt="Logo" className="h-8 w-auto mr-3 brightness-0 invert" />
                <span className="text-white font-bold text-lg tracking-wide">LifeCare IVF</span>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
                
                {/* Dashboard Link */}
                <NavLink 
                    to="/dashboard" 
                    end // 'end' ensures this only matches exactly /dashboard, not /dashboard/something
                    className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeClasses : inactiveClasses}`}
                >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    Dashboard Overview
                </NavLink>

                {/* Clinic Management Link */}
                <NavLink 
                    to="/clinics" 
                    className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeClasses : inactiveClasses}`}
                >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    Clinic Management
                </NavLink>

                {/* Patient Records Link (Placeholder for future) */}
                <NavLink 
                    to="/patients" 
                    className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeClasses : inactiveClasses}`}
                >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    Patient Records
                </NavLink>
                
            </nav>

            {/* Sidebar Footer (User Settings) */}
            <div className="p-4 border-t border-slate-800 shrink-0">
                <button onClick={onLogout} className="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    Secure Logout
                </button>
            </div>
        </aside>
    );
}