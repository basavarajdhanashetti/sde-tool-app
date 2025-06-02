import React, { useState, useEffect } from 'react';
import { User, Briefcase, RefreshCw } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ProfileCard from '../components/ProfileCard';
import { useAuth } from '../hooks/useAuth';
import api from '../api/api';

const EmployeePage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  // Handle tab changes from sidebar
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Check URL parameters for initial tab
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam === 'projects') {
      setActiveTab('projects');
    }
  }, [location.search]);

  // Fetch employee profile and projects
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [profileData, projectData] = await Promise.all([
        api.getMyProfile(),
        api.getMyProjects()
      ]);

      setProfile(profileData);
      setProjects(projectData);
    } catch (err) {
      console.error('Error fetching employee data:', err);
      // Display a more user-friendly error message
      if (err.message.includes('profile not found') || err.message.includes('404')) {
        setError('Your employee profile is not set up yet. Please contact an administrator.');
      } else {
        setError('Failed to load data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle profile updates
  const handleUpdateProfile = async (updatedData) => {
    try {
      const updatedProfile = await api.updateMyProfile(updatedData);
      setProfile(updatedProfile);
      return true;
    } catch (err) {
      alert('Failed to update profile');
      return false;
    }
  };

  // Handle project creation
  const handleAddProject = async (projectData) => {
    try {
      const newProject = await api.addProject(projectData);
      setProjects([...projects, newProject]);
      return true;
    } catch (err) {
      alert('Failed to add project');
      return false;
    }
  };

  // Handle project updates
  const handleUpdateProject = async (projectId, projectData) => {
    try {
      const updatedProject = await api.request(`/employees/me/projects/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify(projectData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Update the projects array with the updated project
      setProjects(projects.map(p => p.id === projectId ? updatedProject : p));
      return true;
    } catch (err) {
      console.error('Error updating project:', err);
      alert('Failed to update project');
      return false;
    }
  };

  // Handle project deletion
  const handleDeleteProject = async (projectId) => {
    try {
      await api.request(`/employees/me/projects/${projectId}`, {
        method: 'DELETE'
      });
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  if (loading && !profile) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar onTabChange={handleTabChange} />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar onTabChange={handleTabChange} />
        <div className="flex-1 p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-600 max-w-2xl">
            <h2 className="text-lg font-semibold mb-2">Error</h2>
            <p className="mb-4">{error}</p>
            <div className="flex space-x-4">
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
              >
                <RefreshCw className="mr-2" size={16} />
                Retry
              </button>
              {error.includes('profile is not set up') && (
                <button
                  onClick={() => window.location.href = '/admin'}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Go to Admin
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onTabChange={handleTabChange} />

      <div className="flex-1 p-6">
        <header className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                {profile ? (
                  <>
                    <User className="mr-2" size={24} />
                    Employee Dashboard
                  </>
                ) : (
                  <>
                    <Briefcase className="mr-2" size={24} />
                    Create Your Profile
                  </>
                )}
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome, {user?.email} | Manage your profile and projects
              </p>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`${loading ? 'animate-spin' : ''}`} size={18} />
              <span>Refresh</span>
            </button>
          </div>
        </header>

        {/* Quick Stats - Only show if profile exists */}
        {profile && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <User className="text-blue-600" size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-semibold text-gray-800">
                    {profile.current_department || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Briefcase className="text-green-600" size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Active Projects</p>
                  <p className="font-semibold text-gray-800">
                    {projects.filter(p => !p.end_date).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Briefcase className="text-purple-600" size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="font-semibold text-gray-800">
                    {projects.filter(p => p.end_date).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <User className="text-amber-600" size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Years Here</p>
                  <p className="font-semibold text-gray-800">
                    {profile.date_of_joining
                      ? new Date().getFullYear() - new Date(profile.date_of_joining).getFullYear()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-3 px-1 ${activeTab === 'profile' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-3 px-1 ${activeTab === 'projects' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
            >
              My Projects ({projects.length})
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-sm">
          <ProfileCard
            profile={profile}
            projects={projects}
            onUpdateProfile={handleUpdateProfile}
            onAddProject={handleAddProject}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
            activeTab={activeTab}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;