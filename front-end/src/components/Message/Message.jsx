import React from 'react'
import {format} from'timeago.js'
import './message.css'
export default function Message({own,message,vu}) {
    console.log(vu)
    return (
        <div className={own? "message own":"message"}>
            <div className="messageTop">
                {
                    own? (
                        <>
                         {vu &&  <span>Vu</span>}
                    <p className="messageText">{message.text}</p>
                    <img src="https://via.placeholder.com/350x150" alt="message image" className="messageImage" />
                     </>) :(
                         <>
                        <img src="https://via.placeholder.com/350x150" alt="message image" className="messageImage" />
                    <p className="messageText">{message.text}</p>
                     </>)}
                
            </div>
            <div className="messageBottom">{format(message.createdAt)}</div>
        </div>
    )
}
