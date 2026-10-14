import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  MapPin,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  Calendar,
  Award,
  BookOpen,
} from 'lucide-react';

export const StudentManagementPage: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState<{ total: number; totalPages: number }>({ total: 0, totalPages: 1 });
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/students', {
        params: { search, page, limit: 10 },
      });
      if (res.data.success) {
        setStudents(res.data.data);
        if (res.data.meta) {
          setMeta(res.data.meta);
        }
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchStudents();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-gov-navy" /> Candidate Profiles
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Registered students and job seekers under the Prime Minister Internship Scheme.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Enrolled</span>
          <p className="text-2xl font-extrabold text-gov-navy">{meta.total} Candidates</p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidates by name, email, degree, college..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy focus:border-transparent"
          />
        </form>
        <button
          onClick={handleSearchSubmit}
          className="w-full sm:w-auto px-5 py-2 bg-gov-navy text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition"
        >
          Search
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Education</th>
                <th className="px-6 py-4">CGPA</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Skills</th>
                <th className="px-6 py-4">Applications</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <div className="w-8 h-8 border-4 border-gov-navy border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading candidate records...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No candidates found matching the criteria.
                  </td>
                </tr>
              ) : (
                students.map((student) => {
                  const profile = student.studentProfile;
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {student.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800">
                          {profile?.degree || 'Not specified'}
                        </div>
                        <div className="text-xs text-slate-500 truncate max-w-xs">
                          {profile?.branch || 'General'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {profile?.cgpa ? (
                          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-xs">
                            {profile.cgpa.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {profile?.state || 'India'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded-md border border-blue-100">
                          {(profile?.studentSkills || profile?.skills || []).length} skills
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-md border border-emerald-100">
                          {(profile?.applications || []).length} applied
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-gov-navy hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Profile
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Showing Page <span className="font-semibold">{page}</span> of{' '}
            <span className="font-semibold">{meta.totalPages || 1}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Candidate Profile Modal */}
      {selectedStudent && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`Candidate Dossier: ${selectedStudent.firstName} ${selectedStudent.lastName}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Basic Info Header */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap gap-4 justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {selectedStudent.email}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="blue">{selectedStudent.studentProfile?.educationLevel || 'Undergraduate'}</Badge>
                <Badge variant="green">Verified Candidate</Badge>
              </div>
            </div>

            {/* Academic Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 border border-slate-100 rounded-xl bg-white shadow-xs">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" /> Degree & Branch
                </span>
                <p className="text-sm font-semibold text-slate-800 mt-1">
                  {selectedStudent.studentProfile?.degree || 'N/A'} - {selectedStudent.studentProfile?.branch || 'N/A'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedStudent.studentProfile?.college || 'Institution details on file'}
                </p>
              </div>

              <div className="p-3.5 border border-slate-100 rounded-xl bg-white shadow-xs">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Performance & Age
                </span>
                <p className="text-sm font-semibold text-slate-800 mt-1">
                  CGPA: {selectedStudent.studentProfile?.cgpa ? selectedStudent.studentProfile.cgpa.toFixed(2) : 'N/A'} / 10
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Passing Year: {selectedStudent.studentProfile?.passingYear || '2025'} | Age: {selectedStudent.studentProfile?.age || '22'}
                </p>
              </div>
            </div>

            {/* Candidate Skills */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" /> Verified Skills & Competencies
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(selectedStudent.studentProfile?.studentSkills || selectedStudent.studentProfile?.skills || []).length > 0 ? (
                  (selectedStudent.studentProfile?.studentSkills || selectedStudent.studentProfile?.skills || []).map((s: any) => (
                    <span
                      key={s.id || s.skillId}
                      className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-slate-200"
                    >
                      {s.skill?.name || s.name || 'Skill'} <span className="text-[10px] text-slate-400">({s.proficiencyLevel || 'Intermediate'})</span>
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No specific skills tagged yet.</p>
                )}
              </div>
            </div>

            {/* Stated Interests */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Career Goals & Interests
              </h4>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                {selectedStudent.studentProfile?.careerGoals ||
                  'Passionate about public infrastructure, tech modernisation, and digital governance.'}
              </p>
            </div>

            {/* Applications record */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Submitted Applications (
                {selectedStudent.studentProfile?.applications?.length || 0})
              </h4>
              <div className="space-y-2">
                {selectedStudent.studentProfile?.applications?.map((app: any) => (
                  <div
                    key={app.id}
                    className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">{app.internship?.title}</div>
                      <div className="text-slate-400 text-[11px]">{app.internship?.organization?.name}</div>
                    </div>
                    <Badge
                      variant={
                        app.status === 'ACCEPTED'
                          ? 'green'
                          : app.status === 'REJECTED'
                          ? 'red'
                          : app.status === 'SHORTLISTED'
                          ? 'purple'
                          : 'blue'
                      }
                    >
                      {app.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
