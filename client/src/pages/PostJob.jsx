import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createJob, updateJob } from '../api/jobs.js';
import { updateUserRole } from '../api/auth.js';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import Lottie from 'lottie-react';
import profileLottie from '../assets/Animation - 1751910490425.json';

const fadeInScale = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const FormContainer = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 700px;
  width: 100%;
  box-sizing: border-box;
  animation: ${fadeInScale} 0.8s ease-out forwards;
  margin: 20px auto;
  
  @media (min-width: 640px) {
    padding: 40px;
    margin: 40px auto;
  }
`;

const FormTitle = styled.h1`
  font-size: 1.8em;
  font-weight: 700;
  color: #007bff;
  text-align: center;
  margin-bottom: 25px;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;

  @media (min-width: 640px) {
    font-size: 2.2em;
    margin-bottom: 35px;
  }

  &:hover {
    transform: scale(1.02);
  }

  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 4px;
    background: linear-gradient(to right, #007bff, #0056b3);
    margin: 15px auto 0;
    border-radius: 2px;
    transition: width 0.3s ease, background-position 1s ease-in-out;
    background-size: 200% 100%;
  }

  &:hover::after {
    width: 100px;
    background-position: 100% 0;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
  position: relative;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 0.95em;
  font-weight: 600;
  color: #343a40;
  margin-bottom: 8px;
  transition: color 0.3s, transform 0.3s, font-size 0.3s;
  transform-origin: left top;

  ${props => props.$focused && `
    color: #007bff;
    transform: translateY(-8px) scale(0.85);
    font-size: 0.9em;
  `}
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 1em;
  color: #343a40;
  background-color: #f8f9fa;
  transition: border-color 0.3s, box-shadow 0.3s, background-color 0.3s;
  box-sizing: border-box;
  min-height: 45px;

  &::placeholder {
    color: #6c757d;
    opacity: 0.8;
    transition: opacity 0.3s;
  }

  &:focus::placeholder {
    opacity: 0.4;
  }

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25), inset 0 0 8px rgba(0, 123, 255, 0.1);
    background-color: #ffffff;
    outline: none;
  }
`;

const SelectField = styled.select`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 1em;
  color: #343a40;
  background-color: #f8f9fa;
  transition: border-color 0.3s, box-shadow 0.3s, background-color 0.3s;
  box-sizing: border-box;
  min-height: 45px;
  cursor: pointer;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25), inset 0 0 8px rgba(0, 123, 255, 0.1);
    background-color: #ffffff;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 15px 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 1em;
  color: #343a40;
  background-color: #f8f9fa;
  transition: border-color 0.3s, box-shadow 0.3s, background-color 0.3s;
  box-sizing: border-box;
  resize: none;
  min-height: 120px;
  max-height: 120px;
  overflow-y: auto;

  &::placeholder {
    color: #6c757d;
    opacity: 0.8;
    transition: opacity 0.3s;
  }

  &:focus::placeholder {
    opacity: 0.4;
  }

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25), inset 0 0 8px rgba(0, 123, 255, 0.1);
    background-color: #ffffff;
    outline: none;
  }
`;

const ErrorMsg = styled.p`
  color: #e74c3c;
  font-size: 0.9rem;
  margin: 0.2rem 0 0.7rem 0;
  opacity: 0;
  transform: translateY(10px);
  animation: fadeInError 0.4s forwards;
  @keyframes fadeInError {
    to { opacity: 1; transform: translateY(0); }
  }
`;

const FormActions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;
  
  @media (min-width: 640px) {
    flex-direction: row;
    margin-top: 30px;
    gap: 15px;
  }
`;

const SubmitButton = styled.button`
  padding: 12px 20px;
  background: linear-gradient(to right, #007bff, #0056b3);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 15px rgba(0, 123, 255, 0.3);
  transition: background 0.4s ease, transform 0.2s ease, box-shadow 0.2s ease;
  letter-spacing: 0.5px;
  outline: none;
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  @media (min-width: 640px) {
    padding: 14px 30px;
    font-size: 1.1em;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -75%;
    width: 50%;
    height: 100%;
    background: rgba(255, 255, 255, 0.3);
    transform: skewX(-20deg);
    z-index: 0;
    transition: transform 0.5s ease;
  }

  &:hover::before {
    transform: translateX(150%);
  }

  &:hover {
    background: linear-gradient(to right, #0056b3, #007bff);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 123, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const CancelButton = styled.button`
  padding: 12px 20px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 15px rgba(108, 117, 125, 0.3);
  transition: background 0.4s ease, transform 0.2s ease, box-shadow 0.2s ease;
  letter-spacing: 0.5px;
  outline: none;
  
  @media (min-width: 640px) {
    padding: 14px 30px;
    font-size: 1.1em;
  }

  &:hover {
    background: #5a6268;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(108, 117, 125, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 10px rgba(108, 117, 125, 0.2);
  }
`;

const AdminNotice = styled.div`
  margin-bottom: 1.2rem;
  padding: 0.7rem 1rem;
  background: rgba(0, 123, 255, 0.1);
  color: #007bff;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  border: 1px solid rgba(0, 123, 255, 0.2);
`;

const DEFAULT_LOGO = '/logo.svg'; // Use your default logo path in public/

const PostJob = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const editMode = location.state?.editMode;
  const jobToEdit = location.state?.job;
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [formData, setFormData] = useState({
    job_category: '',
    job_type: '',
    job_designation: '',
    job_location: '',
    company_name: '',
    salary: '',
    apply_by: '',
    skills_required: '',
    number_of_openings: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [logoUploading, setLogoUploading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState(null);

  // Prefill company fields for admin users from user.company
  useEffect(() => {
    console.log('PostJob useEffect - user:', user);
    console.log('PostJob useEffect - user.role:', user?.role);
    console.log('PostJob useEffect - user.company:', user?.company);
    console.log('PostJob useEffect - typeof user.company:', typeof user?.company);
    
    if (user && user.role === 'admin' && user.company && typeof user.company === 'object') {
      console.log('PostJob useEffect - Setting company details:', {
        name: user.company.name,
        location: user.company.location
      });
      setFormData(prev => ({
        ...prev,
        company_name: user.company.name || '',
        job_location: user.company.location || ''
      }));
    } else {
      console.log('PostJob useEffect - Conditions not met for company prefill');
    }
  }, [user]);

  // Prefill form in edit mode
  useEffect(() => {
    const normalizeJobType = (type) => {
      if (!type) return '';
      const map = {
        'full-time': 'Full-time',
        'Full-time': 'Full-time',
        'Full Time': 'Full-time',
        'part-time': 'Part-time',
        'Part-time': 'Part-time',
        'Part Time': 'Part-time',
        'internship': 'Internship',
        'Internship': 'Internship'
      };
      return map[type] || type;
    };
    if (editMode && jobToEdit) {
      setFormData({
        job_category: jobToEdit.job_category || '',
        job_type: normalizeJobType(jobToEdit.job_type),
        job_designation: jobToEdit.job_designation || '',
        job_location: jobToEdit.job_location || '',
        company_name: jobToEdit.company_name || '',
        salary: jobToEdit.salary || '',
        apply_by: jobToEdit.apply_by || '',
        skills_required: Array.isArray(jobToEdit.skills_required) ? jobToEdit.skills_required.join(', ') : (jobToEdit.skills_required || ''),
        number_of_openings: jobToEdit.number_of_openings || '',
        description: jobToEdit.description || ''
      });
      setLogoUrl(jobToEdit.company_logo || '');
    }
  }, [editMode, jobToEdit]);

  // Only allow admins to access this page
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Only recruiters/admins can post jobs!');
      navigate('/jobs');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = (fieldName) => {
    if (!formData[fieldName]) {
      setFocusedField('');
    }
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('/api/jobs/upload-logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setLogoUrl(res.data.path);
      toast.success('Logo uploaded!');
    } catch (err) {
      toast.error('Logo upload failed');
    } finally {
      setLogoUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.job_category.trim()) {
      newErrors.job_category = 'Job category is required';
    }
    
    if (!formData.job_type.trim()) {
      newErrors.job_type = 'Job type is required';
    }
    
    if (!formData.job_designation.trim()) {
      newErrors.job_designation = 'Job designation is required';
    }
    
    if (!formData.job_location.trim()) {
      newErrors.job_location = 'Job location is required';
    }
    
    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required';
    }
    
    if (!formData.salary.trim()) {
      newErrors.salary = 'Salary is required';
    }
    
    if (!formData.apply_by.trim()) {
      newErrors.apply_by = 'Apply by date is required';
    }
    
    if (!formData.skills_required.trim()) {
      newErrors.skills_required = 'Skills required is required';
    }
    
    if (!formData.number_of_openings) {
      newErrors.number_of_openings = 'Number of openings is required';
    } else if (parseInt(formData.number_of_openings) < 1) {
      newErrors.number_of_openings = 'Number of openings must be at least 1';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Convert skills string to array
      const jobData = {
        ...formData,
        company_logo: logoUrl,
        skills_required: formData.skills_required.split(',').map(skill => skill.trim()).filter(skill => skill),
        number_of_openings: parseInt(formData.number_of_openings),
        posted_at: new Date().toISOString()
      };
      console.log('JobData being sent:', jobData);
      
      if (editMode && jobToEdit && jobToEdit._id) {
        await updateJob(jobToEdit._id, jobData);
        toast.success('Job updated successfully!');
      } else {
        await createJob(jobData);
        toast.success('Job posted successfully!');
      }
      navigate('/jobs');
    } catch (error) {
      console.error('Error posting/updating job:', error);
      toast.error('Failed to post/update job');
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in yyyy-mm-dd format
  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '16px' }}>
      <FormContainer>
        <FormTitle>{editMode ? 'Update Job' : 'Post a New Job'}</FormTitle>
        {user && user.role === 'admin' && (
          <AdminNotice>✓ You are now an Admin and can post jobs!</AdminNotice>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            <FormGroup>
              <FormLabel $focused={focusedField === 'job_category' || formData.job_category}>
                Job Category *
              </FormLabel>
              <SelectField 
                id="job_category" 
                name="job_category" 
                value={formData.job_category} 
                onChange={handleChange}
                onFocus={() => handleFocus('job_category')}
                onBlur={() => handleBlur('job_category')}
              >
                <option value="">Select Category</option>
                <option value="Tech">Technology</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Design">Design</option>
                <option value="Finance">Finance</option>
                <option value="HR">Human Resources</option>
                <option value="Operations">Operations</option>
                <option value="Other">Other</option>
              </SelectField>
              {errors.job_category && <ErrorMsg>{errors.job_category}</ErrorMsg>}
            </FormGroup>

            <FormGroup>
              <FormLabel $focused={focusedField === 'job_type' || formData.job_type}>
                Job Type *
              </FormLabel>
              <SelectField 
                id="job_type" 
                name="job_type" 
                value={formData.job_type} 
                onChange={handleChange}
                onFocus={() => handleFocus('job_type')}
                onBlur={() => handleBlur('job_type')}
              >
                <option value="">Select Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
              </SelectField>
              {errors.job_type && <ErrorMsg>{errors.job_type}</ErrorMsg>}
            </FormGroup>

            <FormGroup>
              <FormLabel $focused={focusedField === 'job_designation' || formData.job_designation}>
                Job Title/Designation *
              </FormLabel>
              <InputField 
                type="text" 
                id="job_designation" 
                name="job_designation" 
                placeholder="e.g., Senior Software Engineer" 
                value={formData.job_designation} 
                onChange={handleChange}
                onFocus={() => handleFocus('job_designation')}
                onBlur={() => handleBlur('job_designation')}
              />
              {errors.job_designation && <ErrorMsg>{errors.job_designation}</ErrorMsg>}
            </FormGroup>

            <FormGroup>
              <FormLabel $focused={focusedField === 'job_category' || formData.job_category}>
                Job Category *
              </FormLabel>
              <SelectField 
                id="job_category" 
                name="job_category" 
                value={formData.job_category} 
                onChange={handleChange}
                onFocus={() => handleFocus('job_category')}
                onBlur={() => handleBlur('job_category')}
              >
                <option value="">Select Category</option>
                <option value="Tech">Technology</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Design">Design</option>
                <option value="Finance">Finance</option>
                <option value="HR">Human Resources</option>
                <option value="Operations">Operations</option>
                <option value="Other">Other</option>
              </SelectField>
              {errors.job_category && <ErrorMsg>{errors.job_category}</ErrorMsg>}
            </FormGroup>

            <FormGroup>
              <FormLabel $focused={focusedField === 'job_type' || formData.job_type}>
                Job Type *
              </FormLabel>
              <SelectField 
                id="job_type" 
                name="job_type" 
                value={formData.job_type} 
                onChange={handleChange}
                onFocus={() => handleFocus('job_type')}
                onBlur={() => handleBlur('job_type')}
              >
                <option value="">Select Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
              </SelectField>
              {errors.job_type && <ErrorMsg>{errors.job_type}</ErrorMsg>}
            </FormGroup>

            <FormGroup>
              <FormLabel $focused={focusedField === 'job_designation' || formData.job_designation}>
                Job Title/Designation *
              </FormLabel>
              <InputField 
                type="text" 
                id="job_designation" 
                name="job_designation" 
                placeholder="e.g., Senior Software Engineer" 
                value={formData.job_designation} 
                onChange={handleChange}
                onFocus={() => handleFocus('job_designation')}
                onBlur={() => handleBlur('job_designation')}
              />
              {errors.job_designation && <ErrorMsg>{errors.job_designation}</ErrorMsg>}
            </FormGroup>

            <FormGroup>
              <FormLabel $focused={focusedField === 'company_name' || formData.company_name}>
                Company Name *
              </FormLabel>
              <InputField 
                type="text" 
                id="company_name" 
                name="company_name" 
                placeholder="Your company name" 
                value={formData.company_name} 
                onChange={handleChange}
                onFocus={() => handleFocus('company_name')}
                onBlur={() => handleBlur('company_name')}
                disabled={user && user.role === 'admin'}
              />
              {errors.company_name && <ErrorMsg>{errors.company_name}</ErrorMsg>}
            </FormGroup>

            <FormGroup>
              <FormLabel $focused={focusedField === 'job_location' || formData.job_location}>
                Job Location *
              </FormLabel>
              <InputField 
                type="text" 
                id="job_location" 
                name="job_location" 
                placeholder="e.g., New York, NY or Remote" 
                value={formData.job_location} 
                onChange={handleChange}
                onFocus={() => handleFocus('job_location')}
                onBlur={() => handleBlur('job_location')}
                disabled={user && user.role === 'admin'}
              />
              {errors.job_location && <ErrorMsg>{errors.job_location}</ErrorMsg>}
            </FormGroup>

            <FormGroup>
              <FormLabel $focused={focusedField === 'salary' || formData.salary}>
                Salary Range *
              </FormLabel>
              <InputField 
                type="text" 
                id="salary" 
                name="salary" 
                placeholder="e.g., $50,000 - $70,000 or 10-15 LPA" 
                value={formData.salary} 
                onChange={handleChange}
                onFocus={() => handleFocus('salary')}
                onBlur={() => handleBlur('salary')}
              />
              {errors.salary && <ErrorMsg>{errors.salary}</ErrorMsg>}
            </FormGroup>

            <FormGroup>
              <FormLabel $focused={focusedField === 'number_of_openings' || formData.number_of_openings}>
                Number of Openings *
              </FormLabel>
              <InputField 
                type="number" 
                id="number_of_openings" 
                name="number_of_openings" 
                min="1" 
                placeholder="1" 
                value={formData.number_of_openings} 
                onChange={handleChange}
                onFocus={() => handleFocus('number_of_openings')}
                onBlur={() => handleBlur('number_of_openings')}
              />
              {errors.number_of_openings && <ErrorMsg>{errors.number_of_openings}</ErrorMsg>}
            </FormGroup>

            <FormGroup>
              <FormLabel $focused={focusedField === 'apply_by' || formData.apply_by}>
                Apply By Date *
              </FormLabel>
              <InputField 
                type="date" 
                id="apply_by" 
                name="apply_by" 
                value={formData.apply_by} 
                onChange={handleChange}
                onFocus={() => handleFocus('apply_by')}
                onBlur={() => handleBlur('apply_by')}
                min={today}
              />
              {errors.apply_by && <ErrorMsg>{errors.apply_by}</ErrorMsg>}
            </FormGroup>
          </div>

          <FormGroup>
            <FormLabel $focused={focusedField === 'skills_required' || formData.skills_required}>
              Skills Required *
            </FormLabel>
            <InputField 
              type="text" 
              id="skills_required" 
              name="skills_required" 
              placeholder="e.g., JavaScript, React, Node.js, MongoDB (comma separated)" 
              value={formData.skills_required} 
              onChange={handleChange}
              onFocus={() => handleFocus('skills_required')}
              onBlur={() => handleBlur('skills_required')}
            />
            <div style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '5px' }}>
              Separate multiple skills with commas
            </div>
            {errors.skills_required && <ErrorMsg>{errors.skills_required}</ErrorMsg>}
          </FormGroup>

          <FormGroup>
            <FormLabel>Company Logo</FormLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
              <label style={{
                display: 'inline-block',
                padding: '8px 18px',
                background: 'linear-gradient(90deg, #007bff, #00d4ff)',
                color: '#fff',
                borderRadius: 8,
                fontWeight: 600,
                cursor: logoUploading ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 8px rgba(0,123,255,0.13)',
                fontSize: 15,
                position: 'relative',
                transition: 'background 0.3s',
                opacity: logoUploading ? 0.7 : 1
              }}>
                Choose Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  disabled={logoUploading}
                  style={{ display: 'none' }}
                />
              </label>
              {logoFile && (
                <span style={{
                  background: '#f4f6fa',
                  color: '#007bff',
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontWeight: 500,
                  fontSize: 14,
                  border: '1px solid #e0eafc',
                  maxWidth: 180,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'inline-block'
                }} title={logoFile.name}>
                  {logoFile.name}
                </span>
              )}
            </div>
            <div style={{ marginTop: 10, position: 'relative', width: 80, height: 80 }}>
              {logoUrl && logoUrl !== DEFAULT_LOGO ? (
                <img
                  src={logoUrl}
                  alt="Company Logo Preview"
                  style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 8, border: '1px solid #eee', background: '#fafbfc' }}
                />
              ) : (
                <Lottie
                  animationData={profileLottie}
                  loop={true}
                  autoplay={true}
                  style={{ width: 80, height: 80, display: 'block', borderRadius: 8, background: '#fafbfc', border: '1px solid #eee' }}
                />
              )}
              {logoUrl && logoUrl !== DEFAULT_LOGO && (
                <button
                  type="button"
                  onClick={() => { setLogoFile(null); setLogoUrl(''); }}
                  style={{
                    position: 'absolute',
                    bottom: 4,
                    right: 4,
                    background: 'rgba(255,255,255,0.85)',
                    border: 'none',
                    borderRadius: '50%',
                    padding: 6,
                    cursor: 'pointer',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                  }}
                  title="Delete Photo"
                >
                  <FaTrash color="#f44336" size={16} />
                </button>
              )}
              {logoUploading && <span style={{ position: 'absolute', top: 4, left: 4, color: '#007bff', background: '#fff', borderRadius: 4, padding: '2px 6px', fontSize: 12 }}>Uploading...</span>}
            </div>
          </FormGroup>

          <FormGroup>
            <FormLabel $focused={focusedField === 'description' || formData.description}>
              Job Description *
            </FormLabel>
            <TextArea 
              id="description" 
              name="description" 
              rows={6} 
              placeholder="Provide a detailed description of the job role, responsibilities, and requirements..." 
              value={formData.description} 
              onChange={handleChange}
              onFocus={() => handleFocus('description')}
              onBlur={() => handleBlur('description')}
            />
            {errors.description && <ErrorMsg>{errors.description}</ErrorMsg>}
          </FormGroup>

          <FormActions>
            <CancelButton type="button" onClick={() => navigate('/jobs')}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ animation: 'spin 1s linear infinite', border: '2px solid #ffffff', borderTop: '2px solid transparent', borderRadius: '50%', width: 18, height: 18, marginRight: 8 }} />
                  Posting Job...
                </div>
              ) : (
                'Post Job'
              )}
            </SubmitButton>
          </FormActions>
        </form>
      </FormContainer>
    </div>
  );
};

export default PostJob; 