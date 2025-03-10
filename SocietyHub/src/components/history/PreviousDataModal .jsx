
import React from "react";

const PreviousDataModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

//   const formatValue = (key , value) => {
//     if (value == null) return "N/A"; // Handle null or undefined values
//    else if (typeof value === "number") return value; // Return numbers as they are

//    else if(typeof value ==="boolean") return value ? "Yes" : "No"; // Convert boolean values to Yes/No

//    else if (typeof value === "string" && value.startsWith("http")) {
//       return <a href={`${value}`} className="text-blue-500 font-medium" target="_blank">link</a>;
//   }

//      else{


//     const isDate = typeof value === "string" && !isNaN(Date.parse(value));

//     return isDate ? new Date(value).toLocaleString() : value; // Convert valid dates, return other strings as is
//   }};


const formatValue = (key, value) => {
  if (value == null) return "N/A"; // Handle null or undefined values
  if (typeof value === "number") return value; // Return numbers as they are
  if (typeof value === "boolean") return value ? "Yes" : "No"; // Convert boolean values to Yes/No
  if (typeof value === "string" && value.startsWith("http")) {
    return (
      <a href={value} className="text-blue-500 font-medium" target="_blank" rel="noopener noreferrer">
        link
      </a>
    );
  }

  // Handle Dates
  const isDate = typeof value === "string" && !isNaN(Date.parse(value));
  if (isDate) return new Date(value).toLocaleString();

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

  return value; // Return other types as they are
};

return (
  <div className="fixed inset-0 flex  items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white max-h-96 w-auto p-6 rounded-lg shadow-lg relative overflow-y-auto ">
      <h2 className="text-xl font-bold mb-4">Previous Data</h2>
      {data.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <ul>
          {data.map((item, index) => (
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
        className="mt-4 absolute top-0 right-0 bg-red-500  text-white px-4 py-2 rounded"
      >
        Close
      </button>
    </div>
  </div>
);
}


export default PreviousDataModal;
