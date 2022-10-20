import React, { useEffect, useState,useRef,useMemo } from 'react'
import { user } from "../Join/Join";
import { Component } from 'react';
import socketIo from "socket.io-client";
import "./Chat.css";
import sendLogo from "../../images/send.png";
import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import closeIcon from "../../images/closeIcon.png";
import JoditEditor from 'jodit-react';
// import EditorContainer from "../text_editor/text_editor"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { render } from 'react-dom';
import { EditorState,convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import htmlToFormattedText from "html-to-formatted-text";




let socket;

const ENDPOINT = "http://localhost:5000/";

let variable;



function uploadImageCallBack(file) {
    return new Promise(
        (resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://api.imgur.com/3/image');
            xhr.setRequestHeader('Authorization', 'Client-ID ##clientid###');
            const data = new FormData();
            data.append('image', file);
            xhr.send(data);
            xhr.addEventListener('load', () => {
                const response = JSON.parse(xhr.responseText);
                console.log(response)
                resolve(response);
            });
            xhr.addEventListener('error', () => {
                const error = JSON.parse(xhr.responseText);
                console.log(error)
                reject(error);
            });
        }
    );
}


class EditorContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
        };
    }





    onEditorStateChange = (editorState) => {
        // console.log(editorState)
        this.setState({
            editorState,
        });

        variable = draftToHtml(convertToRaw(editorState.getCurrentContent()));

        // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))


    };


    render() {
        const { editorState } = this.state;
        return <div className='editor'>
            <Editor
                editorState={editorState}
                onEditorStateChange={this.onEditorStateChange}
                editorClassName="chatInput"
                className="chatInput"
                toolbar={{
                    inline: { inDropdown: true },
                    list: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    link: { inDropdown: true },
                    history: { inDropdown: true },
                    image: { uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: true } },
                }}
            />
           
        </div>
    }
}




const Chat = () => {
    const [id, setid] = useState("");
    
    const [messages, setMessages] = useState([])
    const send = () => {
        let message = document.getElementsByClassName('chatInput').value;
        console.log(variable)

        // message=variable.to
        message=htmlToFormattedText(variable)

        console.log(message)

        socket.emit('message', { message, id });
        document.getElementById('chatInput').value = "";

    }

    console.log(messages);
    useEffect(() => {
        socket = socketIo(ENDPOINT, { transports: ['websocket'] });

        socket.on('connect', () => {
            alert('Connected');
            setid(socket.id);

        })
        console.log(socket);
        socket.emit('joined', { user })

        socket.on('welcome', (data) => {
            setMessages([...messages, data]);
            console.log(data.user, data.message);
        })

        socket.on('userJoined', (data) => {
            setMessages([...messages, data]);
            console.log(data.user, data.message);
        })

        socket.on('leave', (data) => {
            setMessages([...messages, data]);
            console.log(data.user, data.message)
        })

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [])

    useEffect(() => {
        socket.on('sendMessage', (data) => {
            setMessages([...messages, data]);
            console.log(data.user, data.message, data.id);
        })
        return () => {
            socket.off();
        }
    }, [messages])

    return (
        <div className="chatPage">
            <div className="chatContainer">
                <div className="header">
                    <h2>Ashutosh Chat Application</h2>
                </div>
                
                <ReactScrollToBottom className="chatBox">
                    {messages.map((item, i) => <Message user={item.id === id ? '' : item.user} message={item.message} classs={item.id === id ? 'right' : 'left'} />)}
                </ReactScrollToBottom>
                <div className="inputBox">
                    {/* <input onKeyPress={(event) => event.key === 'Enter' ? send() : null} type="text" id="chatInput" /> */}
                    <EditorContainer/>
                    <button onClick={send} className="sendBtn"><img src={sendLogo} alt="Send" /></button>

                   
                </div>
            </div>
        </div>
        // <div>
        //     <EditorContainer />
        // </div>


    )
}

export default Chat
