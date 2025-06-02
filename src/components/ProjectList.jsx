import React from 'react';
import { Briefcase, Calendar, Edit3, Trash2, MapPin, Code, User, CheckCircle, Clock } from 'lucide-react';

const ProjectList = ({ projects, onEditProject, onDeleteProject }) => {
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Briefcase className="text-gray-400" size={32} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Yet</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Start building your portfolio by adding your first project. Click "Add Project" to get started.
        </p>
      </div>
    );
  }

  // Separate active and completed projects
  const activeProjects = projects.filter(project => !project.end_date);
  const completedProjects = projects.filter(project => project.end_date);

  const ProjectCard = ({ project, isCompleted = false }) => {
    const startDate = new Date(project.start_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    const endDate = project.end_date
      ? new Date(project.end_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      : 'Present';

    // Calculate project duration
    const calculateDuration = () => {
      const start = new Date(project.start_date);
      const end = project.end_date ? new Date(project.end_date) : new Date();
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const months = Math.floor(diffDays / 30);
      const days = diffDays % 30;

      if (months > 0) {
        return `${months} month${months > 1 ? 's' : ''}${days > 0 ? ` ${days} day${days > 1 ? 's' : ''}` : ''}`;
      }
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    };

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200 group">
        {/* Header with project name and actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className={`p-2 rounded-lg mr-3 ${isCompleted ? 'bg-green-100' : 'bg-blue-100'}`}>
                {isCompleted ? (
                  <CheckCircle className={`${isCompleted ? 'text-green-600' : 'text-blue-600'}`} size={20} />
                ) : (
                  <Clock className="text-blue-600" size={20} />
                )}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {project.project_name}
                </h4>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isCompleted 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {isCompleted ? 'Completed' : 'Active'}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{calculateDuration()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEditProject(project)}
              className="flex items-center justify-center w-8 h-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Project"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this project?')) {
                  onDeleteProject(project.id);
                }
              }}
              className="flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Project"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Project description */}
        <p className="text-gray-700 mb-4 leading-relaxed">
          {project.project_description}
        </p>

        {/* Project details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Duration */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
              <Calendar className="text-gray-600" size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Duration</p>
              <p className="text-gray-900 font-medium">
                {startDate} - {endDate}
              </p>
            </div>
          </div>

          {/* Role */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
              <User className="text-gray-600" size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Role</p>
              <p className="text-gray-900 font-medium">
                {project.role_in_project}
              </p>
            </div>
          </div>
        </div>

        {/* Technologies */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg mt-0.5">
              <Code className="text-gray-600" size={16} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 mb-2">Technologies Used</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies_used.split(',').map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Active Projects Section */}
      {activeProjects.length > 0 && (
        <div>
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <Clock className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Active Projects
              </h3>
              <p className="text-sm text-gray-600">
                {activeProjects.length} project{activeProjects.length !== 1 ? 's' : ''} in progress
              </p>
            </div>
          </div>
          <div className="grid gap-6">
            {activeProjects.map((project) => (
              <ProjectCard key={project.id} project={project} isCompleted={false} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Projects Section */}
      {completedProjects.length > 0 && (
        <div>
          <div className="flex items-center mb-6">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Completed Projects
              </h3>
              <p className="text-sm text-gray-600">
                {completedProjects.length} project{completedProjects.length !== 1 ? 's' : ''} completed
              </p>
            </div>
          </div>
          <div className="grid gap-6">
            {completedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} isCompleted={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;