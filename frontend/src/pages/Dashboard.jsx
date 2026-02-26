import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axios';

// Import our modular components
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axiosClient.get('/api/user')
            .then(({ data }) => {
                setUser(data);
                setLoading(false);
            })
            .catch(() => {
                localStorage.removeItem('ACCESS_TOKEN');
                navigate('/');
            });
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await axiosClient.post('/api/logout');
        } catch(e) { console.error(e); }
        
        localStorage.removeItem('ACCESS_TOKEN');
        navigate('/');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            
            {/* 1. MODULAR SIDEBAR */}
            <Sidebar onLogout={handleLogout} />

            <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
                
                {/* 2. MODULAR HEADER */}
                <Header user={user} />

                {/* 3. MAIN PAGE CONTENT */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name?.split(' ')[0] || 'Admin'}</h1>
                        <p className="text-slate-500 mt-1">Here is what is happening across your clinics today.</p>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {['Total Clinics Actively Managed', 'Registered Patients', 'Pending Appointments'].map((title, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center">
                                <div className={`h-12 w-12 rounded-lg flex items-center justify-center mr-4 ${i===0?'bg-blue-50 text-blue-600':i===1?'bg-emerald-50 text-emerald-600':'bg-amber-50 text-amber-600'}`}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">{title}</p>
                                    <p className="text-2xl font-bold text-slate-800">{[12, 1430, 28][i]}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Additional Dashboard Widgets can go here in the future */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8 p-8 flex items-center justify-center text-slate-400 border-dashed border-2">
                        <p>Additional widgets and data charts will appear here.</p>
                    </div>

                </main>

                {/* 4. MODULAR FOOTER */}
                <Footer />
                
            </div>
        </div>
    );
}