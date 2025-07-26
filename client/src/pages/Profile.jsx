import React, { useRef, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getSkills, saveSkills, updateProfile } from '../api/auth';

const SkillsSection = () => {
  const [skills, setSkills] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      try {
        const res = await getSkills();
        if (res.data.success) setSkills(res.data.skills);
        else setError(res.data.message || 'Failed to load skills');
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    const newSkill = input.trim();
    if (!newSkill || skills.includes(newSkill)) return;
    const updated = [...skills, newSkill];
    setSkills(updated);
    setInput('');
    await saveSkillsHandler(updated);
  };

  const handleRemoveSkill = async (skill) => {
    const updated = skills.filter(s => s !== skill);
    setSkills(updated);
    await saveSkillsHandler(updated);
  };

  const saveSkillsHandler = async (updatedSkills) => {
    setSaving(true);
    setError('');
    try {
      const res = await saveSkills(updatedSkills);
      if (!res.data.success) setError(res.data.message || 'Failed to save skills');
    } catch (err) {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="skills-section" style={{ marginTop: 40, width: '100%', maxWidth: 380 }}>
      <h3 style={{ fontWeight: 700, fontSize: '1.1em', marginBottom: 10 }}>Skills</h3>
      {loading ? <div>Loading skills...</div> : (
        <div className="skills-list" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {skills.map(skill => (
            <span key={skill} className="skill-tag" style={{ background: '#e0f0ff', color: '#0056b3', borderRadius: 16, padding: '6px 14px', display: 'inline-flex', alignItems: 'center', fontWeight: 500 }}>
              {skill}
              <button onClick={() => handleRemoveSkill(skill)} style={{ marginLeft: 6, background: 'none', border: 'none', color: '#0056b3', cursor: 'pointer', fontWeight: 700, fontSize: 16 }} title="Remove">×</button>
            </span>
          ))}
        </div>
      )}
      <form onSubmit={handleAddSkill} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a skill..."
          className="glass-input"
          style={{ width: '100%' }}
          disabled={saving}
        />
        <button type="submit" className="add-skill-btn" style={{ background: 'linear-gradient(45deg, #007bff, #00d4ff)', color: '#fff', border: 'none', borderRadius: 16, padding: '12px 18px', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s', width: '100%' }} disabled={saving || !input.trim()}>Add</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

const Profile = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef();
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState(null);
  // Remove admin code prompt logic from Profile page

  useEffect(() => {
    if (user && (!user.phone || user.phone.trim() === '')) {
      setShowPhonePrompt(true);
    }
  }, [user]);

  // Fetch company information for admin users
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      if (user && user.role === 'admin' && user.company) {
        try {
          const response = await fetch(`http://localhost:5000/api/companies/${user.company}`, {
            credentials: 'include'
          });
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setCompanyInfo(data.data);
            }
          }
        } catch (error) {
          console.error('Error fetching company info:', error);
        }
      }
    };

    fetchCompanyInfo();
  }, [user]);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setPhoneError('');
    if (!phoneInput.trim() || phoneInput.trim().length < 8) {
      setPhoneError('Please enter a valid phone number.');
      return;
    }
    setPhoneLoading(true);
    try {
      const res = await updateProfile({ phone: phoneInput });
      if (res.data.success) {
        updateUser({ ...user, phone: phoneInput });
        setShowPhonePrompt(false);
      } else {
        setPhoneError(res.data.message || 'Failed to update phone number.');
      }
    } catch (err) {
      setPhoneError('Network error.');
    } finally {
      setPhoneLoading(false);
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  // Get first initial
  const initial = user.name ? user.name[0].toUpperCase() : 'U';
  // Role label
  const roleLabel = user.role === 'admin' ? 'Recruiter' : 'Job Seeker';
  // Member since date
  const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #eaf4ff, #dbe9ff)', padding: '16px', boxSizing: 'border-box', color: '#495057', overflow: 'hidden' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
      {showPhonePrompt && (
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: '20px', marginBottom: 24, width: '100%' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1em', marginBottom: 10 }}>Please provide your phone number (optional)</h3>
          <form onSubmit={handlePhoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              type="text"
              value={phoneInput}
              onChange={e => setPhoneInput(e.target.value.replace(/[^0-9+\- ]/g, ''))}
              placeholder="Phone number"
              className="glass-input"
              style={{ width: '100%' }}
              disabled={phoneLoading}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="add-skill-btn" style={{ background: 'linear-gradient(45deg, #007bff, #00d4ff)', color: '#fff', border: 'none', borderRadius: 16, padding: '0 18px', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s', flex: 1 }} disabled={phoneLoading}>
                {phoneLoading ? 'Saving...' : 'Save'}
              </button>
              <button type="button" onClick={() => setShowPhonePrompt(false)} className="add-skill-btn" style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 16, padding: '0 18px', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s', flex: 1 }} disabled={phoneLoading}>Skip</button>
            </div>
          </form>
          {phoneError && <div style={{ color: 'red', marginTop: 8 }}>{phoneError}</div>}
        </div>
      )}
      <div className="profile-card">
        <div className="avatar-container">
          <div className="avatar-initial">{initial}</div>
        </div>
        <h2 className="username">{user.name}</h2>
        <div className="job-seeker-tag">
          <span className="info-icon" role="img" aria-label="user icon">👤</span>
          {roleLabel}
        </div>
        <div className="info-row">
          <span className="info-icon" role="img" aria-label="mail icon">✉️</span>
          <span>{user.email}</span>
        </div>
        <div className="info-row">
          <span className="info-icon" role="img" aria-label="calendar icon">📅</span>
          <span>Member since: {memberSince}</span>
        </div>
        
        {user.role === 'admin' && companyInfo && (
          <div className="company-info" style={{ 
            background: 'linear-gradient(135deg, #f0f8ff, #e6f3ff)', 
            borderRadius: 12, 
            padding: 16, 
            marginTop: 16, 
            width: '100%',
            border: '1px solid #d1ecf1'
          }}>
            <h4 style={{ fontWeight: 600, fontSize: '1em', marginBottom: 8, color: '#0056b3' }}>Company Information</h4>
            <div className="info-row">
              <span className="info-icon" role="img" aria-label="building icon">🏢</span>
              <span>{companyInfo.name}</span>
            </div>
            <div className="info-row">
              <span className="info-icon" role="img" aria-label="location icon">📍</span>
              <span>{companyInfo.location}</span>
            </div>
            {companyInfo.website && (
              <div className="info-row">
                <span className="info-icon" role="img" aria-label="globe icon">🌐</span>
                <a href={companyInfo.website} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>
                  {companyInfo.website}
                </a>
              </div>
            )}
          </div>
        )}
        
        <button className="edit-button" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
          <span className="edit-button-icon" role="img" aria-label="edit icon">✏️</span>
          Edit Profile
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" aria-label="Upload profile picture" />
        </div>
        {user.role !== 'admin' && <SkillsSection />}
      </div>
      <style>{`
        :root {
          --primary-blue: #007bff;
          --primary-cyan: #00d4ff;
          --secondary-gray: #6c757d;
          --dark-text: #212529;
          --medium-text: #495057;
          --light-text: #6f747a;
          --accent-blue-light: #4c9aff;
          --shine-color: rgba(255, 255, 255, 0.5);
          --shine-accent-color: rgba(0, 123, 255, 0.3);
          --card-bg-light: #fdfefe;
          --card-bg-dark: #f0f3f6;
          --card-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          --card-border-radius: 20px;
          --avatar-outer-glow: radial-gradient(circle at center, rgba(0, 123, 255, 0.3) 0%, rgba(0, 123, 255, 0) 70%);
          --avatar-inner-border: rgba(255, 255, 255, 0.5);
          --avatar-fill-gradient: linear-gradient(135deg, #a7d9ff, #62b1ff);
          --avatar-text-color: #ffffff;
          --tag-bg-color: #e0f0ff;
          --tag-text-color: #0056b3;
          --button-gradient: linear-gradient(45deg, #007bff, #00d4ff);
          --button-hover-gradient: linear-gradient(45deg, #0056b3, #00aaff);
          --button-shadow: 0 8px 20px rgba(0, 123, 255, 0.3);
          --transition-speed-fast: 0.2s;
          --transition-speed-medium: 0.3s;
        }
        .profile-card {
          background: linear-gradient(135deg, var(--card-bg-light), var(--card-bg-dark));
          border-radius: var(--card-border-radius);
          box-shadow: var(--card-shadow);
          padding: 30px;
          max-width: 380px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          overflow: hidden;
          transition: transform var(--transition-speed-medium) ease-out, box-shadow var(--transition-speed-medium) ease-out;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInSlideUp var(--transition-speed-medium) ease-out forwards;
        }
        .profile-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }
        .avatar-container {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: var(--avatar-outer-glow);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 25px;
          position: relative;
          padding: 5px;
        }
        .avatar-initial {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: var(--avatar-fill-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3.5em;
          font-weight: 800;
          color: var(--avatar-text-color);
          box-shadow: inset 0 0 15px rgba(0,0,0,0.1);
          border: 3px solid var(--avatar-inner-border);
          transition: transform var(--transition-speed-medium) ease-out;
        }
        .avatar-container:hover .avatar-initial {
          transform: scale(1.05);
        }
        .username {
          font-size: 1.8em;
          font-weight: 700;
          color: var(--dark-text);
          margin-bottom: 10px;
          position: relative;
          display: inline-block;
          overflow: hidden;
          transition: color var(--transition-speed-fast), transform var(--transition-speed-fast);
        }
        .username::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 150%;
          height: 100%;
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 25%, var(--shine-color) 50%, rgba(255,255,255,0.2) 75%, rgba(255,255,255,0) 100%);
          animation: shineSweep 2s infinite linear;
          mix-blend-mode: lighten;
          pointer-events: none;
        }
        @keyframes shineSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .username:hover {
          color: var(--primary-blue);
          transform: translateY(-2px) scale(1.01);
        }
        .username:hover::before {
          animation-play-state: paused;
          opacity: 0;
          transition: opacity var(--transition-speed-fast);
        }
        .username::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 0%;
          height: 3px;
          background: var(--primary-blue);
          border-radius: 2px;
          transition: width var(--transition-speed-medium) ease-out, background var(--transition-speed-fast);
        }
        .username:hover::after {
          width: 80%;
          background: var(--accent-blue-light);
        }
        .job-seeker-tag {
          display: inline-flex;
          align-items: center;
          background-color: var(--tag-bg-color);
          color: var(--tag-text-color);
          padding: 8px 15px;
          border-radius: 25px;
          font-size: 0.9em;
          font-weight: 600;
          margin-bottom: 25px;
          gap: 8px;
          transition: background-color var(--transition-speed-fast), transform var(--transition-speed-fast);
        }
        .job-seeker-tag:hover {
          background-color: #cce0ff;
          transform: translateY(-2px);
        }
        .info-row {
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 280px;
          margin-bottom: 15px;
          font-size: 0.95em;
          color: var(--medium-text);
          transition: color var(--transition-speed-fast), transform var(--transition-speed-fast);
        }
        .info-row:last-of-type {
          margin-bottom: 30px;
        }
        .info-row span:last-child {
          color: var(--dark-text);
          font-weight: 500;
          text-shadow: 0 0 0.5px rgba(0, 0, 0, 0.1);
          transition: color var(--transition-speed-fast), text-shadow var(--transition-speed-fast);
        }
        .info-row:hover span:last-child {
          color: var(--primary-blue);
          text-shadow: 0 0 5px rgba(0, 123, 255, 0.4);
        }
        .info-row:hover {
          transform: translateX(5px);
        }
        .info-icon {
          font-size: 1.2em;
          margin-right: 12px;
          color: var(--primary-blue);
          transition: transform var(--transition-speed-fast), color var(--transition-speed-fast);
        }
        .info-row:hover .info-icon {
          transform: scale(1.1);
          color: var(--accent-blue-light);
        }
        .edit-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: auto;
          padding: 15px 30px;
          background: var(--button-gradient);
          color: white;
          border: none;
          border-radius: 30px;
          font-size: 1.05em;
          font-weight: 600;
          cursor: pointer;
          box-shadow: var(--button-shadow);
          transition: background var(--transition-speed-medium), transform var(--transition-speed-medium), box-shadow var(--transition-speed-medium);
          letter-spacing: 0.2px;
          text-decoration: none;
        }
        .edit-button:hover {
          background: var(--button-hover-gradient);
          transform: translateY(-3px);
          box-shadow: 0 12px 25px rgba(0, 123, 255, 0.45);
        }
        .edit-button:active {
          transform: translateY(0);
          box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2);
        }
        .edit-button-icon {
          font-size: 1.1em;
        }
        @keyframes fadeInSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Profile; 