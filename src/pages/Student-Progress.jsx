import { useState, useEffect} from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    TypingIndicator
} from "@chatscope/chat-ui-kit-react";
import axios from "axios";
import {createNewInterface} from "../functions/newElements.jsx";

export default function StudentProgress() {
    const API_KEY = process.env.VITE_API_KEY;
    let phrase;
    const [studentDict, setStudentDict] = useState({});
    const [courseID, setCourseID] = useState("");
    const [courseName, setCourseName] = useState("");

    function fetchData() {
        const urlParams = new URLSearchParams(window.location.search);
        setCourseID(urlParams.get('param1'))
        setCourseName(urlParams.get('param2'))
        axios.post("http://localhost:4000/studentDict", {
            courseID: urlParams.get('param1'),
            courseName: urlParams.get('param2')
        }).then(function(response) {
            return response.data
        }).then((response) => {
            console.log(response)
            setStudentDict(response)
            let studentKeyArray = Object.keys(response);
            studentKeyArray.sort()
            console.log(studentKeyArray.length === 0)
            document.getElementById('studentSubscreen').hidden = studentKeyArray.length === 0;


            let newPara;
            for (let i=0; i<studentKeyArray.length; i++) {
                let x = studentKeyArray[i];
                if (i % 2 === 0) {
                    newPara = document.getElementById('studentA').cloneNode();
                }
                else {
                    newPara = document.getElementById('studentB').cloneNode();
                }
                newPara.textContent = `${response[x]['studentLastName']}, ${response[x]['studentFirstName']}
                | ${response[x]['studentID']} | ${response[x]['studentEmail']}`;
                newPara.hidden = false;
                const button = document.createElement('button');
                button.textContent = "AI+";
                button.className = "progA";
                button.addEventListener('click', AIAnalysis);
                document.getElementById("studentSubscreen").appendChild(newPara);
                newPara.appendChild(button);
            }
        })
    }

    function saveStudentDict() {
        axios.post("http://localhost:4000/studentDictSave", {
            studentDict: JSON.stringify(studentDict),
            courseID: parseInt(courseID)
        })
    }

    useEffect(() => {
        fetchData()
    }, []);

    function addStudent() {
        /** Prompts the user to give information about the new student and makes information consistent, correcting
         * capitalization issues and formatting their presentation properly. Sorts the student dictionary array
         * alphabetically by last name so they can be displayed in the same way.*/

        let continueLoop = true;

        // Checks to see if all characters are letters plus -
        function allLetters(str) {
            return /^[a-zA-Z-]+$/.test(str);
        }

        // Checks if all characters are numbers
        function allNumbers(intStr) {
            if (!intStr) {
                return false;
            }
            for (let i=0; i<intStr.length; i++) {
                const parsed = parseInt(intStr[i]);
                if (!Number.isInteger(parsed)) {
                    return false;
                }
            }
            return true;
        }

        // Checks if an email is valid
        function isValidEmail(email) {
            const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return pattern.test(email);
        }

        while (continueLoop) {
            // prompts the user for the last name of the student and corrects capitalization, and checks if
            // the name is valid
            let tempLast = prompt("Please enter the student's last name:");
            let studentLastInitial = tempLast.slice(0, 1).toUpperCase();
            let studentLastRest = tempLast.slice(1, -1).toLowerCase() + tempLast.slice(-1).toLowerCase();
            let studentLastName = studentLastInitial + studentLastRest;
            console.log(typeof studentLastName + studentLastName)
            if (!allLetters(studentLastName)) {
                throw new Error("Please enter a valid name.")
            }

            // prompts the user for the first name of the student and corrects capitalization, and checks if
            // the name is valid
            let tempFirst = prompt("Please enter the student's first name:");
            let studentFirstInitial = tempFirst.slice(0, 1).toUpperCase();
            let studentFirstRest = tempFirst.slice(1, -1).toLowerCase() + tempFirst.slice(-1).toLowerCase();
            let studentFirstName = studentFirstInitial + studentFirstRest;
            console.log(typeof studentFirstName + studentFirstName)
            if (!allLetters(studentFirstName)) {
                throw new Error("Please enter a valid name.")
            }

            // prompts the user for the student ID, and checks if it's a valid ID
            const studentID = prompt("Please enter the student's ID number:");
            console.log(typeof studentID + studentID)
            if (!allNumbers(studentID)) {
                throw new Error("Please enter a valid ID number.")
            }

            // prompts the user for an email, corrects the email capitalization and checks if it's valid
            const studentEmail = prompt("Please enter the student's email:").toLowerCase();
            console.log(typeof studentEmail + studentEmail)
            if (!isValidEmail(studentEmail)) {
                throw new Error("Please enter a valid email.");
            }

            // adds student info to the array
            studentDict[studentLastName] = {
                studentID: String(studentID),
                studentFirstName: String(studentFirstName),
                studentLastName: String(studentLastName),
                studentEmail: String(studentEmail)
            }

            let userResponse = confirm("Add another student?");
            if (userResponse === false) {
                continueLoop = false;
            }
        }

        let studentKeyArray = Object.keys(studentDict);
        console.log(studentKeyArray)
        studentKeyArray.sort()

        const parent = document.getElementById('studentSubscreen');
        while (parent.hasChildNodes()) {
            parent.removeChild(parent.children[0]);
        }

        let newPara;
        for (let i=0; i<studentKeyArray.length; i++) {
            let x = studentKeyArray[i];
            if (i % 2 === 0) {
                newPara = document.getElementById('studentA').cloneNode();
            }
            else {
                newPara = document.getElementById('studentB').cloneNode();
            }
            newPara.textContent = `${studentDict[x]['studentLastName']}, ${studentDict[x]['studentFirstName']}
                | ${studentDict[x]['studentID']} | ${studentDict[x]['studentEmail']}`;
            newPara.hidden = false;
            const button = document.createElement('button');
            button.textContent = "AI+";
            button.className = "progA";
            button.addEventListener('click', AIAnalysis);
            document.getElementById("studentSubscreen").appendChild(newPara);
            newPara.appendChild(button);
        }
        document.getElementById("studentSubscreen").hidden = false;
        console.log(studentDict)


        return studentDict;
    }

    function AIAnalysis(){}

    // all react states: typing indicator, visible messages, hidden messages, buttons, and file
    const [typing, setTyping] = useState(false);
    const [messages, setMessages] = useState([{
        message: "How may I help you today?",
        sender: "ChatGPT",
        direction: "incoming"
    }]);  // []
    const [hiddenMessages, setHiddenMessages] = useState([{
        message: "How may I help you today?",
        sender: "ChatGPT",
        direction: "incoming"
    }]);

    // sends requests to GPT and handles transforming data to work correctly with requests
    const handleSend = async (message) => {
        const newMessage = {
            message: message,
            sender: "user",
            direction: "outgoing"
        }
        // update visible messages
        const newMessages = [...messages, newMessage];
        setMessages(newMessages);

        // update hidden messages
        const newHiddenMessages = [...hiddenMessages, newMessage]
        setHiddenMessages(newHiddenMessages);

        // set a typing indicator
        setTyping(true);
        // process message to chatGPT
        await processMessageToChatGPT(newMessages, newHiddenMessages);
    }
    async function processMessageToChatGPT(chatMessages, allMessages) {
        // chatMessages {sender: "user" or "ChatGPT", message: "message content"}
        // apiMessages {role: "user" or "assistant", content: "message content"}
        let apiMessages = allMessages.map((messageObject) => {
            let role;
            let direction;
            if (messageObject.sender === "ChatGPT") {
                role = "assistant"
                direction = "incoming"
            } else {
                role = "user"
                direction = "outgoing"
            }
            return {role: role, content: messageObject.message, direction: direction}
        });


        // role: "user" -> message from the user, "assistant" -> a response from ChatGPT
        // "system" -> generally one initial message defining HOW we want chatgpt to talk

        const systemMessage1 = {
            role: "system",
            content: "You are a helpful assistant."
        }

        const apiRequestBody1 = {
            "model": "gpt-4o-mini",
            "messages": [
                systemMessage1,
                ...apiMessages // [message1, message2, message3, ...]
            ]
        }

        await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody1)
        }).then((data1) => {
            return data1.json();
        }).then((data1) => {
            console.log(data1);
            console.log(data1.choices[0].message.content);
            phrase = data1.choices[0].message.content;
        });
        setMessages([...chatMessages, {
            message: phrase,
            sender: "ChatGPT",
            direction: "incoming"
        }]);

        setHiddenMessages([...allMessages, {
            message: phrase,
            sender: "ChatGPT",
            direction: "incoming"
        }]);
        setTyping(false);
    }

    function toCurriculum() {
        console.log(courseID)
        console.log(courseName)
        window.location.replace('/curriculum?param1=' + encodeURIComponent(courseID) + '&param2=' + encodeURIComponent(courseName))
    }


    return (
        <>
            <head>
                <meta charSet="UTF-8"/>
                <title>Student Progress</title>
                <link rel="icon" type="image/svg+xml" href="/assets/gac-icon.png"/>
                <link href={"src/stylesheets/student-Progress.css"} rel="stylesheet"/>
                <link href={"src/stylesheets/index.css"} rel="stylesheet"/>
                <link href={"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"} rel="stylesheet"
                      integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
                      crossOrigin="anonymous"/>
            </head>
            <body>
                <div className="topnav">
                    <a href="/home">Home</a>
                    <a style={{color: "#00006c"}} onClick={toCurriculum}>Curriculum Creator</a>
                    <a className="active">Student Progress</a>
                    <a href="/userPage" style={{float: "right"}}>User Information</a>
                </div>
                <div className={"row"} style={{paddingBottom:"18px"}}>
                    <div className={"column"}>
                        <h1><b>Student Progress</b></h1>
                        <div style={{height: "630px", width: "700px", marginTop: "10px", marginLeft: "20px", marginBottom: "20px"}}>
                            <MainContainer>
                                <ChatContainer>
                                    <MessageList scrollBehavior={'smooth'} typingIndicator={typing ?
                                        <TypingIndicator content="ChatGPT is thinking"/> : false}>
                                        {messages.map((message, i) => {
                                            return <Message key={i} model={message}/>
                                        })}
                                    </MessageList>
                                    <MessageInput placeholder={"Type message here"}
                                                  onSend={(message) => handleSend(message)}/>
                                </ChatContainer>
                            </MainContainer>
                        </div>
                    </div>
                    <div className={"column"}>
                        <h3 id={"courseTitleID"} style={{color:"#00006c", fontSize:"40px", fontWeight: "bold"}}>{courseName + ": " + courseID}</h3>
                        <div className={"studentList"} id={"studentList"}>
                            <button className={"addStudent"} style={{marginRight: "0px"}} onClick={addStudent}>Add Student +</button>
                            <button className={"addStudent"} onClick={AIAnalysis}>General Progress Analysis</button>
                            <button className={"saveButton"} onClick={saveStudentDict}>Save</button>
                            <p className="studentA" id="studentA" hidden>X<button className="progA">AI+</button></p>
                            <p className="studentB" id="studentB" hidden>X<button className="progA">AI+</button></p>
                            <div className="studentSubscreen" id="studentSubscreen" hidden></div>
                        </div>
                    </div>
                </div>
            </body>

        </>


    )
}

//onClick={addStudent()}
// onClick={AIAnalysis()}