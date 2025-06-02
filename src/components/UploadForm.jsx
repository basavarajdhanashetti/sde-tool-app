import React, { useState } from 'react';
import { UploadCloud, AlertCircle, CheckCircle, FileSpreadsheet } from 'lucide-react';
import api from '../api/api';

const UploadForm = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null);
    setSuccess(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    // Check file type (only allow Excel files)
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      setError('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file:', file.name, 'Size:', file.size);

      const result = await api.uploadEmployeeData(formData);

      console.log('Upload successful:', result);

      setSuccess(true);
      setFile(null);
      document.getElementById('file-upload').value = '';

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      console.error('Upload error:', err);

      // Better error message handling
      let errorMessage = 'Failed to upload file. Please try again.';

      if (err.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err.toString && err.toString() !== '[object Object]') {
        errorMessage = err.toString();
      }

      // Handle specific common errors
      if (errorMessage.includes('KeyError') || errorMessage.includes('column')) {
        errorMessage = 'Invalid Excel format. Please check that your Excel file has the required columns: employee_id, name, email, date_of_joining, current_department, role, current_project';
      } else if (errorMessage.includes('date')) {
        errorMessage = 'Date format error. Please ensure dates are in a valid format (YYYY-MM-DD or Excel date format)';
      } else if (errorMessage.includes('duplicate') || errorMessage.includes('unique')) {
        errorMessage = 'Duplicate employee ID found. Please check your data for duplicate employee IDs.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Upload Employee Data</h3>
        <p className="mt-1 text-sm text-gray-600">
          Upload an Excel file with employee information to bulk import or update records.
        </p>
      </div>

      {/* File Upload Area */}
      <form onSubmit={handleSubmit}>
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${
            error ? 'border-red-300 bg-red-50' : 
            success ? 'border-green-300 bg-green-50' : 
            file ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
          }`}
        >
          <div className="space-y-1 text-center">
            {!file ? (
              <UploadCloud
                className={`mx-auto h-12 w-12 ${
                  error ? 'text-red-400' : 
                  success ? 'text-green-400' : 'text-gray-400'
                }`}
              />
            ) : (
              <FileSpreadsheet className="mx-auto h-12 w-12 text-blue-400" />
            )}

            <div className="flex text-sm">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span>{file ? 'Change file' : 'Select a file'}</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept=".xlsx,.xls"
                />
              </label>
              <p className="pl-1">{file ? 'or drag and drop another' : 'or drag and drop'}</p>
            </div>
            <p className="text-xs text-gray-500">
              XLSX or XLS up to 10MB
            </p>
          </div>
        </div>

        {file && (
          <div className="mt-3 text-sm text-gray-600">
            <p className="font-medium">Selected file:</p>
            <p>{file.name} ({(file.size / 1024).toFixed(2)} KB)</p>
          </div>
        )}

        {error && (
          <div className="mt-3 flex items-start text-sm text-red-600">
            <AlertCircle className="mr-2 mt-0.5 flex-shrink-0" size={16} />
            <span className="break-words">{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-3 flex items-center text-sm text-green-600">
            <CheckCircle className="mr-2" size={16} />
            <span>File uploaded successfully!</span>
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading || !file}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading || !file 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : 'Upload File'}
          </button>
        </div>
      </form>

      {/* Instructions */}
      <div className="mt-8 border-t border-gray-200 pt-6">
        <h4 className="text-sm font-medium text-gray-900">File Format Requirements:</h4>
        <ul className="mt-2 text-sm text-gray-600 list-disc pl-5 space-y-1">
          <li>File must be in Excel format (.xlsx or .xls)</li>
          <li>The first row should contain column headers</li>
          <li><strong>Required columns:</strong> employee_id, name, email</li>
          <li><strong>Optional columns:</strong> date_of_joining, current_department, role, current_project, phone, address, skills</li>
          <li>Date format should be YYYY-MM-DD or standard Excel date format</li>
          <li>If employee_id already exists, the record will be updated</li>
          <li>Maximum file size: 10MB</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadForm;