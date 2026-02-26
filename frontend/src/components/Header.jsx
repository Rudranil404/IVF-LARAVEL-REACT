export default function Header({ user }) {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shrink-0">
            <div>
                <h2 className="text-xl font-semibold text-slate-800 hidden sm:block">Control Center</h2>
            </div>
            
            <div className="flex items-center space-x-4">
                {/* Notification Bell */}
                <button className="text-slate-400 hover:text-slate-600 relative transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                    </svg>
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>
                
                <div className="h-8 w-px bg-slate-200 mx-2"></div>
                
                {/* User Profile Info */}
                <div className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-sm mr-3">
                        {user?.name?.charAt(0) || 'A'}
                    </div>
                    <div className="hidden md:block text-sm">
                        <p className="font-medium text-slate-700 leading-tight">{user?.name}</p>
                        <p className="text-slate-500 text-xs uppercase tracking-wider">
                            {user?.roles?.[0]?.name?.replace('_', ' ')}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}