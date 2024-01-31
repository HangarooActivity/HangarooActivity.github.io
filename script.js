const levels = {
    easy: [
        "TADPOLE", "LION", "MANILA", "SPIDERS", "SKULL", "THREE", "MILK", "PACIFIC", "SKIN", "SAMPAGUITA"
    ],
    difficult: [
        "PYTHON", "JAVASCRIPT", "HTML", "CSS", "DATABASE", "FRAMEWORK", "DEVELOPMENT", "INTERFACE", "CODING", "DEBUGGING"
    ],
    expert: [
        "EXTRAVAGANZA", "JUBILATION", "QUINTESSENTIAL", "SERENDIPITY", "ELOQUENT", "EFFERVESCENT", "MAGNIFICENT", "PHENOMENAL", "QUINTESSENTIAL", "PERSEVERANCE"
    ]
};




let secretWord = "";
let guessWord = [];
let incorrectGuesses = 0;
let points = 0;
let cluesUsed = 0;
let currentQuestionIndex = 0;
let currentLevel = "";
let changeLevel = 0;
let difficultyCounter = 0;
let questionSet = [];

function initializeGame() {
    secretWord = chooseWord();
    guessWord = Array(secretWord.length).fill("_");
    incorrectGuesses = 0;
    cluesUsed = 0;
    updateDisplay();
}


function chooseWord() {
    const levelWords = levels[currentLevel];
    return levelWords[currentQuestionIndex].split("");
}

function postQuestion () {
	switch (changeLevel) {
		case 0:
			currentLevel = "easy"
			questionSet = splitQuestions("easy"); //pull easy questions
			break;
		case 1:
			currentLevel = "hard"
			questionSet = splitQuestions("hard"); //pull hard questions
			break;
		case 2:
			currentLevel = "expert"
			questionSet = splitQuestions("expert");//pull expert questions
			break;
	}
	return questionSet;
}
//function that fetches question .txt files from server
function getQuestions(){
	//create promise block
	Promise.all([
	//fetch all files from server
	fetch('/easy.txt').then(x => x.text()),
	fetch('/hard.txt').then(x => x.text()),
	fetch('/expert.txt').then(x => x.text())
	
	//shorthand function that takes response objects (easy.txt, hard.txt, expert.txt) 
	//and respectively passes them to parameters easy, hard, expert
	]).then(([easy, hard, expert]) => { 
		//declare 3 constant variables with values of respective text files in array form, delimited with next-line (\n) character
		const easyQlines = easy.split('\n');
		const hardQlines = hard.split('\n');
		const expertQlines = expert.split('\n');	
		//log to console for debugging
		console.log('Easy file contents:', easyQlines);
		console.log('Hard file content:', hardQlines);
		console.log('Expert file content:', expertQlines);
		
		//return array of arrays to function caller
		//use in returning function as:
		//const questions = getQuestions();
		//easyLines = questions[0]
		//hardLines = questions[1]
		//expertLines = questions[2]
		//manipulate data from returning function
		return [easyQlines, hardQlines, expertQlines];
	}).catch(error => 
		{console.error("Error fetching questions:", error);}
	);
	
}

//function that returns array of questions based on difficulty parameter
function splitQuestions(difficulty) {
	const questions = getQuestions(); //get array of array-type questions
	const easyQ = questions[0]; //array of easy questions
	const hardQ= questions[1]; //array of hard questions
	const expertQ = questions[2]; //array of expert questions
	
	if (difficulty == "easy"){ //if the parameter's value is "easy" when this function is called, return array of easy questions
		return easyQ;
	} else if (difficulty == "hard"){ //if the parameter's value is "hard" when this function is called, return array of hard questions 
		return hardQ;
	} else if (difficulty == "expert"){ //if the parameter's value is "expert" when this function is called, return array of expert questions
		return expertQ;
	}
}

// Updates the display of the game, including the guessed word, points, and letter buttons
function updateDisplay() {
    // Get the container for displaying the guessed word
    const wordDisplay = document.getElementById('word-display');
    // Set the inner HTML of wordDisplay to show each guessed letter in a span element
    wordDisplay.innerHTML = guessWord.map(letter => `<span>${letter}</span>`).join('');
    
	document.getElementById('question').innerText = questionSet[currentQuestionIndex];
    // Update the letter buttons and points
    updateLetterButtons();
    document.getElementById('points').innerText = `Points: ${points}`;
}

// Updates the letter buttons based on the guessed letters and disables buttons already in the container
function updateLetterButtons() {
    // Get the container for letter buttons
    const letterButtonsContainer = document.getElementById('letter-buttons');
    // Clear existing buttons
    letterButtonsContainer.innerHTML = "";

    // Loop through ASCII codes for A to Z
    for (let i = 65; i <= 90; i++) {
        // Convert ASCII code to a character (A to Z)
        const letter = String.fromCharCode(i);

        // Create a button element
        const button = document.createElement('button');
        button.innerText = letter;  // Set button text to the letter
        button.className = 'button';  // Set class for styling
        button.onclick = function () { checkGuess(letter); };  // Set click event to check the guessed letter

        // Disable the button if the letter is already in the container
        if (guessWord.includes(letter)) {
            button.disabled = true;
        }

        // Append the button to the letterButtonsContainer
        letterButtonsContainer.appendChild(button);
    }

    // Set click event for the clue button
    const clueButton = document.getElementById('clue-button');
    clueButton.onclick = function () { getClue(); };
}

// Updates the styling of guess buttons based on the number of incorrect guesses
function updateGuessButtons() {
    const guessButtons = document.querySelectorAll('.guess-button');
    for (let i = 0; i < guessButtons.length; i++) {
        if (i < incorrectGuesses) {
            guessButtons[i].classList.add('highlighted');
        } else {
            guessButtons[i].classList.remove('highlighted');
        }
    }
}

// Checks the guessed letter against the secret word and updates the game state
function checkGuess(guess) {
    let newGuess = false;

    if (secretWord.includes(guess)) {
        for (let i = 0; i < secretWord.length; i++) {
            if (secretWord[i] === guess && guessWord[i] !== guess) {
                guessWord[i] = guess;
                newGuess = true;
            }
        }
    } else {
        if (!guessWord.includes(guess)) {
            incorrectGuesses++;
        }
    }

    // Update the display, guess buttons, and check the game status
    updateDisplay();
    updateGuessButtons();
    checkGameStatus();
}

// Provides a clue by revealing a letter in the word
function getClue() {
    if (cluesUsed < 3 && points >= 25) {
        // Find indices of unrevealed letters in the guessed word
        const unrevealedIndices = guessWord.reduce((indices, letter, index) => {
            if (letter === '_') {
                indices.push(index);
            }
            return indices;
        }, []);

        if (unrevealedIndices.length > 0) {
            // Randomly choose an unrevealed index
            const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
            
            // Set the guessed word at the random index to the corresponding letter in the secret word
            guessWord[randomIndex] = secretWord[randomIndex];
            
            // If the secret word has additional occurrences of the revealed letter, also update them
            unrevealedIndices.forEach(index => {
                if (index !== randomIndex && secretWord[index] === secretWord[randomIndex]) {
                    guessWord[index] = secretWord[index];
                }
            });

            // Deduct points and increment cluesUsed
            points -= 25;
            cluesUsed++;
            displayMessage(`Clue revealed! You have earned a clue for 25 points.`);

            // Check if all letters have been revealed to move to the next question
            if (guessWord.indexOf('_') === -1) {
                setTimeout(() => {
                    moveNextQuestion();
                }, 1000);
            }
        }
    } else {
        const message = cluesUsed >= 3 ? "You've already used all your clues." : "You don't have enough points for a clue.";
        displayMessage(message);
    }

    // Update the display after getting a clue
    updateDisplay();
}

// Reveals a consonant as a clue
function revealConsonant(letter) {
    const consonants = "BCDFGHJKLMNPQRSTVWXYZ";
    const remainingConsonants = [...consonants].filter(c => c !== letter);
    return remainingConsonants[Math.floor(Math.random() * remainingConsonants.length)];
}

// Reveals a vowel as a clue
function revealVowel(letter) {
    const vowels = "AEIOU";
    const remainingVowels = [...vowels].filter(v => v !== letter);
    return remainingVowels[Math.floor(Math.random() * remainingVowels.length)];
}

function checkGameStatus() {
    if (!guessWord.includes('_')) {
        points += 10;
        displayMessage(`Congratulations! You guessed the word. You earned 10 points.`);

        if (currentQuestionIndex === levels[currentLevel].length - 1) {
            // If it's the last word for the current level, move to the next level
            displayMessage(`You've completed all questions for ${currentLevel} level! You earned ${points} points.`);
            changeLevel++;
			moveNextLevel();
        } else {
            // Move to the next question
            currentQuestionIndex++;
            secretWord = chooseWord();
            guessWord = Array(secretWord.length).fill("_");
            incorrectGuesses = 0;
            updateDisplay();
        }
    } else if (incorrectGuesses >= 3) {
        displayMessage(`Game over! The word was ${secretWord.join('')}. You earned 0 points.`);

        if (currentQuestionIndex === levels[currentLevel].length - 1) {
            // If it's the last word for the current level, move to the next level
            displayMessage(`You've completed all questions for ${currentLevel} level! You earned ${points} points.`);
            changeLevel++;
			moveNextLevel();
        } else {
            // Move to the next question
            currentQuestionIndex++;
            secretWord = chooseWord();
            guessWord = Array(secretWord.length).fill("_");
            incorrectGuesses = 0;
            updateDisplay();
        }
    }
}

function moveNextLevel() {
    const levelKeys = Object.keys(levels);
    const currentLevelIndex = levelKeys.indexOf(currentLevel);

    if (currentLevelIndex < levelKeys.length - 1) {
        currentLevel = levelKeys[currentLevelIndex + 1];
        currentQuestionIndex = 0;
        initializeGame();
    } else {
        // If it's the last level, you can handle this case as needed
        displayMessage("Congratulations! You've completed all levels.");
    }
}



function displayMessage(message) {
    document.getElementById('message').innerText = message;
    document.getElementById('letter-buttons').innerHTML = "";
}

function setLevel(level) {
    currentLevel = level;
    currentQuestionIndex = 0;
    initializeGame();
}




initializeGame();
