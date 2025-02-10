
import React, { useEffect, useState } from "react";
import axios from "axios";

const PollApp = () => {
  const [polls, setPolls] = useState([]);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [vari, setVari] = useState(false);
const token = localStorage.getItem("user");
const user = token ? JSON.parse(token) : null;
const role = user?.data.user.role
console.log(role)
  useEffect(() => {
    fetchPolls();
  }, [vari]);

  const fetchPolls = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/polls/getAllPolls", {
        withCredentials: true,
      });
      setPolls(res.data.data);
    } catch (err) {
      console.error("Error fetching polls", err);
    }
  };

  const handleVote = async (pollId, optionId) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/v1/polls/votePoll/${pollId}/${optionId}`,
        {},
        { withCredentials: true }
      );
      setVari(!vari);
    } catch (err) {
      console.error("Error voting", err);
    }
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8000/api/v1/polls/createPoll",
        { question, options: options.map((opt) => ({ option: opt })) },
        { withCredentials: true }
      );
      setQuestion("");
      setOptions(["", ""]);
      setVari(!vari);
    } catch (err) {
      console.error("Error creating poll", err);
    }
  };
  const handleDeletePoll = async (pollId) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/polls/deletePoll/${pollId}`, {
        withCredentials: true,
      });
      setVari(!vari);
    } catch (err) {
      console.error("Error deleting poll", err);
    }
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Poll Management</h1>
      
     {
       role === "admin" && (
        <div className="mb-6 p-4 border rounded">
        <h2 className="text-lg font-semibold">Create a Poll</h2>
        <form onSubmit={handleCreatePoll}>
          <input 
            type="text" 
            value={question} 
            onChange={(e) => setQuestion(e.target.value)} 
            placeholder="Poll question" 
            className="w-full p-2 border rounded mt-2"
            required
          />
          {options.map((opt, index) => (
            <input 
              key={index} 
              type="text" 
              value={opt} 
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }}
              placeholder={`Option ${index + 1}`} 
              className="w-full p-2 border rounded mt-2"
              required
            />
          ))}
          <button
            type="button"
            className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            onClick={addOption}
          >
            Add Option
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 ml-2"
          >
            Create Poll
          </button>
        </form>
      </div>
       )
     }
      
      <h2 className="text-lg font-semibold mb-4">Active Polls</h2>
      {polls.map((poll) => (
        <div key={poll._id} className="p-4 border rounded mb-4">
          <h3 className="text-lg font-bold">{poll.question}</h3>
          {poll.options.map((opt) => (
            <button 
              key={opt._id} 
              onClick={() => handleVote(poll._id, opt._id)} 
              className="block w-full p-2 bg-gray-200 rounded mt-2"
            >
              {opt.option} ({opt.votes} votes)
            </button>
          ))}
            {
             role === "admin" && (
               <button 
             onClick={() => handleDeletePoll(poll._id)} 
             className="bg-red-500 text-white px-4 py-2 rounded mt-4"
           >
             Delete Poll
           </button>
             )
           }
        </div>
      ))}
    </div>
  );
};

export default PollApp;
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const PollApp = () => {
//   const [polls, setPolls] = useState([]);
//   const [question, setQuestion] = useState("");
//   const [options, setOptions] = useState(["", ""]);
//   const [vari, setVari] = useState(false);

// const token = localStorage.getItem("user");
// const user = token ? JSON.parse(token) : null;
// const role = user?.role
   
//   useEffect(() => {
//     fetchPolls();
//   }, [vari]);

//   const fetchPolls = async () => {
//     try {
//       const res = await axios.get("http://localhost:8000/api/v1/polls/getAllPolls", {
//         withCredentials: true,
//       });
//       setPolls(res.data.data);
//     } catch (err) {
//       console.error("Error fetching polls", err);
//     }
//   };

//   const handleVote = async (pollId, optionId) => {
//     try {
//       await axios.post(
//         `http://localhost:8000/api/v1/polls/votePoll/${pollId}/${optionId}`,
//         {},
//         { withCredentials: true }
//       );
//       setVari(!vari);
//     } catch (err) {
//       console.error("Error voting", err);
//     }
//   };

//   const handleCreatePoll = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(
//         "http://localhost:8000/api/v1/polls/createPoll",
//         { question, options: options.map((opt) => ({ option: opt })) },
//         { withCredentials: true }
//       );
//       setQuestion("");
//       setOptions(["", ""]);
//       setVari(!vari);
//     } catch (err) {
//       console.error("Error creating poll", err);
//     }
//   };

//   const handleDeletePoll = async (pollId) => {
//     try {
//       await axios.delete(`http://localhost:8000/api/v1/polls/deletePoll/${pollId}`, {
//         withCredentials: true,
//       });
//       setVari(!vari);
//     } catch (err) {
//       console.error("Error deleting poll", err);
//     }
//   };

//   const addOption = () => {
//     setOptions([...options, ""]);
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Poll Management</h1>
      
//       {
//        role === "admin" &&  (
//         <div className="mb-6 p-4 border rounded">
//         <h2 className="text-lg font-semibold">Create a Poll</h2>
//         <form onSubmit={handleCreatePoll}>
//           <input 
//             type="text" 
//             value={question} 
//             onChange={(e) => setQuestion(e.target.value)} 
//             placeholder="Poll question" 
//             className="w-full p-2 border rounded mt-2"
//             required
//           />
//           {options.map((opt, index) => (
//             <input 
//               key={index} 
//               type="text" 
//               value={opt} 
//               onChange={(e) => {
//                 const newOptions = [...options];
//                 newOptions[index] = e.target.value;
//                 setOptions(newOptions);
//               }}
//               placeholder={`Option ${index + 1}`} 
//               className="w-full p-2 border rounded mt-2"
//               required
//             />
//           ))}
//           <button
//             type="button"
//             className="bg-green-500 text-white px-4 py-2 rounded mt-2"
//             onClick={addOption}
//           >
//             Add Option
//           </button>
//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-4 py-2 rounded mt-4 ml-2"
//           >
//             Create Poll
//           </button>
//         </form>
//       </div>
      
//        )
//       }
//       <h2 className="text-lg font-semibold mb-4">Active Polls</h2>
//       {polls.map((poll) => (
//         <div key={poll._id} className="p-4 border rounded mb-4">
//           <h3 className="text-lg font-bold">{poll.question}</h3>
//           {poll.options.map((opt) => (
//             <button 
//               key={opt._id} 
//               onClick={() => handleVote(poll._id, opt._id)} 
//               className="block w-full p-2 bg-gray-200 rounded mt-2"
//             >
//               {opt.option} ({opt.votes} votes)
//             </button>
//           ))}
//           {
//             role === "admin" && (
//               <button 
//             onClick={() => handleDeletePoll(poll._id)} 
//             className="bg-red-500 text-white px-4 py-2 rounded mt-4"
//           >
//             Delete Poll
//           </button>
//             )
//           }
//         </div>
//       ))}
//     </div>
//   );
// };

// export default PollApp;
