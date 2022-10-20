import React, { Component } from 'react';
import { render } from 'react-dom';
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { useEffect, useState } from "react";



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


// const EditorContainer = (props) => {



//     const [editorState, seteditorState] = useState()

//     return <div className='editor'>
//       <Editor
//         editorState={editorState}
//         onEditorStateChange={()=>seteditorState(editorState)}    
//         toolbar={{
//           inline: { inDropdown: true },
//           list: { inDropdown: true },
//           textAlign: { inDropdown: true },
//           link: { inDropdown: true },
//           history: { inDropdown: true },
//           image: { uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: true } },
//         }}
//       />
//     </div>
// }

// export default EditorContainer













const EditorContainer = (props) => {

    const {editerState}=this.state;

    const onEditorStateChange = (editorState) => {
        // console.log(editorState)
        this.setState({
            editorState,
        });
    };

    const { editorState } = this.state;
    return <div className='editor'>
        <Editor
            editorState={editorState}
            onEditorStateChange={this.onEditorStateChange}
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


export default EditorContainer;






