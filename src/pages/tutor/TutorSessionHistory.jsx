// frontend/src/pages/tutor/TutorSessionHistory.jsx
import { useState, useEffect } from 'react';
import {
  Star,
  Download,
  ChevronRight,
  ChevronLeft,
  Calendar,
  RefreshCw,
  ChevronDown,
  TrendingUp,
} from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';

const TutorSessionHistory = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalHours: 0,
    ratingChange: '+0',
  });
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [dateRange, setDateRange] = useState('last30');
  const [ratingFilter, setRatingFilter] = useState('all');

  const subjectColors = {
    'Programmation': 'blue',
    'Base de données': 'purple',
    'Mathématiques': 'emerald',
    'Physique': 'blue',
    'Littérature': 'purple',
    'Design': 'emerald',
    'Economics': 'blue',
    'Literature': 'purple',
    'Calculus': 'emerald',
    default: 'blue'
  };

  useEffect(() => {
    fetchSessionHistory();
  }, []);

  const fetchSessionHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tutor/sessions/history');
      
      if (response.data.sessions) {
        setSessions(response.data.sessions);
      }
      if (response.data.stats) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Erreur chargement historique:', error);
      // Données mockées en cas d'erreur
      setSessions([
        {
          id: 1,
          date: '2024-10-24',
          time: '10:30 AM - 12:00 PM',
          student: { name: 'Alexandre Moreau', initials: 'AM', program: 'Graduate Program' },
          subject: 'Economics',
          subjectColor: 'blue',
          duration: 1.5,
          rating: 5,
          comment: 'Excellent clarity on Macro principles.',
        },
        {
          id: 2,
          date: '2024-10-22',
          time: '02:00 PM - 03:00 PM',
          student: { name: 'Sarah Hadidi', initials: 'SH', program: 'Undergraduate' },
          subject: 'Literature',
          subjectColor: 'purple',
          duration: 1.0,
          rating: 4,
          comment: 'Great analysis of Proust.',
        },
        {
          id: 3,
          date: '2024-10-21',
          time: '09:00 AM - 11:00 AM',
          student: { name: 'Liam Kennedy', initials: 'LK', program: 'Doctoral Candidate' },
          subject: 'Calculus',
          subjectColor: 'emerald',
          duration: 2.0,
          rating: 5,
          comment: 'Finally understood complex integration.',
        },
      ]);
      setStats({
        averageRating: 4.92,
        totalHours: 142,
        ratingChange: '+0.3',
      });
    } finally {
      setLoading(false);
    }
  };

  const getUniqueSubjects = () => {
    const subjects = sessions.map(s => s.subject);
    return ['all', ...new Set(subjects)];
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSubject = selectedSubject === 'all' || session.subject === selectedSubject;
    
    // Filtre par date
    let matchesDate = true;
    if (dateRange !== 'all') {
      const sessionDate = new Date(session.date);
      const today = new Date();
      if (dateRange === 'last30') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        matchesDate = sessionDate >= thirtyDaysAgo;
      } else if (dateRange === 'last90') {
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(today.getDate() - 90);
        matchesDate = sessionDate >= ninetyDaysAgo;
      }
    }
    
    // Filtre par note
    let matchesRating = true;
    if (ratingFilter !== 'all') {
      if (ratingFilter === '5stars') matchesRating = session.rating === 5;
      else if (ratingFilter === '4stars') matchesRating = session.rating >= 4;
      else if (ratingFilter === '3stars') matchesRating = session.rating >= 3;
    }
    
    return matchesSubject && matchesDate && matchesRating;
  });

  const renderStars = (rating) => (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? 'fill-blue-600 text-blue-600' : 'text-gray-300'}
        />
      ))}
    </div>
  );

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getSubjectColor = (subject) => {
    return subjectColors[subject] || subjectColors.default;
  };

  const getColorClass = (color) => {
    const classes = {
      blue: 'bg-blue-50 text-blue-800',
      purple: 'bg-purple-50 text-purple-800',
      emerald: 'bg-emerald-50 text-emerald-800',
    };
    return classes[color] || classes.blue;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

const filtered = filteredSessions;
  return (
    <div className="pt-5 px-6 pb-12 min-h-screen bg-gray-50">
      <div className="max-w-[1280px] mx-auto">
 
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-blue-900 mb-1 font-['Noto_Serif']">
              Tutor Session History
            </h1>
            <p className="text-gray-500 text-sm max-w-xl">
              A comprehensive record of your academic contributions and student engagement performance metrics.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-full shadow border border-gray-100 self-start md:self-auto">
            <button className="bg-blue-700 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2">
              <Download size={15} /> Export Report
            </button>
            <div className="h-7 w-px bg-gray-200" />
            <div className="flex items-center gap-2 px-3">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Language</span>
              <span className="font-semibold text-sm">English (US)</span>
              <ChevronDown size={15} className="text-gray-400" />
            </div>
          </div>
        </div>
 
        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          {/* Performance Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow border border-gray-100 p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 font-['Noto_Serif']">
                  Rating Performance Trend
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Average satisfaction score over the last 6 months
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Average Rating
              </div>
            </div>
            <div className="h-52 bg-gradient-to-b from-blue-50 to-transparent rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="text-blue-600 mx-auto mb-2" size={28} />
                <p className="text-gray-400 text-sm">Chart: Rating trend over time</p>
              </div>
            </div>
          </div>
 
          {/* Stats Cards */}
          <div className="flex flex-col gap-4">
            <div className="bg-blue-700 text-white rounded-xl p-5 shadow relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-xs font-semibold opacity-80 uppercase tracking-wider mb-1">
                  Overall Satisfaction
                </p>
                <h2 className="text-5xl font-bold">
                  {stats.averageRating}
                  <span className="text-xl opacity-60 ml-1">/ 5</span>
                </h2>
              </div>
              <div className="relative z-10 mt-2">
                <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                  {stats.ratingChange} from last month
                </span>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Star size={110} fill="white" />
              </div>
            </div>
 
            <div className="bg-gray-50 rounded-xl p-5 shadow border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Total Tutoring Time
              </p>
              <h2 className="text-5xl font-bold text-blue-700">
                {stats.totalHours}
                <span className="text-xl text-gray-400 ml-1">hrs</span>
              </h2>
              <div className="flex items-center gap-3 mt-4">
                <div className="flex -space-x-2">
                  {sessions.slice(0, 2).map((s, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-bold">
                      {s.student?.initials || '?'}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-blue-700 flex items-center justify-center text-[10px] font-bold text-blue-700">
                    +{sessions.length - 2}
                  </div>
                </div>
                <span className="text-xs text-gray-500">Active students this period</span>
              </div>
            </div>
          </div>
        </div>
 
        {/* Filters */}
        <div className="bg-white rounded-xl shadow border border-gray-100 p-5 mb-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                Subject Matter
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full border-0 border-b border-gray-200 focus:border-blue-600 focus:ring-0 py-2 px-0 bg-transparent text-sm"
              >
                <option value="all">All Subjects</option>
                {getUniqueSubjects().filter(s => s !== 'all').map(subject => (
                  <option key={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full border-0 border-b border-gray-200 focus:border-blue-600 focus:ring-0 py-2 px-0 bg-transparent text-sm"
              >
                <option value="all">All Time</option>
                <option value="last30">Last 30 Days</option>
                <option value="last90">Last 90 Days</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                Rating Filter
              </label>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full border-0 border-b border-gray-200 focus:border-blue-600 focus:ring-0 py-2 px-0 bg-transparent text-sm"
              >
                <option value="all">All Ratings</option>
                <option value="5stars">5 Stars</option>
                <option value="4stars">4+ Stars</option>
                <option value="3stars">3+ Stars</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={fetchSessionHistory}
                className="flex items-center gap-2 text-blue-600 font-semibold text-sm hover:gap-3 transition-all"
              >
                Refresh Data <RefreshCw size={13} />
              </button>
            </div>
          </div>
        </div>
 
        {/* Sessions Table */}
        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Session Date', 'Student', 'Subject', 'Duration', 'Rating', 'Actions'].map((h) => (
                    <th key={h} className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-blue-50/20 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-800">{formatDate(session.date)}</div>
                      <div className="text-xs text-gray-400">{session.time}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-xs flex-shrink-0">
                          {session.student?.initials || '?'}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{session.student?.name || 'Unknown'}</div>
                          <div className="text-xs text-gray-400">{session.student?.program || 'Student'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${getColorClass(getSubjectColor(session.subject))}`}>
                        {session.subject}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-700">{session.duration} hrs</td>
                    <td className="px-5 py-4">
                      {renderStars(session.rating)}
                      <div className="text-xs text-gray-400 mt-1">"{session.comment || 'No comment'}"</div>
                    </td>
                    <td className="px-5 py-4">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-blue-600 font-semibold text-sm">
                        View Details <ChevronRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
 
          {/* Pagination */}
          <div className="px-5 py-4 flex items-center justify-between border-t border-gray-100 bg-gray-50/30">
            <span className="text-xs text-gray-400">
              Showing 1 to {filtered.length} of {sessions.length} sessions
            </span>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white transition-colors">
                <ChevronLeft size={13} />
              </button>
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  className={`w-8 h-8 rounded flex items-center justify-center text-sm font-semibold transition-colors ${
                    n === 1
                      ? 'bg-blue-700 text-white'
                      : 'border border-gray-200 text-gray-400 hover:bg-white'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white transition-colors">
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
 
      </div>
    </div>
  );
};
 
export default TutorSessionHistory;