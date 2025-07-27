import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import styled from 'styled-components';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  
  @media (min-width: 640px) {
    margin-top: 30px;
  }
`;

const Th = styled.th`
  background: #667eea;
  color: #fff;
  padding: 8px;
  font-size: 14px;
  
  @media (min-width: 640px) {
    padding: 12px;
    font-size: 16px;
  }
`;

const Td = styled.td`
  padding: 8px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
  
  @media (min-width: 640px) {
    padding: 10px;
    font-size: 16px;
  }
`;

const EditInput = styled.input`
  padding: 4px 8px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  
  @media (min-width: 640px) {
    padding: 6px 10px;
    font-size: 15px;
  }
`;

const Button = styled.button`
  padding: 6px 12px;
  margin: 0 2px;
  border: none;
  border-radius: 6px;
  background: #667eea;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 12px;
  
  @media (min-width: 640px) {
    padding: 7px 16px;
    margin: 0 4px;
    font-size: 14px;
  }
  
  &:hover { background: #4f46e5; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const PortalCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('portalAdminToken');

  useEffect(() => {
    if (!token) return;
          axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/companies/portal`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setCompanies(res.data.data))
      .catch(() => toast.error('Failed to fetch companies'));
  }, [token]);

  const handleEdit = (company) => {
    setEditing(company._id);
    setForm(company);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
              await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/companies/${editing}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Company updated');
      setEditing(null);
      // Refresh list
              const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/companies/portal`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompanies(res.data.data);
    } catch {
      toast.error('Failed to update company');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: '16px', overflowX: 'auto' }}>
      <h2 style={{ fontWeight: 700, fontSize: '24px', marginBottom: 10 }}>Registered Companies</h2>
      <Table>
        <thead>
          <tr>
            <Th>Name</Th><Th>Location</Th><Th>Email</Th><Th>Admin Code</Th><Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {companies.map(c => (
            <tr key={c._id}>
              <Td>{editing === c._id
                ? <EditInput value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
                : c.name}
              </Td>
              <Td>{editing === c._id
                ? <EditInput value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} />
                : c.location}
              </Td>
              <Td>{editing === c._id
                ? <EditInput value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
                : c.email}
              </Td>
              <Td><code>{c.adminCode}</code></Td>
              <Td>
                {editing === c._id
                  ? <Button onClick={handleSave} disabled={loading}>Save</Button>
                  : <Button onClick={() => handleEdit(c)}>Edit</Button>
                }
                {editing === c._id && <Button onClick={() => setEditing(null)} disabled={loading} style={{ background: '#aaa' }}>Cancel</Button>}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default PortalCompanies; 