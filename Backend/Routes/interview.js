const express = require('express')
const {authUser} = require('../Middlewares/auth.js');
const {generateInterviewReportController, getInterviewReportByIdController,getAllInterviewController,generateResumePdfController} = require('../Controller/interview.js')
const upload = require('../Middlewares/file.js');
const interviewRouter = express.Router()

interviewRouter.post('/',authUser,upload.single("resume"),generateInterviewReportController)

interviewRouter.get('/report/:interviewId',authUser,getInterviewReportByIdController)

interviewRouter.get('/',authUser,getAllInterviewController)

interviewRouter.get("/resume/pdf/:interviewReportId",authUser,generateResumePdfController)
module.exports = interviewRouter