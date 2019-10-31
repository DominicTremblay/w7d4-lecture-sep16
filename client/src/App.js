import React, { useEffect, useReducer } from 'react';
import './App.css';
import NavBar from './NavBar';
import ChatBar from './ChatBar';
import MessageList from './MessageList';
import lib from './lib/messages';

// create a message reducer to update the state

const SET_MESSAGES = 'SET_MESSAGES';
const SET_USERNAME = 'SET_USERNAME';
const SET_SOCKET = 'SET_SOCKET';

const messageReducer = (state, action) => {


	const actions = {

		SET_MESSAGES: {
			...state,
			messages: [...state.messages, action.message]
		},
		SET_USERNAME: {
			...state,
			currentUser: {name: action.username}
		},
		SET_SOCKET: {
			...state,
			socketServer: action.socket,
			connected: true
		}
	}

	if (!actions[action.type]) {
		throw new Error("Unkown type in message reducer")
	}

	// return the state from the corresponding action
	return actions[action.type]

}



// Create a custom hook to connect to WebSocket

const useSocket = url => {

	const [state, dispatch] = useReducer(messageReducer, {
		currentUser: { name: 'Anonymous' },
		messages: lib.messages,
		socketServer: null,
		connected: false
	})

	useEffect(() => {
		dispatch({ type: SET_SOCKET, socket: new WebSocket(url) })

	}, [url]);


// useEffect to attach event listeners onopen and onmessage	
	useEffect(() => {
		
		if (state.connected) {
			state.socketServer.onopen = () => console.log("Connected to Socket Server");
			state.socketServer.onmessage = event => {

				const message = JSON.parse(event.data);

				dispatch({ type: SET_MESSAGES, message });

			}
			state.socketServer.onclose = () => console.log('Disconnected from Socket Server')
			return () => {
				state.socketServer.onopen = null;
				state.socketServer.onmessage = null;
				state.onclose = null;
			}
		}
	})


	// return state, dispatch
	return {
		state,
		dispatch
	}

}




function App() {
	
	// use the custom hook
	const {state, dispatch} = useSocket('ws://localhost:3001')

	// Sending message from the chat to the server
	const sendMessage = (message) => {

		// Create a new message object
		const newMessage = {
			type: 'postMessage',
			content: message,
			username: state.currentUser.name
		}
		
    // send a message to the server

		state.socketServer.send(JSON.stringify(newMessage));

	};

	const updateUser = (username) => {

		// Create a notification object		
		const newNotification = {
      type: 'postNotification',
      content: `${state.currentUser.name} has changed their name to ${username}`,
    }

		// updating the username in the state
		dispatch({type: SET_USERNAME, username})
		
		// send a message to the server
		state.socketServer.send(JSON.stringify(newNotification))

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
