import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import { generateInterviewReport,interviewReportById,getAllInterviewReports,generateResumePdf} from "../services/interview.api";

export const useInterview =()=>{
    const {loading,setLoading,report,setReport,reports,setReports}= useContext(InterviewContext)

    const generateReport = async({jobDescription,selfDescription,resumeFile})=>{
        setLoading(true)
        try{
            const response = await generateInterviewReport({jobDescription,selfDescription,resumeFile})
           setReport(response.interviewReport)
           return response.interviewReport
        }catch(err){
            console.log(err)
        }finally{
        setLoading(false)
        }
    }

    const getReportById = async(interviewId) =>{
        setLoading(true)
        try{
            const response = await  interviewReportById(interviewId)
            setReport(response.interviewReport[0])
            return response.interviewReport
        }catch(err){
            console.log(err)
        }finally {
    setLoading(false);
  }
    }

    const getReports =async()=>{
        setLoading(true)
        try{
            const response = await getAllInterviewReports()
            setReports(response.interviewReports)
            return response.interviewReports
        }catch(err){
            console.log(err)
        }finally{
        setLoading(false)
        }
    }

    const getResumePdf = async(interviewReportId)=>{
        setLoading(true)
        try{
            const response = await generateResumePdf({interviewReportId})
            const url = window.URL.createObjectURL(new Blob([response],{type:"application/pdf"}))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download",`resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
    }

    return {loading,report,reports,getReports,getReportById,generateReport,getResumePdf}
}