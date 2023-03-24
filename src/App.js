//import WordlePanel from "./components/WordlePanel"
import './App.css';
import { useEffect, useState } from 'react';
import WordlePanel from './components/WordlePanel/WordlePanel';
import useDebounce from './utils/debounceHook';
import CheckGuess from './utils/checkGuess';
import RespondToKeyPress from './utils/respondToKeyPress';
import API from "./utils/API.js";
import Submit from './components/Submit';
import axios from 'axios';

function App() {
  const [key, setKey] = useState({
    value: "",
    timeStamp: 0
  });
  const [data, setData] = useState({
    guessLetters: [["", "", "", "", ""],
                  ["", "", "", "", ""],
                  ["", "", "", "", ""],
                  ["", "", "", "", ""],
                  ["", "", "", "", ""]],
    index: 0,
    row: 0
  });
  const [solution, setSolution] = useState("GAMES");

  // GET as new word from the wordle-solutions API when the page loads for the first time
  // Uncomment when done
  /*
  useEffect(() => {
    console.log("GET SOLUTION");
    const options = {
      method: 'GET',
      url: 'https://wordle-answers-solutions.p.rapidapi.com/answers',
      headers: {
          'X-RapidAPI-Key': '9ba7d440b5msh5438551fa5d5c20p112825jsne7fb13cd489f',
          'X-RapidAPI-Host': 'wordle-answers-solutions.p.rapidapi.com'
      }
    }
    axios.request(options)
      .then(function (response) {
        setSolution(response.data.data[Math.floor(Math.random() * parseInt(response.data.data[0].num))].answer);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, []);*/

  // Debounce the Key Press
  const debouncedKey = useDebounce(key, 500);

  useEffect(() => {
    // Listen to a key press anywhere on the window
    window.addEventListener('keydown', e => {
      console.log(e);
      if ((e.which >= 65 && e.which <= 90) || e.which === 8) {
        // Respond if the key is a letter press or a backspace
        setKey({value: e.key, timeStamp: e.timeStamp});
      }
    });
  }, []);

  useEffect(() => {
    //What should you do if the debounced value of the keypress changes.
    console.log(`Key Pressed: ${debouncedKey}; Index: ${data.index}`);
    let temp = RespondToKeyPress({ ...data }, debouncedKey.value);
    console.log(temp);
    setData(temp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKey.timeStamp])

  const checkEntry = () => {
    if (data.index >= 5) {
        API.IsDictionaryWord(data.guessLetters[data.row].join(''))
          .then(res => {
            setData({ ...data, index: 0, row: data.row + 1 });
            CheckGuess(data, solution);
          })
          .catch(err => { 
            let temp = data.guessLetters;
            temp[data.row] = ["", "", "", "", ""];
            setData({ ...data, guessLetters: temp, index: 0 });
          });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  return (
    <div className="container w-50">
      <WordlePanel row1={data.guessLetters[0]} row2={data.guessLetters[1]} row3={data.guessLetters[2]} row4={data.guessLetters[3]} row5={data.guessLetters[4]} />
      <Submit clickHandler={checkEntry}/>
    </div>
  );
}

export default App;
