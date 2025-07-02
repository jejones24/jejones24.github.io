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
import {createNewInterface} from "../functions/newElements.jsx";
import axios from "axios";


export default function Curriculum() {
    const API_KEY = process.env.VITE_API_KEY;
    let stringDict = [];


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
    const [buttons, setButtons] = useState([]);
    const [firstQuery, setFirstQuery] = useState(true)
    const [courseID, setCourseID] = useState("");
    const [courseName, setCourseName] = useState("");
    const [curriculum, setCurriculum] = useState({});

    function fetchData() {
        const urlParams = new URLSearchParams(window.location.search);
        setCourseID(urlParams.get('param1'))
        setCourseName(urlParams.get('param2'))
        axios.post("http://localhost:4000/curriculum", {
            courseID: urlParams.get('param1'),
        }).then(function(response){
            return response.data
        }).then((response) => {
            console.log(response)
            if (response) {
                setCurriculum(response)
                // set buttons to key array of response
                const keyArray = Array.from(Object.keys(response));
                setButtons(keyArray);

                // call create interface
                createNewInterface(response);

                // add string dictionary to hidden messages
                stringDict[2] = JSON.stringify(response)
                setHiddenMessages([...hiddenMessages, {
                    message: stringDict[2],
                    sender: "ChatGPT",
                    direction: "incoming"
                }])

                // set firstQuery to false
                setFirstQuery(false);
                document.getElementById("introMessage").hidden = true;
            }}).catch(function (error) {
            console.log(error)
        })
    }

    useEffect(() => {
        fetchData()
    }, []);

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
        console.log(firstQuery);
        console.log(hiddenMessages);
        let apiMessages = allMessages.map((messageObject) => {
            let role;
            let direction;
            if (messageObject.sender === "ChatGPT") {
                role="assistant"
                direction="incoming"
            } else {
                role = "user"
                direction="outgoing"
            }
            return { role: role, content: messageObject.message, direction: direction }
        });


        // role: "user" -> message from the user, "assistant" -> a response from ChatGPT
        // "system" -> generally one initial message defining HOW we want chatgpt to talk

        const systemMessage1 = {
            role: "system",
            content: "Based on the information or query given, state the high level goal of this query and state the " +
                "subtasks that would be relevant to fulfilling this query as a bulleted list. Finally, create a " +
                "detailed curriculum relevant to the query, including things like possible assignments and assessments."
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
            stringDict[1] = data1.choices[0].message.content;
        });


        const systemMessage2 = {
            role: "system",
            content: `Based on the given high level goal, subtasks, and curriculum revise the curriculum to be 
                formatted as a javascript Object dictionary that is usable in code as a string that 
                can be parsed using the JSON function. Format the javascript Object as such: {"Week X": {"Title": "X",
                "Topics": ["X", "X", "X"], "Assignments": ["X", "X", "X"], "Assessments": ["X", "X", "X"]}}, with 
                "X" characters being replaced with the actual content relevant to the prompt. If it you believe it 
                would be more appropriate to leave out assignments or assessments on a given week, that is
                acceptable, but if you so choose to do that, leave the javascript Object out of the dictionary for
                that week, like removing "Assessments": ["X", "X", "X"] from the example. You should never completely
                exclude assignments or assessments either- make sure assignments and assessments are present at least 
                the majority of weeks. Choose where they would fit best. You must always include
                "Title" and "Topics". Always exclude the ''' javascript ''' tag and never deviate from this format. 
                When fulfilling this query, take into account the high level goal and bulleted subtasks as defined by (${stringDict[1]})
                in the messages before. If you receive a file such as an image or docx or a link leading to an image, 
                analyze the image first, and create an outline based on the content in an identical manner to if you 
                received a standard query from the user.`,
        }

        const apiRequestBody2 = {
            "model": "gpt-4o-mini",
            "messages": [
                systemMessage2,
                ...apiMessages // [message1, message2, message3, ...]
            ]
        }

        const systemMessageA = {
            role: "system",
            content: "When fulfilling this query, always reference the most recent javascript Object created. " +
                "When you perform this action, take into account the entire javascript Object, and make alterations" +
                " only to the relevant sections. Do not add any additional flavor text, such as 'Your changes have " +
                "been made' or 'Here is the updated curriculum' under any circumstance- just return the slightly " +
                "altered javascript Object from before, and always exclude any extra tags, such as the '''json''' tag or the  '''javascript''' tag. Any additions " +
                "should follow the same format of the already established javascript Object of : {'Week X': {'Title': 'X', " +
                "'Topics': ['X', 'X', 'X'], 'Assignments': ['X', 'X', 'X'], 'Assessments': ['X', 'X', 'X']}}, with " +
                "'X' characters being replaced with the actual content relevant to the prompt. You should be " +
                "returning the entire javascript Object with the revised changes."
        };

        const apiRequestBodyA = {
            "model": "gpt-4o-mini",
            "messages": [
                systemMessageA,
                ...apiMessages // [message1, message2, message3, ...]
            ]
        }

        let x;
        if (firstQuery) {
            x = apiRequestBody2;
        }
        else {
            x = apiRequestBodyA;
        }

        await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(x)
        }).then((data3) => {
            return data3.json();
        }).then((data3) => {
            console.log(data3);
            console.log(data3.choices[0].message.content);
            stringDict[2] = data3.choices[0].message.content
            console.log(typeof stringDict[2])
            stringDict[3] = JSON.parse(stringDict[2]);
            console.log(stringDict[3])
            setCurriculum(stringDict[3])
            console.log(firstQuery)
            let phrase;
            if (firstQuery) {
                phrase = "An outline of your curriculum has been made. If you have questions or would like " +
                    "to make a change, let me know!"
            }
            else {
                phrase = "The requested changes have been made. Let me know if there's anything else you " +
                    "would like me to do!"
            }
            setMessages([...chatMessages, {
                message: phrase,
                sender: "ChatGPT",
                direction: "incoming"
            }]);

            setHiddenMessages([...allMessages, {
                message: stringDict[1],
                sender: "ChatGPT",
                direction: "incoming"
            }, {
                message: stringDict[2],
                sender: "ChatGPT",
                direction: "incoming"
            }, {
                message: phrase,
                sender: "ChatGPT",
                direction: "incoming"
            }]);


            setFirstQuery(false);
            setTyping(false);
            document.getElementById("introMessage").hidden = true;
            document.getElementById("mainInterface").hidden = false;

            const parent = document.getElementById('subInterfaces');
            while (parent.hasChildNodes()) {
                parent.removeChild(parent.children[0]);
            }
            // createNewUnitButton(stringDict[4]);
            const keyArray = Array.from(Object.keys(stringDict[3]));
            setButtons(keyArray);

            createNewInterface(stringDict[3]);
            console.log(firstQuery);

        });
    }
    const [file, setFile] = useState(null);
    const [imgResponse, setImgResponse] = useState('');
    const [previewURL, setPreviewURL] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        const objectURL = URL.createObjectURL(e.target.files[0])
        setPreviewURL(objectURL)

    };
    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setTyping(true)

        const newMessage = {
            sender: "user",
            direction: "outgoing",
            type: 'image',
            src: previewURL
        }

        const newMessages = [...messages, newMessage];
        setMessages(newMessages);

        try {
            const res = await axios.post("http://localhost:4000/image", formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('Success: ', res.data)
            setImgResponse(res.data)

            const newHiddenMessage = {
                type: 'text',
                message: res.data,
                sender: "user",
                direction: "outgoing"
            }

            const newHiddenMessages = [...hiddenMessages, newHiddenMessage]
            setHiddenMessages(newHiddenMessages);

            // process message to chatGPT
            await processMessageToChatGPT(newMessages, newHiddenMessages);
        } catch (err) {
            console.error('Upload error: ', err)
        }
    }

    function saveToDB() {
        console.log(curriculum)
        axios.post("http://localhost:4000/curriculumSave", {
            newCurriculum: JSON.stringify(curriculum),
            courseID: parseInt(courseID)
        })}

    function toStudentProgress() {
        console.log(courseID)
        console.log(courseName)
        window.location.replace('/studentProgress?param1=' + encodeURIComponent(courseID) + '&param2=' + encodeURIComponent(courseName))
    }

    function showWeekPanel(i) {
        stringDict[6] = i;
        document.getElementById("mainInterface").hidden = true;
        document.getElementById("subInterfaces").hidden = false
        document.getElementById("backButton").hidden = false;
        document.getElementById(`weekPanel${i}`).hidden = false;
        document.getElementById(`weekButton0`).hidden = true;
    }

    function goBack() {
        document.getElementById("subInterfaces").hidden = true;
        document.getElementById("mainInterface").hidden = false;
        document.getElementById("backButton").hidden = true;
        document.getElementById(`weekPanel${stringDict[6]}`).hidden = true;
        document.getElementById(`weekButton0`).hidden = false;
    }

    function uploadFile(){
        document.getElementById('fileChange').click()
    }

    return (
        <>
            <head>
                <meta charSet="UTF-8"/>
                <meta name="viewport"
                      content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"/>
                <meta httpEquiv="X-UA-Compatible" content="ie=edge"/>
                <link href={"src/stylesheets/home.css"} rel="stylesheet"/>
                <title>Curriculum Creator</title>
            </head>
            <div className="App">
                <div className="topnav">
                    <a href="/home">Home</a>
                    <a className="active">Curriculum Creator</a>
                    <a style={{color: "#00006c"}} onClick={toStudentProgress}>Student Progress</a>
                    <a href="/userPage" style={{float: "right"}}>User Information</a>
                </div>
                <div className="row" style={{paddingBottom:"18px"}}>
                    <div className="col-6">
                        <div className="leftside">
                            <h1><b>Curriculum Generator</b></h1>
                            <div style={{height: "595px", width: "700px", marginTop: "10px", marginLeft: "20px", marginBottom: "5px"}}>
                                <MainContainer>
                                    <ChatContainer>
                                        <MessageList scrollBehavior={'smooth'} typingIndicator={typing ?
                                            <TypingIndicator content="ChatGPT is thinking"/> : false}>
                                            {messages.map((message, i) => {
                                                if (message.type === 'image') {
                                                return (<Message key={i} model={{
                                                    direction: message.direction,
                                                    sender: message.sender,
                                                    message: ''}}>
                                                    <Message.ImageContent src={previewURL} alt={"user Upload"} width={200}/>
                                                </Message>
                                                )} else {
                                                    return (
                                                        <Message key={i} model={{
                                                            direction: message.direction,
                                                            sender: message.sender,
                                                            message: message.message}}/>
                                                    )
                                                }
                                            })}
                                        </MessageList>
                                        <MessageInput placeholder={"Type message here"}
                                                      onSend={(message) => handleSend(message)}
                                                      attachButton={true}
                                        onAttachClick={uploadFile}/>
                                    </ChatContainer>
                                </MainContainer>
                            </div>
                            <div>
                                <input id={'fileChange'} type={'file'} accept={"image/*"} onChange={handleFileChange} hidden/>
                                <button className={"newCourse"} style={{display: "inline-block", margin: "5px", marginTop: "0px"}} id={'fileSend'} onClick={handleUpload}>Upload</button>
                                {file && <p style={{display: "inline-block"}}>{file.name}</p>}
                            </div>
                        </div>
                    </div>
                    <div id="rightCol" className="col">
                        <h3 id={"courseTitleID"} style={{color:"#00006c", fontSize:"40px", fontWeight: "bold"}}>{courseName + ": " + courseID}</h3>
                        <button className={"newCourse"} id="weekButton0" onClick={() => showWeekPanel(0)} style={{display: "inline-block", margin: "10px"}}>All Content</button>
                        <button className={"saveButton"} onClick={() => saveToDB()}>Save</button>
                        <p id="introMessage"><a href={"/documents/demo.txt"}>Lesson plan will be shown here.</a></p>
                        <div id="mainInterface" className="panel0">
                            {buttons.map((label, i) => (
                                <button key={i+1} id={`weekButton${i+1}`} className={"button"} onClick={() => showWeekPanel(i+1)}>{label}</button>
                            ))}
                        </div>
                        <div className={"panel"} id={"subInterfaces"} hidden>
                            <div id={"weekPanel0"} hidden>
                                <h1 style={{color:"#00006c", textAlign:"center", fontWeight:"bold"}}>All Content</h1>
                                <ul>
                                    <li>No Assignments found for this course</li>
                                </ul>
                            </div>
                        </div>
                        <button className={"backButton"} id={"backButton"} onClick={goBack} hidden={true}>{"<- Back"}</button>

                    </div>
                </div>
            </div>
        </>
    )
}