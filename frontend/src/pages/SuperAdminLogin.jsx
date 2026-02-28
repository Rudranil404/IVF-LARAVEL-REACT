import { useState } from 'react';
import axiosClient from '../axios';

export default function SuperAdminLogin() {
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
                login_type: 'super_admin' 
            });
            
            localStorage.setItem('ACCESS_TOKEN', data.token);
            window.location.href = '/dashboard';

        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                
                {/* LEFT SIDE - Illustration */}
                <div className="w-full md:w-1/2 bg-slate-50 flex items-center justify-center p-8 border-r border-slate-100 hidden md:flex">
                    {/* Using an open-source illustration matching the "working at desk" vibe */}
                    <img 
                        src="https://raw.githubusercontent.com/undrawio/undraw/master/undraw-illustrations/undraw_working_re_ddwy.svg" 
                        alt="Admin Working" 
                        className="w-full max-w-[300px] h-auto opacity-90"
                    />
                </div>

                {/* RIGHT SIDE - Form */}
                <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center bg-white">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-black text-slate-800 tracking-wide">Login</h2>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Input with User Icon inside */}
                        <div className="relative">
                            <input 
                                type="email" 
                                required 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                className="w-full pl-4 pr-10 py-3.5 rounded-lg bg-slate-100 border-transparent text-sm text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder-slate-400"
                                placeholder="super@admin.com"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                            </div>
                        </div>

                        {/* Password Input with Eye Icon inside */}
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                required 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                className="w-full pl-4 pr-10 py-3.5 rounded-lg bg-slate-100 border-transparent text-sm text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder-slate-400"
                                placeholder="••••••••"
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)} 
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                                )}
                            </button>
                        </div>

                        <div className="flex justify-end">
                            <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-800 mt-1">Forgot Password?</a>
                        </div>

                        <div className="pt-4">
                            <button type="submit" disabled={loading} className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full text-sm transition-all shadow-md disabled:opacity-70">
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </div>

                        <div className="text-center text-xs text-slate-500 mt-6 pt-4">
                            Don't have account? Let's <a href="#" className="text-blue-600 font-bold hover:underline">Get Started For Free!</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}