import React, { useState, useEffect, useReducer } from 'react';
import './App.css';
import NavBar from './NavBar';
import ChatBar from './ChatBar';
import MessageList from './MessageList';
import lib from './lib/messages';

// create a message reducer to update the state

// return the state from the corresponding action

// Create a custom hook to connect to WebSocket

// useEffect to attach event listeners onopen and onmessage

// return state, dispatch,socketServer

function App() {
	// use the custom hook

  const [state, setState] = useState(lib);
	// Sending message from the chat to the server
	const sendMessage = (message) => {
  // Create a new message object
    
    const newMessage =  {
      type: 'incomingMessage',
      content: message,
      username: lib.currentUser.name,
    }

    // send a message to the server
    
    setState({
      ...state,
      messages: [...state.messages, newMessage]
    })
    
	};

	const updateUser = (username) => {

    // Create a notification object
    const newNotification = {
      type: 'incomingNotification',
      content: `${state.currentUser.name} has changed their name to ${username}`
    }

		// updating the username in the state
    setState({
      ...state,
      currentUser: {name: username}
    })
    // send a message to the server
    setState({
      ...state,
      messages: [...state.messages, newNotification]
    })
	};

	return (
		<div>
			<NavBar />
			<MessageList messages={state.messages} />
			<ChatBar username={state.currentUser.name} sendMessage={sendMessage} updateUser={updateUser} />
		</div>
	);
}

export default App;
