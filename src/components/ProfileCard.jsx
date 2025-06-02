import React, { useState, useEffect } from 'react';
import { Edit3, Calendar, Plus, User, Mail, Phone, MapPin, Briefcase, Award } from 'lucide-react';
import ProjectForm from './ProjectForm';
import ProjectList from './ProjectList';
import api from '../api/api.js';

const ProfileCard = ({ profile, projects, onUpdateProfile, onAddProject, onDeleteProject, onUpdateProject, activeTab }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    employee_id: '',
    email: '',
    phone: '',
    address: '',
    date_of_joining: '',
    current_department: '',
    role: '',
    skills: ''
  });
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Initialize form data when profile changes or editing starts
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        employee_id: profile.employee_id || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        date_of_joining: profile.date_of_joining
          ? new Date(profile.date_of_joining).toISOString().split('T')[0]
          : '',
        current_department: profile.current_department || '',
        role: profile.role || '',
        skills: profile.skills || ''
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data for submission
    const updateData = {
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      current_department: formData.current_department,
      role: formData.role,
      skills: formData.skills
    };

    // Only include date_of_joining if it's provided and different from current
    if (formData.date_of_joining) {
      // Convert the date string to ISO format for the API
      const dateObj = new Date(formData.date_of_joining + 'T00:00:00.000Z');
      updateData.date_of_joining = dateObj.toISOString();
    }

    console.log('Submitting update data:', updateData); // Debug log

    const success = await onUpdateProfile(updateData);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleProjectAdd = async (projectData) => {
    if (editingProject) {
      const success = await handleProjectUpdate(editingProject.id, projectData);
      if (success) {
        setShowProjectForm(false);
        setEditingProject(null);
      }
    } else {
      const success = await onAddProject(projectData);
      if (success) {
        setShowProjectForm(false);
      }
    }
  };

  const handleProjectUpdate = async (projectId, projectData) => {
    try {
      if (onUpdateProject) {
        return await onUpdateProject(projectId, projectData);
      } else {
        const updatedProject = await api.updateProject(projectId, projectData);
        console.log('Project updated successfully:', updatedProject);
        return true;
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project: ' + (error.message || 'Unknown error'));
      return false;
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowProjectForm(true);
  };

  // No Profile State
  if (!profile && !isEditing) {
    return (
      <div className="p-8 text-center">
        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <User className="text-gray-400" size={32} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Profile Found</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          It looks like your profile hasn't been set up yet. Create your profile to get started with managing your projects and information.
        </p>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors inline-flex items-center"
        >
          <Plus className="mr-2" size={18} />
          Create Your Profile
        </button>
      </div>
    );
  }

  // Profile Form
  if (isEditing) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {profile ? 'Edit Profile' : 'Create Profile'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information Section */}
            <div className="md:col-span-2">
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <User className="mr-2" size={20} />
                Personal Information
              </h4>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Employee ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee ID *
              </label>
              <input
                type="text"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                required
                disabled
                title="Employee ID cannot be changed"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                required
                disabled
                title="Email cannot be changed"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Work Information Section */}
            <div className="md:col-span-2 mt-8">
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Briefcase className="mr-2" size={20} />
                Work Information
              </h4>
            </div>

            {/* Joining Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Joining
              </label>
              <input
                type="date"
                name="date_of_joining"
                value={formData.date_of_joining}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                max={new Date().toISOString().split('T')[0]} // Prevent future dates
              />
              <p className="text-xs text-gray-500 mt-1">
                Current value: {formData.date_of_joining || 'Not set'}
              </p>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                name="current_department"
                value={formData.current_department}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Role
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. Software Engineer, Product Manager"
              />
            </div>

            {/* Skills */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills & Expertise
              </label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="List your key skills, separated by commas"
              ></textarea>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                // Reset form data to original profile data
                if (profile) {
                  setFormData({
                    name: profile.name || '',
                    employee_id: profile.employee_id || '',
                    email: profile.email || '',
                    phone: profile.phone || '',
                    address: profile.address || '',
                    date_of_joining: profile.date_of_joining
                      ? new Date(profile.date_of_joining).toISOString().split('T')[0]
                      : '',
                    current_department: profile.current_department || '',
                    role: profile.role || '',
                    skills: profile.skills || ''
                  });
                }
              }}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              {profile ? 'Update Profile' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Profile Display (rest of the component remains the same)
  return (
    <>
      {activeTab === 'profile' ? (
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Profile Information</h3>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
            >
              <Edit3 className="mr-2" size={16} />
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <User className="mr-2 text-blue-600" size={20} />
                  Personal Information
                </h4>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <User className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p className="text-gray-900 font-medium">{profile.name}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email Address</p>
                    <p className="text-gray-900">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                    <p className="text-gray-900">
                      {profile.phone && profile.phone.trim() !== ''
                        ? profile.phone
                        : 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-gray-900">
                      {profile.address && profile.address.trim() !== ''
                        ? profile.address
                        : 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Briefcase className="mr-2 text-green-600" size={20} />
                  Work Information
                </h4>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Briefcase className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Employee ID</p>
                    <p className="text-gray-900 font-medium">{profile.employee_id}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Briefcase className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Department</p>
                    <p className="text-gray-900">{profile.current_department || 'Not assigned'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <User className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Job Role</p>
                    <p className="text-gray-900">{profile.role || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date of Joining</p>
                    <p className="text-gray-900">
                      {profile.date_of_joining
                        ? new Date(profile.date_of_joining).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="lg:col-span-2 mt-8">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h4 className="text-lg font-medium text-gray-900 flex items-center">
                  <Award className="mr-2 text-purple-600" size={20} />
                  Skills & Expertise
                </h4>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                {profile.skills ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.split(',').map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-900">
                    No skills listed yet. Click "Edit Profile" to add your skills.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Projects Tab */
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">My Projects</h3>
            <button
              onClick={() => {
                setEditingProject(null);
                setShowProjectForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
            >
              <Plus className="mr-2" size={16} />
              Add Project
            </button>
          </div>

          <ProjectList
            projects={projects}
            onEditProject={handleEditProject}
            onDeleteProject={onDeleteProject}
          />
        </div>
      )}

      {/* Project Form Modal */}
      {showProjectForm && (
        <ProjectForm
          project={editingProject}
          onClose={() => {
            setShowProjectForm(false);
            setEditingProject(null);
          }}
          onSubmit={handleProjectAdd}
        />
      )}
    </>
  );
};

export default ProfileCard;