import React, { useContext, useEffect, useRef, useState } from "react";
import "../style/home.css";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../../hooks/useAuth";

const Home = () => {

  const {loading,reports,getReports,generateReport} = useInterview()
  const {handleLogout} = useAuth()
  const [jobDescription,setjobDescription] = useState("")
  const [selfDescription,setselfDescription] = useState("")
  const resumeInputRef = useRef()
  const navigate = useNavigate();
  console.log(reports)

  const handleGenerateReport = async()=>{
     const resumeFile = resumeInputRef.current.files[0]
    const data = await generateReport({jobDescription,selfDescription,resumeFile})
    navigate(`/interview/${data._id}`)

  }
  const handlelogout = async()=>{
   const response =  await handleLogout()
   console.log(response)
  }

   useEffect(()=>{
        getReports()
      },[])



  if(loading){
    return (
      <div className="loader-container">
      <div className="loader"></div>
    </div>
    )
  }

  return (
    <main className="home">
      <div className="hero-content">
        <span className="ai-badge">AI INTERVIEW ASSISTANT</span>

        <h1>Create Your Custom Interview Plan</h1>

        <p>
          Let our AI analyze the job requirements and your unique profile
          to build a winning interview strategy.
        </p>
      </div>

      <div className="interview-container">
        <div className="left">
          <label htmlFor="jobDescription">Job Description</label>

          <textarea
            onChange={(e)=>setjobDescription(e.target.value)}
            name="jobDescription"
            id="jobDescription"
            placeholder="Paste the job description here..."
          ></textarea>
        </div>

        <div className="right">
          <div className="input-group">
            <label htmlFor="resume">Upload Resume</label>

            <input
            ref={resumeInputRef}
              type="file"
              name="resume"
              id="resume"
              accept=".pdf"
            />
          </div>

          <div className="input-group">
            <label htmlFor="selfDescription">Self Description</label>

            <textarea
              onChange={(e)=>setselfDescription(e.target.value)}
              name="selfDescription"
              id="selfDescription"
              placeholder="Describe yourself in a few sentences..."
            ></textarea>
          </div>

          <button onClick={handleGenerateReport}
          className="generate-btn">
            ✨ Generate Interview Report
          </button>
        </div>

     {/* //recent reports list */}
    {reports.length > 0 && (
  <section className="recent-reports">
    <h2>My Interview Plans</h2>

    <ul className="report-list">
      {reports.map((report) => (
        <li
          key={report._id}
          className="report-item"
          onClick={() => navigate(`/interview/${report._id}`)}
        >
          <h3>{report.title || "Untitled position"}</h3>
          <p className="report-meta">
            Generated on {new Date(report.createdAt).toLocaleDateString()}
          </p>
        </li>
      ))}
    </ul>
  </section>
)}    <div className="btn-container">
      <button onClick={handlelogout} className="logout-btn">Logout</button>
      </div>
      </div>
    </main>
  );
};

export default Home;








// import React from "react";
// import "../style/home.css";
// const Home =()=>{
//   return(
//     <main className='home'>
//       <h1>Create yous custom interview plan</h1>
//       <p>Let Our AI analyze the job requirements and your unique profile to build a winning strategy</p>
//     <div className="left">
//         <textarea name="jobDescription" id="jobDescription" placeholder="Enter jobDescription here.."></textarea>
//     </div>
//     <div className="right">
//         <div className="input-group">
//            <label htmlFor="resume"> Upload Resume</label>
//            <input type="file" name="resume" accept=".pdf"/>
//         </div>
//          <div className="input-group">
//            <label htmlFor="selfDescription"> self Description</label>
//             <textarea name="selfDescription" id="selfDescription" placeholder="describe yourself in few sentences.."></textarea>
//         </div>
//         <button className="generate-btn">Generate Interview Report</button>
//     </div>
//     </main>
//   )
// }
// export default Home