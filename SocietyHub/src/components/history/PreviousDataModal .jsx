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
      ? Object.keys(filteredByMonthYear[0]).map((key) =>
          key === "paymentId" ? "Description" : key
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
          const actualKey = header === "Description" ? "paymentId" : header;
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header Section */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-[95%] mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                title="Go Back"
              >
                <FiArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  Historical Records
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  View, filter, and export system audit and operational records.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={exportToExcel}
                disabled={filteredByMonthYear.length === 0}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-4 py-2 text-sm font-semibold rounded-md shadow-sm transition-colors duration-200"
              >
                <FiDownload className="w-4 h-4" />
                Export to Excel
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[95%] mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Controls / Filter Bar */}
        <div className="bg-white rounded-t-lg border border-gray-200 border-b-0 p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search records across all fields..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-700 font-medium bg-gray-50 rounded-md border border-gray-200 p-1">
              <FiFilter className="w-4 h-4 ml-2 text-gray-500" />
              <select
                className="bg-transparent border-none focus:ring-0 text-sm font-medium pr-8 cursor-pointer"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="">All Years</option>
                {years.map((year, idx) => (
                  <option key={idx} value={year}>{year}</option>
                ))}
              </select>
              <div className="w-px h-4 bg-gray-300"></div>
              <select
                className="bg-transparent border-none focus:ring-0 text-sm font-medium pr-8 cursor-pointer"
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
              className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4 text-gray-500" />
              Reset
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white border text-sm text-gray-900 border-gray-200 rounded-b-lg shadow-sm overflow-hidden">
          {filteredByMonthYear.length === 0 ? (
             <div className="py-16 flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <FiSearch className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No records found</h3>
              <p className="mt-1 text-sm text-gray-500 max-w-sm">
                We couldn't find any data matching your current filters and search criteria. Try adjusting them.
              </p>
            </div>
          ) : (
            // 🔥 Virtualization Wrapper: We lock the height and attach an Intersection Observer to the boundary box.
            <div 
              className="overflow-x-auto overflow-y-auto max-h-[600px] border-b border-gray-200"
              onScroll={(e) => {
                const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
                if (scrollHeight - scrollTop <= clientHeight + 50) {
                   if (visibleCount < filteredByMonthYear.length) {
                      setVisibleCount(prev => prev + 50);
                   }
                }
              }}
            >
              <table className="min-w-full divide-y divide-gray-200 relative">
                <thead className="bg-gray-50">
                  <tr>
                    {tableHeaders.map((header, idx) => (
                      <th 
                        key={header} 
                        scope="col" 
                        className={`px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${idx === 0 ? 'rounded-tl-lg' : ''} ${idx === tableHeaders.length-1 ? 'rounded-tr-lg' : ''}`}
                      >
                        <div className="flex items-center gap-2 w-max">
                          {header === "description" ? "Description" : header.replace(/([A-Z])/g, ' $1').trim()}
                          {/* We only attach SORT to the first date header found for simplicity, or we let a global sort handle it */}
                          {dateFields.includes(header === "description" ? "paymentId" : header) && (
                            <button onClick={toggleSortOrder} className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
                              {sortOrder === "asc" ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" /> }
                            </button>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredByMonthYear
                    .filter((item) => {
                      if ("paymentId" in item) {
                        return item.paymentId?.description;
                      }
                      return true;
                    })
                    .slice(0, visibleCount)  // 🔥 Slicing logic: Blocks React from rendering 50,000 DOM nodes at a time!
                    .map((item, idx) => (
                      <tr key={idx} className="hover:bg-indigo-50/50 transition-colors duration-150 ease-in-out">
                        {tableHeaders.map((header) => {
                          const actualKey =
                            header === "Description" ? "paymentId" : header;
                          return (
                            <td key={actualKey} className="px-6 py-4 whitespace-normal align-top text-sm">
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
             <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center">
               <p className="text-sm text-gray-500">
                 Showing matching database records: <span className="font-semibold text-gray-900">{filteredByMonthYear.length}</span> total.
               </p>
               {visibleCount < filteredByMonthYear.length && (
                 <span className="text-xs font-semibold text-indigo-600 animate-pulse">
                   Scroll down to render more...
                 </span>
               )}
             </div>
          )}
        </div>
      </main>

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
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
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
