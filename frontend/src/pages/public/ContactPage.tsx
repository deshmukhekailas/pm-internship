import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-gov-saffron uppercase tracking-wider">
          SUPPORT & GRIEVANCE REDRESSAL
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gov-navy">
          Helpdesk & Candidate Assistance
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Have questions regarding eligibility, recommendation scoring, or application status? Our
          dedicated support team is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <Phone className="w-6 h-6 text-gov-saffron" />
          <h3 className="font-bold text-sm text-slate-800">Toll-Free Helpline</h3>
          <p className="text-xs text-slate-600">1800-11-6000 / 1800-11-2000</p>
          <p className="text-[11px] text-slate-400">Available Mon-Sat: 9:00 AM - 6:00 PM</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <Mail className="w-6 h-6 text-gov-navy" />
          <h3 className="font-bold text-sm text-slate-800">Official Email Support</h3>
          <p className="text-xs text-slate-600">pminternship-support@mca.gov.in</p>
          <p className="text-[11px] text-slate-400">Response within 24-48 working hours</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <MapPin className="w-6 h-6 text-emerald-600" />
          <h3 className="font-bold text-sm text-slate-800">Project Directorate</h3>
          <p className="text-xs text-slate-600">Shastri Bhawan, Dr. Rajendra Prasad Road</p>
          <p className="text-[11px] text-slate-400">New Delhi - 110001, India</p>
        </div>
      </div>

      {/* Query Form */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
        <h2 className="text-lg font-bold text-slate-900">Submit a Query or Grievance</h2>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-emerald-900 text-sm">Grievance Ticket Registered</h4>
            <p className="text-xs text-emerald-700">
              Ticket ID: PMIS-{Math.floor(100000 + Math.random() * 900000)}. Our support executive will
              respond to your registered email shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Aarav Sharma"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Eligibility query, Resume issue, or Application inquiry"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Message</label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your issue or question in detail..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gov-navy hover:bg-gov-navyLight text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Inquiry</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
