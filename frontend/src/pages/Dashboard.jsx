import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axios';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', clinic_id: 1 });
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user data on load
        axiosClient.get('/api/user')
            .then(({ data }) => {
                setUser(data);
                setLoading(false);
            })
            .catch(() => {
                // If unauthorized or token expired, kick to login
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

    const handleCreateClinicAdmin = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/api/users/clinic-admin', newAdmin);
            alert("Clinic Admin Created Successfully!");
            setNewAdmin({ name: '', email: '', password: '', clinic_id: 1 });
        } catch (err) {
            alert("Error: " + (err.response?.data?.message || 'Failed'));
        }
    };

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading System...</div>;

    const isSuperAdmin = user?.roles?.some(role => role.name === 'super_admin');

    return (
        <div style={{ padding: '20px', fontFamily: 'system-ui', maxWidth: '1200px', margin: 'auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>
                <h1 style={{ margin: 0 }}>🏥 IVF System Dashboard</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span>Welcome, <strong>{user?.name}</strong></span>
                    <button onClick={handleLogout} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>
                        Logout
                    </button>
                </div>
            </header>

            {isSuperAdmin && (
                <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #007bff', borderRadius: '8px', background: '#f8fbff' }}>
                    <h2>👑 Super Admin Panel: Create Clinic Admin</h2>
                    <form onSubmit={handleCreateClinicAdmin} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
                        <input type="text" placeholder="Admin Name" value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} required style={{ padding: '8px' }} />
                        <input type="email" placeholder="Admin Email" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} required style={{ padding: '8px' }} />
                        <input type="password" placeholder="Temporary Password" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} required style={{ padding: '8px' }} />
                        <input type="number" placeholder="Clinic ID" value={newAdmin.clinic_id} onChange={e => setNewAdmin({...newAdmin, clinic_id: e.target.value})} required style={{ padding: '8px', width: '100px' }} />
                        <button type="submit" style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>Create User</button>
                    </form>
                </div>
            )}
        </div>
    );
}