import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./auth.context";
import Protected from "./components/protected";
import Home from "./interview/pages/home";
import Interview from "./interview/pages/interview";
import { InterviewProvider } from "./interview/interview.context";
import {Toaster}  from "react-hot-toast";

function App() {
  return (
    <>
    <Toaster/>
    <AuthProvider>
    <InterviewProvider>
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Protected><Home/></Protected>} />

        <Route path="/interview/:interviewId" element={<Protected><Interview/></Protected>} />

      </Routes>
    </BrowserRouter>
    </InterviewProvider>
    </AuthProvider>
    </>
  );
}
export default App;

