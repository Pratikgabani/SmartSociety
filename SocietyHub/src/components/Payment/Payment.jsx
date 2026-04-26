import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from "../../axios";
import PreviousDataModal from '../history/PreviousDataModal ';
import { Plus, X, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { HashLoader } from 'react-spinners';
import UserContext from "../../context/UserContext";

// ── PaymentRow ────────────────────────────────────────────────────────────────
const PaymentRow = React.memo(({ payment, status, payDate, receiptUrl, rolee, onRequestDelete }) => {
  const isPaid = status === "Paid";
  const isOverdue = !isPaid && new Date(payment.dueDate) < new Date();

  return (
    <tr className="transition-colors duration-100 bg-white hover:bg-slate-50 border-b border-gray-100 last:border-none">
      {/* Description */}
      <td className="py-3.5 px-4 text-sm text-gray-700 align-middle">
        <span className="font-medium text-gray-900 text-sm">{payment.description}</span>
      </td>

      {/* Amount */}
      <td className="py-3.5 px-4 text-sm text-gray-700 align-middle">
        <span className="font-medium text-[1rem] text-gray-900">₹{payment.amount}</span>
      </td>

      {/* Status badge */}
      <td className="py-3.5 px-4 text-sm text-gray-700 align-middle">
        <span className={`inline-block py-[3px] px-2.5 rounded-full text-xs font-medium tracking-[0.2px] ${isPaid
            ? "bg-green-100 text-green-800"
            : isOverdue
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}>
          {isOverdue ? "Overdue" : status}
        </span>
      </td>

      {/* Payment Date */}
      <td className="py-3.5 px-4 text-sm text-gray-700 align-middle">
        <span className="text-[0.82rem] text-gray-500">{payDate}</span>
      </td>

      {/* Due Date */}
      <td className="py-3.5 px-4 text-sm text-gray-700 align-middle">
        <span className={`text-[0.82rem] ${isOverdue ? "text-red-600 font-semibold" : "text-gray-500"}`}>
          {new Date(payment.dueDate).toLocaleDateString("en-GB")}
        </span>
      </td>

      {/* Actions */}
      <td className="py-3.5 px-4 text-sm text-gray-700 align-middle whitespace-nowrap">
        <div className="flex items-center gap-2 justify-end">
          {status !== "Paid" && (
            <Link
              to={`/layout/payPayment/${payment._id}`}
              className="inline-block py-1.5 px-3.5 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-[7px] text-xs font-semibold no-underline transition-colors whitespace-nowrap"
            >
              Pay Now
            </Link>
          )}
          {status === "Paid" && (
            <>
              {receiptUrl ? (
                <a
                  href={receiptUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block py-[5px] px-3 bg-transparent hover:bg-blue-50 text-blue-600 border border-blue-600 rounded-[7px] text-xs font-semibold no-underline transition-colors whitespace-nowrap"
                >
                  View Receipt
                </a>
              ) : (
                <span className="inline-block py-[5px] px-2.5 bg-gray-50 text-gray-400 border border-gray-100 rounded-[6px] text-xs font-medium whitespace-nowrap">No receipt</span>
              )}
            </>
          )}
          {rolee === "admin" && (
            <button
              onClick={() => onRequestDelete(payment._id, payment.description)}
              className="inline-flex items-center justify-center p-1.5 bg-transparent hover:bg-red-50 text-red-500 hover:text-red-700 border-none rounded-[6px] cursor-pointer transition-colors"
              title="Delete"
            >
              <Trash2 strokeWidth={2.5} className="w-[18px] h-[18px]" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
});

const PaymentSection = () => {
  const [payments, setPayments] = useState([]);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [newPayment, setNewPayment] = useState({ description: "", amount: "", dueDate: "" });
  const [loading, setLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [previousData, setPreviousData] = useState([]);
  const [fetchAgain, setFetchAgain] = useState([]);
  const [kaam, setKaam] = useState([]);
  const { rolee } = useContext(UserContext);

  // Pagination States
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // UI-only state for search + filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activePayTab, setActivePayTab] = useState("pending");

  // Confirm delete modal state
  const [confirmModal, setConfirmModal] = useState({ open: false, paymentId: null, description: "" });

  const handleRequestDelete = (paymentId, description) => {
    setConfirmModal({ open: true, paymentId, description });
  };

  const handleConfirmDelete = () => {
    deletePayment(confirmModal.paymentId);
    setConfirmModal({ open: false, paymentId: null, description: "" });
  };

  const fetchPurchases = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/purchase/getAllPurchases`, { withCredentials: true });
      setKaam(response.data.data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  useEffect(() => {
    fetchPayments(page === 1, page === 1, page);
  }, [page]);

  useEffect(() => {
    const url = `${import.meta.env.VITE_URL_BACKEND}/api/v1/payment/stream`;
    const es = new EventSource(url, { withCredentials: true });

    es.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "payment_intent.succeeded") {
          fetchPurchases();
          fetchPayments(false);
        }
      } catch (err) {
        console.error("SSE parse error", err);
      }
    };

    es.onerror = () => {
      es.close();
    };

    return () => {
      es.close();
    };
  }, []);

  const fetchPayments = async (showLoader = true, reset = true, pageNum = 1) => {
    if (showLoader) setLoading(true);
    if (!reset) setIsFetchingMore(true);

    try {
      const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/payment/getPayments?page=${pageNum}&limit=15`, {
        withCredentials: true,
      });

      const { data: fetchedPayments, hasMore: morePayments } = response.data.data;

      if (reset) {
        setPayments(fetchedPayments);
      } else {
        setPayments(prev => {
          const existingIds = new Set(prev.map(p => p._id));
          const uniqueNew = fetchedPayments.filter(p => !existingIds.has(p._id));
          return [...prev, ...uniqueNew];
        });
      }
      setHasMore(morePayments);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }

    if (showLoader) setLoading(false);
    if (!reset) setIsFetchingMore(false);
  };

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      if (hasMore && !isFetchingMore && !loading) {
        setPage((prev) => prev + 1);
      }
    }
  };

  const fetchAgainData = async (a) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/payment/getAdminData`, { withCredentials: true });
      setFetchAgain(response.data.data);
      navigate("/history", { state: { data: response.data.data } });
      setIsAdminModalOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchPreviousData = async (a) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/v1/purchase/getAllPurchases`, { withCredentials: true });
      setPreviousData(response.data.data);
      navigate("/history", { state: { data: response.data.data } });
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deletePayment = useCallback(async (paymentId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_URL_BACKEND}/api/v1/payment/deletePayment/${paymentId}`, {
        withCredentials: true,
      });
      toast.success("Payment deleted successfully!");
      setPayments((prev) => prev.filter((payment) => payment._id !== paymentId));
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  }, []);

  const handleNewPaymentChange = (e) => {
    setNewPayment({ ...newPayment, [e.target.name]: e.target.value });
  };

  const paymentStatus = (payId) => {
    if (kaam.length > 0) {
      return kaam.some(purchase => purchase.paymentId && purchase.paymentId._id === payId)
        ? "Paid"
        : "Pending";
    }
    return "Pending";
  };

  const paymentDateLaao = (payId) => {
    if (kaam.length > 0) {
      const found = kaam.find(purchase => purchase.paymentId && purchase.paymentId._id === payId);
      if (found) {
        return new Date(found.paidOn).toLocaleDateString("en-GB");
      }
    }
    return "N/A";
  };

  const getPaymentReceiptUrl = (payId) => {
    if (kaam.length > 0) {
      const found = kaam.find(purchase => purchase.paymentId && purchase.paymentId._id === payId);
      return found?.receiptUrl || null;
    }
    return null;
  };

  const addPayment = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_URL_BACKEND}/api/v1/payment/createPayment`, newPayment, {
        withCredentials: true,
      });
      setShowAdminForm(false);
      setNewPayment({ description: "", amount: "", dueDate: "" });
      setPage(1);
      fetchPayments(true, true, 1);
      toast.success("Payment added successfully!");
    } catch (error) {
      console.error("Error adding payment:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <HashLoader size={52} color="#2563eb" loading={loading} />
        <p className="mt-4 text-sm text-gray-500 font-medium">Loading payments…</p>
      </div>
    );
  }

  // Derived summary stats
  const totalPaid = payments.filter(p => paymentStatus(p._id) === "Paid").reduce((s, p) => s + Number(p.amount), 0);
  const totalPending = payments.filter(p => paymentStatus(p._id) !== "Paid").reduce((s, p) => s + Number(p.amount), 0);
  const totalOverdue = payments.filter(p => paymentStatus(p._id) !== "Paid" && new Date(p.dueDate) < new Date()).reduce((s, p) => s + Number(p.amount), 0);
  const totalTxns = payments.length;

  // Tab-split lists
  const pendingPayments = payments.filter(p => paymentStatus(p._id) !== "Paid");
  const paidPayments = payments.filter(p => paymentStatus(p._id) === "Paid");
  const overdueCount = pendingPayments.filter(p => new Date(p.dueDate) < new Date()).length;

  const statCards = [
    { label: "Total Paid", value: `₹${totalPaid.toLocaleString("en-IN")}`, cls: "bg-white border-gray-200 text-gray-900" },
    { label: "Pending Amount", value: `₹${totalPending.toLocaleString("en-IN")}`, cls: "bg-white border-gray-200 text-gray-900" },
    { label: "Overdue Amount", value: `₹${totalOverdue.toLocaleString("en-IN")}`, cls: "bg-white border-gray-200 text-gray-900" },
    { label: "Total Charges", value: totalTxns, cls: "bg-white border-gray-200 text-gray-900" },
  ];

  return (
    <div className="max-w-[1200px] mx-auto py-6 px-4 md:py-8 md:px-6 font-sans text-gray-900 bg-gray-50 min-h-screen">

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-7">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 m-0 tracking-[-0.3px]">Payments</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-0">Manage society maintenance and charges</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2.5 items-center w-full sm:w-auto">
          {rolee === "admin" && (
            <button
              onClick={fetchAgainData}
              className="w-full sm:w-auto py-[9px] px-[18px] bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold cursor-pointer transition-colors whitespace-nowrap"
            >
              All Data
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

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map(({ label, value, cls }) => (
          <div key={label} className={`p-5 rounded-xl border shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${cls}`}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-[0.4px] m-0 mb-1.5">{label}</p>
            <p className="text-[1.6rem] font-semibold m-0 tracking-[-0.5px]">{value}</p>
          </div>
        ))}
      </div>

      {/* TAB BAR & SEARCH */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        {/* Containerized Tabs */}
        <div className="flex bg-gray-200/60 p-1 rounded-xl border border-gray-200/80 w-full md:w-max max-w-full overflow-x-auto no-scrollbar">
          {[
            { id: "pending", label: "Pending Payments", count: pendingPayments.length },
            { id: "history", label: "Paid Payments", count: paidPayments.length },
          ].map(tab => {
            const isActive = activePayTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePayTab(tab.id)}
                className={`flex items-center gap-2 py-1.5 px-4 font-semibold text-sm cursor-pointer transition-all duration-300 rounded-lg whitespace-nowrap border border-transparent ${isActive
                    ? "bg-white text-blue-700 shadow-sm border-gray-200/50"
                    : "bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                  }`}
              >
                <span>{tab.label}</span>
                <span className={`inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full text-xs font-medium ${isActive ? "bg-blue-100/80 text-blue-700" : "bg-gray-300/60 text-gray-600"
                  }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full md:max-w-[280px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search payments…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-[38px] pr-3 py-2.5 border border-gray-200/80 rounded-xl text-sm text-gray-900 outline-none bg-white font-medium box-border focus:ring-2 focus:ring-blue-100 hover:border-gray-300 focus:border-blue-400 transition-all"
            />
          </div>

          {rolee === "admin" && (
            <button
              onClick={() => setShowAdminForm(true)}
              className="w-full sm:w-auto py-[9px] px-[18px] bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors whitespace-nowrap"
            >
              + New Payment
            </button>
          )}
        </div>
      </div>

      {/* PENDING TAB */}
      {activePayTab === "pending" && (
        <section>
          {pendingPayments.length > 0 && (
            <div className="py-2.5 px-3.5 bg-yellow-50 border border-yellow-200 rounded-lg mb-3.5 text-sm">
              <span className={`font-semibold ${overdueCount > 0 ? "text-red-800" : "text-yellow-800"}`}>
                {overdueCount > 0 ? ` ${overdueCount} overdue · ` : ""}
                {pendingPayments.length} pending payment{pendingPayments.length !== 1 ? "s" : ""}
              </span>
              <span className="text-gray-500 text-[0.82rem] ml-1.5">— please clear dues to avoid penalties</span>
            </div>
          )}



          <div className="bg-white rounded-xl border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.05)] overflow-auto max-h-[520px]" onScroll={handleScroll}>
            <table className="w-full border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 sticky top-0 z-[1]">
                  {["Description", "Amount", "Status", "Due Date", "Action"].map(h => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-[0.4px] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pendingPayments
                  .filter(p => p.description.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((payment) => (
                    <PaymentRow
                      key={payment._id}
                      payment={payment}
                      status={paymentStatus(payment._id)}
                      payDate={paymentDateLaao(payment._id)}
                      receiptUrl={getPaymentReceiptUrl(payment._id)}
                      rolee={rolee}
                      onRequestDelete={handleRequestDelete}
                    />
                  ))}
              </tbody>
            </table>

            {pendingPayments.filter(p => p.description.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
              <div className="text-center py-16 px-6">
                <p className="text-[2rem] mb-2">🎉</p>
                <p className="font-semibold text-gray-700 mb-1">No pending payments!</p>
                <p className="text-sm text-gray-400">You're all caught up. Great job!</p>
              </div>
            )}

            {isFetchingMore && (
              <div className="text-center py-4 text-sm text-blue-600 font-semibold">Fetching older records…</div>
            )}
            {!hasMore && pendingPayments.length > 0 && (
              <div className="text-center py-3 text-xs text-gray-400">✓ All records loaded</div>
            )}
          </div>
        </section>
      )}

      {/* HISTORY TAB */}
      {activePayTab === "history" && (
        <section>


          <div className="bg-white rounded-xl border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.05)] overflow-auto max-h-[520px] opacity-[0.95]" onScroll={handleScroll}>
            <table className="w-full border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 sticky top-0 z-[1]">
                  {["Description", "Amount", "Status", "Payment Date", "Due Date", "Action"].map(h => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-[0.4px] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paidPayments
                  .filter(p => p.description.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((payment) => (
                    <PaymentRow
                      key={payment._id}
                      payment={payment}
                      status={paymentStatus(payment._id)}
                      payDate={paymentDateLaao(payment._id)}
                      receiptUrl={getPaymentReceiptUrl(payment._id)}
                      rolee={rolee}
                      onRequestDelete={handleRequestDelete}
                    />
                  ))}
              </tbody>
            </table>

            {paidPayments.filter(p => p.description.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
              <div className="text-center py-16 px-6">
                <p className="text-[2rem] mb-2">🗂️</p>
                <p className="font-semibold text-gray-700 mb-1">No paid payments </p>
                <p className="text-sm text-gray-400">Completed payments will appear here</p>
              </div>
            )}

            {isFetchingMore && (
              <div className="text-center py-4 text-sm text-blue-600 font-semibold">Fetching older records…</div>
            )}
            {!hasMore && paidPayments.length > 0 && (
              <div className="text-center py-3 text-xs text-gray-400">✓ All records loaded</div>
            )}
          </div>
        </section>
      )}

      {/* ADD PAYMENT MODAL */}
      {showAdminForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-7 w-full max-w-[440px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-gray-900 m-0">New Payment</h2>
              <button onClick={() => setShowAdminForm(false)} className="bg-transparent border-none text-lg text-gray-400 hover:text-gray-600 cursor-pointer p-1 leading-none">✕</button>
            </div>
            {[
              { label: "Description", name: "description", type: "text", placeholder: "e.g. Monthly Maintenance" },
              { label: "Amount (₹)", name: "amount", type: "number", placeholder: "e.g. 2500" },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name} className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-[0.3px]">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={newPayment[name]}
                  onChange={handleNewPaymentChange}
                  placeholder={placeholder}
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none box-border bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>
            ))}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-[0.3px]">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={newPayment.dueDate}
                onChange={handleNewPaymentChange}
                className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none box-border bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
            <div className="flex justify-end gap-2.5 mt-6">
              <button onClick={() => setShowAdminForm(false)} className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold cursor-pointer transition-colors">Cancel</button>
              <button
                onClick={addPayment}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors"
              >
                Add Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {confirmModal.open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-7 w-full max-w-[400px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-200 text-center">
            <div className="flex justify-center mb-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h2 className="text-xl font-medium text-gray-900 m-0 mb-2 justify-center">Delete Payment?</h2>
            <p className="text-sm text-gray-500 m-0 mb-1.5">Are you sure you want to delete</p>
            <p className="text-sm font-semibold text-gray-900 m-0 mb-6">"{confirmModal.description}"</p>
            <p className="text-xs text-gray-400 mb-6 -mt-3">This action cannot be undone.</p>
            <div className="flex gap-2.5 justify-center">
              <button
                onClick={() => setConfirmModal({ open: false, paymentId: null, description: "" })}
                className="flex-1 max-w-[140px] py-2.5 px-0 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 max-w-[140px] py-2.5 px-0 bg-red-600 hover:bg-red-700 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSection;
