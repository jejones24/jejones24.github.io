import { Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './stylesheets/index.css';
import './stylesheets/App.css';

import LogIn from "./pages/LogIn.jsx";
import Home from "./pages/Home.jsx";
import HomeS from "./pages/HomeS.jsx";
import Curriculum from "./pages/Curriculum.jsx";
import Assignments from "./pages/Assignments.jsx";
import StudentProgress from "./pages/Student-Progress.jsx";
import Grades from "./pages/Grades.jsx";
import UserPage from "./pages/UserPage.jsx";
import UserPageS from "./pages/UserPageS.jsx";
import NoPage from "./pages/NoPage.jsx";


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<LogIn/>}/>
                <Route path={"/home"} element={<Home/>}/>
                <Route path={"/homes"} element={<HomeS/>}/>
                <Route path={"/curriculum"} element={<Curriculum/>}/>
                <Route path={"/assignments"} element={<Assignments/>}/>
                <Route path={"/studentProgress"} element={<StudentProgress/>}/>
                <Route path={"/grades"} element={<Grades/>}/>
                <Route path={"/userPage"} element={<UserPage/>}/>
                <Route path={"/userPages"} element={<UserPageS/>}/>
                <Route path={"/*"} element={<NoPage/>}/>
            </Routes>
        </BrowserRouter>
    );}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
