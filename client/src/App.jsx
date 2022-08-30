import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:4000');

function App() {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('client:message', message);
    setMessage('');
  };

  useEffect(() => {
    // Procesa los mensages que recive de otros usuarios
    const receivedMessage = (message) => {
      console.log(message);
    };
    // Evento de escucha
    socket.on('server:message', receivedMessage);

    return () => {
      // Desuscribe el evento de escucha al finalizar lo recepcion
      socket.off('server:message', receivedMessage);
    };
  }, []);

  return (
    <div className='App'>
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
    </div>
  );
}

export default App;
