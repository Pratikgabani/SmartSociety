import React, { useState, useEffect, useContext } from 'react';
import axios from '../../axios';
import { useNavigate } from 'react-router-dom';
import { HashLoader } from 'react-spinners';
import { toast } from 'react-hot-toast';
import UserContext from '../../context/UserContext';
import { Trash2 } from 'lucide-react';

// ── Initials Avatar ──────────────────────────────────────────────────────────
const Avatar = ({ name }) => {
  const initials = name
    ? name.trim().split(' ').slice(0, 2).map(w => w[0].toUpperCase()).join('')
    : '?';
  const colors = [
    'bg-blue-100 text-blue-700',
    'bg-violet-100 text-violet-700',
    'bg-emerald-100 text-emerald-700',
    'bg-orange-100 text-orange-700',
    'bg-pink-100 text-pink-700',
    'bg-teal-100 text-teal-700',
  ];
  const color = colors[(name?.charCodeAt(0) || 0) % colors.length];
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${color}`}>
      {initials}
    </div>
  );
};

// ── Format visit date/time ───────────────────────────────────────────────────
const formatVisitTime = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return isToday ? `Today, ${time}` : `${d.toLocaleDateString('en-GB')}, ${time}`;
};



// ── Main Component ────────────────────────────────────────────────────────────
function Visitor() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVisitor, setNewVisitor] = useState({
    visitorName: '',
    visitorPhone: '',
    visitingBlock: '',
    visitingAdd: null,
    purpose: '',
    visitDate: '',
    visitTime: '',
    duration: '',
  });
  const [loading, setLoading] = useState(true);
  const [activeVisitors, setActiveVisitors] = useState([]);
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [vari, setVari] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { rolee } = useContext(UserContext);

  // ── Data fetching ──────────────────────────────────────────────────────────
  const fetchPreviousData = async () => {
    try {
      let response;
      if (rolee === 'security') {
        response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/visitor/getHisAllRecentVisitors`, { withCredentials: true });
      } else {
        response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/visitor/getHisRecentVisitorsByUserId`, { withCredentials: true });
      }
      navigate('/history', { state: { data: response.data.data } });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const fetchRecentVisitors = async () => {
      try {
        let response;
        if (rolee === 'security') {
          response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/visitor/getRecentVisitors`, { withCredentials: true });
        } else {
          response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/visitor/getRecentVisitorsByUserId`, { withCredentials: true });
        }
        setRecentVisitors(response.data.data || response.data);
      } catch (error) {
        console.error('Error fetching recent visitors:', error);
      }
    };
    fetchRecentVisitors();
  }, [vari]);

  useEffect(() => {
    const fetchActiveVisitors = async () => {
      try {
        let response;
        if (rolee === 'security') {
          response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/visitor/getActiveVisitors`, { withCredentials: true });
        } else {
          response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/visitor/getActiveVisitorsByUserId`, { withCredentials: true });
        }
        setActiveVisitors(response.data.data || response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching active visitors:', error);
        setLoading(false);
      }
    };
    fetchActiveVisitors();
  }, [vari]);

  const deleteVisitor = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_URL_BACKEND}/api/v1/visitor/deleteVisitor/${id}`, { withCredentials: true });
      setVari(!vari);
      toast.success('Visitor removed');
    } catch (error) {
      console.error('Error deleting visitor:', error);
    }
  };

  const handleAddVisitor = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_URL_BACKEND}/api/v1/visitor/createVisitor`,
        {
          visitorName: newVisitor.visitorName,
          visitorPhone: newVisitor.visitorPhone,
          visitingAdd: newVisitor.visitingAdd,
          purpose: newVisitor.purpose,
          visitingBlock: newVisitor.visitingBlock,
          duration: '',
        },
        { withCredentials: true }
      );
      setShowAddModal(false);
      setNewVisitor({ visitorName: '', visitorPhone: '', visitingAdd: '', purpose: '', visitingBlock: '', duration: '' });
      setVari(!vari);
      toast.success('Visitor added successfully');
    } catch (error) {
      console.error('Error adding visitor:', error);
      toast.error('Failed to add visitor');
    }
  };

  const handleCheckOut = async (id) => {
    if (rolee !== 'security') return;
    try {
      const checkoutTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
      });
      await axios.patch(
        `${import.meta.env.VITE_URL_BACKEND}/api/v1/visitor/updateVisitorDuration/${id}`,
        { duration: checkoutTime },
        { withCredentials: true }
      );
      const checkedOutVisitor = activeVisitors.find(v => v._id === id);
      if (checkedOutVisitor) {
        checkedOutVisitor.duration = checkoutTime;
        checkedOutVisitor.isActive = false;
        setActiveVisitors(activeVisitors.filter(v => v._id !== id));
        setRecentVisitors(prev => [...prev, checkedOutVisitor]);
      }
      toast.success('Visitor checked out');
    } catch (error) {
      console.error('Error checking out visitor:', error);
    }
  };

  // ── Derived stats ──────────────────────────────────────────────────────────
  const todayVisits = recentVisitors.filter(v => {
    if (!v.visitDate) return false;
    return new Date(v.visitDate).toDateString() === new Date().toDateString();
  }).length;

  // ── Filter helpers ─────────────────────────────────────────────────────────
  const filterVisitors = (list) =>
    list.filter(v =>
      v.visitorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(v.visitorPhone || '').includes(searchQuery) ||
      v.purpose?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const filteredActive = filterVisitors(activeVisitors);
  const filteredRecent = filterVisitors(recentVisitors);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <HashLoader size={52} color="#2563eb" />
        <p className="mt-4 text-sm text-gray-500 font-medium">Loading visitors…</p>
      </div>
    );
  }

  // ── Field config for Add Visitor form ──────────────────────────────────────
  const formFields = [
    { key: 'visitorName', label: 'Visitor Name', placeholder: 'e.g. Rahul Sharma' },
    { key: 'visitorPhone', label: 'Phone Number', placeholder: 'e.g. 9876543210' },
    { key: 'visitingBlock', label: 'Visiting Block', placeholder: 'e.g. A' },
    { key: 'visitingAdd', label: 'Visiting Flat / Address', placeholder: 'e.g. 304' },
    { key: 'purpose', label: 'Purpose of Visit', placeholder: 'e.g. Delivery, Guest, etc.' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto py-6 px-4 md:py-8 md:px-6 font-sans text-gray-900 bg-gray-50 min-h-screen">

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-7">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 m-0 tracking-[-0.3px]">Visitors</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-0">Manage and track your society visitors</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2.5 items-center w-full sm:w-auto">
          {rolee === 'security' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full sm:w-auto py-[9px] px-[18px] bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors whitespace-nowrap"
            >
              + Add Visitor
            </button>
          )}
          <button
            onClick={fetchPreviousData}
            className="w-full sm:w-auto py-[9px] px-[18px] bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold cursor-pointer transition-colors whitespace-nowrap"
          >
            History
          </button>
        </div>
      </div>

      {/* TAB BAR & SEARCH */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        {/* Containerized Tabs */}
        <div className="flex bg-gray-200/60 p-1 rounded-xl border border-gray-200/80 w-full md:w-max max-w-full overflow-x-auto no-scrollbar">
          {[
            { id: 'active', label: 'Active Visitors', count: activeVisitors.length },
            { id: 'history', label: 'Visitor History', count: recentVisitors.length },
          ]
            .filter(tab => !(rolee === 'security' && tab.id === 'history'))
            .map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-1.5 px-4 font-semibold text-sm cursor-pointer transition-all duration-300 rounded-lg whitespace-nowrap border border-transparent ${
                  isActive
                    ? "bg-white text-blue-700 shadow-sm border-gray-200/50"
                    : "bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full text-xs font-medium ${
                  isActive ? "bg-blue-100/80 text-blue-700" : "bg-gray-300/60 text-gray-600"
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:max-w-[280px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search visitors…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-[38px] pr-3 py-2.5 border border-gray-200/80 rounded-xl text-sm text-gray-900 outline-none bg-white font-medium box-border focus:ring-2 focus:ring-blue-100 hover:border-gray-300 focus:border-blue-400 transition-all"
          />
        </div>
      </div>

      {/* ACTIVE VISITORS TAB */}
      {activeTab === 'active' && (
        <section>


          <div className="bg-white rounded-xl border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.05)] overflow-hidden">

          {filteredActive.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-[72px] px-6 text-center">
              <span className="text-5xl mb-3">🚶</span>
              <p className="text-lg font-semibold text-gray-700 m-0">
                {searchQuery ? 'No visitors match your search' : 'No active visitors'}
              </p>
              <p className="text-sm text-gray-400 mt-1.5 mb-0">
                {searchQuery ? 'Try a different name or phone number' : 'Active visitors will appear here when they check in'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-[0.4px]">Visitor</th>
                    <th className="py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-[0.4px]">Purpose</th>
                    <th className="py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-[0.4px]">Phone</th>
                    <th className="py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-[0.4px]">Check-In</th>
                    <th className="py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-[0.4px]">Status</th>
                    {rolee === 'security' && (
                      <th className="py-3 px-5 text-right text-xs font-medium text-gray-500 uppercase tracking-[0.4px]">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredActive.map((visitor) => (
                    <tr
                      key={visitor._id}
                      className="border-t border-gray-100 hover:bg-green-50/40 transition-colors group"
                    >
                      {/* Visitor name + avatar */}
                      <td className="py-3.5 px-5 align-middle">
                        <div className="flex items-center gap-3">
                          <Avatar name={visitor.visitorName} />
                          <div>
                            <p className="text-sm font-semibold text-gray-900 m-0">{visitor.visitorName}</p>
                            {visitor.visitingBlock && (
                              <p className="text-xs text-gray-400 m-0">Block {visitor.visitingBlock}{visitor.visitingAdd ? ` · ${visitor.visitingAdd}` : ''}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 align-middle">
                        <span className="text-sm text-gray-600">{visitor.purpose || '—'}</span>
                      </td>
                      <td className="py-3.5 px-5 align-middle">
                        <span className="text-sm text-gray-700 font-medium">{visitor.visitorPhone || '—'}</span>
                      </td>
                      <td className="py-3.5 px-5 align-middle">
                        <span className="text-sm text-gray-600">{formatVisitTime(visitor.visitDate)}</span>
                      </td>
                      <td className="py-3.5 px-5 align-middle">
                        <span className="inline-flex items-center gap-1.5 py-[3px] px-2.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-medium">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          Active
                        </span>
                      </td>
                      {rolee === 'security' && (
                        <td className="py-3.5 px-5 align-middle">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => handleCheckOut(visitor._id)}
                              className="py-1.5 px-3.5 bg-green-600 hover:bg-green-700 text-white border-none rounded-lg text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap"
                            >
                              Check Out
                            </button>
                            <button
                              onClick={() => deleteVisitor(visitor._id)}
                              className="inline-flex items-center justify-center p-1.5 bg-transparent hover:bg-red-50 text-red-400 hover:text-red-600 border border-transparent hover:border-red-200 rounded-lg cursor-pointer transition-colors"
                              title="Delete visitor"
                            >
                              <Trash2 strokeWidth={2.5} className="w-[18px] h-[18px]" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          </div>
        </section>
      )}

      {/* VISITOR HISTORY TAB */}
      {activeTab === 'history' && (
        <section>


          <div className="bg-white rounded-xl border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.05)] overflow-hidden opacity-[0.95]">

          {filteredRecent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-[72px] px-6 text-center">
              <span className="text-5xl mb-3">🗂️</span>
              <p className="text-lg font-semibold text-gray-700 m-0">
                {searchQuery ? 'No visitors match your search' : 'No visitor history'}
              </p>
              <p className="text-sm text-gray-400 mt-1.5 mb-0">
                {searchQuery ? 'Try a different search term' : 'Checked-out visitors will appear here'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-[0.4px]">Visitor</th>
                    <th className="py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-[0.4px]">Purpose</th>
                    <th className="py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-[0.4px]">Phone</th>
                    <th className="py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-[0.4px]">Visit Time</th>
                    <th className="py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-[0.4px]">Checkout</th>
                    <th className="py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-[0.4px]">Status</th>
                    {rolee === 'security' && (
                      <th className="py-3 px-5 text-right text-xs font-medium text-gray-500 uppercase tracking-[0.4px]">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredRecent.map((visitor) => (
                    <tr
                      key={visitor._id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3.5 px-5 align-middle">
                        <div className="flex items-center gap-3">
                          <Avatar name={visitor.visitorName} />
                          <div>
                            <p className="text-sm font-semibold text-gray-700 m-0">{visitor.visitorName}</p>
                            {visitor.visitingBlock && (
                              <p className="text-xs text-gray-400 m-0">Block {visitor.visitingBlock}{visitor.visitingAdd ? ` · ${visitor.visitingAdd}` : ''}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 align-middle">
                        <span className="text-sm text-gray-500">{visitor.purpose || '—'}</span>
                      </td>
                      <td className="py-3.5 px-5 align-middle">
                        <span className="text-sm text-gray-600">{visitor.visitorPhone || '—'}</span>
                      </td>
                      <td className="py-3.5 px-5 align-middle">
                        <span className="text-sm text-gray-500">{formatVisitTime(visitor.visitDate)}</span>
                      </td>
                      <td className="py-3.5 px-5 align-middle">
                        <span className="text-sm text-gray-500">{visitor.duration || '—'}</span>
                      </td>
                      <td className="py-3.5 px-5 align-middle">
                        <span className="inline-flex items-center gap-1.5 py-[3px] px-2.5 bg-gray-100 text-gray-500 border border-gray-200 rounded-full text-xs font-medium">
                          Checked Out
                        </span>
                      </td>
                      {rolee === 'security' && (
                        <td className="py-3.5 px-5 align-middle">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => deleteVisitor(visitor._id)}
                              className="inline-flex items-center justify-center p-1.5 bg-transparent hover:bg-red-50 text-red-400 hover:text-red-600 border border-transparent hover:border-red-200 rounded-lg cursor-pointer transition-colors"
                              title="Delete visitor"
                            >
                              <Trash2 strokeWidth={2.5} className="w-[18px] h-[18px]" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          </div>
        </section>
      )}

      {/* ── ADD VISITOR MODAL ── */}
      {rolee === 'security' && showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-7 w-full max-w-[480px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-medium text-gray-900 m-0">Add New Visitor</h2>
                <p className="text-xs text-gray-400 mt-0.5 mb-0">Fill in visitor details below</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-transparent border-none text-lg text-gray-400 hover:text-gray-600 cursor-pointer p-1 leading-none"
              >✕</button>
            </div>
            <form onSubmit={handleAddVisitor}>
              {formFields.map(({ key, label, placeholder }) => (
                <div key={key} className="mb-4">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-[0.3px]">
                    {label} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={placeholder}
                    value={newVisitor[key] || ''}
                    onChange={(e) => setNewVisitor({ ...newVisitor, [key]: e.target.value })}
                    className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none box-border bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
              ))}
              <div className="flex justify-end gap-2.5 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors"
                >
                  Add Visitor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Visitor;
