import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axios';
import ClinicSidebar from '../components/ClinicSidebar';
import Header from '../components/Header';

export default function PatientRegistration() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Comprehensive Form State mapped from your reference HTML
    const [formData, setFormData] = useState({
        patient_type: 'New',
        old_mrn: '',
        doctor_id: '',
        aadhaar_number: '',
        passport_number: '',
        
        // Personal Info
        honour_name: '',
        patient_full_name: '',
        patient_dob: '',
        patient_age: '',
        patient_sex: '',
        blood_group: '',
        patient_marital_status: '',
        
        // Contact & Location
        mobile_number: '',
        phone_number: '',
        email_id: '',
        nationality: 'IND',
        full_address: '',
        city: '',
        area_landmark: '',
        patient_pincode: '',
        live_in: '',
        
        // Demographics
        patient_profession: '',
        patient_education: '',
        patient_religion: '',
        patient_food_habit: '',
        how_do_you_know: '',
        paitent_parity: '',

        // Spouse Info
        use_spouse: false,
        spouse_type: 'New',
        old_mrn_spouse: '',
        spouse_name: '',
        spouse_dob: '',
        spouse_age: '',
        spouse_phone_number: '',
        spouse_blood_group: '',
        spouse_education: '',
        spouse_occupation: '',
        spouse_religion: '',
        spouse_food_habit: '',
        
        // Guardian (If unmarried/minor)
        father_name: ''
    });

    useEffect(() => {
        axiosClient.get('/api/user')
            .then(({ data }) => setUser(data))
            .catch(() => navigate('/'));
    }, [navigate]);

    // Handle standard input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Auto-select gender based on Honorific
    const handleHonorificChange = (e) => {
        const honour = e.target.value;
        let sex = '';
        if(honour === 'Mr') sex = 'M';
        if(honour === 'Mrs' || honour === 'Miss') sex = 'F';
        
        setFormData(prev => ({
            ...prev,
            honour_name: honour,
            patient_sex: sex
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Hook up to API here in the future
        console.log("Submitting Payload: ", formData);
        alert("Patient payload prepared successfully! Check console.");
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            <ClinicSidebar onLogout={() => { localStorage.removeItem('ACCESS_TOKEN'); navigate('/'); }} clinic={user?.clinic} />
            <div className="flex-1 flex flex-col min-w-0">
                <Header user={user} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">New Patient Registration</h1>
                            <p className="text-slate-500 text-sm mt-1">Register a new patient into {user?.clinic?.name || 'the clinic'} database.</p>
                        </div>
                        <button onClick={() => navigate('/patients')} className="text-slate-500 hover:text-slate-700 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                            Cancel & Back
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 max-w-7xl">
                        
                        {/* SECTION 1: Master Setup */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-sky-600 mb-6 border-b border-slate-100 pb-3">1. Assignment & Identity</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Patient Type <span className="text-red-500">*</span></label>
                                    <select name="patient_type" value={formData.patient_type} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm bg-white">
                                        <option value="New">New Patient</option>
                                        <option value="Old">Old Patient (Transfer)</option>
                                    </select>
                                </div>

                                {formData.patient_type === 'Old' && (
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Old MRN Number <span className="text-red-500">*</span></label>
                                        <input type="text" name="old_mrn" value={formData.old_mrn} onChange={handleChange} required placeholder="Enter Old MRN" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm" />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Assigned Doctor <span className="text-red-500">*</span></label>
                                    <select name="doctor_id" value={formData.doctor_id} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm bg-white">
                                        <option value="">Select Doctor</option>
                                        <option value="1">Dr. Enakshi Paul</option>
                                        <option value="2">Dr. Sagar Dutta</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Aadhaar Number (12 Digits)</label>
                                    <input type="text" maxLength="12" name="aadhaar_number" value={formData.aadhaar_number} onChange={handleChange} placeholder="XXXX XXXX XXXX" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm" />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Passport Number</label>
                                    <input type="text" name="passport_number" value={formData.passport_number} onChange={handleChange} placeholder="Optional" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm" />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: Demographics */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-sky-600 mb-6 border-b border-slate-100 pb-3">2. Patient Demographics</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Title <span className="text-red-500">*</span></label>
                                    <select name="honour_name" value={formData.honour_name} onChange={handleHonorificChange} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm bg-white">
                                        <option value="">Choose</option>
                                        <option value="Mr">Mr.</option>
                                        <option value="Mrs">Mrs.</option>
                                        <option value="Miss">Miss</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                                    <input type="text" name="patient_full_name" value={formData.patient_full_name} onChange={handleChange} required placeholder="John Doe" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Gender <span className="text-red-500">*</span></label>
                                    <select name="patient_sex" value={formData.patient_sex} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm bg-slate-50">
                                        <option value="">Auto-selected</option>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                        <option value="O">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Date of Birth</label>
                                    <input type="date" name="patient_dob" value={formData.patient_dob} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Age <span className="text-red-500">*</span></label>
                                    <input type="number" name="patient_age" value={formData.patient_age} onChange={handleChange} required placeholder="Years" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Blood Group</label>
                                    <select name="blood_group" value={formData.blood_group} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm bg-white">
                                        <option value="">Select</option>
                                        <option value="A+">A+</option><option value="A-">A-</option>
                                        <option value="B+">B+</option><option value="B-">B-</option>
                                        <option value="O+">O+</option><option value="O-">O-</option>
                                        <option value="AB+">AB+</option><option value="AB-">AB-</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Marital Status <span className="text-red-500">*</span></label>
                                    <select name="patient_marital_status" value={formData.patient_marital_status} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm bg-white">
                                        <option value="">Choose</option>
                                        <option value="UM">Unmarried</option>
                                        <option value="M">Married</option>
                                        <option value="D">Divorced</option>
                                        <option value="W">Widowed</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: Contact & Address */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-sky-600 mb-6 border-b border-slate-100 pb-3">3. Contact & Location</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mobile Number <span className="text-red-500">*</span></label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">+91</span>
                                        <input type="text" maxLength="10" name="mobile_number" value={formData.mobile_number} onChange={handleChange} required placeholder="9876543210" className="flex-1 px-4 py-2.5 rounded-r-lg border border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Alternative Number</label>
                                    <input type="text" maxLength="10" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Optional" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                                    <input type="email" name="email_id" value={formData.email_id} onChange={handleChange} placeholder="patient@mail.com" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                <div className="md:col-span-6">
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Address <span className="text-red-500">*</span></label>
                                    <input type="text" name="full_address" value={formData.full_address} onChange={handleChange} required placeholder="123 Street Name, Apartment..." className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">City</label>
                                    <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City Name" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Pincode</label>
                                    <input type="text" name="patient_pincode" value={formData.patient_pincode} onChange={handleChange} placeholder="e.g. 700001" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Live In</label>
                                    <select name="live_in" value={formData.live_in} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm bg-white">
                                        <option value="">Select</option>
                                        <option value="urban">Urban</option>
                                        <option value="rural">Rural</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 4: Spouse Info (Conditional) */}
                        {formData.patient_marital_status === 'M' && (
                            <div className="bg-sky-50/50 p-6 md:p-8 rounded-2xl shadow-sm border border-sky-200">
                                <div className="flex items-center justify-between border-b border-sky-100 pb-3 mb-6">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-sky-700">4. Spouse Information</h3>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" name="use_spouse" checked={formData.use_spouse} onChange={handleChange} className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500" />
                                        <span className="text-sm font-bold text-slate-700">Add Spouse to File</span>
                                    </label>
                                </div>

                                {formData.use_spouse && (
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Spouse Type</label>
                                            <select name="spouse_type" value={formData.spouse_type} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm bg-white">
                                                <option value="New">New Record</option>
                                                <option value="Old">Old MRN</option>
                                            </select>
                                        </div>
                                        {formData.spouse_type === 'Old' && (
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Spouse MRN <span className="text-red-500">*</span></label>
                                                <input type="text" name="old_mrn_spouse" value={formData.old_mrn_spouse} onChange={handleChange} required placeholder="MRN..." className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm" />
                                            </div>
                                        )}
                                        <div className={formData.spouse_type === 'Old' ? 'md:col-span-2' : 'md:col-span-3'}>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Spouse Full Name <span className="text-red-500">*</span></label>
                                            <input type="text" name="spouse_name" value={formData.spouse_name} onChange={handleChange} required placeholder="Jane Doe" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm" />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
                                            <input type="text" maxLength="10" name="spouse_phone_number" value={formData.spouse_phone_number} onChange={handleChange} placeholder="9876543210" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Age <span className="text-red-500">*</span></label>
                                            <input type="number" name="spouse_age" value={formData.spouse_age} onChange={handleChange} required placeholder="Years" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Blood Group</label>
                                            <select name="spouse_blood_group" value={formData.spouse_blood_group} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm bg-white">
                                                <option value="">Select</option>
                                                <option value="A+">A+</option><option value="A-">A-</option>
                                                <option value="B+">B+</option><option value="B-">B-</option>
                                                <option value="O+">O+</option><option value="O-">O-</option>
                                                <option value="AB+">AB+</option><option value="AB-">AB-</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Profession</label>
                                            <select name="spouse_occupation" value={formData.spouse_occupation} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm bg-white">
                                                <option value="">Select</option>
                                                <option value="Teacher">Teacher</option>
                                                <option value="Service">Service</option>
                                                <option value="Business">Business</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Guardian Section (For Unmarried/Minors) */}
                        {formData.patient_marital_status === 'UM' && (
                            <div className="bg-slate-100/50 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 mb-4 border-b border-slate-200 pb-3">Guardian Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Guardian Name <span className="text-red-500">*</span></label>
                                        <input type="text" name="father_name" value={formData.father_name} onChange={handleChange} required placeholder="Father/Mother/Guardian" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer Actions */}
                        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200 mt-8 pb-10">
                            <button type="button" onClick={() => setFormData(prev => ({...prev, patient_full_name: ''}))} className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors">
                                Reset Form
                            </button>
                            <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-md shadow-sky-600/30 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                Save Patient Record
                            </button>
                        </div>
                    </form>

                </main>
            </div>
        </div>
    );
}