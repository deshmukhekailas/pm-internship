import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Modal } from '../../components/common/Modal';
import {
  User,
  GraduationCap,
  Sparkles,
  FolderGit2,
  Briefcase,
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
} from 'lucide-react';
import { StudentProfile } from '../../types';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [personalForm, setPersonalForm] = useState({
    dateOfBirth: '',
    gender: 'Male',
    category: 'General',
    state: '',
    district: '',
    city: '',
    pinCode: '',
    bio: '',
    careerGoal: '',
    remotePreference: 'ANY',
    preferredDomains: [] as string[],
    preferredLocations: [] as string[],
  });

  // Modal states
  const [educationModalOpen, setEducationModalOpen] = useState(false);
  const [newEducation, setNewEducation] = useState({
    level: 'UNDERGRADUATE',
    degree: 'B.Tech',
    branch: 'Computer Engineering',
    institute: '',
    startYear: 2022,
    graduationYear: 2026,
    cgpaOrPercentage: 8.5,
  });

  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({
    skillName: '',
    category: 'TECHNICAL',
    proficiencyLevel: 'INTERMEDIATE',
  });

  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/student/profile');
      const data = res.data.data;
      setProfile(data);

      setPersonalForm({
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
        gender: data.gender || 'Male',
        category: data.category || 'General',
        state: data.state || '',
        district: data.district || '',
        city: data.city || '',
        pinCode: data.pinCode || '',
        bio: data.bio || '',
        careerGoal: data.careerGoal || '',
        remotePreference: data.remotePreference || 'ANY',
        preferredDomains: typeof data.preferredDomains === 'string' ? JSON.parse(data.preferredDomains || '[]') : data.preferredDomains || [],
        preferredLocations: typeof data.preferredLocations === 'string' ? JSON.parse(data.preferredLocations || '[]') : data.preferredLocations || [],
      });
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaveSuccess(false);

    try {
      const res = await api.put('/student/profile', personalForm);
      setProfile(res.data.data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile.');
    }
  };

  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/student/education', {
        ...newEducation,
        startYear: Number(newEducation.startYear),
        graduationYear: Number(newEducation.graduationYear),
        cgpaOrPercentage: Number(newEducation.cgpaOrPercentage),
      });
      setEducationModalOpen(false);
      fetchProfile();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to add education.');
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm('Are you sure you want to remove this education entry?')) return;
    try {
      await api.delete(`/student/education/${id}`);
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.skillName.trim()) return;
    try {
      await api.post('/student/skills', newSkill);
      setNewSkill({ skillName: '', category: 'TECHNICAL', proficiencyLevel: 'INTERMEDIATE' });
      setSkillModalOpen(false);
      fetchProfile();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to add skill.');
    }
  };

  const handleDeleteSkill = async (studentSkillId: string) => {
    try {
      await api.delete(`/student/skills/${studentSkillId}`);
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/student/projects', newProject);
      setNewProject({ title: '', description: '', technologies: '', githubUrl: '' });
      setProjectModalOpen(false);
      fetchProfile();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to add project.');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await api.delete(`/student/projects/${projectId}`);
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading student profile...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header & Completion Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-gov-saffron uppercase tracking-wider">
            STUDENT PROFILE & ELIGIBILITY
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            {profile?.user.firstName} {profile?.user.lastName}
          </h1>
          <p className="text-xs text-slate-500">
            {profile?.user.email} • {profile?.user.phone || 'Phone not set'}
          </p>
        </div>

        <div className="w-full sm:w-60 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span>Profile Completion</span>
            <span className="text-gov-navy font-bold">{profile?.profileCompletionPercentage}%</span>
          </div>
          <ProgressBar value={profile?.profileCompletionPercentage || 40} color="saffron" size="sm" showPercent={false} />
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile updated successfully! Recommendation engine will calibrate with new data.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Personal & Career Goals Section */}
      <form onSubmit={handlePersonalSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <User className="w-4 h-4 text-gov-navy" />
          <h3 className="font-bold text-sm text-slate-800">Personal Information & Preferences</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
            <input
              type="date"
              value={personalForm.dateOfBirth}
              onChange={(e) => setPersonalForm({ ...personalForm, dateOfBirth: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Gender</label>
            <select
              value={personalForm.gender}
              onChange={(e) => setPersonalForm({ ...personalForm, gender: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy bg-white"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other / Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">State of Residence</label>
            <input
              type="text"
              value={personalForm.state}
              onChange={(e) => setPersonalForm({ ...personalForm, state: e.target.value })}
              placeholder="e.g. Maharashtra, Karnataka"
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">City</label>
            <input
              type="text"
              value={personalForm.city}
              onChange={(e) => setPersonalForm({ ...personalForm, city: e.target.value })}
              placeholder="e.g. Mumbai, Pune"
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Work Mode Preference</label>
            <select
              value={personalForm.remotePreference}
              onChange={(e) => setPersonalForm({ ...personalForm, remotePreference: e.target.value as any })}
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy bg-white"
            >
              <option value="ANY">Any Mode (Open to all)</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ONSITE">On-Site Only</option>
              <option value="REMOTE">Remote Only</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">PIN Code</label>
            <input
              type="text"
              value={personalForm.pinCode}
              onChange={(e) => setPersonalForm({ ...personalForm, pinCode: e.target.value })}
              placeholder="400001"
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Career Goal & Professional Aspiration
          </label>
          <textarea
            rows={2}
            value={personalForm.careerGoal}
            onChange={(e) => setPersonalForm({ ...personalForm, careerGoal: e.target.value })}
            placeholder="e.g. Build enterprise web software, design clean energy systems, specialize in financial risk analysis..."
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2 bg-gov-navy hover:bg-gov-navyLight text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" /> Save Changes
          </button>
        </div>
      </form>

      {/* 2. Education Qualifications Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-gov-navy" />
            <h3 className="font-bold text-sm text-slate-800">Education Background</h3>
          </div>
          <button
            onClick={() => setEducationModalOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold text-gov-navy bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Degree
          </button>
        </div>

        {profile?.educations && profile.educations.length > 0 ? (
          <div className="space-y-3">
            {profile.educations.map((edu) => (
              <div
                key={edu.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex justify-between items-start gap-4 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {edu.degree} in {edu.branch}
                  </div>
                  <p className="text-slate-600 font-medium mt-0.5">{edu.institute}</p>
                  <div className="flex gap-4 text-slate-500 mt-2">
                    <span>Graduation: <strong>{edu.graduationYear}</strong></span>
                    <span>CGPA / %: <strong className="text-emerald-700">{edu.cgpaOrPercentage} / {edu.maxScale}</strong></span>
                    <span className="capitalize">{edu.level.toLowerCase()}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteEducation(edu.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  title="Remove education entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-4">
            No education entries added yet. Please add your degree to enable eligibility checks.
          </p>
        )}
      </div>

      {/* 3. Skills Inventory Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gov-saffron" />
            <h3 className="font-bold text-sm text-slate-800">Skills & Competencies</h3>
          </div>
          <button
            onClick={() => setSkillModalOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold text-gov-navy bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Skill
          </button>
        </div>

        {profile?.studentSkills && profile.studentSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.studentSkills.map((ss) => (
              <div
                key={ss.id}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold flex items-center gap-2"
              >
                <span>{ss.skill.name}</span>
                <span className="text-[10px] text-slate-400 font-normal">({ss.proficiencyLevel.toLowerCase()})</span>
                <button
                  onClick={() => handleDeleteSkill(ss.id)}
                  className="text-slate-400 hover:text-rose-600"
                  title="Remove skill"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-4">No skills added yet.</p>
        )}
      </div>

      {/* 4. Projects & Portfolio Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-gov-navy" />
            <h3 className="font-bold text-sm text-slate-800">Academic & Personal Projects</h3>
          </div>
          <button
            onClick={() => setProjectModalOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold text-gov-navy bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Project
          </button>
        </div>

        {profile?.projects && profile.projects.length > 0 ? (
          <div className="space-y-3">
            {profile.projects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex justify-between items-start gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm">{proj.title}</div>
                  <p className="text-slate-600">{proj.description}</p>
                  <div className="text-slate-500 pt-1">
                    Technologies: <strong className="text-slate-700">{proj.technologies}</strong>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteProject(proj.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  title="Remove project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-4">No projects added yet.</p>
        )}
      </div>

      {/* Add Education Modal */}
      <Modal
        isOpen={educationModalOpen}
        onClose={() => setEducationModalOpen(false)}
        title="Add Education Entry"
        maxWidth="md"
      >
        <form onSubmit={handleAddEducation} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Education Level</label>
            <select
              value={newEducation.level}
              onChange={(e) => setNewEducation({ ...newEducation, level: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy bg-white"
            >
              <option value="UNDERGRADUATE">Undergraduate (B.Tech, B.Sc, B.Com, etc.)</option>
              <option value="POSTGRADUATE">Postgraduate (M.Tech, MCA, MBA, etc.)</option>
              <option value="DIPLOMA">Polytechnic / Diploma</option>
              <option value="TWELFTH">12th Grade / Higher Secondary</option>
              <option value="TENTH">10th Grade / Secondary</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Degree Title</label>
            <input
              type="text"
              required
              value={newEducation.degree}
              onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
              placeholder="e.g. B.Tech, B.E., B.Com, MCA"
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Branch / Major Field</label>
            <input
              type="text"
              required
              value={newEducation.branch}
              onChange={(e) => setNewEducation({ ...newEducation, branch: e.target.value })}
              placeholder="e.g. Computer Science, Mechanical, Finance"
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">College / University</label>
            <input
              type="text"
              required
              value={newEducation.institute}
              onChange={(e) => setNewEducation({ ...newEducation, institute: e.target.value })}
              placeholder="e.g. VJTI Mumbai, IIT Bombay, Delhi University"
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Graduation Year</label>
              <input
                type="number"
                required
                value={newEducation.graduationYear}
                onChange={(e) => setNewEducation({ ...newEducation, graduationYear: Number(e.target.value) })}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">CGPA / Percentage</label>
              <input
                type="number"
                step="0.01"
                required
                value={newEducation.cgpaOrPercentage}
                onChange={(e) => setNewEducation({ ...newEducation, cgpaOrPercentage: Number(e.target.value) })}
                placeholder="8.5"
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEducationModalOpen(false)}
              className="px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-gov-navy hover:bg-gov-navyLight rounded-lg shadow-sm"
            >
              Save Education
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Skill Modal */}
      <Modal
        isOpen={skillModalOpen}
        onClose={() => setSkillModalOpen(false)}
        title="Add Skill"
        maxWidth="sm"
      >
        <form onSubmit={handleAddSkill} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Skill Name</label>
            <input
              type="text"
              required
              value={newSkill.skillName}
              onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })}
              placeholder="e.g. Python, Docker, SQL, AutoCAD"
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Proficiency Level</label>
            <select
              value={newSkill.proficiencyLevel}
              onChange={(e) => setNewSkill({ ...newSkill, proficiencyLevel: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy bg-white"
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="EXPERT">Expert</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setSkillModalOpen(false)}
              className="px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-gov-navy hover:bg-gov-navyLight rounded-lg shadow-sm"
            >
              Save Skill
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Project Modal */}
      <Modal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        title="Add Project"
        maxWidth="md"
      >
        <form onSubmit={handleAddProject} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Project Title</label>
            <input
              type="text"
              required
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              placeholder="e.g. Smart City Citizen Portal"
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              required
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Describe the problem, your architecture, and key outcomes..."
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Technologies Used</label>
            <input
              type="text"
              required
              value={newProject.technologies}
              onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
              placeholder="e.g. React, Python, PostgreSQL, Docker"
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setProjectModalOpen(false)}
              className="px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-gov-navy hover:bg-gov-navyLight rounded-lg shadow-sm"
            >
              Save Project
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
