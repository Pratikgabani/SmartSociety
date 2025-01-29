import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser"
import dotenv from "dotenv";

dotenv.config({
    path : "./.env"
})

const app = express();

 // cors is a middleware that allows us to make requests from different origins
// Middleware to handle Cross-Origin Resource Sharing (CORS), allowing the server to accept requests from other origins (e.g., your frontend hosted on a different domain).
app.use(
    cors({
        origin: process.env.CORS_ORIGIN, //Specifies which domains can send requests to this server.
        credentials :true //indicates that cookies or other credentials should be allowed during requests.
    })
)

// Common middlewares
// Configures the server to parse incoming JSON request bodies.
app.use(express.json({
    limit: "16kb" //Restricts the size of the JSON payload to 16 KB to prevent overly large requests that could cause performance issues.
}))

// Configures the server to parse incoming URL-encoded request bodies.
app.use(express.urlencoded({
    extended:true , //When you set extended: true, it tells the server to allow parsing of rich objects and arrays in the URL-encoded data. Rich objects or arrays --> Complex structures like user[name]=John&user[age]=25.
    limit : "16kb"
}))

// Configures the server to serve static files from the public directory.
app.use(express.static("public"));

// Configures the server to parse cookies in the incoming request headers and make them accessible via req.cookies.
app.use(cookieParser())


import userRouter from "./routes/user.routes.js";
import eventRouter from "./routes/event.routes.js";

app.use("/api/v1/users" , userRouter)
app.use("/api/v1/events" , eventRouter)

export default app;
