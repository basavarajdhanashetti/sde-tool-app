import React, { useState, useEffect } from 'react';
import { X, Save, Calendar } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import EmployeeTable from '../components/EmployeeTable';
import UploadForm from '../components/UploadForm';
import { useAuth } from '../hooks/useAuth';
import { useSearchParams } from 'react-router-dom';
import api from '../api/api';

const AdminPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('employees');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize tab from URL params
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl === 'upload') {
      setActiveTab('upload');
    } else {
      setActiveTab('employees');
    }
  }, [searchParams]);

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Update URL without causing navigation
    if (tab === 'upload') {
      setSearchParams({ tab: 'upload' });
    } else {
      setSearchParams({});
    }
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setEditForm({
      name: employee.name || '',
      current_department: employee.current_department || '',
      role: employee.role || '',
      current_project: employee.current_project || '',
      phone: employee.phone || '',
      address: employee.address || '',
      skills: employee.skills || '',
      date_of_joining: employee.date_of_joining ? new Date(employee.date_of_joining).toISOString().split('T')[0] : ''
    });
    setShowEditModal(true);
    setError(null);
  };

  // Add these new functions
  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEmployee = async () => {
    if (!selectedEmployee) return;

    try {
      setLoading(true);
      setError(null);

      // Convert date back to ISO format if provided
      const updateData = {
        ...editForm,
        date_of_joining: editForm.date_of_joining ? new Date(editForm.date_of_joining).toISOString() : undefined
      };

      await api.updateEmployee(selectedEmployee.id, updateData);

      setShowEditModal(false);
      setSelectedEmployee(null);
      refreshData();
    } catch (err) {
      setError(err.message || 'Failed to update employee');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedEmployee(null);
    setEditForm({});
    setError(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onTabChange={handleTabChange} />

      <div className="flex-1 p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome, {user?.email} | Manage employee records and data
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => handleTabChange('employees')}
              className={`py-3 px-1 ${activeTab === 'employees' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Employees
            </button>
            <button
              onClick={() => handleTabChange('upload')}
              className={`py-3 px-1 ${activeTab === 'upload' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Upload Data
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'employees' ? (
            <EmployeeTable
              refreshTrigger={refreshTrigger}
              onEmployeeSelect={handleEmployeeSelect}
            />
          ) : (
            <UploadForm onUploadSuccess={refreshData} />
          )}
        </div>
      </div>

      {/* Add this entire Edit Employee Modal section */}
      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Edit Employee: {selectedEmployee.name}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={editForm.current_department}
                    onChange={(e) => handleInputChange('current_department', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    value={editForm.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Project
                  </label>
                  <input
                    type="text"
                    value={editForm.current_project}
                    onChange={(e) => handleInputChange('current_project', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="inline mr-1" size={16} />
                    Date of Joining
                  </label>
                  <input
                    type="date"
                    value={editForm.date_of_joining}
                    onChange={(e) => handleInputChange('date_of_joining', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    value={editForm.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills
                  </label>
                  <textarea
                    value={editForm.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    rows={2}
                    placeholder="e.g., JavaScript, React, Node.js"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEmployee}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2" size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPage;