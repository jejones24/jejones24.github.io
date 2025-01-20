import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react"

const API_KEY ="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";

function App() {
    const [typing, setTyping] = useState(false);
    const [messages, setMessages] = useState([{
        message: "What would you like your lesson plan to look like?",
        sender: "ChatGPT",
        direction: "outgoing"
    }]);  // []

    const handleSend = async (message) => {
        const newMessage = {
            message: message,
            sender: "user",
            direction: "incoming"
        }

        const newMessages = [...messages, newMessage];
        // update our messages state
        setMessages(newMessages)

        // set a typing indicator
        setTyping(true);
        // process message to chatGPT
        await processMessageToChatGPT(newMessages);
    }

    async function processMessageToChatGPT(chatMessages) {
        // chatMessages {sender: "user" or "ChatGPT", message: "message content"}
        // apiMessages {role: "user" or "assistant", content: "message content"}

        let apiMessages = chatMessages.map((messageObject) => {
            let role = "";
            if (messageObject.sender === "ChatGPT") {
                role="assistant"
            } else {
                role = "user"
            }
            return { role: role, content: messageObject.message }
        });

        // role: "user" -> message from the user, "assistant" -> a response from ChatGPT
        // "system" -> generally one initial message defining HOW we want chatgpt to talk

        const systemMessage = {
            role: "system",
            content: "You are a helpful assistant. If the bracketed query is irrelevant to the creation of an " +
                "educational curriculum, politely say that you can't answer. Otherwise, when fulfilling this query, " +
                "consider its high level goal. Make the output a bulleted and explain the reasoning behind the " +
                "answer you give."
        }

        const apiRequestBody = {
            "model": "gpt-4o-mini",
            "messages": [
                systemMessage,
                ...apiMessages // [message1, message2, message3, ...]
            ]
        }
        await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody)
        }).then((data) => {
            return data.json();
        }).then((data) => {
            console.log(data);
            console.log(data.choices[0].message.content);
            setMessages(
                [...chatMessages, {
                    message: data.choices[0].message.content,
                    sender: "ChatGPT"
                }]
            );
            setTyping(false);
        });
    }

    return (
        <>
            <head>
                <meta charSet="UTF-8"/>
                <meta name="viewport"
                      content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"/>
                <meta httpEquiv="X-UA-Compatible" content="ie=edge"/>
                <title>Curriculum Generator</title>
            </head>
            <div className="App">
                <div style={{position: "relative", height: "700px", width: "700px"}}>
                    <MainContainer>
                        <ChatContainer>
                            <MessageList scrollBehavior={'smooth'} typingIndicator={typing ?
                                <TypingIndicator content="ChatGPT is thinking"/> : false}>
                                {messages.map((message, i) => {
                                    return <Message key={i} model={message}/>
                                })}
                            </MessageList>
                            <MessageInput placeholder={"Type message here"} onSend={(message) => handleSend(message)}/>
                        </ChatContainer>
                    </MainContainer>
                </div>
            </div>
        </>
    )
}

export default App

