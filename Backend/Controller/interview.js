const pdfParse = require('pdf-parse')
const {generateInterviewReport,generateResumePdf} = require('../services/ai')
const interviewReportModel = require('../Model/interviewReport')

const generateInterviewReportController =async(req,res)=>{
     const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
     const {selfDescription,jobDescription} = req.body;

     const interviewReportByAi = await generateInterviewReport({
        resume:resumeContent.text,
        selfDescription,
        jobDescription})

     const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume : resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAi
     })

     res.status(201).json({
        message: "interview report generated succesfully",
        interviewReport
     })
}


const getInterviewReportByIdController = async(req,res)=>{
    const {interviewId} = req.params;

    const interviewReport = await interviewReportModel.find({_id:interviewId,user:req.user.id})

    if(!interviewReport){
      return res.status(404).json({
         message:"interview report not found"
      })
    }

    res.status(200).json({
      message:"interview report fetched succesfully",
      interviewReport
    })


}

const getAllInterviewController = async(req,res)=>{
   const interviewReports = await interviewReportModel.find({user:req.user.id}).sort({createdAt:-1}).select("title createdAt updatedAt")

   res.status(200).json({
      message:"interview reports fetched successfully",
      interviewReports
   })
}


const generateResumePdfController = async(req,res)=>{
   const {interviewReportId} = req.params

   const interviewReport = await interviewReportModel.findById({_id:interviewReportId})

   if(!interviewReport){
      return res.status(404).json({
         message:"Interview report not found"
      })
   }

   const {resume,selfDescription,jobDescription} = interviewReport

   const pdfBuffer = await generateResumePdf({resume,selfDescription,jobDescription})

   res.set({
      "Content-Type" : "application/pdf",
      "Content-Disposition" : `attachment; filename=resume_${interviewReportId}.pdf`
})

 res.send(pdfBuffer)

}
module.exports ={ generateInterviewReportController, getInterviewReportByIdController,getAllInterviewController,generateResumePdfController}

//"-resume -selfDescription -jobDescription - technicalQuestions -behavioralQuestions -skillGaps -preparationPlan -matchScore")
