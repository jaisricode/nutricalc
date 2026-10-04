import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Eye, 
  Edit3, 
  Trash2, 
  UserPlus, 
  FileSpreadsheet, 
  ChevronLeft, 
  ChevronRight,
  Database,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api.js';
import { useAssessment } from '../context/AssessmentContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import ClinicalBadge from '../components/ClinicalBadge.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import PatientDetailModal from './PatientDetailModal.jsx';

export default function PatientRecords() {
  const navigate = useNavigate();
  const { loadExistingRecord, resetAssessment } = useAssessment();
  const { success, error } = useToast();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [toolFilter, setToolFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modals
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await api.getAllPatients({
        search,
        tool: toolFilter,
        gender: genderFilter,
        sortBy,
        sortOrder,
        page: currentPage,
        limit: 15
      });

      if (res.success) {
        setPatients(res.data);
        setTotalRecords(res.total);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      error(`Failed to load patient records: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [currentPage, toolFilter, genderFilter, sortBy, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPatients();
  };

  const handleView = (patient) => {
    setSelectedPatient(patient);
    setViewModalOpen(true);
  };

  const handleEdit = (patient) => {
    loadExistingRecord(patient);
    success(`Loaded ${patient.patientDetails.name}'s assessment into active workspace.`);
    navigate('/register');
  };

  const handleDeletePrompt = (patient) => {
    setPatientToDelete(patient);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!patientToDelete) return;
    try {
      const res = await api.deletePatient(patientToDelete._id);
      if (res.success) {
        success('Patient record deleted successfully.');
        setDeleteModalOpen(false);
        setPatientToDelete(null);
        fetchPatients();
      }
    } catch (err) {
      error(`Delete failed: ${err.message}`);
    }
  };

  const handleNewPatient = () => {
    resetAssessment();
    navigate('/register');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
              Patient Records & History
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {totalRecords} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse, search, audit, and manage clinical patient assessment documents stored in MongoDB Atlas.
          </p>
        </div>

        <button
          onClick={handleNewPatient}
          className="clinical-btn-primary text-xs py-2.5 px-4"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ New Assessment</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-clinical space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, IP no, district, state..."
              className="clinical-input pl-9 text-xs"
            />
          </form>

          {/* Screening Tool Filter */}
          <div>
            <select
              value={toolFilter}
              onChange={(e) => {
                setToolFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="clinical-select text-xs"
            >
              <option value="all">All Screening Tools</option>
              <option value="GLIM">GLIM</option>
              <option value="SGA">SGA</option>
              <option value="MNA">MNA</option>
              <option value="MUST">MUST</option>
            </select>
          </div>

          {/* Gender Filter */}
          <div>
            <select
              value={genderFilter}
              onChange={(e) => {
                setGenderFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="clinical-select text-xs"
            >
              <option value="all">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
                setCurrentPage(1);
              }}
              className="clinical-select text-xs"
            >
              <option value="createdAt-desc">Date (Newest First)</option>
              <option value="createdAt-asc">Date (Oldest First)</option>
              <option value="patientDetails.name-asc">Name (A – Z)</option>
              <option value="formulas.tee-desc">TEE (Highest First)</option>
              <option value="formulas.bmi-desc">BMI (Highest First)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Patient Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-clinical overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm animate-pulse">
            Querying clinical database repository...
          </div>
        ) : patients.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No Patient Records Match Criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search terms or filters, or register a new clinical patient assessment.
            </p>
            <button onClick={handleNewPatient} className="clinical-btn-primary text-xs py-2 px-4 mt-2">
              <UserPlus className="w-4 h-4" />
              <span>Create New Assessment</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Patient Name</th>
                  <th className="px-4 py-3.5">IP Number</th>
                  <th className="px-4 py-3.5">Age / Gender</th>
                  <th className="px-4 py-3.5">Screening Tool</th>
                  <th className="px-4 py-3.5">Screening Result</th>
                  <th className="px-4 py-3.5">BMI</th>
                  <th className="px-4 py-3.5">BMR</th>
                  <th className="px-4 py-3.5">TEE</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {patients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">{patient.patientDetails.name}</div>
                      <div className="text-[11px] text-slate-400">{patient.patientDetails.district}, {patient.patientDetails.state}</div>
                    </td>

                    {/* IP */}
                    <td className="px-4 py-4 font-mono text-slate-600">
                      {patient.patientDetails.ipNo || '—'}
                    </td>

                    {/* Age / Gender */}
                    <td className="px-4 py-4">
                      {patient.patientDetails.age}y / {patient.patientDetails.gender}
                    </td>

                    {/* Tool */}
                    <td className="px-4 py-4">
                      {patient.screening?.tool ? (
                        <span className="font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                          {patient.screening.tool}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Direct Formulas</span>
                      )}
                    </td>

                    {/* Result Badge */}
                    <td className="px-4 py-4">
                      {patient.screening?.result?.classification ? (
                        <ClinicalBadge
                          classification={patient.screening.result.classification}
                          severity={patient.screening.result.severity}
                          size="sm"
                        />
                      ) : (
                        <span className="text-slate-400 italic">Not Screened</span>
                      )}
                    </td>

                    {/* BMI */}
                    <td className="px-4 py-4 font-mono">
                      {patient.formulas?.bmi ? `${patient.formulas.bmi} kg/m²` : '—'}
                    </td>

                    {/* BMR */}
                    <td className="px-4 py-4 font-mono">
                      {patient.formulas?.bmr ? `${patient.formulas.bmr} kcal` : '—'}
                    </td>

                    {/* TEE */}
                    <td className="px-4 py-4 font-mono font-bold text-slate-900">
                      {patient.formulas?.tee ? `${patient.formulas.tee} kcal/d` : '—'}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-slate-400 whitespace-nowrap">
                      {new Date(patient.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleView(patient)}
                          className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors"
                          title="View Full Record"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(patient)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Edit & Recalculate"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePrompt(patient)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({totalRecords} records)
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="clinical-btn-secondary py-1 px-3 text-xs disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="clinical-btn-secondary py-1 px-3 text-xs disabled:opacity-40"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Patient Detail Modal */}
      <PatientDetailModal
        patient={selectedPatient}
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedPatient(null);
        }}
        onEdit={handleEdit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Patient Record?"
        message={`Are you sure you want to permanently delete the clinical record for "${patientToDelete?.patientDetails?.name}"? This action cannot be undone.`}
        confirmText="Delete Record"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setPatientToDelete(null);
        }}
      />

    </div>
  );
}
