import React, { useEffect, useContext, useState } from 'react';
import io from 'socket.io-client';
import UserContext from '../context/UserContext';
import { Container, Button } from '@material-ui/core';
import MessageDisplay from './MessageDisplay';
import axios from 'axios';

let socket = io('http://localhost:5000');

const Messages = () => {
    const { userData, setUserData } = useContext(UserContext);
    
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState('');
    
    const token = localStorage.getItem('auth-token');

    
    useEffect(() => {
        
        axios.post("http://localhost:5000/getUserMessages", {
            userId: userData.user.id,
            contactId: userData.contactId
        }, {
            headers: {
                "x-auth-token": token
            }
        })
        .then(res => {
            console.log('set message history', res)
            setMessages(res.data.messageHistory)
            
        })
        
        socket.emit('joinroom', userData.user);
        
        
        return () => socket.disconnect();
    }, []);
    
    if(messages){
        socket.on('newMessage', data => {
            console.log('message recieved')
            const newHistory = [...messages.messageHistory, data]
            setMessages({...messages, messageHistory: newHistory})
        });
    }
    
    
    const sendMessage = (e) => {
        
        e.preventDefault();
        if (message) {
            const newMessage = {
                text: message,
                senderId: userData.user.id,
                timeStamp: Date.now()
            }
            
            const currentHistory = messages.messageHistory;
            const newHistory = [...currentHistory, newMessage]
            setMessages({ ...messages, messageHistory: newHistory })
            
            axios.post("http://localhost:5000/updateUserMessages", {
                newMessage,
                messagesId: messages._id
            }, {
                headers: {
                    "x-auth-token": token
                }
            })
            .catch(err => console.log(err));
            
            socket.emit('update', {
                newMessage,
                messages: messages,
                senderId: userData.user.id
            })
            
            setMessage('');
        }
    }
    
    
    return (
        <div>
            <Container>
                <h1>Messages</h1>
                <div className="display">
                    {messages && messages.messageHistory && messages.messageHistory.map(message => {
                        return <MessageDisplay
                            message={message.text}
                            senderId={message.senderId}
                            time={message.timeStamp}
                        />
                    })}
                </div>
                <input
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' ? sendMessage(e) : null}
                />
                <Button onClick={sendMessage}>Submit</Button>
            </Container>

        </div>
    )
}

export default Messages;
