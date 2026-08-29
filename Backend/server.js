const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const cookieParser = require("cookie-parser");
const authRouter = require('./Routes/auth.js');
const interviewRouter = require('./Routes/interview.js');



const app = express()
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());



mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('DB Error:', err))

app.use('/api/auth',authRouter);
app.use('/api/interview',interviewRouter);


app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' })
})



const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})