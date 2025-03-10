// import React, { useEffect } from "react";

// const PreviousDataModal = ({ isOpen, onClose, data }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//         <h2 className="text-xl font-bold mb-4">Previous Data</h2>

//         {data.length === 0 ? (
//           <p>No data available.</p>
//         ) : (
//           <ul>
//             {data.map((item, index) => (
//               <ol className="flex flex-col border-b-4" key={index}>
//               <li key={index} className="p-1 ">{"Name: " + item.value}</li> 
//               <li key={index} className="p-1 ">{"phone: " + item.visitorPhone}</li>
//                 <li key={index} className="p-1 ">{"Address: " + item.visitingAdd}</li>
//                 <li key={index} className="p-1 ">{"Purpose: " + item.purpose}</li>
//                 <li key={index} className="p-1 ">{"Date: " + new Date(item.visitDate).toLocaleDateString()}</li>
//                 <li key={index} className="p-1 ">{"Time: " + item.visitTime}</li>
//                 <li key={index} className="p-1 ">{"Duration: " + item.duration}</li>
//               </ol>
//               // Update 'item.name' based on your backend response structure
//             ))}
//           </ul>
//         )}

//         <button
//           onClick={onClose}
//           className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PreviousDataModal;
// import React from "react";

// const PreviousDataModal = ({ isOpen, onClose, data }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//         <h2 className="text-xl font-bold mb-4">Previous Data</h2> 
//         {data.length === 0 ? (
//           <p>No data available.</p>
//         ) : (
//           <ul>
//             {data.map((item, index) => (
//               <li key={index} className="border-b-4 p-2">
//                 {Object.entries(item).map(([key, value]) => (
//                   <p key={key} className="p-1">
//                     <strong>{key}:</strong>{" "}
//                     {key.includes("Date")
//                       ? new Date(value).toLocaleDateString() // Format date if key contains 'Date'
//                       : value.toString()}
//                   </p>
//                 ))}
//               </li>
//             ))}
//           </ul>
//         )}

//         <button
//           onClick={onClose}
//           className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PreviousDataModal;
import React from "react";

const PreviousDataModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const formatValue = (key , value) => {
    if (value == null) return "N/A"; // Handle null or undefined values
   else if (typeof value === "number") return value; // Return numbers as they are
  
   else if(typeof value ==="boolean") return value ? "Yes" : "No"; // Convert boolean values to Yes/No
    
   else if(typeof value === "string" && !isNaN(value)) return value;
   else if (typeof value === "string" && value.startsWith("http")) {
      return <a href={`${value}`} className="text-blue-500 font-medium" target="_blank">link</a>;
  }

     else{

     
    const isDate = typeof value === "string" && !isNaN(Date.parse(value));
    
    return isDate ? new Date(value).toLocaleString() : value; // Convert valid dates, return other strings as is
  }};
  

  return (
    <div className="fixed inset-0 flex  items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white h-700px w-auto p-6 rounded-lg shadow-lg relative overflow-y-auto ">
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
};

export default PreviousDataModal;
