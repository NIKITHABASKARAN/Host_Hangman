const ld = document.querySelector(".word-display"); // Letter display
const gt = document.querySelector(".guesses-text b"); // Guessed text
const keys = document.querySelector(".keyboard"); // Keyboard div
const image = document.querySelector(".hangman-box img"); // Hangman image
const game = document.querySelector(".game-modal"); // Game modal
const playAgainBtn = game.querySelector("button"); // Button renamed to "New Game"

// Add Score Display dynamically
const scoreDisplay = document.createElement("p");
scoreDisplay.classList.add("score-display");
scoreDisplay.innerText = "Score: 0";
document.body.appendChild(scoreDisplay); // Add Score display to the page

// Initializing game variables
let currentWord, correctLetters, wrongGuessCount, score = 0;
const maxGuesses = 6;

// Selecting a random word from the wordList
function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    const selectedWord = wordList[randomIndex];
    const word = selectedWord.word;
    const hint = selectedWord.hint;

    currentWord = word; // Set currentWord to the selected random word
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
}

function initGame(clickedLetter) {
    // Disabling the clicked button
    const button = keys.querySelector('button[data-letter="' + clickedLetter + '"]');
    if (button) button.disabled = true;

    // Checking if the clickedLetter exists in the currentWord
    if (currentWord.includes(clickedLetter)) {
        // Showing all correct letters on the word display
        for (let i = 0; i < currentWord.length; i++) {
            const letter = currentWord[i];
            if (letter === clickedLetter) {
                correctLetters.push(letter); // Add the correct letter to the list
                const listItem = ld.querySelectorAll("li")[i];
                listItem.innerText = letter; // Update the displayed letter
                listItem.classList.add("guessed"); // Mark it as guessed
            }
        }
    } else {
        // Wrong guess - Update wrongGuessCount and hangman
        wrongGuessCount++;
        image.src = "images/hangman-" + wrongGuessCount + ".svg";
        gt.innerText = wrongGuessCount + " / " + maxGuesses;
    }

    // Game over conditions
    if (wrongGuessCount === maxGuesses) {
        gameOver(false);
    } else if (correctLetters.length === currentWord.length) {
        gameOver(true);
    }
}

// Game over function
function gameOver(victory) {
    let modalText, modalImage, modalHeader;

    // Determine the modal text, image, and header based on victory status
    if (victory) {
        modalText = "You Got it right! It is:";
        modalImage = "images/cg.gif";
        modalHeader = "Congrats!";
        updateScore(); // Update score for victory
    } else {
        modalText = "The correct word was:";
        modalImage = "images/lost.gif";
        modalHeader = "Game Over!";
        updateScore(); // Update score for game over
    }

    // Update modal elements
    game.querySelector("p").innerHTML = modalText + " <b>" + currentWord + "</b>";
    game.querySelector("img").src = modalImage;
    game.querySelector("h4").innerText = modalHeader;

    // Show the modal
    game.classList.add("show");
}

// Update the player's score based on wrongGuessCount
function updateScore() {
    let points = 0;

    switch (wrongGuessCount) {
        case 0:
            points = 1000;
            break;
        case 1:
            points = 900;
            break;
        case 2:
            points = 700;
            break;
        case 3:
            points = 500;
            break;
        case 4:
            points = 300;
            break;
        case 5:
            points = 100;
            break;
        default:
            points = 0;
    }

    score += points; // Add points to the total score
    scoreDisplay.innerText = "Score: " + score; // Update score display
}

// Resetting the game
function resetGame() {
    correctLetters = [];
    wrongGuessCount = 0;
    image.src = "images/hangman-0.svg";
    gt.innerText = "0 / " + maxGuesses;
    ld.innerHTML = currentWord
        .split("")
        .map(() => '<li class="letter"></li>')
        .join("");
    keys.querySelectorAll("button").forEach((btn) => {
        btn.disabled = false;
    });
    game.classList.remove("show");
}

// Initialize keyboard buttons
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    const letter = String.fromCharCode(i);
    button.innerText = letter;
    button.dataset.letter = letter; // Use dataset for easy selection
    button.onclick = () => initGame(letter); // Call initGame with the letter
    keys.appendChild(button);
}

// Start the game
getRandomWord();

// Add event listeners for the buttons
playAgainBtn.innerText = "New Game";
playAgainBtn.addEventListener("click", getRandomWord); // New Game: Selects a new word and starts over
