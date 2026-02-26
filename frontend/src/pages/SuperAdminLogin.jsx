import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axios';

// 1. IMPORT YOUR LOGO HERE
import ProductLogo from '../assets/logo.png'; 

export default function SuperAdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        
        try {
            await axiosClient.get('/sanctum/csrf-cookie');
            const { data } = await axiosClient.post('/api/login', { email, password });
            
            localStorage.setItem('ACCESS_TOKEN', data.access_token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please verify your access.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white font-sans">
            {/* Left Side - Medical Imagery/Branding */}
            <div className="hidden lg:flex lg:w-7/12 relative bg-sky-900">
                <img 
                    src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=2070&auto=format&fit=crop" 
                    alt="IVF Laboratory" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-900/90 to-sky-600/40"></div>
                <div className="relative z-10 flex flex-col justify-end p-12 text-white max-w-2xl">
                    
                    {/* 2. REPLACED TEXT TITLE WITH YOUR LOGO */}
                    <img 
                        src={ProductLogo} 
                        alt="Product Logo" 
                        className="h-20 w-auto mb-6 object-contain drop-shadow-md brightness-0 invert" 
                        // Note: "brightness-0 invert" turns the logo pure white. 
                        // Remove those two classes if your logo already looks good against a dark blue background!
                    />
                    
                    <p className="text-lg font-light leading-relaxed text-sky-100">
                        Advanced Reproductive Technologies & Comprehensive Patient Management System. Empowering clinics to deliver exceptional care.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-5/12 flex items-center justify-center p-8 sm:p-12 bg-slate-50">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        {/* 3. REPLACED SHIELD ICON WITH YOUR LOGO */}
                        <div className="inline-flex items-center justify-center mb-4">
                            <img 
                                src={ProductLogo} 
                                alt="Product Logo" 
                                className="h-16 w-auto object-contain" 
                            />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">System Access</h2>
                        <p className="text-sm text-slate-500 mt-2">Sign in to the Super Admin portal</p>
                    </div>
                    
                    {/* Error Alert */}
                    {error && (
                        <div className="flex items-center p-4 mb-6 text-sm text-red-800 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
                            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">{error}</span>
                        </div>
                    )}
                    
                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                                Corporate Email
                            </label>
                            <input 
                                type="email" 
                                placeholder="admin@lifecareivf.com" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                required 
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                                Security Password
                            </label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••" 
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)} 
                                    required 
                                    className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-sky-600 transition-colors focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                            <line x1="1" y1="1" x2="23" y2="23"></line>
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className={`w-full py-3.5 px-4 mt-2 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Authenticating...' : 'Secure Login'}
                        </button>
                    </form>
                    
                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-400">Restricted Access • Authorized Personnel Only</p>
                        <p className="text-xs text-slate-300 mt-1">© 2026 LifeCare IVF Technologies</p>
                    </div>
                </div>
            </div>
        </div>
    );
}