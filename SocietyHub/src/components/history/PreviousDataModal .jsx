

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PreviousDataPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [modalData, setModalData] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state?.data || [];

  const dateFields = [
    "date",
    "eventDate",
    "visitDate",
    "dueDate",
    "paidOn",
    "createdAt",
    "updatedAt",
    "resolvedDate",
    "lastDateOfPay",
  ];

  const getDateField = (item) => {
    for (const key of dateFields) {
      if (item[key]) return new Date(item[key]);
    }
    return null;
  };

  const years = Array.from(
    new Set(
      data
        .map((item) => {
          const d = getDateField(item);
          return d ? d.getFullYear() : null;
        })
        .filter((year) => year !== null)
    )
  );

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    const parsed = new Date(date);
    if (isNaN(parsed)) return date;
    const is530AM = parsed.getHours() === 5 && parsed.getMinutes() === 30;
    return is530AM
      ? parsed.toLocaleDateString("en-IN", { dateStyle: "medium" })
      : parsed.toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        });
  };

  const highlightSearch = (text) => {
    if (!searchTerm) return text;
    const parts = String(text).split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, idx) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={idx} className="bg-yellow-300 px-1">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const safeSearchFilter = (item) => {
    if (!searchTerm) return true;
    const lower = searchTerm.toLowerCase();
    return Object.entries(item).some(([key, value]) => {
      if (typeof value === "string" || typeof value === "number") {
        return String(value).toLowerCase().includes(lower);
      }
      if (Array.isArray(value)) {
        return value.some((v) =>
          typeof v === "string"
            ? v.toLowerCase().includes(lower)
            : JSON.stringify(v).toLowerCase().includes(lower)
        );
      }
      if (typeof value === "object" && value !== null) {
        return JSON.stringify(value).toLowerCase().includes(lower);
      }
      return false;
    });
  };

  const sortedFilteredData = data
    .filter(safeSearchFilter)
    .sort((a, b) => {
      const dateA = getDateField(a);
      const dateB = getDateField(b);
      const timeA = dateA ? dateA.getTime() : 0;
      const timeB = dateB ? dateB.getTime() : 0;
      return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
    });

  const filteredByMonthYear = sortedFilteredData.filter((item) => {
    const dateObj = getDateField(item);
    const matchesYear = selectedYear
      ? dateObj?.getFullYear() === parseInt(selectedYear)
      : true;
    const matchesMonth = selectedMonth
      ? dateObj?.getMonth() + 1 === parseInt(selectedMonth)
      : true;
    return matchesYear && matchesMonth;
  });

  const renderValue = (key, value) => {
    // ✅ Special handling for paymentId
    if (key === "paymentId" && value?.description) {
      return highlightSearch(value.description);
    }

    if (key === "options" && Array.isArray(value)) {
      return (
        <table className="text-sm border w-full mb-2">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-1">Option</th>
              <th className="border p-1">Votes</th>
              <th className="border p-1">Percent</th>
            </tr>
          </thead>
          <tbody>
            {value.map((opt, idx) => (
              <tr key={idx}>
                <td className="border p-1">{highlightSearch(opt.option)}</td>
                <td className="border p-1">{opt.votes}</td>
                <td className="border p-1">{opt.percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (Array.isArray(value)) {
      const filtered = value.filter(
        (v) => v?.name || v?.phoneNo || v?.houseNo || v?.block
      );
      if (filtered.length === 0) {
        return (
          <pre className="whitespace-pre-wrap break-words text-xs bg-gray-50 p-2 border rounded">
            {JSON.stringify(value, null, 2)}
          </pre>
        );
      }
      return (
        <button
          className="text-blue-600 underline cursor-pointer"
          onClick={() => setModalData(filtered)}
        >
          View All
        </button>
      );
    }

    if (typeof value === "object" && value !== null) {
      if (value.name && value.phoneNo && value.houseNo && value.block) {
        return (
          <button
            className="text-blue-600 underline cursor-pointer"
            onClick={() => setModalData([value])}
          >
            View User
          </button>
        );
      }
      return (
        <div className="space-y-1">
          {Object.entries(value).map(([k, v]) => (
            <div key={k}>
              <strong>{k}:</strong> {renderValue(k, v)}
            </div>
          ))}
        </div>
      );
    }

    if (typeof value === "string") {
      if (value.startsWith("http")) {
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Open Link
          </a>
        );
      }
      if (dateFields.includes(key) && !isNaN(Date.parse(value))) {
        return formatDate(value);
      }
      return highlightSearch(value);
    }

    return highlightSearch(String(value));
  };

  // ✅ Column header with paymentId → description
  const tableHeaders =
  filteredByMonthYear.length > 0
    ? Object.keys(filteredByMonthYear[0]).map((key) =>
        key === "paymentId" ? "Description" : key
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-10">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold">Previous Data</h2>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={toggleSortOrder}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Sort by Date {sortOrder === "asc" ? "↑" : "↓"}
            </button>

            <select
              className="border p-2 rounded"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">All Years</option>
              {years.map((year, idx) => (
                <option key={idx} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              className="border p-2 rounded"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">All Months</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setSelectedYear("");
                setSelectedMonth("");
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Reset Filter
            </button>

            <button
              onClick={() => navigate(-1)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Back
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search..."
          className="p-2 border border-black text-black font-medium rounded w-full mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredByMonthYear.length === 0 ? (
          <p className="text-gray-500">No matching data found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  {tableHeaders.map((header) => (
                    <th key={header} className="p-3 capitalize border">
                      {header === "description" ? "Description" : header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredByMonthYear.map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                  {tableHeaders.map((header) => {
  const actualKey = header === "Description" ? "paymentId" : header;
  return (
    <td key={actualKey} className="p-3 align-top border">
      {renderValue(actualKey, item[actualKey])}
    </td>
  );
})}

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalData.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">User Info</h3>
              <button
                className="text-red-600 text-sm font-bold"
                onClick={() => setModalData([])}
              >
                Close
              </button>
            </div>
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Phone</th>
                  <th className="border p-2">House No</th>
                  <th className="border p-2">Block</th>
                </tr>
              </thead>
              <tbody>
                {modalData.map((user, idx) => (
                  <tr key={idx}>
                    <td className="border p-2">{user.name || "-"}</td>
                    <td className="border p-2">{user.phoneNo || "-"}</td>
                    <td className="border p-2">{user.houseNo || "-"}</td>
                    <td className="border p-2">{user.block || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviousDataPage;
