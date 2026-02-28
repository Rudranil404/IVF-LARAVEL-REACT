import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axios';
import ClinicSidebar from '../components/ClinicSidebar';
import Header from '../components/Header';
import PatientRegistrationPanel from '../components/PatientRegistrationPanel';

export default function PatientList() {
    const [user, setUser] = useState(null);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // ⚠️ New state to control the slide-in panel
    const [isRegOpen, setIsRegOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axiosClient.get('/api/user')
            .then(({ data }) => {
                setUser(data);
                fetchPatients();
            })
            .catch(() => navigate('/'));
    }, [navigate]);

    const fetchPatients = async () => {
        try {
            const { data } = await axiosClient.get('/api/patients');
            setPatients(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div></div>;

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            {/* Persistent Sidebar */}
            <ClinicSidebar onLogout={() => { localStorage.removeItem('ACCESS_TOKEN'); navigate('/'); }} clinic={user?.clinic} />
            
            <div className="flex-1 flex flex-col min-w-0">
                <Header user={user} />
                
                {/* ⚠️ MAGIC HAPPENS HERE: The Horizontal Flex Container */}
                <div className="flex-1 flex overflow-hidden">
                    
                    {/* LEFT PANE: Patient Table (Flex-1 ensures it fills all remaining space automatically) */}
                    <main className="flex-1 flex flex-col overflow-hidden p-6 md:p-8">
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 gap-4 shrink-0">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Patient Management</h1>
                                <p className="text-slate-500 text-sm mt-1">View and manage all registered clinic patients.</p>
                            </div>
                            {!isRegOpen && (
                                <button onClick={() => setIsRegOpen(true)} className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center shrink-0 w-max">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                                    Register New Patient
                                </button>
                            )}
                        </div>

                        {/* Search & Filters */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-wrap gap-4 shrink-0">
                            <div className="flex-1 min-w-[200px] relative">
                                <input type="text" placeholder="Search by Name, MRN, or Phone..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm transition-all" />
                                <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
                            <div className="overflow-x-auto overflow-y-auto flex-1">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-bold sticky top-0 z-10">
                                        <tr>
                                            <th className="p-4">MRN</th>
                                            <th className="p-4">Patient Details</th>
                                            <th className="p-4">Assigned Doctor</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {patients.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="p-10 text-center text-slate-500">
                                                    No patients found in database.
                                                </td>
                                            </tr>
                                        ) : patients.map(patient => (
                                            <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-4 font-semibold text-sky-700">{patient.mrn}</td>
                                                <td className="p-4">
                                                    <p className="font-bold text-slate-800">{patient.name}</p>
                                                    <p className="text-xs text-slate-500 mt-0.5">{patient.phone}</p>
                                                </td>
                                                <td className="p-4 text-slate-700 font-medium">{patient.doctor}</td>
                                                <td className="p-4 text-right space-x-3">
                                                    <button className="text-slate-400 hover:text-sky-600 transition-colors font-bold text-[10px] uppercase tracking-wider">View</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>

                    {/* RIGHT PANE: Sliding Registration Form */}
                    <div 
                        className={`transition-all duration-300 ease-in-out shrink-0 bg-white z-20 overflow-hidden
                        ${isRegOpen ? 'w-[400px] xl:w-[480px] border-l border-slate-200 shadow-[-15px_0_20px_-5px_rgba(0,0,0,0.05)]' : 'w-0 border-l-0 shadow-none'}`}
                    >
                        {/* Fixed inner width prevents content wrapping during animation */}
                        <div className="w-[400px] xl:w-[480px] h-full">
                            <PatientRegistrationPanel 
                                onClose={() => setIsRegOpen(false)} 
                                onSuccess={() => {
                                    setIsRegOpen(false);
                                    fetchPatients();
                                }} 
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}