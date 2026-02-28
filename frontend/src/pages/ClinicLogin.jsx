import { useState } from 'react';
import axiosClient from '../axios';

export default function ClinicLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await axiosClient.post('/api/login', { 
                email, 
                password,
                login_type: 'clinic' 
            });
            
            localStorage.setItem('ACCESS_TOKEN', data.token);
            window.location.href = '/clinic-dashboard';

        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
            <div className="max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                
                {/* LEFT SIDE - Doctor Image & Branding */}
                <div className="w-full md:w-1/2 relative hidden md:block">
                    {/* Placeholder image from Unsplash (Doctor with stethoscope) */}
                    <img 
                        src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop" 
                        alt="Doctor" 
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Blue Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-sky-900/95 via-sky-800/60 to-transparent"></div>
                    
                    {/* Text Content */}
                    <div className="absolute bottom-0 left-0 p-10 text-white">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-white/20 backdrop-blur rounded flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            </div>
                            <h2 className="text-xl font-bold tracking-widest uppercase">NexusCare</h2>
                        </div>
                        <p className="text-sm text-sky-100 leading-relaxed max-w-sm">
                            Empowering Healthcare, One Click at a Time: Your Health, Your Records, Your Control.
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white">
                    
                    <div className="flex items-center gap-2 mb-8 md:hidden">
                        <div className="w-8 h-8 bg-sky-600 rounded flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        </div>
                        <h2 className="text-xl font-bold tracking-widest text-sky-900 uppercase">NexusCare</h2>
                    </div>

                    <h2 className="text-3xl font-extrabold text-slate-900 mb-1">Login</h2>
                    <p className="text-sm text-slate-500 mb-8 font-medium">Log in to your clinic account</p>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                            <input 
                                type="email" 
                                required 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    required 
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)} 
                                    className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                                    placeholder="Enter your password"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {showPassword ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                                    )}
                                </button>
                            </div>
                            <div className="flex justify-end mt-2">
                                <a href="#" className="text-xs font-semibold text-sky-600 hover:text-sky-800">Forgot Password?</a>
                            </div>
                        </div>

                        <div className="pt-2 space-y-3">
                            <button type="submit" disabled={loading} className="w-full py-3 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-full text-sm transition-all shadow-md disabled:opacity-70">
                                {loading ? 'Logging in...' : 'Log In'}
                            </button>
                            
                            {/* Dummy Google Button for visual match */}
                            <button type="button" className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-full text-sm transition-all flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                                Log in with Google
                            </button>
                        </div>

                        <div className="text-center text-xs text-slate-500 mt-6">
                            Don't have an account? <a href="#" className="text-sky-600 font-bold hover:underline">Sign Up</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}