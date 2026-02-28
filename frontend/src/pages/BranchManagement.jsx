import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axios';
import ClinicSidebar from '../components/ClinicSidebar';
import Header from '../components/Header';
import { Country, State } from 'country-state-city';

// --- Searchable Select Component ---
const SearchableSelect = ({ options, value, onChange, placeholder, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);
    const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()));

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearch('');
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                className={`w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm flex justify-between items-center transition-colors 
                ${disabled ? 'bg-slate-50 opacity-60 cursor-not-allowed' : 'bg-white cursor-pointer hover:border-indigo-400 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500'}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span className={`truncate ${selectedOption ? 'text-slate-900' : 'text-slate-400'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
            {isOpen && !disabled && (
                <div className="absolute z-[100] w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-64 flex flex-col overflow-hidden animate-fade-in">
                    <div className="p-2 border-b border-slate-100 bg-slate-50 shrink-0">
                        <div className="relative">
                            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            <input type="text" className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-md text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
                        </div>
                    </div>
                    <ul className="overflow-y-auto flex-1 p-1">
                        {filteredOptions.length === 0 ? (
                            <li className="px-3 py-4 text-sm text-slate-500 text-center">No results found</li>
                        ) : (
                            filteredOptions.map(opt => (
                                <li key={opt.value} className={`px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${value === opt.value ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`} onClick={() => { onChange(opt.value); setIsOpen(false); setSearch(''); }}>
                                    {opt.label}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default function BranchManagement() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [branches, setBranches] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedBranchId, setSelectedBranchId] = useState(null);

    const emptyContact = { phone: '', name: '', position: '' };
    const initialFormState = { branch_name: '', branch_address_1: '', branch_address_2: '', branch_country: '', branch_state: '', branch_zip: '', branch_contacts: [{ ...emptyContact }] };
    const [formData, setFormData] = useState(initialFormState);

    const countryOptions = Country.getAllCountries().map(c => ({ value: c.isoCode, label: c.name }));
    const stateOptions = formData.branch_country ? State.getStatesOfCountry(formData.branch_country).map(s => ({ value: s.isoCode, label: s.name })) : [];

    useEffect(() => {
        axiosClient.get('/api/user')
            .then(({ data }) => { setUser(data); fetchBranches(); })
            .catch(() => navigate('/'));
    }, [navigate]);

    const fetchBranches = async () => {
        try {
            const { data } = await axiosClient.get('/api/branches');
            setBranches(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch branches", error);
            setLoading(false);
        }
    };

    // Form Handlers
    const handleCreateClick = () => { setFormData(initialFormState); setIsEditMode(false); setIsModalOpen(true); };
    const handleEditClick = (branch) => {
        setFormData({
            branch_name: branch.branch_name || '', branch_address_1: branch.branch_address_1 || '', branch_address_2: branch.branch_address_2 || '',
            branch_country: branch.branch_country || '', branch_state: branch.branch_state || '', branch_zip: branch.branch_zip || '',
            branch_contacts: branch.branch_contacts && branch.branch_contacts.length > 0 ? branch.branch_contacts : [{ ...emptyContact }]
        });
        setSelectedBranchId(branch.id);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const handleContactChange = (index, field, value) => {
        const newContacts = [...formData.branch_contacts];
        newContacts[index][field] = value;
        setFormData({ ...formData, branch_contacts: newContacts });
    };
    const addContact = () => setFormData({ ...formData, branch_contacts: [...formData.branch_contacts, { ...emptyContact }] });
    const removeContact = (index) => setFormData({ ...formData, branch_contacts: formData.branch_contacts.filter((_, i) => i !== index) });

    // API Actions
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = isEditMode ? `/api/branches/${selectedBranchId}` : '/api/branches';
            const method = isEditMode ? 'put' : 'post';
            await axiosClient[method](url, formData);
            alert(isEditMode ? 'Branch updated successfully!' : 'Branch created successfully!');
            setIsModalOpen(false);
            fetchBranches();
        } catch (error) { alert(error.response?.data?.message || "Operation failed."); }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        if(!window.confirm(`Are you sure you want to ${currentStatus ? 'suspend' : 'activate'} this branch?`)) return;
        try {
            await axiosClient.patch(`/api/branches/${id}/toggle-status`);
            fetchBranches();
        } catch (err) { alert("Failed to change status."); }
    };

    const handleDelete = async (id) => {
        if(!window.confirm("Are you sure you want to permanently delete this branch?")) return;
        try {
            await axiosClient.delete(`/api/branches/${id}`);
            fetchBranches();
        } catch (err) { alert("Failed to delete branch."); }
    };

    // Derived Metrics
    const totalBranches = branches.length;
    const activeBranches = branches.filter(b => b.is_active !== false).length;
    const suspendedBranches = totalBranches - activeBranches;
    const filteredBranches = branches.filter(b => b.branch_name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) return <div className="flex h-screen items-center justify-center bg-[#f8f9fa]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="flex h-screen bg-[#f8f9fa] font-sans overflow-hidden">
            <ClinicSidebar onLogout={() => { localStorage.removeItem('ACCESS_TOKEN'); navigate('/'); }} clinic={user?.clinic} />

            <div className="flex-1 flex flex-col min-w-0">
                <Header user={user} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    
                    {/* Top Header Row matching Image */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Overview</h1>
                            <p className="text-slate-500 text-sm mt-0.5">Manage your hospital networks and branches.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                <input type="text" placeholder="Search branches..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-64 pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm shadow-sm" />
                            </div>
                            <button onClick={handleCreateClick} className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center shrink-0">
                                + Add Branch
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards matching Image */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex justify-between items-center">
                            <div>
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Total Branches</p>
                                <h3 className="text-3xl font-black text-slate-800">{totalBranches}</h3>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex justify-between items-center">
                            <div>
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Active Branches</p>
                                <h3 className="text-3xl font-black text-emerald-600">{activeBranches}</h3>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex justify-between items-center">
                            <div>
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Suspended</p>
                                <h3 className="text-3xl font-black text-rose-600">{suspendedBranches}</h3>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            </div>
                        </div>
                    </div>

                    {/* Complex Table matching Image */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-10">
                        {/* Table Header */}
                        <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <div className="col-span-3">Location & Branch</div>
                            <div className="col-span-4">Details</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-3 text-right">Actions</div>
                        </div>

                        {/* Clinic "Organization" Master Row */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between px-6 py-5 bg-white border-b border-slate-200 gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-base">{user?.clinic?.name || 'My Clinic'}</h3>
                                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Organization Group</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <button className="px-3 py-1.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-semibold hover:bg-indigo-100 transition-colors">View Admins</button>
                                <button className="px-3 py-1.5 rounded bg-orange-50 text-orange-600 border border-orange-100 text-xs font-semibold hover:bg-orange-100 transition-colors">Edit Settings</button>
                                <button onClick={handleCreateClick} className="px-4 py-1.5 rounded bg-[#4f46e5] text-white text-xs font-semibold shadow-sm hover:bg-[#4338ca] transition-colors flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                    Add Branch
                                </button>
                            </div>
                        </div>

                        {/* Child Rows (Branches) */}
                        <div className="divide-y divide-slate-100">
                            {filteredBranches.length === 0 ? (
                                <div className="p-10 text-center text-slate-500 text-sm">No branches found.</div>
                            ) : filteredBranches.map((branch) => {
                                const contact = branch.branch_contacts?.[0];
                                const isActive = branch.is_active !== false;

                                return (
                                    <div key={branch.id} className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center px-6 py-5 bg-white hover:bg-slate-50 transition-colors group">
                                        
                                        {/* Location */}
                                        <div className="col-span-3 flex items-start gap-3">
                                            <svg className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                            <div>
                                                <p className="font-bold text-slate-700 text-sm">{branch.branch_name}</p>
                                                <p className="text-[11px] text-slate-400 uppercase font-medium mt-0.5">{branch.branch_state}, {branch.branch_country}</p>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="col-span-4">
                                            <p className="text-sm font-bold text-slate-800">
                                                {contact?.name || 'No Manager Assigned'} 
                                                {contact?.position && <span className="ml-2 text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-semibold">{contact.position}</span>}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                                                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                                {contact?.phone || 'No phone provided'}
                                            </p>
                                        </div>

                                        {/* Status */}
                                        <div className="col-span-2 flex items-center">
                                            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                                {isActive ? 'Active' : 'Suspended'}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-3 flex justify-start lg:justify-end gap-2">
                                            <button onClick={() => handleEditClick(branch)} title="Edit" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                            </button>
                                            <button onClick={() => handleToggleStatus(branch.id, isActive)} title={isActive ? "Suspend" : "Activate"} className={`p-2 rounded-lg transition-colors ${isActive ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' : 'text-amber-500 bg-amber-50 hover:bg-amber-100'}`}>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            </button>
                                            <button onClick={() => handleDelete(branch.id)} title="Delete" className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal Form remains exactly the same logic, omitted here for brevity to keep snippet clean. Keep your existing modal code starting at: {isModalOpen && ( ... */}
            
            {/* --- CREATE / EDIT MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[95vh] overflow-hidden animate-fade-in">
                        
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">{isEditMode ? 'Edit Branch' : 'Add New Branch'}</h2>
                                <p className="text-xs text-slate-500 mt-1">Configure location and contact details.</p>
                            </div>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <form id="branch-form" onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                            <div className="p-6 md:p-8 space-y-8 flex-1 overflow-y-auto pb-12 custom-scrollbar">
                                
                                <datalist id="position-options">
                                    <option value="Branch Manager" />
                                    <option value="Head Doctor" />
                                    <option value="Receptionist" />
                                </datalist>

                                <section>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-4 border-b border-slate-100 pb-2">1. Location Details</h3>
                                    
                                    <div className="mb-4">
                                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Branch Name *</label>
                                        <input type="text" required value={formData.branch_name} onChange={e => setFormData({...formData, branch_name: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Address Line 1 *</label>
                                            <input type="text" required value={formData.branch_address_1} onChange={e => setFormData({...formData, branch_address_1: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Address Line 2</label>
                                            <input type="text" value={formData.branch_address_2} onChange={e => setFormData({...formData, branch_address_2: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm" />
                                        </div>
                                        
                                        <div className="relative">
                                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Country *</label>
                                            <SearchableSelect 
                                                options={countryOptions}
                                                value={formData.branch_country}
                                                placeholder="Search Country..."
                                                onChange={(val) => setFormData({ ...formData, branch_country: val, branch_state: '' })}
                                            />
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="flex-1 relative">
                                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">State *</label>
                                                <SearchableSelect 
                                                    options={stateOptions}
                                                    value={formData.branch_state}
                                                    placeholder="Search State..."
                                                    disabled={!formData.branch_country}
                                                    onChange={(val) => setFormData({ ...formData, branch_state: val })}
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">ZIP Code *</label>
                                                <input type="text" required value={formData.branch_zip} onChange={e => setFormData({...formData, branch_zip: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm" />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600">2. Branch Contacts</h3>
                                        <button type="button" onClick={addContact} className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded transition-colors">
                                            + Add Person
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {formData.branch_contacts.map((contact, idx) => (
                                            <div key={idx} className="flex flex-wrap md:flex-nowrap gap-3 items-start bg-slate-50 p-4 rounded-xl border border-slate-200">
                                                <div className="flex-1 min-w-[150px]">
                                                    <label className="block text-[10px] uppercase text-slate-500 mb-1 font-bold">Phone No.</label>
                                                    <input type="text" required value={contact.phone} onChange={e => handleContactChange(idx, 'phone', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="+91..." />
                                                </div>
                                                <div className="flex-1 min-w-[150px]">
                                                    <label className="block text-[10px] uppercase text-slate-500 mb-1 font-bold">Name</label>
                                                    <input type="text" value={contact.name} onChange={e => handleContactChange(idx, 'name', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="John Doe" />
                                                </div>
                                                <div className="flex-1 min-w-[150px]">
                                                    <label className="block text-[10px] uppercase text-slate-500 mb-1 font-bold">Role</label>
                                                    <input list="position-options" value={contact.position} onChange={e => handleContactChange(idx, 'position', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="Manager..." />
                                                </div>
                                                {formData.branch_contacts.length > 1 && (
                                                    <button type="button" onClick={() => removeContact(idx)} className="mt-5 p-2 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="p-5 border-t border-slate-100 flex justify-end space-x-3 bg-white shrink-0">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 rounded-lg bg-[#4f46e5] hover:bg-[#4338ca] text-white font-medium text-sm shadow-sm transition-colors flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    {isEditMode ? 'Update Branch' : 'Save Branch'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}