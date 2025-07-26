import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Lottie from 'lottie-react';
import profileLottie from '../assets/Animation - 1751910490425.json';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px;
  
  @media (min-width: 640px) {
    padding: 20px;
  }
`;

const FormCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 24px;
  width: 100%;
  max-width: 500px;
  position: relative;
  overflow: hidden;
  
  @media (min-width: 640px) {
    padding: 40px;
  }
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 700;
  
  @media (min-width: 640px) {
    margin-bottom: 30px;
    font-size: 28px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 600;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessCard = styled.div`
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  margin-top: 20px;
`;

const AdminCode = styled.div`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0;
  font-family: 'Courier New', monospace;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 2px;
`;

const CompanyRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    website: '',
    email: '',
    phone: ''
  });

  // Check portal admin authentication on component mount
  React.useEffect(() => {
    const portalAdminToken = localStorage.getItem('portalAdminToken');
    if (!portalAdminToken) {
      toast.error('Portal admin authentication required');
      navigate('/portal-admin-login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const portalAdminToken = localStorage.getItem('portalAdminToken');
      
      if (!portalAdminToken) {
        toast.error('Portal admin authentication required');
        navigate('/portal-admin-login');
        return;
      }

      
      
      const response = await axios.post('http://localhost:5000/api/companies/register', formData, {
        headers: {
          'Authorization': `Bearer ${portalAdminToken}`
        }
      });
      
      if (response.data.success) {
        setCompanyData(response.data.data.company);
        setSuccess(true);
        toast.success('Company registered successfully!');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Portal admin authentication required');
        navigate('/portal-admin-login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to register company');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success && companyData) {
    return (
      <Container>
        <FormCard>
          <Title>Company Registered Successfully!</Title>
          <SuccessCard>
            <h3>Your Company Details</h3>
            <p><strong>Name:</strong> {companyData.name}</p>
            <p><strong>Location:</strong> {companyData.location}</p>
            <p><strong>Email:</strong> {companyData.email}</p>
            
            <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Admin Registration Code</h4>
            <AdminCode>{companyData.adminCode}</AdminCode>
            
            <p style={{ fontSize: '14px', opacity: '0.9' }}>
              Share this code with your admin users. They can use this code during registration to become admins for your company.
            </p>
          </SuccessCard>
          
          <Button 
            onClick={() => navigate('/register')}
            style={{ marginTop: '20px', background: 'rgba(255, 255, 255, 0.2)' }}
          >
            Register Admin User
          </Button>
          
          <Button 
            onClick={() => {
              setSuccess(false);
              setCompanyData(null);
              setFormData({
                name: '',
                location: '',
                description: '',
                website: '',
                email: '',
                phone: ''
              });
            }}
            style={{ marginTop: '10px', background: 'rgba(255, 255, 255, 0.1)' }}
          >
            Register Another Company
          </Button>
        </FormCard>
      </Container>
    );
  }

  return (
    <Container>
      <FormCard>
        <Title>Register Your Company</Title>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Company Name *</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter company name"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Location *</Label>
            <Input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., New York, NY"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Description</Label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of your company"
            />
          </FormGroup>

          <FormGroup>
            <Label>Website</Label>
            <Input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://yourcompany.com"
            />
          </FormGroup>

          <FormGroup>
            <Label>Email *</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="company@example.com"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Phone</Label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
            />
          </FormGroup>

          <Button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register Company'}
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Already have an admin code?{' '}
            <button 
              onClick={() => navigate('/register')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#667eea', 
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Register as Admin
            </button>
          </p>
        </div>
      </FormCard>
    </Container>
  );
};

export default CompanyRegister; 