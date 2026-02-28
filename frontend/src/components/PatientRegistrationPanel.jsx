import { useState, useEffect } from 'react';

export default function PatientRegistrationPanel({ onClose, onSuccess }) {
    // --- PATIENT FORM STATE ---
    const [formData, setFormData] = useState({
        patient_type: 'New', old_mrn: '', doctor_id: '', aadhaar_number: '', passport_number: '',
        honour_name: '', patient_full_name: '', patient_dob: '', patient_age: '', patient_sex: '',
        blood_group: '', patient_marital_status: '', mobile_number: '', phone_number: '', email_id: '',
        nationality: 'IND', full_address: '', city: '', area_landmark: '', patient_pincode: '', live_in: '',
        patient_profession: '', patient_education: '', patient_religion: '', patient_food_habit: '',
        how_do_you_know: '', paitent_parity: '', use_spouse: false, spouse_type: 'New', old_mrn_spouse: '',
        spouse_name: '', spouse_dob: '', spouse_age: '', spouse_phone_number: '', spouse_blood_group: '',
        spouse_education: '', spouse_occupation: '', spouse_religion: '', spouse_food_habit: '', father_name: ''
    });

    // --- ADD DOCTOR MODAL STATE ---
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);
    const [docData, setDocData] = useState({
        location_id: '', branch_id: '', department_name: '', first_name: '', last_name: '',
        registration_no: '', qualification: '', phone_number: '', address: '', signature: null
    });

    // Dummy lists for dropdowns (To be replaced with DB fetch via useEffect)
    const [locations] = useState([{ id: 1, name: 'Kolkata Main' }, { id: 2, name: 'Delhi Branch' }]);
    const [branches] = useState([{ id: 1, name: 'Saltlake Branch' }, { id: 2, name: 'New Town Branch' }]);
    const [doctors, setDoctors] = useState([{ id: 1, name: 'Dr. Enakshi Paul' }]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleDocChange = (e) => {
        const { name, value, type, files } = e.target;
        setDocData(prev => ({ ...prev, [name]: type === 'file' ? files[0] : value }));
    };

    const handleHonorificChange = (e) => {
        const honour = e.target.value;
        let sex = '';
        if(honour === 'Mr') sex = 'M';
        if(honour === 'Mrs' || honour === 'Miss') sex = 'F';
        setFormData(prev => ({ ...prev, honour_name: honour, patient_sex: sex }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting Patient Payload: ", formData);
        alert("Patient payload prepared successfully! Check console.");
        if (onSuccess) onSuccess();
    };

    const handleDocSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting Doctor Data: ", docData);
        // Simulate adding to DB and updating dropdown
        setDoctors(prev => [...prev, { id: Date.now(), name: `Dr. ${docData.first_name} ${docData.last_name}` }]);
        alert("Doctor Added Successfully!");
        setIsDocModalOpen(false);
        // Reset form
        setDocData({ location_id: '', branch_id: '', department_name: '', first_name: '', last_name: '', registration_no: '', qualification: '', phone_number: '', address: '', signature: null });
    };

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* Panel Header */}
            <div className="bg-white p-5 border-b border-slate-100 flex justify-between items-center shrink-0 shadow-sm z-10 relative">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">New Patient</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Register a new profile</p>
                </div>
                <button type="button" onClick={onClose} className="p-2 bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-10">
                <form id="patient-form" onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* SECTION 1 */}
                    <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-sky-600 mb-4">1. Identity</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Patient Type</label>
                                <select name="patient_type" value={formData.patient_type} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none">
                                    <option value="New">New Patient</option>
                                    <option value="Old">Old Patient</option>
                                </select>
                            </div>
                            
                            {formData.patient_type === 'Old' && (
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Old MRN Number *</label>
                                    <input type="text" name="old_mrn" required className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none" />
                                </div>
                            )}

                            {/* ASSIGNED DOCTOR WITH "ADD" MASTER BUTTON */}
                            <div className={formData.patient_type === 'New' ? "col-span-1" : "col-span-2"}>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-[11px] font-semibold text-slate-600">Assigned Doctor *</label>
                                    <button type="button" onClick={() => setIsDocModalOpen(true)} className="text-[10px] font-bold text-sky-600 hover:text-sky-800 flex items-center bg-sky-50 px-2 py-0.5 rounded">
                                        + Add Master
                                    </button>
                                </div>
                                <select name="doctor_id" value={formData.doctor_id} onChange={handleChange} required className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none">
                                    <option value="">Select Doctor</option>
                                    {doctors.map(doc => (
                                        <option key={doc.id} value={doc.id}>{doc.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="col-span-2">
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Aadhaar Number</label>
                                <input type="text" maxLength="12" placeholder="12 Digits" className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2 */}
                    <div className="border-t border-slate-100 pt-6">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-sky-600 mb-4">2. Demographics</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Title *</label>
                                <select name="honour_name" onChange={handleHonorificChange} required className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none">
                                    <option value="">Choose</option>
                                    <option value="Mr">Mr.</option>
                                    <option value="Mrs">Mrs.</option>
                                    <option value="Miss">Miss</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Gender *</label>
                                <select name="patient_sex" value={formData.patient_sex} onChange={handleChange} required className="w-full p-2.5 rounded-lg border border-slate-200 text-sm bg-slate-50 outline-none">
                                    <option value="">Auto</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                    <option value="O">Other</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Name *</label>
                                <input type="text" name="patient_full_name" required placeholder="John Doe" className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Age *</label>
                                <input type="number" name="patient_age" required placeholder="Years" className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Marital Status *</label>
                                <select name="patient_marital_status" value={formData.patient_marital_status} onChange={handleChange} required className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none">
                                    <option value="">Choose</option>
                                    <option value="UM">Unmarried</option>
                                    <option value="M">Married</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3 */}
                    <div className="border-t border-slate-100 pt-6">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-sky-600 mb-4">3. Contact Info</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mobile Number *</label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-200 text-slate-500 text-sm bg-slate-50">+91</span>
                                    <input type="text" maxLength="10" required className="flex-1 p-2.5 rounded-r-lg border border-slate-200 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none" placeholder="Phone" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Address *</label>
                                <textarea required rows="2" className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none" placeholder="Street, Apartment..."></textarea>
                            </div>
                        </div>
                    </div>

                </form>
            </div>

            {/* Panel Footer */}
            <div className="bg-white p-5 border-t border-slate-100 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] z-10 relative">
                <button type="submit" form="patient-form" className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-sky-600/20 transition-colors flex justify-center items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Save Patient Record
                </button>
            </div>

            {/* ========================================================
                ADD DOCTOR MASTER MODAL (Overlay inside the panel) 
                ======================================================== */}
            {isDocModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden animate-fade-in">
                        
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">Add New Doctor</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Master Database Entry</p>
                            </div>
                            <button type="button" onClick={() => setIsDocModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <form id="doc-form" onSubmit={handleDocSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {/* Location */}
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Select Location *</label>
                                    <select name="location_id" value={docData.location_id} onChange={handleDocChange} required className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none bg-white">
                                        <option value="">-- Choose Location --</option>
                                        {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                                    </select>
                                </div>

                                {/* Branch */}
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Select Branch *</label>
                                    <select name="branch_id" value={docData.branch_id} onChange={handleDocChange} required className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none bg-white">
                                        <option value="">-- Choose Branch --</option>
                                        {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </select>
                                </div>

                                {/* Names */}
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">First Name *</label>
                                    <input type="text" name="first_name" value={docData.first_name} onChange={handleDocChange} required className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Last Name *</label>
                                    <input type="text" name="last_name" value={docData.last_name} onChange={handleDocChange} required className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none" />
                                </div>

                                {/* Department & Reg No */}
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Department Name *</label>
                                    <input type="text" name="department_name" value={docData.department_name} onChange={handleDocChange} required placeholder="e.g. Cardiology" className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Registration No. *</label>
                                    <input type="text" name="registration_no" value={docData.registration_no} onChange={handleDocChange} required placeholder="Medical Reg ID" className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none" />
                                </div>

                                {/* Qual & Phone */}
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Qualification *</label>
                                    <input type="text" name="qualification" value={docData.qualification} onChange={handleDocChange} required placeholder="e.g. MBBS, MD" className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phone Number *</label>
                                    <input type="text" maxLength="10" name="phone_number" value={docData.phone_number} onChange={handleDocChange} required placeholder="10 Digits" className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none" />
                                </div>

                                {/* Address */}
                                <div className="sm:col-span-2">
                                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Address *</label>
                                    <textarea name="address" value={docData.address} onChange={handleDocChange} required rows="2" className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"></textarea>
                                </div>

                                {/* E-Signature */}
                                <div className="sm:col-span-2 bg-slate-50 p-3 rounded-lg border border-dashed border-slate-300">
                                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">E-Signature Upload (Optional)</label>
                                    <input type="file" name="signature" accept="image/*" onChange={handleDocChange} className="w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-sky-100 file:text-sky-700 hover:file:bg-sky-200 transition-colors cursor-pointer" />
                                </div>
                            </div>
                        </form>

                        <div className="p-5 border-t border-slate-100 flex justify-end space-x-3 shrink-0">
                            <button type="button" onClick={() => setIsDocModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors">Cancel</button>
                            <button type="submit" form="doc-form" className="px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm shadow-sm transition-colors flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                Save Doctor
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}