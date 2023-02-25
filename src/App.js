import "./SCSS/app.scss";
import { useEffect, useState } from "react";

const Timer = ({ timingType, timeFormatter }) => {
  return (
    <div className="timer">
      <h2 id="timer-label">{timingType}</h2>
      <h3 id="time-left" className="">
        {timeFormatter}
      </h3>
    </div>
  );
};

const CommandsTime = ({ handlePlay, handleReset, play, nextTimingType }) => {
  return (
    <div className="my-2">
      <button onClick={handlePlay} id="start_stop" className="sessionButton">
        {play ? <i class="fas fa-pause"></i> : <i class="fa fa-play"></i>}
      </button>
      <button onClick={handleReset} id="reset" className="sessionButton">
        <i class="fa fa-refresh"></i>
      </button>
      <button onClick={nextTimingType} id="next" className="sessionButton">
        <i class="fas fa-step-forward"></i>
      </button>
    </div>
  );
};

const TimeSettings = ({
  play,
  breakIncrement,
  breakDecrement,
  breakLength,
  sessionDecrement,
  sessionLength,
  sessionIncrement,
}) => {
  return (
    <div id="break-session" className="d-flex mt-4">
      <div className="mx-4">
        <h3 id="break-label">Break</h3>
        <div className="d-flex">
          <button
            disabled={play}
            onClick={breakDecrement}
            id="break-decrement"
            className="sessionButton"
          >
            <i class="fa fa-minus"></i>
          </button>
          <strong id="break-length" className="sessionButton">
            {breakLength}
          </strong>
          <button
            disabled={play}
            onClick={breakIncrement}
            id="break-increment"
            className="sessionButton"
          >
            <i class="fa fa-plus"></i>
          </button>
        </div>
      </div>
      <div className="mx-4">
        <h3 id="session-label">Session</h3>
        <div className="d-flex">
          <button
            disabled={play}
            onClick={sessionDecrement}
            id="session-decrement"
            className="sessionButton"
          >
            <i class="fa fa-minus"></i>
          </button>
          <strong id="session-length" className="sessionButton">
            {sessionLength}
          </strong>
          <button
            disabled={play}
            onClick={sessionIncrement}
            id="session-increment"
            className="sessionButton"
          >
            <i class="fa fa-plus"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(1500);
  const [timingType, setTimingtype] = useState("Session");

  const [play, setPlay] = useState(false);

  const timeout = setTimeout(() => {
    if (timeLeft && play) {
      setTimeLeft(timeLeft - 1);
    }
    if (timeLeft == 0) {
      const audio = document.getElementById("beep");
      audio.play();
      nextTimingType();
    }
  }, 1000);

  const breakIncrement = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
      if (timingType === "Break") {
        setTimeLeft(timeLeft + 60);
      }
    }
  };

  const breakDecrement = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
      if (timingType === "Break") {
        setTimeLeft(timeLeft - 60);
      }
    }
  };

  const sessionIncrement = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      if (timingType === "Session") {
        setTimeLeft(timeLeft + 60);
      }
    }
  };

  const sessionDecrement = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      if (timingType === "Session") {
        setTimeLeft(timeLeft - 60);
      }
    }
  };

  const handleReset = () => {
    clearTimeout(timeout);
    setPlay(false);
    setTimeLeft(1500);
    setBreakLength(5);
    setSessionLength(25);
    setTimingtype("Session");
    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
  };

  const handlePlay = () => {
    clearTimeout(timeout);
    setPlay(!play);
  };

  const resetTimer = () => {
    const audio = document.getElementById("beep");
    if (!timeLeft && timingType === "Session") {
      setTimeLeft(breakLength * 60);
      setTimingtype("Break");
      audio.play();
      changeColor();
    }
    if (!timeLeft && timingType === "Break") {
      setTimeLeft(sessionLength * 60);
      setTimingtype("Session");
      audio.play();
      changeColor();
    }
  };

  const changeColor = () => {
    if (timingType === "Session") {
      document.getElementById("wrapperSession").id = "wrapperBreak";
      document.getElementById("sessionTime").id = "breakTime";
      const className = document.querySelectorAll(".sessionButton");
      if (className) {
        className.forEach((elem) => {
          elem.className = "breakButton";
        });
      }
    } else {
      document.getElementById("wrapperBreak").id = "wrapperSession";
      document.getElementById("breakTime").id = "sessionTime";
      const className = document.querySelectorAll(".breakButton");
      if (className) {
        className.forEach((elem) => {
          elem.className = "sessionButton";
        });
      }
    }
  };

  const nextTimingType = () => {
    if (timingType === "Session") {
      clearTimeout(timeout);
      setTimeLeft(breakLength * 60);
      setTimingtype("Break");
      setPlay(false);
      changeColor();
    } else {
      clearTimeout(timeout);
      setTimeLeft(sessionLength * 60);
      setTimingtype("Session");
      setPlay(false);
      changeColor();
    }
  };

  const clock = () => {
    if (play) {
      timeout();
      resetTimer();
    } else {
      clearTimeout(timeout);
    }
  };

  useEffect(() => {
    //clock();
  }, [play, timeLeft, timeout]);

  const timeFormatter = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <div>
      <div id="wrapperSession">
        <h2 className="title">Pomodoro Clock</h2>
        <div className="timer-wrapper">
          <div id="sessionTime">
            <Timer timingType={timingType} timeFormatter={timeFormatter()} />
            <CommandsTime
              handlePlay={handlePlay}
              handleReset={handleReset}
              play={play}
              nextTimingType={nextTimingType}
            />
          </div>
        </div>
        <TimeSettings
          play={play}
          breakLength={breakLength}
          breakIncrement={breakIncrement}
          breakDecrement={breakDecrement}
          sessionLength={sessionLength}
          sessionIncrement={sessionIncrement}
          sessionDecrement={sessionDecrement}
        />
      </div>
      <audio
        id="beep"
        preload="auto"
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      />
    </div>
  );
};

export default App;
