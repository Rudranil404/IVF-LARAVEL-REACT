import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SuperAdminLogin from './pages/SuperAdminLogin';
import Dashboard from './pages/Dashboard';
import ClinicManagement from './pages/ClinicManagement';

// Route Protection: Kicks user to login if they have no token
function ProtectedRoute({ children }) {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (!token) {
        return <Navigate to="/" replace />;
    }
    return children;
}

// Guest Route: Kicks user to dashboard if they are already logged in
function GuestRoute({ children }) {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 1. Login Page (Guest Only) */}
                <Route 
                    path="/" 
                    element={
                        <GuestRoute>
                            <SuperAdminLogin />
                        </GuestRoute>
                    } 
                />

                {/* 2. Dashboard Page (Logged In Only) */}
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/clinics" 
                    element={
                        <ProtectedRoute>
                            {/* Note: In your actual ClinicManagement.jsx, you will need to wrap the content 
                                in the <Sidebar /> and <Header /> layout just like we did in Dashboard.jsx! */}
                            <ClinicManagement />
                        </ProtectedRoute>
                    } 
                />
                {/* 3. 404 Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;