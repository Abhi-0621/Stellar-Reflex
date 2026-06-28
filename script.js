const gameBox = document.getElementById("gameBox");
const message = document.getElementById("message");
const startButton = document.getElementById("startButton");
const lastTimeDisplay = document.getElementById("lastTime");
const bestTimeDisplay = document.getElementById("bestTime");
const rankDisplay = document.getElementById("rank");
const animalDisplay = document.getElementById("animal");
const explanationDisplay = document.getElementById("explanation");

let startTime;
let timeoutId;
let gameState = "idle";
let bestTime = localStorage.getItem("bestReactionTime");

if (bestTime) {
  bestTimeDisplay.textContent = bestTime + " ms";
}

startButton.addEventListener("click", startGame);
gameBox.addEventListener("click", handleBoxClick);

function startGame() {
  gameState = "waiting";

  gameBox.className = "game-box waiting";
  message.textContent = "Wait for the signal...";
  startButton.disabled = true;

  rankDisplay.textContent = "--";
  animalDisplay.textContent = "--";
  explanationDisplay.textContent = "React only when the box turns green.";

  const randomDelay = Math.floor(Math.random() * 4000) + 2000;

  timeoutId = setTimeout(() => {
    gameState = "ready";
    gameBox.className = "game-box ready";
    message.textContent = "CLICK!";
    startTime = Date.now();
  }, randomDelay);
}

function handleBoxClick() {
  if (gameState === "waiting") {
    clearTimeout(timeoutId);
    gameState = "tooEarly";

    gameBox.className = "game-box too-early";
    message.textContent = "Too early!";
    explanationDisplay.textContent = "You clicked before the signal. Wait until the box turns green.";
    startButton.disabled = false;
  } 
  
  else if (gameState === "ready") {
    const reactionTime = Date.now() - startTime;

    gameState = "finished";
    gameBox.className = "game-box finished";
    message.textContent = reactionTime + " ms";

    lastTimeDisplay.textContent = reactionTime + " ms";

    if (!bestTime || reactionTime < Number(bestTime)) {
      bestTime = reactionTime;
      localStorage.setItem("bestReactionTime", bestTime);
      bestTimeDisplay.textContent = bestTime + " ms";
    }

    const result = getReactionRank(reactionTime);

    rankDisplay.textContent = result.rank;
    animalDisplay.textContent = result.animal;
    explanationDisplay.textContent = result.explanation;

    startButton.disabled = false;
  }
}

function getReactionRank(time) {
  if (time < 150) {
    return {
      rank: "Lightning Reflex",
      animal: "Fly / insect-like reflexes",
      explanation: "That is extremely fast. Your reaction is ranked near the quickest animal-inspired reflex range."
    };
  } 
  
  else if (time < 200) {
    return {
      rank: "Elite Reflex",
      animal: "Cat-level reflexes",
      explanation: "Amazing speed. You reacted faster than most people and entered the elite human reaction range."
    };
  } 
  
  else if (time < 250) {
    return {
      rank: "Fast Human",
      animal: "Dog-level reflexes",
      explanation: "Great reaction time. You are faster than the average player and close to athlete-level reflexes."
    };
  } 
  
  else if (time < 350) {
    return {
      rank: "Average Human",
      animal: "Human-level reflexes",
      explanation: "This is a normal human reaction range for a simple visual stimulus."
    };
  } 
  
  else if (time < 500) {
    return {
      rank: "Slow Response",
      animal: "Sloth-mode human",
      explanation: "Your reaction was a little slow this round. Focus on the signal and try again."
    };
  } 
  
  else {
    return {
      rank: "Delayed Response",
      animal: "Sleepy turtle mode",
      explanation: "This was a delayed reaction. Your device, focus, or timing may have affected the score."
    };
  }
}