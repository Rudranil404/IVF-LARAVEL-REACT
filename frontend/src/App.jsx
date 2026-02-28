import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClinicLogin from './pages/ClinicLogin';
import SuperAdminLogin from './pages/SuperAdminLogin';
import Dashboard from './pages/Dashboard';
import ClinicManagement from './pages/ClinicManagement';
import ClinicDashboard from './pages/ClinicDashboard';

// ⚠️ NEW IMPORTS
import PatientList from './pages/PatientList';
import PatientRegistration from './pages/PatientRegistration';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClinicLogin />} />
        <Route path="/admin" element={<SuperAdminLogin />} />
        
        {/* Super Admin Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clinics" element={<ClinicManagement />} />
        
        {/* Clinic Admin & Staff Routes */}
        <Route path="/clinic-dashboard" element={<ClinicDashboard />} />
        
        {/* ⚠️ NEW ROUTES */}
        <Route path="/patients" element={<PatientList />} />
        {/* <Route path="/patients/new" element={<PatientRegistration />} /> */}

      </Routes>
    </Router>
  );
}

export default App; 