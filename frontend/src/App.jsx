import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClinicLogin from './pages/ClinicLogin';
import SuperAdminLogin from './pages/SuperAdminLogin';
import Dashboard from './pages/Dashboard';
import ClinicManagement from './pages/ClinicManagement';
import ClinicDashboard from './pages/ClinicDashboard';
import PatientList from './pages/PatientList';

// ⚠️ NEW: Import the Branch Management page
import BranchManagement from './pages/BranchManagement'; 

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
        
        // ⚠️ NEW: Branch Route
        <Route path="/clinic-branches" element={<BranchManagement />} />
        
        <Route path="/patients" element={<PatientList />} />
      </Routes>
    </Router>
  );
}

export default App;