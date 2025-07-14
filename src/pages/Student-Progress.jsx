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
import createStudentList from "../functions/createStudentList.js";

const temp = await axios.post("http://localhost:4000/getAPIKey");
const API_KEY = temp.data

export default function StudentProgress() {
    let phrase;
    const [studentDict, setStudentDict] = useState({});
    const [courseID, setCourseID] = useState("");
    const [courseName, setCourseName] = useState("");
    const [assignments, setAssignments] = useState({});
    const [grades, setGrades] = useState({});
    const [analysisSet, setAnalysisSet] = useState({});

    function fetchData() {
        const urlParams = new URLSearchParams(window.location.search);
        setCourseID(urlParams.get('param1'))
        setCourseName(urlParams.get('param2'))
        axios.post("http://localhost:4000/studentDict", {
            courseID: urlParams.get('param1'),
        }).then(function(response) {
            return response.data
        }).then((response) => {
            console.log(response);
            setStudentDict(response['studentDict']);
            setAssignments(response['activityDict']);
            setGrades(response['gradeDict']);
            let tempStudentDict = response['studentDict'];
            let tempActivityDict = response['activityDict'];
            let tempGradeDict = response['gradeDict'];

            setAnalysisSet(createStudentList(tempStudentDict, tempActivityDict, tempGradeDict));

            let stuSubs = document.getElementById('studentSubscreen');
            for (const child of stuSubs.children) {
                if (child.className === 'studentA' || child.className === 'studentB') {
                    const button = document.createElement('button');
                    button.textContent = "AI+";
                    button.className = "progA";
                    button.addEventListener('click', () => AIPlusAnalysis(response['studentID']));
                    child.appendChild(button);
                }
            }
        })
    }

    useEffect(() => {
        fetchData()
    }, []);

    function addStudent() {
        /** Prompts the user to give information about the new student and makes information consistent, correcting
         * capitalization issues and formatting their presentation properly. Sorts the student dictionary array
         * alphabetically by last name so they can be displayed in the same way.*/

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


        // prompts the user for the student ID, and checks if it's a valid ID
        const studentID = prompt("Please enter a student ID number to search:");
        if (!allNumbers(studentID)) {
            alert("Please enter a valid ID number.")
        }

        axios.post("http://localhost:4000/enrollStudent", {
            studentID: studentID,
            courseID: courseID,
            timestamp: Date.now()
        }).then(function(response) {
            return response.data
        }).then((response) => {
            // if it is found, student is enrolled and added to Object, ask user to add another or quit
            if (response) {
                studentDict[response['lastName']] = response;
                let elem = document.getElementById('studentSubscreen')
                while (elem.firstChild) {
                    elem.removeChild(elem.firstChild)
                }
                createStudentList(studentDict, assignments, grades)

                let stuSubs = document.getElementById('studentSubscreen');
                for (const child of stuSubs.children) {
                    if (child.className === 'studentA' || child.className === 'studentB') {
                        const button = document.createElement('button');
                        button.textContent = "AI+";
                        button.className = "progA";
                        button.addEventListener('click', () => AIPlusAnalysis(response['studentID']));
                        child.appendChild(button);
                    }
                }

                document.getElementById("studentSubscreen").hidden = false;
                console.log(studentDict)
                return studentDict;
            } else {
                alert('No student found')
                console.error('No student found')
            }
        }).catch(function (error) {
            console.error(error)
        })
    }

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

    async function AIPlusAnalysis(studentID){
        let statement = analysisSet[studentID]['statement'];
        let name = statement.split('**')
        console.log(name)
        // const newMessage = {
        //     message: `Perform a progress analysis on ${}`,
        //     sender: "user",
        //     direction: "outgoing"
        // }
        //
        // const newHiddenMessage = {
        //     message: ,
        //     sender: 'user',
        //     direction: 'outgoing'
        // }
        // // update visible messages
        // const newMessages = [...messages, newMessage];
        // setMessages(newMessages);
        //
        // // update hidden messages
        // const newHiddenMessages = [...hiddenMessages, newMessage]
        // setHiddenMessages(newHiddenMessages);
        //
        // // set a typing indicator
        // setTyping(true);
        // // process message to chatGPT
        // await processMessageToChatGPT(newMessages, newHiddenMessages);
    }

    function generalAIAnalysis(){}

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
                            <button className={"addStudent"} onClick={generalAIAnalysis}>General Progress Analysis</button>
                            <div id={'toBeCloned'}>
                                <p className="studentA" id="studentA" hidden>X<button className="progA">AI+</button></p>
                                <div className={"studentADiv"} id={"studentADiv"} hidden></div>
                                <p className="studentB" id="studentB" hidden>X<button className="progA">AI+</button></p>
                                <div className={"studentBDiv"} id={"studentBDiv"} hidden></div>
                                <div className={"studentDivLeft"} id={"studentDivLeft"}></div>
                                <div className={"studentDivRight"} id={"studentDivRight"}></div>
                            </div>
                            <div className="studentSubscreen" id="studentSubscreen" hidden></div>
                        </div>
                    </div>
                </div>
            </body>

        </>


    )
}
