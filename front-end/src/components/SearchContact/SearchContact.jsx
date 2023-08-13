import React, { useState } from 'react'
import axios from 'axios'
export default function SearchContact({setDisplayChatBox}) {

    const [users, setUsers] = useState([])

    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            let context = this, args = arguments;
            let later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            let callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
    
    const showResult=debounce(async(e)=>{
        let value=e.target.value.trim()
        try{
            const res=await axios.get('http://localhost:3005/api/users?username='+value)
             setUsers(res.data)
             console.log(res.data)
              //buffer = Buffer.from( new Uint8Array(res.data.picture.data) );
            // console.log(typeof buffer)
         }

         catch(err){
             console.log(err)
         }
    },200)

    
    return (
        <div>
            <input type="text" className="chatMenuInput" onKeyUp={showResult} placeholder="Search for friends" />
            <div>test</div>
            {users?.map(user=>(<div>hi</div>))}
        </div>
    )
}
