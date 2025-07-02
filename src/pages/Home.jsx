import {useEffect, useState} from 'react'
import axios from "axios";
import 'cookie-parser'

export default function Home() {
    let [courses, setCourses] = useState({})
    let [courseIDs, setCourseIDs] = useState([])
    let [courseNames, setCourseNames] = useState([])

    function fetchData() {
        let splitCookie = document.cookie.split('=')
        let curr = splitCookie[1]
        console.log(splitCookie[1])
        axios.post("http://localhost:4000/home", {
            withCredentials: true,
            currToken: curr
        }).then(function(response) {
            return response.data
        }).then((response) => {
            setCourses(response)
            setCourseIDs(Object.keys(response))
            setCourseNames(Object.values(response))
        }).catch(function (error) {
            console.log(error)
        })
        axios.post("http://localhost:4000/homeName", {
            currToken: curr
        }).then(function(response) {
            return response.data
        }).then((response) => {
            document.getElementById('usersCourses').innerText = `${response}'s Courses`
        }).catch(function (error) {
            console.log(error)
        })
    }

    function openCourse(courseID, courseName) {
        console.log(courseID)
        console.log(courseName)
        window.location.replace('/curriculum?param1=' + encodeURIComponent(courseID) + '&param2=' + encodeURIComponent(courseName))
    }

    function createNewCourse() {
        let splitCookie = document.cookie.split('=')
        let curr = splitCookie[1]
        let newName = prompt('Please enter the name for the course:')
        let newID = prompt('Please enter the ID for the course:')
        axios.post("http://localhost:4000/createNewCourse", {
            newName: newName,
            newID: newID,
            currToken: curr
        })
        window.location.replace('/curriculum?param1=' + encodeURIComponent(newID) + '&param2=' + encodeURIComponent(newName))
    }

    useEffect(() => {
        fetchData()
    }, []);


    return (
        <>
            <head>
                <meta charSet="UTF-8"/>
                <title>Home</title>
                <link rel="icon" type="image/svg+xml" href="../../assets/gac-icon.png"/>
                <link href="src/stylesheets/home.css" rel="stylesheet"/>
                <link href="src/stylesheets/index.css" rel="stylesheet"/>
                <link href={"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"} rel="stylesheet"
                      integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
                      crossOrigin="anonymous"/>
            </head>
            <body style={{background: "wheat"}}>
            <div className={"topnav"}>
                <a className={"active"}>Home</a>
                <a href={"/userPage"} style={{float: "right"}}>User Information</a>
            </div>
            <div className={"row"}>
                <div className={"column1"}>
                    <div className={"institutionLogo"}>
                        <img src={"../../assets/gac-icon.png"} alt={"Gustavus Adolphus College logo"} width={"200"} height={"200"}/>
                        <b>Gustavus AI Lab (GACAI)</b>
                    </div>
                    <div className="institutionInfo">
                        This is where information about the institution using the app will go. Since this is only a
                        demo, it will have information about the group creating it, the Gustavus AI Lab, also known
                        as GACAI (or GAIL). This app intends to ease many of the pains of creating curriculum and
                        tracking student progress. With an AI assistant, this process becomes much easier. This place
                        could also be a possible place to put an abbreviated user profile, depending on how the
                        development of this app continues. This is the instructor side of the application.
                    </div>
                </div>
                <div className={"column2"}>
                    <div id={"classCardInterface"}>
                        <p id={'usersCourses'} style={{fontSize:"40px", marginTop: "10px", fontWeight: 'bold'}}>User&#39;s Courses</p>
                        {courseNames.map((label, i) => (
                            <button key={courseIDs[i]} id={`classCard${courseIDs[i]}`} className={"classCard"} onClick={() => openCourse(courseIDs[i], label)}>{label}<br/>{courseIDs[i]}</button>
                        ))}
                    </div>
                    <a className={"newCourse"} onClick={createNewCourse}>New Course +</a>
                </div>
            </div>
            </body>
        </>
    );
}