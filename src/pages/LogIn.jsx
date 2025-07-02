import {useState, useEffect} from "react";
import Validation from "../functions/LoginValidation.js";
import axios from "axios";

export default function LogIn () {
    const [loginType, setLoginType] = useState("Teacher")
    const [values, setValues] = useState({
        username: '',
        password: ''
    });
    let x;
    const [errors, setErrors] = useState({})
    // const handleInput = (event) => {
    //     setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
    // }
    // const postData = async() => {
    //     email: email,
    //     const post = {
    //         password: password
    //     }
    // }
    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     setErrors(Validation(values));
    // }

    function changeLoginTypeS() {
        setLoginType("Student")
        document.getElementById("studentLogin").className = "active"
        document.getElementById("teacherLogin").className = "inactive"
    }

    function changeLoginTypeT() {
        setLoginType("Teacher")
        document.getElementById("studentLogin").className = "inactive"
        document.getElementById("teacherLogin").className = "active"
    }

    function logInUser () {
        if (loginType === "Student") {
            window.location.href = "/homeS"
        }
        else if (loginType === "Teacher") {
            window.location.href = "/home"
        }
    }

    return (
        <>
            <head>
                <meta charSet="UTF-8"/>
                <title>Log In</title>
                <link href="src/stylesheets/index.css" rel="stylesheet"/>
            </head>
            <body style={{backgroundColor: "wheat", textAlign: "center", padding: "20px", paddingBottom: "89px"}}>
            <div
                style={{background: "black", textAlign: "center", height: "250px", width: "250px", margin: "auto", marginBottom: "20px", padding: "20px"}}>
                <img src="assets/gac-icon.png" alt="Gustavus Adolphus College logo" width="100" height="100"
                     style={{marginTop: "20px", marginBottom: "5px"}}/>
                <h1 style={{fontSize: "50px", color: "white", marginTop: "5px"}}>GACAI</h1>
            </div>
            <div style={{textAlign: "center",
  backgroundColor: "#E9E9E9",
  border: "4px solid #00006c",
  fontSize: "20px",
  padding: "16px 32px",
  borderRadius: "12px",
  margin: "auto",
  width: "400px",
  height: "385px",
    // height: "470px",
            }}>
                {/*<div className={"switchA"}>*/}
                {/*    <button className={"inactive"} id={"studentLogin"} onClick={changeLoginTypeS}>Student</button>*/}
                {/*    <button className={"active"} id={"teacherLogin"} onClick={changeLoginTypeT}>Teacher</button>*/}
                {/*</div>*/}
                <p className={"error-message"}></p>
                <form action={"http://localhost:4000/login"} method={"POST"}>
                    <div>
                        <label htmlFor="email" style={{fontSize: "24px", marginBottom: "10px"}}>Email:</label>
                        <input type="text" id="email" name="email" size="25"
                               style={{fontSize: "24px", marginBottom: "30px"}}/>
                    </div>
                    <div>
                        <label htmlFor="password" style={{fontSize: "24px", marginBottom: "10px"}}>Password:</label>
                        <input type="password" id="password" name="password" size="25"
                               style={{fontSize: "24px", marginBottom: "20px"}}/>
                    </div>
                    <input className="button" type="submit" value="Log In" style={{margin: "10px"}}/>
                </form>
            </div>
            </body>
        </>
    )
}