import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser"
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
dotenv.config({
    path : "./.env"
})

const app = express();
app.use(
    cors({
        origin: 'https://resihub.onrender.com',
       
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE" ,"PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
)

// app.use((req, res, next) => {
//   // Set the Access-Control-Allow-Origin header to the correct origin
//   res.setHeader('Access-Control-Allow-Origin', 'https://resi-hub.onrender.com');
//   // Or to allow multiple origins:
//   // const allowedOrigins = ['https://resi-hub.onrender.com', 'http://localhost:5173'];
//   // const origin = req.headers.origin;
//   // if (allowedOrigins.includes(origin)) {
//   //      res.setHeader('Access-Control-Allow-Origin', origin);
//   // }
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });

app.use(express.json({
    limit: "16kb" 
}))



app.use(express.urlencoded({
    extended:true , 
    limit : "16kb"
}))

app.use(express.static("public"));

app.use(cookieParser())



import userRouter from "./routes/user.routes.js";
import eventRouter from "./routes/event.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import complainRouter from "./routes/complain.routes.js";
import societyDetailRouter from "./routes/societyDetail.routes.js";
import visitorRouter from "./routes/visitor.routes.js";
import securityRouter from "./routes/security.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import pollRouter from "./routes/poll.routes.js";
import noticeRouter from "./routes/notice.routes.js";
import orderRouter from "./routes/order.routes.js";
import expenseRouter from "./routes/expense.routes.js" 
import purchaseRouter from "./routes/purchase.routes.js"

app.use('/auth', authRoutes);

app.use("/api/v1/users" , userRouter)
app.use("/api/v1/events" , eventRouter)
app.use("/api/v1/booking" , bookingRouter)
app.use("/api/v1/complain" , complainRouter)
app.use("/api/v1/societyDetail" , societyDetailRouter)
app.use("/api/v1/visitor" , visitorRouter)
app.use("/api/v1/security" , securityRouter)
app.use("/api/v1/polls" , pollRouter )
app.use("/api/v1/payment" , paymentRouter)
app.use("/api/v1/notices" , noticeRouter)
app.use("/api/v1/expense" , expenseRouter)
app.use("/api/v1/order",orderRouter)
app.use("/api/v1/purchase",purchaseRouter)
export default app;
