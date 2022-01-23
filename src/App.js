import "./App.css";
import { useEffect, useState } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";

function App() {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState(null);
  const [savedNotes, setSavedNotes] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    handleListen();
  }, [isListening]);

  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log("continue....");
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log("Stopped Mic on Click");
      };
    }
    mic.onstart = () => {
      console.log("Mics on");
    };
    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

      setNote(transcript);
      mic.error = (event) => {
        console.log(event.error);
      };
    };
  };

  const handleButtonClick = () => {
    setOpen(!open);
  };

  const LanguageSelector = (e) => {
    e === "hindi" ? (mic.lang = "hi") : (mic.lang = "en-US");
    setOpen(!open);
  };

  const handleSaveNote = () => {
    setSavedNotes([...savedNotes, note]);
    setNote("");
  };

  return (
    <>
      <h1>Voice Notes</h1>
      <div className="container">
        <div className="box">
          <h2>Current Note</h2>
          {isListening ? <span>🎤</span> : <span>🔴 🎤</span>}
          <button
            style={{ cursor: "pointer" }}
            onClick={handleSaveNote}
            disabled={!note}
          >
            Saved Note
          </button>
          <button
            style={{ cursor: "pointer" }}
            onClick={() => setIsListening((prevState) => !prevState)}
          >
            {isListening ? "Stop" : "Start"}
          </button>
          <button
            style={{ cursor: "pointer" }}
            type="button"
            className="button"
            onClick={handleButtonClick}
          >
            ☰
          </button>
          {open && (
            <div>
              <ul>
                <li
                  style={{ cursor: "pointer" }}
                  onClick={() => LanguageSelector("hindi")}
                >
                  Hindi
                </li>
                <li
                  style={{ cursor: "pointer" }}
                  onClick={() => LanguageSelector("english")}
                >
                  English
                </li>
              </ul>
            </div>
          )}
          Language: {mic.lang === "en-US" ? "English" : "Hindi"}
          <p>{note}</p>
        </div>
        <div className="box">
          <h2>Notes</h2>
          {savedNotes.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
