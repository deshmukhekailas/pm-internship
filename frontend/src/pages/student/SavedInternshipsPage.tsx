import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { InternshipCard } from '../../components/internships/InternshipCard';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { Bookmark, Search } from 'lucide-react';
import { Internship } from '../../types';
import { Link } from 'react-router-dom';

export const SavedInternshipsPage: React.FC = () => {
  const [savedInternships, setSavedInternships] = useState<Internship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/internships/saved');
      setSavedInternships(res.data.data || []);
    } catch (err) {
      console.error('Failed to load saved internships:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <span className="text-xs font-bold text-gov-saffron uppercase tracking-wider flex items-center gap-1.5">
          <Bookmark className="w-3.5 h-3.5" /> MY BOOKMARKS
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Saved Internships</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Opportunities you bookmarked for later review and application.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : savedInternships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedInternships.map((internship) => (
            <InternshipCard
              key={internship.id}
              internship={{ ...internship, isSaved: true }}
              onRefresh={fetchSaved}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No saved internships yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the bookmark icon on any internship card to save opportunities here.
          </p>
          <Link
            to="/internships"
            className="px-4 py-2 text-xs font-bold text-white bg-gov-navy hover:bg-gov-navyLight rounded-lg transition-colors inline-block"
          >
            Explore Opportunities
          </Link>
        </div>
      )}
    </div>
  );
};
