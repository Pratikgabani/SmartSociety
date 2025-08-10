import axios from 'axios'; // 4

const api = axios.create({
  baseURL: "https://resihub2.onrender.com/auth/",
  withCredentials: true, // ✅ FIXED: cookies will now be sent
});


export const googleAuth = (code) => api.get(`/google?code=${code}`);
// here the /google is the endpoint defined in the authRoutes.js file
// and the code is the authorization code received from Google after user authentication

// and in the Login.jsx file, you can use this function like this:
// const result = await googleAuth(authResult.code);

// so it will send a GET request to https://resihub.onrender.com/auth/google?code=authResult.code
// in which user controoler will extract the code from the query parameters 