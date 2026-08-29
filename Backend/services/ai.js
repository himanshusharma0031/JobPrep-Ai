const { GoogleGenAI } = require("@google/genai");
const {z} = require("zod")
const{zodToJsonSchema} = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.Google_GenAI_API_KEY
});

const interviewReportSchema = {
    type: "object",
    properties: {
        matchScore: {
            type: "number"
        },

        technicalQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: { type: "string" },
                    intention: { type: "string" },
                    answer: { type: "string" }
                },
                required: ["question", "intention", "answer"]
            }
        },

        behavioralQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: { type: "string" },
                    intention: { type: "string" },
                    answer: { type: "string" }
                },
                required: ["question", "intention", "answer"]
            }
        },

        skillGaps: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string" },
                    severity: {
                        type: "string",
                        enum: ["low", "medium", "high"]
                    }
                },
                required: ["skill", "severity"]
            }
        },

        preparationPlan: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    day: { type: "number" },
                    focus: { type: "string" },
                    tasks: {
                        type: "array",
                        items: { type: "string" }
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        },
        title:{
            type:'string'
        }
    },

    required: [
        "matchScore",
        "technicalQuestions",
        "behavioralQuestions",
        "skillGaps",
        "preparationPlan",
        "title"
    ]
};

const generateInterviewReport = async ({
    resume,
    selfDescription,
    jobDescription
}) => {

    const prompt = `
Generate an interview report for the candidate.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

IMPORTANT:

Return ONLY JSON.

The JSON must contain exactly these fields:

matchScore
technicalQuestions
behavioralQuestions
skillGaps
preparationPlan
title

technicalQuestions must be an array of objects.
Each object must contain:
question
intention
answer

behavioralQuestions must be an array of objects.
Each object must contain:
question
intention
answer

skillGaps must be an array of objects.
Each object must contain:
skill
severity

preparationPlan must be an array of objects.
Each object must contain:
day
focus
tasks
tasks must:
- be an array of strings
- contain at least 3 concrete tasks
- contain actionable preparation activities

matchScore must be a number between 0 and 100.
Do not return "95%". Return 95.


title is the title of job for which interview report is generated
Do not add any other fields.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,

        config: {
            responseMimeType: "application/json",
            responseSchema: interviewReportSchema
        }
    });

    const report = JSON.parse(response.text);
   // console.log(JSON.stringify(report, null, 2));
   // console.log(report);

    return report;
};


const generatePdfFromHtml = async(htmlContent)=>{
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent,{
  waitUntil: 'networkidle2'
})

  const pdfBuffer = await page.pdf({format :"A4"})

  await browser.close()

  return pdfBuffer
}

const generateResumePdf =async({resume,selfDescription,jobDescription})=>{
   const resumePdfSchema = z.object({
     html: z.string().describe("The html content of the resume which can be converted to pdf using any library like puppeteer")
   })

   const prompt = `generate a resume for a candidate with the following details:
                   resume : ${resume}
                   selfDescription : ${selfDescription}
                   jobDescription : ${jobDescription}

                   the response should be JSON object with a single field "html" which contains the HTML content of the resume which can be converted to pdf using any library like puppeteer
            `

     const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema:  zodToJsonSchema(resumePdfSchema)
        }
    })

    const jsonContent = JSON.parse(response.text)

    //  console.log("Gemini response:", jsonContent);
    // console.log("HTML type:", jsonContent.html);

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer
}


module.exports = {generateInterviewReport,generateResumePdf};








//gemini-3-flash-preview
//gemini-3.6-flash


























// const { GoogleGenAI } = require("@google/genai")
// const {z} = require("zod")
// const{zodToJsonSchema} = require("zod-to-json-schema")
// const { selfDescription, jobDescription } = require("./temp")
// const { describe } = require("zod/v4/core")

// const ai = new GoogleGenAI({
//     apiKey : process.env.Google_GenAI_API_KEY
// })

// const interviewReportSchema = z.object({
//     matchScore : z.number().describe("A score between 0 to 100 indicationg how well the candidate profile matches the job description"),
//     technicalQuestions:z.array(z.object({
//         question: z.string().describe("The technical question can be asked in the interview"),
//         intention: z.string().describe("The intention of interviewer behind asking this question"),
//         answer : z.string().describe("How to answer this question,what points to cover,what approach to take etc.")
//     })).describe("the technical questions asked in the interview along with their intention"),
//     behavioralQuestions:z.array(z.object({
//         question: z.string().describe("The behavioural question can be asked in the interview"),
//         intention: z.string().describe("The intention of interviewer behind asking this question"),
//         answer : z.string().describe("How to answer this question,what points to cover,what approach to take etc.")
//     })).describe("the Behavioral questions asked in the interview along with their intention"),
//     skillGaps:z.array(z.object({
//         skill: z.string().describe("The skill which the candidate is lacking"),
//         severity: z.enum(["low","medium","high"]).describe("The intention of interviewer behind asking this question"),
//     })).describe("List of skill gaps in the candidate's profile along with their severity"),
//     preparationPlan:z.array(z.object({
//         day: z.number().describe("the day number in the preparationplan,starting from 1"),
//         focus: z.string().describe("The main focus of this day in the preparation plan,e.g Data Structures,System Design"),
//         tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan,e.g read a specific book"),
//     })).describe("A day-wise preparation-plan for the candidate to follow in order to prepare for the interview effectively"),
// }) 
// const generateInterviewReport = async({resume,selfDescription,jobDescription})=>{

//     const prompt = `Generate an interview report for the candidate with the following details:

//                    IMPORTANT:
//                      Return ONLY JSON matching the provided response schema.
//                     The JSON must contain exactly these fields:
//                     - matchScore
//                     - technicalQuestions
//                     - behavioralQuestions
//                     - skillGaps
//                     - preparationPlan
                      
//                      Do NOT add any fields.
//                      Do NOT rename any fields.
//                      Do NOT return candidateName, appliedRole, company, summary,
//                      recommendation, strengths, or any other fields not present in the schema. 
//                 Resume : ${resume},
//                 selfDescription : ${selfDescription},
//                 jobDescription : ${jobDescription}`

//       const response = await ai.models.generateContent({
//         model : "gemini-3-flash-preview",
//         contents :prompt,
//         config :{
//             responseMimeType :"application/json",
//              responseSchema: zodToJsonSchema(interviewReportSchema, {
//                 target: "jsonSchema7"
//             })
//            // responseSchema : zodToJsonSchema(interviewReportSchema)
//         }
//       })
//      // console.log(response.text)
//     console.log(JSON.parse(response.text))
// }

// module.exports = generateInterviewReport;








// const invokeGeminiAi = async() =>{
//     const response = await ai.models.generateContent({
//         model : "gemini-3.6-flash",
//         contents : "hello gemini explain factorial of 5?"
//     })

//     console.log(response.text);
// }

// module.exports = invokeGeminiAi