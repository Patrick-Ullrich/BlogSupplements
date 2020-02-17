import React , { useState } from 'react';
import './App.css';
import useInterval from './hooks/useInterval'

function App() {
  const [timer, setTimer] = useState<number | null>(1000)
  const [date, setDate] = useState<string>(new Date().toISOString())
  const [callback, setCallback] = useState<() => void>(() => () => setDate(new Date().toISOString()))

  useInterval(callback, timer)

  return (
    <div className="App">
        <p>
          {date}
        </p>
        <button onClick={() => setTimer(null)}>
          Stop Timer
        </button>
        <button onClick={() => setTimer(1000)}>
          Start Timer
        </button>
        <button onClick={() => setCallback(() => () => setDate(new Date().toUTCString()))}>
          To UTC string
        </button>
        <button onClick={() => setCallback(() => () => setDate(new Date().toISOString()))}>
          To ISO string
        </button>
    </div>
  );
}

export default App;
