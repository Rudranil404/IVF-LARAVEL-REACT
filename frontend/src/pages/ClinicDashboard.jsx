import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axios';

import ClinicSidebar from '../components/ClinicSidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ClinicDashboard() {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const navigate = useNavigate();

    // Placeholder data until we build the metrics backend
    const [stats] = useState({
        totalPatients: 142,
        todayAppointments: 18,
        pendingBills: 5,
        lowStockItems: 2
    });

    useEffect(() => {
        axiosClient.get('/api/user')
            .then(({ data }) => {
                // Ensure only Clinic Admins/Staff access this
                if (data.roles[0].name === 'super_admin') {
                    navigate('/dashboard'); // Kick Super Admins back to their specific dashboard
                    return;
                }
                setUser(data);
                setAuthLoading(false);
            })
            .catch(() => {
                localStorage.removeItem('ACCESS_TOKEN');
                navigate('/');
            });
    }, [navigate]);

    const handleLogout = async () => {
        try { await axiosClient.post('/api/logout'); } catch (e) {}
        localStorage.removeItem('ACCESS_TOKEN');
        navigate('/');
    };

    if (authLoading) return <div className="flex h-screen items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div></div>;

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            <ClinicSidebar onLogout={handleLogout} clinic={user?.clinic} />

            <div className="flex-1 flex flex-col min-w-0">
                <Header user={user} />

                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    {/* Welcome Banner */}
                    <div className="bg-sky-600 rounded-2xl p-8 mb-8 text-white shadow-lg flex justify-between items-center relative overflow-hidden">
                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
                            <p className="text-sky-100">Here is what is happening at {user?.clinic?.name} today.</p>
                        </div>
                        {/* Decorative background circles */}
                        <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                        <div className="absolute right-10 bottom-0 w-32 h-32 bg-white opacity-10 rounded-full translate-y-1/2"></div>
                    </div>

                    {/* Key Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Metric 1 */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center">
                            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Total Patients</p>
                                <p className="text-2xl font-bold text-slate-800">{stats.totalPatients}</p>
                            </div>
                        </div>

                        {/* Metric 2 */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center">
                            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mr-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Today's Appointments</p>
                                <p className="text-2xl font-bold text-slate-800">{stats.todayAppointments}</p>
                            </div>
                        </div>

                        {/* Metric 3 */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center">
                            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mr-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"></path></svg>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Pending Bills</p>
                                <p className="text-2xl font-bold text-slate-800">{stats.pendingBills}</p>
                            </div>
                        </div>

                        {/* Metric 4 */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center">
                            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mr-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Low Stock Alerts</p>
                                <p className="text-2xl font-bold text-slate-800">{stats.lowStockItems}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions / Activity Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">Today's Schedule</h2>
                            <p className="text-sm text-slate-500 text-center py-10 border-2 border-dashed border-slate-200 rounded-lg">No appointments logged yet.</p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-sky-500 hover:bg-sky-50 transition-colors text-left group">
                                    <span className="text-sm font-medium text-slate-700 group-hover:text-sky-700">Register New Patient</span>
                                    <svg className="w-4 h-4 text-slate-400 group-hover:text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </button>
                                <button className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-sky-500 hover:bg-sky-50 transition-colors text-left group">
                                    <span className="text-sm font-medium text-slate-700 group-hover:text-sky-700">Book Appointment</span>
                                    <svg className="w-4 h-4 text-slate-400 group-hover:text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </button>
                                <button className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-sky-500 hover:bg-sky-50 transition-colors text-left group">
                                    <span className="text-sm font-medium text-slate-700 group-hover:text-sky-700">Generate Invoice</span>
                                    <svg className="w-4 h-4 text-slate-400 group-hover:text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}