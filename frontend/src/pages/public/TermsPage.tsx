import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-slate-700">
      <div className="space-y-2 text-center">
        <span className="text-xs font-bold text-gov-saffron uppercase tracking-wider">
          LEGAL & PROGRAM GUIDELINES
        </span>
        <h1 className="text-3xl font-extrabold text-gov-navy">Terms of Service & Code of Conduct</h1>
        <p className="text-xs text-slate-500">
          Prime Minister's Internship Scheme • Ministry of Corporate Affairs, New Delhi
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Scheme Guidelines & Candidate Declaration</h2>
          <p>
            By registering on this portal, applicants certify that they meet the statutory age
            eligibility (21 to 24 years), hold valid Indian nationality, are not currently engaged in
            full-time permanent employment, and that all academic scores entered are genuine and verifiable
            against university records.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Recommendation Disclaimers</h2>
          <p>
            Recommendation compatibility percentages reflect algorithmic alignment between candidate
            profiles and published internship prerequisites. Recommendation scores do not represent a
            guarantee of selection, which remains at the discretion of the partner organization following
            evaluation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Monthly Stipend & Incidental Grant Terms</h2>
          <p>
            Selected interns will receive ₹5,000 per month for the duration of the 12-month internship.
            Government stipend disbursements (₹4,500/month) will be credited directly to the intern's Aadhaar-linked
            bank account via Direct Benefit Transfer (DBT), contingent upon monthly attendance and performance
            certification by the host company.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Code of Professional Conduct</h2>
          <p>
            Interns are expected to maintain professional integrity, adhere to company non-disclosure
            agreements (NDAs), observe safety protocols, and demonstrate commitment to learning throughout the
            12-month tenure.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">5. Termination & Grievances</h2>
          <p>
            Either the intern or the host organization may initiate formal separation as per MCA guidelines
            with prior notice. Disputed matters may be escalated via the portal's online Grievance Redressal
            Mechanism.
          </p>
        </section>
      </div>
    </div>
  );
};
