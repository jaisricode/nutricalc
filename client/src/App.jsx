import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AssessmentProvider } from './context/AssessmentContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';

// Components
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Stepper from './components/Stepper.jsx';

// Pages
import Dashboard from './pages/Dashboard.jsx';
import PatientRegistration from './pages/PatientRegistration.jsx';
import ToolSelection from './pages/ToolSelection.jsx';
import GLIMAssessment from './pages/GLIMAssessment.jsx';
import SGAAssessment from './pages/SGAAssessment.jsx';
import MNAAssessment from './pages/MNAAssessment.jsx';
import MUSTAssessment from './pages/MUSTAssessment.jsx';
import ScreeningResult from './pages/ScreeningResult.jsx';
import FormulasPage from './pages/FormulasPage.jsx';
import FinalResult from './pages/FinalResult.jsx';
import PatientRecords from './pages/PatientRecords.jsx';
import About from './pages/About.jsx';

export default function App() {
  return (
    <ToastProvider>
      <AssessmentProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            <Navbar />
            <Stepper />

            <main className="flex-1">
              <Routes>
                {/* 1. Dashboard */}
                <Route path="/" element={<Dashboard />} />

                {/* 2. Patient Registration */}
                <Route path="/register" element={<PatientRegistration />} />

                {/* 3. Screening Tool Selection */}
                <Route path="/select-tool" element={<ToolSelection />} />

                {/* 4–7. Individual Assessment Pages */}
                <Route path="/assessment/glim" element={<GLIMAssessment />} />
                <Route path="/assessment/sga" element={<SGAAssessment />} />
                <Route path="/assessment/mna" element={<MNAAssessment />} />
                <Route path="/assessment/must" element={<MUSTAssessment />} />

                {/* 8. Screening Result */}
                <Route path="/screening-result" element={<ScreeningResult />} />

                {/* 9. Formula Calculator & TEE */}
                <Route path="/formulas" element={<FormulasPage />} />

                {/* 10. Final Clinical Report */}
                <Route path="/final-result" element={<FinalResult />} />

                {/* 11. Patient Records Registry */}
                <Route path="/patients" element={<PatientRecords />} />

                {/* 12. About & Guidelines Reference */}
                <Route path="/about" element={<About />} />

                {/* Catch-all redirect to Dashboard */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </AssessmentProvider>
    </ToastProvider>
  );
}
