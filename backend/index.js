import express from 'express';
const app = express();
// import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config({});
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './utils/db.js';
import userRoute from './routes/userRoute.js';
import companyRoute from './routes/companyRoute.js';
import jobRoute from './routes/jobRoute.js';
import applicationRoute from './routes/applicationRoute.js';


//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
}
app.use(cors(corsOptions));

const port = process.env.PORT;

// API's 
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

app.listen(port, () => {
    console.log(`server is connected at port ${port}`);
    connectDB();
})