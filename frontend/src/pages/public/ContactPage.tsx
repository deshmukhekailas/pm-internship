import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  FileCheck,
  Award,
  Sparkles,
} from 'lucide-react';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: 'APPLICATION' | 'ELIGIBILITY' | 'STIPEND';
}

const FAQS: FaqItem[] = [
  {
    id: 1,
    category: 'APPLICATION',
    question: 'How many internship positions can I apply for under the PM Internship Scheme?',
    answer:
      'Candidates can apply for up to 5 internship opportunities across different partner companies. We recommend reviewing your AI Compatibility Scores to choose roles where your skills and educational background have the strongest match.',
  },
  {
    id: 2,
    category: 'APPLICATION',
    question: 'How do I track the status of my submitted internship applications?',
    answer:
      'You can monitor the live progress of all your submissions in real time under the "My Applications" tab in your Candidate Dashboard. The application stages progress through: Applied → Under Review → Shortlisted → Selected (or Rejected), each with clear status timestamps.',
  },
  {
    id: 3,
    category: 'APPLICATION',
    question: 'Can I edit my application or update my resume after submitting?',
    answer:
      'Once an application is submitted, the snapshot of your resume and skills provided at that time is shared with the recruiting partner company. If you need to update details, you can withdraw your application from the "My Applications" section and resubmit with updated credentials before the posted deadline.',
  },
  {
    id: 4,
    category: 'APPLICATION',
    question: 'What is the role of the AI Recommendation Score in candidate selection?',
    answer:
      'The recommendation engine computes a transparent 0-100 compatibility score evaluating your verified skills, education level, domain interest, and location preferences against the company requirements. Partner organizations use these objective scores to fairly shortlist candidates based on genuine merit without bias.',
  },
  {
    id: 5,
    category: 'ELIGIBILITY',
    question: 'Who is eligible to apply for PM Internship Scheme opportunities?',
    answer:
      'Indian youth aged 21 to 24 years who have completed secondary education (10th/12th), ITI, Polytechnic Diploma, or undergraduate degrees (BA, B.Sc, B.Com, B.Tech, etc.) from recognized institutions and are not currently engaged in full-time employment or enrolled in full-time higher education programs are eligible.',
  },
  {
    id: 6,
    category: 'ELIGIBILITY',
    question: 'What should I do if an internship shows "Not Eligible" for my profile?',
    answer:
      'Click on the "View Eligibility Details" link on the internship card. The portal highlights the specific criteria (such as degree stream, required graduation year, or minimum CGPA). We encourage applying for other opportunities where your profile meets 100% of the scheme criteria.',
  },
  {
    id: 7,
    category: 'STIPEND',
    question: 'What is the monthly stipend and financial assistance provided during the internship?',
    answer:
      'Selected interns receive a monthly stipend of ₹5,000 for the full 12-month tenure (₹4,500 disbursed directly by the Government of India via Direct Benefit Transfer [DBT], and ₹500 contributed by the host partner company through CSR), plus a one-time incident grant of ₹6,000 upon successfully joining.',
  },
  {
    id: 8,
    category: 'APPLICATION',
    question: 'What happens after my application is shortlisted by a partner company?',
    answer:
      'Shortlisted candidates will receive an instant in-portal notification and an email alert. The partner company will share interview schedules, assessment guidelines, or reporting dates directly through your candidate portal.',
  },
  {
    id: 9,
    category: 'APPLICATION',
    question: 'How do I prepare my profile to maximize application shortlisting chances?',
    answer:
      'Ensure all technical and soft skills are listed in your "Profile & Skills" section, upload an ATS-friendly resume in PDF format, specify your preferred location and domains, and maintain a profile completion rate of 100%.',
  },
];

export const ContactPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'APPLICATION' | 'ELIGIBILITY' | 'STIPEND'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIds, setOpenFaqIds] = useState<number[]>([1, 2]); // First two opened by default

  const toggleFaq = (id: number) => {
    setOpenFaqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = activeCategory === 'ALL' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-gov-saffron uppercase tracking-wider">
          CANDIDATE ASSISTANCE & FREQUENTLY ASKED QUESTIONS
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gov-navy">
          Help & Application FAQs
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Find instant answers to frequently asked questions regarding your internship applications,
          shortlisting procedures, eligibility rules, and financial stipends.
        </p>
      </div>

      {/* Official Helpdesk Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <Phone className="w-6 h-6 text-gov-saffron" />
          <h3 className="font-bold text-sm text-slate-800">Toll-Free Helpline</h3>
          <p className="text-xs text-slate-600">1800-11-6000 / 1800-11-2000</p>
          <p className="text-[11px] text-slate-400">Available Mon-Sat: 9:00 AM - 6:00 PM IST</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <Mail className="w-6 h-6 text-gov-navy" />
          <h3 className="font-bold text-sm text-slate-800">Official Email Support</h3>
          <p className="text-xs text-slate-600">pminternship-support@mca.gov.in</p>
          <p className="text-[11px] text-slate-400">Grievance queries resolved within 24-48 hrs</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <MapPin className="w-6 h-6 text-emerald-600" />
          <h3 className="font-bold text-sm text-slate-800">Project Directorate</h3>
          <p className="text-xs text-slate-600">Shastri Bhawan, Dr. Rajendra Prasad Road</p>
          <p className="text-[11px] text-slate-400">Ministry of Corporate Affairs, New Delhi</p>
        </div>
      </div>

      {/* FAQ Main Section */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-gov-saffron" />
              <span>Application & Scheme FAQs</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select a category or search by topic to review answers to common candidate queries.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search application queries..."
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeCategory === 'ALL'
                ? 'bg-gov-navy text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            All Questions ({FAQS.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('APPLICATION')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeCategory === 'APPLICATION'
                ? 'bg-gov-navy text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Application Queries
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('ELIGIBILITY')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeCategory === 'ELIGIBILITY'
                ? 'bg-gov-navy text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Eligibility & Selection
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('STIPEND')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeCategory === 'STIPEND'
                ? 'bg-gov-navy text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Stipend & Grants
          </button>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3 pt-2">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className={`border rounded-xl transition-all ${
                    isOpen
                      ? 'border-gov-navy/30 bg-slate-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left p-4 flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-800"
                  >
                    <span className="flex items-center gap-2.5">
                      <FileCheck className="w-4 h-4 text-gov-saffron shrink-0" />
                      <span>{faq.question}</span>
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-gov-navy shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 mt-1">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              No FAQs matching "{searchQuery}". Try searching with different keywords.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
