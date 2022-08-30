import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:4000');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('client:message', message);
    const newMessage = {
      body: message,
      from: 'Me',
      timestamp: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
    };
    setMessages([newMessage, ...messages]);
    setMessage('');
  };

  useEffect(() => {
    // Procesa los mensages que recive de otros usuarios
    const receivedMessage = (message) => {
      setMessages((messages) => [message, ...messages]);
    };
    // Evento de escucha
    socket.on('server:message', receivedMessage);

    return () => {
      // Desuscribe el evento de escucha al finalizar lo recepcion
      socket.off('server:message', receivedMessage);
    };
  }, [messages]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='message'
          placeholder='Write a message'
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button>Send</button>
      </form>

      {messages.map((message, index) => (
        <div key={index}>
          <p>
            {message.from}: {message.body} <br />
            {message.timestamp}
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;
