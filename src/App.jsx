
import { useState, useRef } from 'react';
import './App.css';

function TodoList({ todos, setTodos }) {
  const [input, setInput] = useState('');
  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { text: input, done: false }]);
      setInput('');
    }
  };
  const toggleTodo = idx => {
    setTodos(todos.map((todo, i) => i === idx ? { ...todo, done: !todo.done } : todo));
  };
  return (
    <div className="feature-frame todo-frame">
      <h2>To-Do List</h2>
      <div className="todo-input">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Add a task..." />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul className="todo-list">
        {todos.map((todo, idx) => (
          <li key={idx} className={todo.done ? 'done' : ''} onClick={() => toggleTodo(idx)}>
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Journal({ entries, setEntries }) {
  const [text, setText] = useState('');
  const addEntry = () => {
    if (text.trim()) {
      setEntries([{ text, date: new Date().toLocaleString() }, ...entries]);
      setText('');
    }
  };
  return (
    <div className="feature-frame journal-frame">
      <h2>Journal</h2>
      <div className="journal-input-row">
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Write your thoughts..." />
        <button onClick={addEntry}>Add Entry</button>
      </div>
      <ul className="journal-list">
        {entries.map((entry, idx) => (
          <li key={idx}>
            <span className="journal-date">{entry.date}</span>
            <div>{entry.text}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Pomodoro({ customMinutes, setCustomMinutes, seconds, setSeconds, isActive, setIsActive, intervalRef }) {
  const [showTimesUp, setShowTimesUp] = useState(false);
  const startTimer = () => {
    setShowTimesUp(false);
    if (!isActive) {
      setIsActive(true);
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setIsActive(false);
            setShowTimesUp(true);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
  };
  const pauseTimer = () => {
    setIsActive(false);
    clearInterval(intervalRef.current);
  };
  const resetTimer = () => {
    setIsActive(false);
    clearInterval(intervalRef.current);
    setSeconds(customMinutes * 60);
    setShowTimesUp(false);
  };
  const handleCustomMinutes = (e) => {
    const val = Math.max(1, Math.min(120, Number(e.target.value)));
    setCustomMinutes(val);
    setSeconds(val * 60);
    setShowTimesUp(false);
  };
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return (
    <div className="feature-frame pomodoro-frame">
      <h2>Pomodoro Timer</h2>
      <div className="pomodoro-custom">
        <label>Set Minutes: </label>
        <input type="number" min="1" max="120" value={customMinutes} onChange={handleCustomMinutes} disabled={isActive} />
      </div>
      <div className="timer-display">{minutes}:{secs}</div>
      {showTimesUp && <div className="timesup-note">Time's up!</div>}
      <div className="timer-controls">
        <button onClick={startTimer} disabled={isActive}>Start</button>
        <button onClick={pauseTimer} disabled={!isActive}>Pause</button>
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
}

function App() {
  const [openFrame, setOpenFrame] = useState(null);
  // App-level state for all features
  const [todos, setTodos] = useState([]);
  const [entries, setEntries] = useState([]);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [seconds, setSeconds] = useState(1500);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef();

  const features = [
    { key: 'todo', label: 'To-Do List', component: <TodoList todos={todos} setTodos={setTodos} /> },
    { key: 'journal', label: 'Journal', component: <Journal entries={entries} setEntries={setEntries} /> },
    { key: 'pomodoro', label: 'Pomodoro Timer', component: <Pomodoro customMinutes={customMinutes} setCustomMinutes={setCustomMinutes} seconds={seconds} setSeconds={setSeconds} isActive={isActive} setIsActive={setIsActive} intervalRef={intervalRef} /> },
  ];
  const handleDropdownClick = (key) => {
    setOpenFrame(openFrame === key ? null : key);
  };
  return (
    <div className="main-app">
      {/* SVG background decorations */}
      <svg className="bg-svg-hearts" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <circle cx="15" cy="20" r="7" fill="#b3e0ff" opacity="0.18" />
        <path d="M30 80 Q32 75 35 80 Q38 85 40 80 Q42 75 45 80 Q48 85 50 80" stroke="#b3e0ff" strokeWidth="2" fill="none" opacity="0.13" />
        <path d="M70 30 Q72 25 75 30 Q78 35 80 30 Q82 25 85 30 Q88 35 90 30" stroke="#b3e0ff" strokeWidth="2" fill="none" opacity="0.13" />
        <polygon points="60,10 65,25 55,25" fill="#b3e0ff" opacity="0.13" />
        <polygon points="80,90 85,75 75,75" fill="#b3e0ff" opacity="0.10" />
        <polygon points="20,60 25,75 15,75" fill="#b3e0ff" opacity="0.10" />
      </svg>
      <h1 className="main-title">One Step at a Time</h1>
      <div className="dropdown-frame-list">
        {features.map(f => (
          <div key={f.key} className={`dropdown-frame${openFrame === f.key ? ' open' : ''}`}> 
            <div className="dropdown-title" onClick={() => handleDropdownClick(f.key)}>{f.label}</div>
            {openFrame === f.key && <div className="dropdown-content">{f.component}</div>}
          </div>
        ))}
      </div>
    </div>
  );
  }

export default App;
