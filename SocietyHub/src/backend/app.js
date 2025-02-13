import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser"
import dotenv from "dotenv";

dotenv.config({
    path : "./.env"
})

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173", 
       
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE" ,"PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
)


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

app.use("/api/v1/users" , userRouter)
app.use("/api/v1/events" , eventRouter)
app.use("/api/v1/booking" , bookingRouter)
app.use("/api/v1/complain" , complainRouter)
app.use("/api/v1/societyDetail" , societyDetailRouter)
app.use("/api/v1/visitor" , visitorRouter)
app.use("/api/v1/security" , securityRouter)
app.use("/api/v1/polls" , pollRouter )
app.use("/api/v1/payments" , paymentRouter)
app.use("/api/v1/notices" , noticeRouter)
export default app;
