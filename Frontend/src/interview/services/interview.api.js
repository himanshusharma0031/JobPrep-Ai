import axios from "axios"

const api = axios.create({
    baseURL : "http://localhost:8000",
    withCredentials: true
})

export const generateInterviewReport = async({selfDescription,jobDescription,resumeFile})=>{
     const formData = new FormData()

    formData.append("jobDescription",jobDescription)
    formData.append("selfDescription",selfDescription)
    formData.append("resume",resumeFile)

    const response =  await api.post("/api/interview/",formData,{
        headers:{
            "Content-Type":"multipart/form-data"
        }
    })
   // console.log(response)
    return response.data
}

export const  interviewReportById = async(interviewId) =>{
     console.log(interviewId)
    const response = await api.get(`/api/interview/report/${interviewId}`)
    console.log(response.data)
    return response.data
}

export const getAllInterviewReports =async()=>{
    const response = await api.get('/api/interview/')
    return response.data
}


export const generateResumePdf =async({interviewReportId})=>{
 const response = await api.get(`/api/interview/resume/pdf/${interviewReportId}`,{
    responseType:'blob'
 })
 return response.data
}
