import React, { useState } from "react";

const PratikPreviousDataModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const [searchTerm, setSearchTerm] = useState("");

  // Filter data based on search input
  const filteredData = data.filter((item) =>
 //one thing to notice is its only applicable to objects..so if in polls..you have array of objects..it will not work,
 //so if u search for some option..thn it will not work..so u need to modify it accordingly...for now i have kept it simple
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const formatValue = (key, value) => {
    if (value == null) return "N/A"; 
    if (typeof value === "number") return value;
    if (typeof value === "boolean") return value ? "Yes" : "No"; 
    if( typeof value === "string" && !isNaN(value)) return value
    if (typeof value === "string" && value.startsWith("http")) {
      return (
        <a href={value} className="text-blue-500 font-medium" target="_blank" rel="noopener noreferrer">
          link
        </a>
      );
    }

    // Handle Dates
    const isDate = typeof value === "string" && !isNaN(Date.parse(value));
    if (isDate) return new Date(value).toLocaleDateString("en-GB");

    // Handle Arrays
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc pl-4">
          {value.length > 0 ? (
            value.map((item, index) => (
              <li key={index} className="p-1">
                {typeof item === "object" ? formatValue("", item) : item}
              </li>
            ))
          ) : (
            <li>No data</li>
          )}
        </ul>
      );
    }

    // Handle Objects (Display Key-Value Pairs)
    if (typeof value === "object") {
      return (
        <ul className="border p-2 rounded-md bg-gray-100">
          {Object.entries(value).map(([subKey, subValue]) => (
            <li key={subKey} className="p-1">
              <strong>{subKey}:</strong> {formatValue(subKey, subValue)}
            </li>
          ))}
        </ul>
      );
    }

    return value; 
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white h-1/2 w-1/2 p-6 rounded-lg shadow-lg relative overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Previous Data</h2>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search..."
          className="p-2 border-black text-black font-medium border rounded w-full mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredData.length === 0 ? (
          <p>No matching data found.</p>
        ) : (
          <ul>
            {filteredData.map((item, index) => (
              <li key={index} className="border-b-4 p-2">
                {Object.entries(item).map(([key, value]) => (
                  <p key={key} className="p-1">
                    <strong>{key}:</strong> {formatValue(key, value)}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={onClose}
          className="mt-4 absolute top-0 right-0 bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PratikPreviousDataModal;