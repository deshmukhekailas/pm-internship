import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { Bell, CheckCircle2, Sparkles, FileCheck, Clock, ExternalLink } from 'lucide-react';
import { NotificationItem } from '../../types';
import { Link } from 'react-router-dom';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-gov-saffron uppercase tracking-wider flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5" /> NOTIFICATIONS CENTER
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Updates & Alerts</h1>
          <p className="text-xs text-slate-500">Live notices on recommendations and applications</p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-3.5 py-1.5 text-xs font-semibold text-gov-navy bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          Mark all as read
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-16 bg-white rounded-xl animate-pulse"></div>
          <div className="h-16 bg-white rounded-xl animate-pulse"></div>
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleMarkRead(item.id)}
              className={`p-4 rounded-xl border transition-colors flex items-start justify-between gap-4 text-xs ${
                item.isRead
                  ? 'bg-white border-slate-200 text-slate-700'
                  : 'bg-blue-50/60 border-blue-200 text-slate-900 font-medium'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{item.title}</span>
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-gov-saffron shrink-0"></span>
                  )}
                </div>
                <p className="text-slate-600">{item.message}</p>
                <span className="text-[11px] text-slate-400 block pt-1">
                  {new Date(item.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {item.link && (
                <Link
                  to={item.link}
                  className="px-3 py-1.5 bg-gov-navy text-white rounded-lg font-semibold hover:bg-gov-navyLight shrink-0 flex items-center gap-1"
                >
                  <span>View</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Bell className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No notifications yet</h3>
          <p className="text-xs text-slate-500">You will be notified when new matching roles are posted.</p>
        </div>
      )}
    </div>
  );
};
