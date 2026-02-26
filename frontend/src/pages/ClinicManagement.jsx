import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axios';

// Import our modular layout components
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ClinicManagement() {
    // Auth State
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const navigate = useNavigate();

    // Data State
    const [clinics, setClinics] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Initial State Template for Contacts
    const emptyContact = { phone: '', name: '', position: '' };

    // Complex Form State (Removed manual warning dates)
    const [formData, setFormData] = useState({
        // Clinic Profile
        name: '', 
        address: '', 
        logo: null,
        clinic_contacts: [{ ...emptyContact }],
        
        // Admin Profile
        email: '', password: '', password_confirmation: '',
        
        // Subscription
        max_branches: 0, 
        expiry_date: '',
        
        // Branch Creation
        has_branch: false,
        branch_name: '',
        branch_address_1: '',
        branch_address_2: '',
        branch_country: '',
        branch_state: '',
        branch_zip: '',
        branch_contacts: [{ ...emptyContact }]
    });

    useEffect(() => {
        axiosClient.get('/api/user')
            .then(({ data }) => {
                setUser(data);
                setAuthLoading(false);
                fetchClinics();
            })
            .catch(() => {
                localStorage.removeItem('ACCESS_TOKEN');
                navigate('/');
            });
    }, [navigate]);

    const handleLogout = async () => {
        try { await axiosClient.post('/api/logout'); } catch(e) {}
        localStorage.removeItem('ACCESS_TOKEN');
        navigate('/');
    };

    const fetchClinics = async () => {
        try {
            const { data } = await axiosClient.get('/api/clinics');
            setClinics(data);
        } catch (error) {
            console.error("Failed to fetch clinics", error);
        }
    };

    // --- Dynamic Form Handlers ---
    const handleContactChange = (type, index, field, value) => {
        const targetArray = type === 'clinic' ? 'clinic_contacts' : 'branch_contacts';
        const newContacts = [...formData[targetArray]];
        newContacts[index][field] = value;
        setFormData({ ...formData, [targetArray]: newContacts });
    };

    const addContact = (type) => {
        const targetArray = type === 'clinic' ? 'clinic_contacts' : 'branch_contacts';
        setFormData({ ...formData, [targetArray]: [...formData[targetArray], { ...emptyContact }] });
    };

    const removeContact = (type, index) => {
        const targetArray = type === 'clinic' ? 'clinic_contacts' : 'branch_contacts';
        const newContacts = formData[targetArray].filter((_, i) => i !== index);
        setFormData({ ...formData, [targetArray]: newContacts });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = new FormData();
        
        // Ensure the first phone number in your contacts array is sent 
        // as the primary 'phone' field the backend expects.
        if (formData.clinic_contacts.length > 0) {
            payload.append('phone', formData.clinic_contacts[0].phone);
        }

        Object.keys(formData).forEach(key => {
            if (key !== 'clinic_contacts' && key !== 'branch_contacts' && key !== 'logo' && key !== 'phone') {
                payload.append(key, formData[key]);
            }
        });
        
        if(formData.logo) payload.append('logo', formData.logo);
        payload.append('clinic_contacts', JSON.stringify(formData.clinic_contacts));
        if (formData.has_branch) {
            payload.append('branch_contacts', JSON.stringify(formData.branch_contacts));
        }

        try {
            await axiosClient.post('/api/clinics/provision', payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Clinic Provisioned Successfully!');
            setIsModalOpen(false);
            
            // Reset Form Data
            setFormData({
                name: '', address: '', logo: null, clinic_contacts: [{ ...emptyContact }],
                email: '', password: '', password_confirmation: '', max_branches: 0, expiry_date: '',
                has_branch: false, branch_name: '', branch_address_1: '', branch_address_2: '',
                branch_country: '', branch_state: '', branch_zip: '', branch_contacts: [{ ...emptyContact }]
            });
            
            fetchClinics();
        } catch (error) {
            // Detailed Validation Error Alerting
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                const firstErrorMsg = Object.values(errors)[0][0];
                alert(`Validation Error: ${firstErrorMsg}`);
            } else {
                alert(error.response?.data?.message || 'Server Error. Please try again.');
            }
        }
    };

    const handleImpersonate = async (clinicId) => {
        if(!window.confirm("Log in as this clinic's administrator?")) return;
        try {
            const { data } = await axiosClient.post(`/api/clinics/${clinicId}/impersonate`);
            localStorage.setItem('ACCESS_TOKEN', data.access_token);
            window.location.href = '/dashboard'; 
        } catch (e) {
            alert("Impersonation failed. Ensure you have Super Admin privileges.");
        }
    };

    const handleBulkUploadClick = () => {
        alert("Please upload a CSV file with columns: Name, Phone, Email, DOB. Download the template first.");
    };

    if (authLoading) return <div className="flex items-center justify-center min-h-screen bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div></div>;

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            <Sidebar onLogout={handleLogout} />

            <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
                <Header user={user} />

                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    {/* Page Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Clinic Management</h1>
                            <p className="text-slate-500 text-sm mt-1">Manage tenants, branches, and subscriptions.</p>
                        </div>
                        <button onClick={() => setIsModalOpen(true)} className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Provision New Clinic
                        </button>
                    </div>

                    {/* Data Table */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-8">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                        <th className="p-4">Clinic Details</th>
                                        <th className="p-4">Subscription Status</th>
                                        <th className="p-4">Branches</th>
                                        <th className="p-4 text-right">Administrative Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {clinics.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-slate-500">
                                                No clinics provisioned yet. Click "Provision New Clinic" to begin.
                                            </td>
                                        </tr>
                                    ) : clinics.map(clinic => (
                                        <tr key={clinic.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500 font-bold mr-3 overflow-hidden border border-slate-200 shrink-0">
                                                        {clinic.logo_path ? <img src={`http://127.0.0.1:8000/storage/${clinic.logo_path}`} className="w-full h-full object-cover" alt="logo" /> : clinic.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-800">{clinic.name}</p>
                                                        <p className="text-slate-500 text-xs">{clinic.phone} • {clinic.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${clinic.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                    {clinic.is_active ? 'Active' : 'Suspended'}
                                                </span>
                                                <p className="text-xs text-slate-500 mt-1">Exp: {clinic.expiry_date || 'N/A'}</p>
                                            </td>
                                            <td className="p-4 text-slate-600">{clinic.max_branches} Allowed</td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button onClick={() => handleImpersonate(clinic.id)} className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-800 transition-colors shadow-sm" title="Login as this clinic">
                                                        Login As
                                                    </button>
                                                    <button onClick={handleBulkUploadClick} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium rounded hover:bg-emerald-100 transition-colors shadow-sm">
                                                        CSV Upload
                                                    </button>
                                                    <div className="h-4 w-px bg-slate-300 mx-1"></div>
                                                    <button className="text-slate-400 hover:text-sky-600 transition-colors p-1" title="Edit Clinic">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                    </button>
                                                    <button className="text-slate-400 hover:text-amber-600 transition-colors p-1" title="Reset Password">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>

            {/* --- CREATION MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto py-10">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl border border-slate-200 my-auto">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl sticky top-0 z-10">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Provision New Clinic</h2>
                                <p className="text-xs text-slate-500 mt-1">Complete the multi-step profile for the new tenant.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-10 max-h-[75vh] overflow-y-auto">
                            
                            {/* Datalist predefined options for drop down + text fill */}
                            <datalist id="position-options">
                                <option value="Director" />
                                <option value="Manager" />
                                <option value="Head Doctor" />
                                <option value="Receptionist" />
                                <option value="Billing Admin" />
                            </datalist>

                            {/* SECTION 1: CLINIC PROFILE */}
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-sky-600 mb-4 border-b border-slate-100 pb-2">1. Master Clinic Profile</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Clinic Name</label>
                                        <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:border-sky-500 text-sm outline-none transition-all" />
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded-lg border border-dashed border-slate-300">
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Clinic Logo</label>
                                        <input type="file" accept="image/*" onChange={e => setFormData({ ...formData, logo: e.target.files[0] })} className="w-full text-sm text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-sky-100 file:text-sky-700" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">HQ Address</label>
                                        <textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:border-sky-500 text-sm outline-none transition-all"></textarea>
                                    </div>
                                </div>

                                {/* Dynamic Clinic Contacts */}
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="block text-xs font-bold text-slate-700">Clinic Phone Numbers & Contacts</label>
                                        <button type="button" onClick={() => addContact('clinic')} className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center">
                                            + Add Another Contact
                                        </button>
                                    </div>
                                    {formData.clinic_contacts.map((contact, idx) => (
                                        <div key={idx} className="flex flex-wrap gap-3 mb-3 items-end bg-white p-3 rounded border border-slate-100 shadow-sm">
                                            <div className="flex-1 min-w-[150px]">
                                                <label className="block text-[10px] uppercase text-slate-500 mb-1">Phone No.</label>
                                                <input type="text" required value={contact.phone} onChange={e => handleContactChange('clinic', idx, 'phone', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="+1 234..." />
                                            </div>
                                            <div className="flex-1 min-w-[150px]">
                                                <label className="block text-[10px] uppercase text-slate-500 mb-1">Contact Name</label>
                                                <input type="text" value={contact.name} onChange={e => handleContactChange('clinic', idx, 'name', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="John Doe" />
                                            </div>
                                            <div className="flex-1 min-w-[150px]">
                                                <label className="block text-[10px] uppercase text-slate-500 mb-1">Position / Role</label>
                                                <input list="position-options" value={contact.position} onChange={e => handleContactChange('clinic', idx, 'position', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Type or Select..." />
                                            </div>
                                            {formData.clinic_contacts.length > 1 && (
                                                <button type="button" onClick={() => removeContact('clinic', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* SECTION 2 & 3: ADMIN & SUBSCRIPTION */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <section>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-sky-600 mb-4 border-b border-slate-100 pb-2">2. System Login</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">Login Email ID</label>
                                            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:border-sky-500 text-sm outline-none transition-all" />
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="flex-1">
                                                <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                                                <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:border-sky-500 text-sm outline-none transition-all" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs font-semibold text-slate-600 mb-1">Confirm</label>
                                                <input type="password" required value={formData.password_confirmation} onChange={e => setFormData({...formData, password_confirmation: e.target.value})} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:border-sky-500 text-sm outline-none transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                
                                <section>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-sky-600 mb-4 border-b border-slate-100 pb-2">3. Subscription Rules</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">Max Branches</label>
                                            <input type="number" min="0" value={formData.max_branches} onChange={e => setFormData({...formData, max_branches: e.target.value})} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:border-sky-500 text-sm outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">Expiry Date <span className="text-red-500">*</span></label>
                                            <input type="date" required value={formData.expiry_date} onChange={e => setFormData({...formData, expiry_date: e.target.value})} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:border-sky-500 text-sm outline-none transition-all" />
                                        </div>
                                        <div className="col-span-2 bg-amber-50 p-3 rounded-lg border border-amber-200 mt-2 flex items-start">
                                            <svg className="w-4 h-4 mr-2 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            <p className="text-xs text-amber-700 font-medium">
                                                Automated warning alerts will be sent 3 months and 1 week prior to the selected expiry date.
                                            </p>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* SECTION 4: OPTIONAL BRANCH CONFIGURATION */}
                            <section className="bg-sky-50/50 p-6 rounded-xl border border-sky-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-sky-700">4. Branch Configuration</h3>
                                        <p className="text-xs text-slate-500">Does this clinic have an immediate secondary branch?</p>
                                    </div>
                                    {/* Toggle Switch */}
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={formData.has_branch} onChange={() => setFormData({...formData, has_branch: !formData.has_branch})} />
                                        <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-sky-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                                        <span className="ml-3 text-sm font-semibold text-slate-700">{formData.has_branch ? 'Yes, Configure Branch' : 'No'}</span>
                                    </label>
                                </div>

                                {/* Conditional Branch Form */}
                                {formData.has_branch && (
                                    <div className="mt-6 space-y-5 border-t border-sky-200 pt-5">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">Branch Name</label>
                                            <input type="text" required value={formData.branch_name} onChange={e => setFormData({...formData, branch_name: e.target.value})} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-600 mb-1">Address Line 1 <span className="text-red-500">*</span></label>
                                                <input type="text" required value={formData.branch_address_1} onChange={e => setFormData({...formData, branch_address_1: e.target.value})} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-600 mb-1">Address Line 2</label>
                                                <input type="text" value={formData.branch_address_2} onChange={e => setFormData({...formData, branch_address_2: e.target.value})} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-600 mb-1">Country <span className="text-red-500">*</span></label>
                                                <select required value={formData.branch_country} onChange={e => setFormData({...formData, branch_country: e.target.value})} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm bg-white">
                                                    <option value="">Select Country</option>
                                                    <option value="US">United States</option>
                                                    <option value="IN">India</option>
                                                    <option value="UK">United Kingdom</option>
                                                </select>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="flex-1">
                                                    <label className="block text-xs font-semibold text-slate-600 mb-1">State <span className="text-red-500">*</span></label>
                                                    <select required value={formData.branch_state} onChange={e => setFormData({...formData, branch_state: e.target.value})} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm bg-white">
                                                        <option value="">Select State</option>
                                                        <option value="NY">New York</option>
                                                        <option value="UP">Uttar Pradesh</option>
                                                        <option value="LDN">London</option>
                                                    </select>
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-xs font-semibold text-slate-600 mb-1">ZIP Code <span className="text-red-500">*</span></label>
                                                    <input type="text" required value={formData.branch_zip} onChange={e => setFormData({...formData, branch_zip: e.target.value})} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dynamic Branch Contacts */}
                                        <div className="bg-white p-4 rounded-xl border border-slate-200 mt-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <label className="block text-xs font-bold text-slate-700">Branch Contacts</label>
                                                <button type="button" onClick={() => addContact('branch')} className="text-xs font-semibold text-sky-600 hover:text-sky-800">
                                                    + Add Branch Contact
                                                </button>
                                            </div>
                                            {formData.branch_contacts.map((contact, idx) => (
                                                <div key={idx} className="flex flex-wrap gap-3 mb-3 items-end bg-slate-50 p-3 rounded border border-slate-100">
                                                    <div className="flex-1 min-w-[150px]">
                                                        <label className="block text-[10px] uppercase text-slate-500 mb-1">Phone No.</label>
                                                        <input type="text" required value={contact.phone} onChange={e => handleContactChange('branch', idx, 'phone', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm bg-white" placeholder="+1 234..." />
                                                    </div>
                                                    <div className="flex-1 min-w-[150px]">
                                                        <label className="block text-[10px] uppercase text-slate-500 mb-1">Contact Name</label>
                                                        <input type="text" value={contact.name} onChange={e => handleContactChange('branch', idx, 'name', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm bg-white" placeholder="Jane Smith" />
                                                    </div>
                                                    <div className="flex-1 min-w-[150px]">
                                                        <label className="block text-[10px] uppercase text-slate-500 mb-1">Position / Role</label>
                                                        <input list="position-options" value={contact.position} onChange={e => handleContactChange('branch', idx, 'position', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm bg-white" placeholder="Type or Select..." />
                                                    </div>
                                                    {formData.branch_contacts.length > 1 && (
                                                        <button type="button" onClick={() => removeContact('branch', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Form Actions */}
                            <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-slate-100 flex justify-end space-x-3 z-10">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 rounded-lg bg-sky-600 text-white font-medium text-sm hover:bg-sky-700 transition-colors shadow-sm flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    Save & Provision Environment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}