import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowDownAZ, ArrowUpZA } from "lucide-react";

const PreviousDataPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state?.data || [];

  // Extract unique years from data
  const years = Array.from(
    new Set(
      data
        .map((item) =>
          new Date(
            item.date ||
              item.eventDate ||
              item.visitDate ||
              item.dueDate ||
              item.paidOn
          ).getFullYear()
        )
        .filter((year) => !isNaN(year))
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

  const formatValue = (key, value) => {
    if (value == null) return "N/A";
    if (typeof value === "number") return value;
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "string" && !isNaN(value)) return value;
    if (typeof value === "string" && value.startsWith("http")) {
      return (
        <a
          href={value}
          className="text-blue-500 font-medium"
          target="_blank"
          rel="noopener noreferrer"
        >
          link
        </a>
      );
    }

    const isDate =
      typeof value === "string" && !isNaN(Date.parse(value));
    if (isDate) return new Date(value).toLocaleDateString("en-GB");

    if (Array.isArray(value)) {
      return (
        <ul className="list-disc pl-4">
          {value.length > 0 ? (
            value.map((item, index) => (
              <li key={index} className="p-1">
                {typeof item === "object"
                  ? formatValue("", item)
                  : item}
              </li>
            ))
          ) : (
            <li>No data</li>
          )}
        </ul>
      );
    }

    if (typeof value === "object") {
      return (
        <ul className="border p-2 rounded-md bg-gray-100">
          {Object.entries(value).map(([subKey, subValue]) => (
            <li key={subKey} className="p-1">
              <strong>{subKey}:</strong>{" "}
              {formatValue(subKey, subValue)}
            </li>
          ))}
        </ul>
      );
    }

    return value;
  };

  // === Sort + Filter ===
  const sortedFilteredData = (Array.isArray(data) ? [...data] : [])
    .filter((item) =>
      Object.values(item || {}).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      const dateA = new Date(
        a.date ||
          a.eventDate ||
          a.visitDate ||
          a.dueDate ||
          a.paidOn ||
          0
      );
      const dateB = new Date(
        b.date ||
          b.eventDate ||
          b.visitDate ||
          b.dueDate ||
          b.paidOn ||
          0
      );
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  // === Month-Year Filtering ===
  const filteredByMonthYear = sortedFilteredData.filter((item) => {
    const dateObj = new Date(
      item.date ||
        item.eventDate ||
        item.visitDate ||
        item.dueDate ||
        item.paidOn
    );
    const matchesYear = selectedYear
      ? dateObj.getFullYear() === parseInt(selectedYear)
      : true;
    const matchesMonth = selectedMonth
      ? dateObj.getMonth() + 1 === parseInt(selectedMonth)
      : true;
    return matchesYear && matchesMonth;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-10">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold">Previous Data</h2>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={toggleSortOrder}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
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
          <ul className="space-y-4">
            {filteredByMonthYear.map((item, index) => (
              <li key={index} className="border-b pb-4">
                {Object.keys(item).length === 0 ? (
                  <p className="text-gray-500">No data available</p>
                ) : (
                  Object.entries(item).map(([key, value]) => (
                    <p key={key} className="p-1 text-sm sm:text-base">
                      <strong>{key}:</strong> {formatValue(key, value)}
                    </p>
                  ))
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PreviousDataPage;



// import { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// const PreviousDataPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();

//   const data = location.state?.data || [];

//   const formatValue = (key, value) => {
//     if (value == null) return "N/A";
//     if (typeof value === "number") return value;
//     if (typeof value === "boolean") return value ? "Yes" : "No";

//     if (typeof value === "string" && !isNaN(Date.parse(value))) {
//       return new Date(value).toLocaleString("en-UK");
//     }

//     if (Array.isArray(value)) {
//       return value.length > 0 ? (
//         <ul className="list-disc pl-4">
//           {value.map((item, index) => (
//             <li key={index} className="p-1">
//               {typeof item === "object" ? formatValue("", item) : item}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <span>No items</span>
//       );
//     }

//     if (typeof value === "object") {
//       return (
//         <ul className="border p-2 rounded-md bg-gray-100">
//           {Object.entries(value).map(([subKey, subValue]) => (
//             <li key={subKey} className="p-1">
//               <strong>{subKey}:</strong> {formatValue(subKey, subValue)}
//             </li>
//           ))}
//         </ul>
//       );
//     }

//     if (typeof value === "string" && value.startsWith("http")) {
//       return (
//         <a
//           href={value}
//           className="text-blue-500 font-medium"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Link
//         </a>
//       );
//     }

//     return value;
//   };

//   const filteredData = Array.isArray(data)
//     ? data.filter((item) =>
//         Object.values(item || {}).some((value) =>
//           String(value).toLowerCase().includes(searchTerm.toLowerCase())
//         )
//       )
//     : [];

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-10">
//       <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-bold">Previous Data</h2>
//           <button
//             onClick={() => navigate(-1)}
//             className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//           >
//             Back
//           </button>
//         </div>

//         <input
//           type="text"
//           placeholder="Search..."
//           className="p-2 border border-black text-black font-medium rounded w-full mb-4"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         {filteredData.length === 0 ? (
//           <p className="text-gray-500">No matching data found.</p>
//         ) : (
//           <ul className="space-y-4">
//             {filteredData.map((item, index) => (
//               <li key={index} className="border-b pb-4">
//                 {Object.keys(item).length === 0 ? (
//                   <p className="text-gray-500">No data available</p>
//                 ) : (
//                   Object.entries(item).map(([key, value]) => (
//                     <p key={key} className="p-1 text-sm sm:text-base">
//                       <strong>{key}:</strong> {formatValue(key, value)}
//                     </p>
//                   ))
//                 )}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PreviousDataPage;


// import { useState } from "react";

// const PreviousDataModal = ({ isOpen, onClose, data = [] }) => {
//   if (!isOpen) return null;

//   const [searchTerm, setSearchTerm] = useState("");

//   // Function to format values
//   const formatValue = (key, value) => {
//     if (value == null) return "N/A"; // Handle null and undefined values
//     if (typeof value === "number") return value;
//     if (typeof value === "boolean") return value ? "Yes" : "No";
    
//     // Handle Dates
//     if (typeof value === "string" && !isNaN(Date.parse(value))) {
//       return new Date(value).toLocaleString("en-UK");
//     }

//     // Handle Arrays
//     if (Array.isArray(value)) {
//       return value.length > 0 ? (
//         <ul className="list-disc pl-4">
//           {value.map((item, index) => (
//             <li key={index} className="p-1">
//               {typeof item === "object" ? formatValue("", item) : item}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <span>No items</span>
//       );
//     }

//     // Handle Objects (Display Key-Value Pairs)
//     if (typeof value === "object") {
//       return (
//         <ul className="border p-2 rounded-md bg-gray-100">
//           {Object.entries(value).map(([subKey, subValue]) => (
//             <li key={subKey} className="p-1">
//               <strong>{subKey}:</strong> {formatValue(subKey, subValue)}
//             </li>
//           ))}
//         </ul>
//       );
//     }

//     // Handle Links
//     if (typeof value === "string" && value.startsWith("http")) {
//       return (
//         <a
//           href={value}
//           className="text-blue-500 font-medium"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Link
//         </a>
//       );
//     }

//     return value;
//   };

//   // Ensure data is an array before filtering
//   const filteredData = Array.isArray(data)
//     ? data.filter((item) =>
//         Object.values(item || {}).some((value) =>
//           String(value).toLowerCase().includes(searchTerm.toLowerCase())
//         )
//       )
//     : [];

//     return (
//       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
//         <div className="bg-white w-full max-w-3xl max-h-[80vh] p-4 sm:p-6 rounded-lg shadow-lg relative overflow-y-auto">
//           <h2 className="text-lg sm:text-xl font-bold mb-4">Previous Data</h2>
    
//           {/* Search Input */}
//           <input
//             type="text"
//             placeholder="Search..."
//             className="p-2 border-black text-black font-medium border rounded w-full mb-4"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
    
//           {/* Data Display */}
//           {filteredData.length === 0 ? (
//             <p className="text-gray-500">No matching data found.</p>
//           ) : (
//             <ul>
//               {filteredData.map((item, index) => (
//                 <li key={index} className="border-b-4 p-2">
//                   {Object.keys(item).length === 0 ? (
//                     <p className="text-gray-500">No data available</p>
//                   ) : (
//                     Object.entries(item).map(([key, value]) => (
//                       <p key={key} className="p-1 text-sm sm:text-base">
//                         <strong>{key}:</strong> {formatValue(key, value)}
//                       </p>
//                     ))
//                   )}
//                 </li>
//               ))}
//             </ul>
//           )}
    
//           {/* Close Button */}
//           <button
//             onClick={onClose}
//             className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-red-600 text-sm sm:text-base"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     );
    
// };

// export default PreviousDataModal;
