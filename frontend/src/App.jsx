import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SuperAdminLogin from './pages/SuperAdminLogin';
import Dashboard from './pages/Dashboard';
import ClinicManagement from './pages/ClinicManagement';

// ⚠️ NEW: Import the Clinic-centric dashboard
import ClinicDashboard from './pages/ClinicDashboard';

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
        // Send to default dashboard; the components themselves will handle role-based redirects
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

                {/* 2. SUPER ADMIN: Dashboard Page (Logged In Only) */}
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } 
                />
                
                {/* 3. SUPER ADMIN: Clinic Management */}
                <Route 
                    path="/clinics" 
                    element={
                        <ProtectedRoute>
                            <ClinicManagement />
                        </ProtectedRoute>
                    } 
                />

                {/* 4. CLINIC ADMIN: Operations Dashboard */}
                <Route 
                    path="/clinic-dashboard" 
                    element={
                        <ProtectedRoute>
                            <ClinicDashboard />
                        </ProtectedRoute>
                    } 
                />

                {/* 5. 404 Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;