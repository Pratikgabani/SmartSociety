import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { FiDownload, FiArrowLeft, FiFilter, FiSearch, FiRefreshCw, FiChevronDown, FiChevronUp } from "react-icons/fi";

const PreviousDataPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [modalData, setModalData] = useState([]);
  
  // 🔥 Virtualization State: Controls maximum HTML <tr> DOM nodes rendered at once.
  const [visibleCount, setVisibleCount] = useState(50);

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
        <mark key={idx} className="bg-yellow-200 text-yellow-900 px-1 rounded-sm font-semibold">
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

  // 🔥 Smart UI Reset: Whenever a user types a new search or changes a filter, we instantly clear the DOM back to 50 logs.
  // This immediately frees up RAM and jumps the table back to the top smoothly.
  useEffect(() => {
    setVisibleCount(50);
  }, [searchTerm, selectedYear, selectedMonth, sortOrder]);

  const tableHeaders =
    filteredByMonthYear.length > 0
      ? Object.keys(filteredByMonthYear[0])
          .filter((key) => key !== "_id" && key !== "id" && key !== "paymentIntentId" && key !== "societyId")
          .map((key) =>
            key === "paymentId" ? "Description" : key === "complainId" ? "Complaint By" : key
          )
      : [];

  const exportToExcel = async () => {
    if (filteredByMonthYear.length === 0) return;

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("History Data");

      // Define Columns
      worksheet.columns = tableHeaders.map((header) => ({
        header: header.toUpperCase(),
        key: header,
        width: 25,
      }));

      // Map and Add Data
      filteredByMonthYear.forEach((item) => {
        const rowData = {};
        tableHeaders.forEach((header) => {
          const actualKey = header === "Description" ? "paymentId" : header === "Complaint By" ? "complainId" : header;
          let cellValue = item[actualKey];

          if (actualKey === "paymentId" && cellValue?.description) {
            cellValue = cellValue.description;
          } else if (actualKey === "options" && Array.isArray(cellValue)) {
            cellValue = cellValue.map((opt) => `${opt.option} (${opt.votes} votes)`).join(", ");
          } else if (Array.isArray(cellValue)) {
            if (cellValue.length > 0 && typeof cellValue[0] === "object") {
               const val = cellValue[0];
               if (val?.name || val?.phoneNo || val?.houseNo) {
                  cellValue = cellValue.map((v) => `${v.name || "N/A"} - ${v.houseNo || "N/A"}`).join(", ");
               } else {
                 cellValue = JSON.stringify(cellValue);
               }
            } else {
               cellValue = cellValue.join(", ");
            }
          } else if (typeof cellValue === "object" && cellValue !== null) {
            if (cellValue.name && cellValue.phoneNo && cellValue.houseNo) {
               cellValue = `${cellValue.name} (${cellValue.houseNo})`;
            } else {
               cellValue = JSON.stringify(cellValue);
            }
          } else if (dateFields.includes(actualKey) && !isNaN(Date.parse(cellValue))) {
            cellValue = formatDate(cellValue);
          }

          rowData[header] = cellValue !== undefined && cellValue !== null ? cellValue : "N/A";
        });
        worksheet.addRow(rowData);
      });

      // Style Header
      worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1E3A8A" }, // tailwind blue-900
      };
      
      // Add border to all cells
      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.border = {
            top: {style:'thin', color: {argb:'FFD1D5DB'}},
            left: {style:'thin', color: {argb:'FFD1D5DB'}},
            bottom: {style:'thin', color: {argb:'FFD1D5DB'}},
            right: {style:'thin', color: {argb:'FFD1D5DB'}}
          };
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `History_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error("Failed to export Excel:", error);
    }
  };

  const renderValue = (key, value) => {
    if (key === "paymentId" && value?.description) {
      return highlightSearch(value.description);
    }

    if (key === "complainId" && typeof value === "object" && value !== null) {
      const name = value.name || "";
      const block = value.block || "";
      const houseNo = value.houseNo || "";
      const displayBlockHouse = (block && houseNo) ? `${block}-${houseNo}` : (houseNo ? houseNo : "");
      const finalStr = `${name} ${displayBlockHouse}`.trim();
      return <span className="text-gray-700 whitespace-nowrap">{highlightSearch(finalStr)}</span>;
    }

    if (key === "options" && Array.isArray(value)) {
      return (
        <div className="min-w-[200px]">
          <table className="w-full text-xs text-left text-gray-500 border border-gray-200">
            <thead className="text-gray-700 bg-gray-50 uppercase">
              <tr>
                <th className="px-2 py-1 border-b">Option</th>
                <th className="px-2 py-1 border-b">Votes</th>
                <th className="px-2 py-1 border-b">%</th>
              </tr>
            </thead>
            <tbody>
              {value.map((opt, idx) => (
                <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-2 py-1 font-medium text-gray-900">{highlightSearch(opt.option)}</td>
                  <td className="px-2 py-1">{opt.votes}</td>
                  <td className="px-2 py-1">{opt.percent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (Array.isArray(value)) {
      const filtered = value.filter(
        (v) => v?.name || v?.phoneNo || v?.houseNo || v?.block
      );
      if (filtered.length === 0) {
        return (
          <div className="max-w-xs max-h-32 overflow-y-auto mt-1 p-2 bg-gray-50 rounded border border-gray-200 text-xs text-gray-600 shadow-inner break-words">
            <pre className="whitespace-pre-wrap font-mono">
              {JSON.stringify(value, null, 2)}
            </pre>
          </div>
        );
      }
      return (
        <button
          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors duration-200"
          onClick={() => setModalData(filtered)}
        >
          View All ({filtered.length})
        </button>
      );
    }

    if (typeof value === "object" && value !== null) {
      if (value.name && value.phoneNo && value.houseNo && value.block) {
        return (
          <button
            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-full transition-colors duration-200"
            onClick={() => setModalData([value])}
          >
            View User Details
          </button>
        );
      }
      return (
        <div className="space-y-1 text-xs text-gray-600">
          {Object.entries(value).map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <span className="font-semibold text-gray-800 capitalize">{k}:</span>
              <span className="truncate max-w-[150px]" title={String(v)}>{renderValue(k, v)}</span>
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
            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
          >
            Access Link ↗
          </a>
        );
      }
      if (dateFields.includes(key) && !isNaN(Date.parse(value))) {
        return <span className="text-gray-700 font-medium whitespace-nowrap">{formatDate(value)}</span>;
      }
      return <span className="text-gray-700">{highlightSearch(value)}</span>;
    }

    return <span className="text-gray-700">{highlightSearch(String(value))}</span>;
  };

  return (
    <div className="max-w-[1200px] mx-auto py-6 px-4 md:py-8 md:px-6 font-sans text-gray-900 bg-gray-50 min-h-screen">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-7">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Go Back"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 m-0 tracking-[-0.3px]">Historical Records</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-0">View, filter, and export system audit and operational records.</p>
          </div>
        </div>
        <div className="flex gap-2.5 items-center w-full sm:w-auto">
          <button
            onClick={exportToExcel}
            disabled={filteredByMonthYear.length === 0}
            className="w-full sm:w-auto inline-flex justify-center items-center gap-2 py-[9px] px-[18px] bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors whitespace-nowrap"
          >
            <FiDownload className="w-4 h-4" />
            Export to Excel
          </button>
        </div>
      </div>

      {/* FILTER BAR & SEARCH */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="flex items-center justify-between gap-2 bg-gray-200/60 p-1 rounded-xl border border-gray-200/80 w-full sm:w-max">
            <FiFilter className="w-4 h-4 ml-2 text-gray-500" />
            <select
              className="bg-transparent border-none focus:ring-0 text-sm font-semibold text-gray-600 hover:text-gray-800 cursor-pointer outline-none"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">All Years</option>
              {years.map((year, idx) => (
                <option key={idx} value={year}>{year}</option>
              ))}
            </select>
            <div className="w-px h-4 bg-gray-300/80"></div>
            <select
              className="bg-transparent border-none focus:ring-0 text-sm font-semibold text-gray-600 hover:text-gray-800 cursor-pointer outline-none pr-2"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">All Months</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setSelectedYear("");
              setSelectedMonth("");
              setSearchTerm("");
            }}
            className="w-full sm:w-auto justify-center flex items-center gap-2 py-1.5 px-4 font-semibold text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-200/50 cursor-pointer transition-all duration-300 rounded-lg whitespace-nowrap border border-transparent"
            title="Reset Filters"
          >
            <FiRefreshCw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:max-w-[280px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-[38px] pr-3 py-2.5 border border-gray-200/80 rounded-xl text-sm text-gray-900 outline-none bg-white font-medium box-border focus:ring-2 focus:ring-blue-100 hover:border-gray-300 focus:border-blue-400 transition-all"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.05)] overflow-hidden">
        {filteredByMonthYear.length === 0 ? (
          <div className="text-center py-16 px-6">
            <p className="text-[2rem] mb-2">🗂️</p>
            <h3 className="font-semibold text-gray-700 mb-1">No records found</h3>
            <p className="text-sm text-gray-400 m-0">We couldn't find any data matching your criteria.</p>
          </div>
        ) : (
          <div 
            className="overflow-x-auto overflow-y-auto max-h-[520px]"
            onScroll={(e) => {
              const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
              if (scrollHeight - scrollTop <= clientHeight + 50) {
                 if (visibleCount < filteredByMonthYear.length) {
                    setVisibleCount(prev => prev + 50);
                 }
              }
            }}
          >
            <table className="w-full border-collapse min-w-[650px] relative">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 sticky top-0 z-[1]">
                  {tableHeaders.map((header, idx) => (
                    <th 
                      key={header} 
                      className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-[0.4px] whitespace-nowrap"
                    >
                      <div className="flex items-center gap-2 w-max">
                        {header === "Description" ? "Description" : header === "Complaint By" ? "Complaint By" : header.replace(/([A-Z])/g, ' $1').trim()}
                        {dateFields.includes(header === "Description" ? "paymentId" : header === "Complaint By" ? "complainId" : header) && (
                          <button onClick={toggleSortOrder} className="p-0.5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
                            {sortOrder === "asc" ? <FiChevronUp className="w-3.5 h-3.5" /> : <FiChevronDown className="w-3.5 h-3.5" /> }
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredByMonthYear
                  .filter((item) => {
                    if ("paymentId" in item) {
                      return item.paymentId?.description;
                    }
                    return true;
                  })
                  .slice(0, visibleCount)
                  .map((item, idx) => (
                    <tr key={idx} className="border-t border-gray-100 bg-white hover:bg-slate-50 transition-colors duration-100">
                      {tableHeaders.map((header) => {
                        const actualKey = header === "Description" ? "paymentId" : header === "Complaint By" ? "complainId" : header;
                        return (
                          <td key={actualKey} className="py-3.5 px-4 text-sm text-gray-700 align-middle whitespace-normal">
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
        {/* Footer of table for record counts & scroll status */}
        {filteredByMonthYear.length > 0 && (
           <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center text-xs">
             <p className="text-gray-500 m-0">
               Showing records: <span className="font-semibold text-gray-900">{filteredByMonthYear.length}</span> total
             </p>
             {visibleCount < filteredByMonthYear.length && (
               <span className="font-semibold text-blue-600 animate-pulse">
                 Scroll down to load more...
               </span>
             )}
           </div>
        )}
      </div>

      {/* Modern Modal for Sub-details (User Info) */}
      {modalData.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900/40 backdrop-blur-sm transition-all">
          <div className="relative w-full max-w-2xl p-4 sm:p-6 lg:p-8">
            <div className="relative bg-white rounded-xl shadow-2xl pb-4 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
                <h3 className="text-lg font-semibold text-gray-900">
                  User Details
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center transition-colors"
                  onClick={() => setModalData([])}
                >
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              
              <div className="p-6">
                <div className="overflow-y-auto max-h-[60vh] rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">House No</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Block</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {modalData.map((user, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phoneNo || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.houseNo || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                             <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                               {user.block || "-"}
                             </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviousDataPage;
