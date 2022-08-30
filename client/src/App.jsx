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
    <div className='h-screen bg-zinc-800 text-white flex items-center justify-center'>
      <form onSubmit={handleSubmit} className='bg-zinc-900 p-10'>
        <h1 className='text-2x1 font-bold my-2'>Chat React</h1>
        <input
          type='text'
          name='message'
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          className='border-2 border-zinc-500 p-2 w-full text-black rounded-md'
        />

        <ul className='h-80 overflow-y-auto'>
          {messages.map((message, index) => (
            <li
              key={index}
              className={`my-2 p-2 table text-sm rounded-md ${
                message.from === 'Me' ? 'bg-sky-700 ml-auto' : 'bg-black'
              }`}
            >
              <p>
                {message.from}: {message.body} <br />
                {message.timestamp}
              </p>
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
}

export default App;
