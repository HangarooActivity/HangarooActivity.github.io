const levels = {
    easy: [
        "TADPOLE", "LION", "MANILA", "SPIDERS", "SKULL", "THREE", "MILK", "PACIFIC", "SKIN", "SAMPAGUITA"
    ],
    hard: [
        "LAYERING", "PYTHON", "BOOTSTRAP", "DEBUGGING", "EXTENSION", "JAVA", "RAW", "WRAPPING", "DATABASE", "POSITIONING"
    ],
    expert: [
        "ITERATION", "ASYNCHRONOUS", "INHERITANCE", "REACT", "KOTLIN", "AGILE", "NOTIFICATION", "WRAPPING", "UNSIGNED", "PLACEHOLDER"
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

async function initializeGame() {
    await postQuestion();
	secretWord = chooseWord();
	console.log("current question set: ", questionSet[0]);
    console.log(questionSet);
    // Check if currentQuestionIndex is within bounds
    if (currentQuestionIndex >= 0 && currentQuestionIndex < levels[currentLevel].length) {
        secretWord = chooseWord();
    } else {
        // Handle the case where the index is out of bounds (e.g., reset to 0)
        currentQuestionIndex = 0;
        secretWord = chooseWord();
    }

    guessWord = Array(secretWord.length).fill("_");
    incorrectGuesses = 0;
    cluesUsed = 0;
    updateDisplay();
    
}



function chooseWord() {
    const levelWords = levels[currentLevel];

    // Check if currentQuestionIndex is within bounds
    if (currentQuestionIndex >= 0 && currentQuestionIndex < levelWords.length) {
        return levelWords[currentQuestionIndex].split("");
    } else {
        // Handle the case where the index is out of bounds (e.g., reset to 0)
        currentQuestionIndex = 0;
        return levelWords[currentQuestionIndex].split("");
    }
}


async function postQuestion() {
	try {
	switch (changeLevel) {
		case 0:
			currentLevel = "easy"
			questionSet = await splitQuestions("easy"); //pull easy questions
			console.log(questionSet);
			console.log(currentLevel);
			break;
		case 1:
			currentLevel = "hard"
			questionSet = await splitQuestions("hard"); //pull hard questions
			break;
		case 2:
			currentLevel = "expert"
			questionSet = await splitQuestions("expert");//pull expert questions
			break;
		}
	} catch (error) {
		console.error("error pulling text file data:", error);
		throw error;
	}
		
	
}
//function that fetches question .txt files from server
async function getQuestions(){
	
	try {
		const [easy, hard, expert] = await Promise.all([ //fetch all files from server
			//shorthand function that takes response objects (easy.txt, hard.txt, expert.txt) 
			//and respectively passes them to parameters easy, hard, expert
			fetch('/easy.txt').then(x => x.text()),
			fetch('/hard.txt').then(x => x.text()),
			fetch('/expert.txt').then(x => x.text())
	]); 
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
	} catch (error) { 
		console.error("Error fetching questions:", error);
        throw error; 
    }
	
}

//function that returns array of questions based on difficulty parameter
async function splitQuestions(difficulty) {
	try {
	const questions = await getQuestions(); //get array of array-type questions
	const [easyQ, hardQ, expertQ] = questions; //get array of questons
	
	if (difficulty === "easy"){ //if the parameter's value is "easy" when this function is called, return array of easy questions
		console.log(easyQ);
		return easyQ;
	} else if (difficulty === "hard"){ //if the parameter's value is "hard" when this function is called, return array of hard questions 
		return hardQ;
	} else if (difficulty === "expert"){ //if the parameter's value is "expert" when this function is called, return array of expert questions
		return expertQ;
	}
	
	} catch (error) {
		console.error("error splitting questions:", error);
		throw error;
	}
}

// Function to update the display of the game
function updateDisplay() {
    const wordDisplay = document.getElementById('word-display');
    wordDisplay.innerHTML = guessWord.map(letter => `<span>${letter}</span>`).join('');
    updateLetterButtons();
    
    document.getElementById('question-content').innerText = questionSet[currentQuestionIndex];
    
    // Update the points display
    document.getElementById('points').innerText = `Points: ${points}`;
}

// Function to update the letter buttons for user interaction
function updateLetterButtons() {
    const letterButtonsContainer = document.getElementById('letter-buttons');
    letterButtonsContainer.innerHTML = "";

    // Create buttons for each letter of the alphabet
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        const button = document.createElement('button');
        button.innerText = letter;
        button.className = 'letter-buttons';
        button.onclick = function () { checkGuess(letter); };
        
        // Disable the button if the letter is already in the container
        if (guessWord.includes(letter)) {
            button.disabled = true;
        }

        letterButtonsContainer.appendChild(button);
    }

    // Add functionality to the clue button
    const clueButton = document.getElementById('clue-button');
    clueButton.onclick = function () { getClue(); };
}

// Function to update the visual representation of incorrect guesses
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

// Function to check the user's guess against the secret word
function checkGuess(guess) {
    let newGuess = false;

    // Check if the guessed letter is in the secret word
    if (secretWord.includes(guess)) {
        for (let i = 0; i < secretWord.length; i++) {
            if (secretWord[i] === guess && guessWord[i] !== guess) {
                guessWord[i] = guess;
                newGuess = true;
            }
        }
    } else {
        // Increment incorrect guesses if the letter is not in the secret word
        if (!guessWord.includes(guess)) {
            incorrectGuesses++;
        }
    }

    // Update the display and check the game status
    updateDisplay();  
    updateGuessButtons();
    checkGameStatus();
}

// Function to provide a clue to the user
function getClue() {
    if (cluesUsed < 3 && points >= 25) {
        const unrevealedIndices = guessWord.reduce((indices, letter, index) => {
            if (letter === '_') {
                indices.push(index);
            }
            return indices;
        }, []);

        if (unrevealedIndices.length > 0) {
            // Randomly reveal a letter in the word as a clue
            const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
            guessWord[randomIndex] = secretWord[randomIndex];
            unrevealedIndices.forEach(index => {
                if (index !== randomIndex && secretWord[index] === secretWord[randomIndex]) {
                    guessWord[index] = secretWord[index];
                }
            });

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
        // Display a message if the user cannot get a clue
        const message = cluesUsed >= 3 ? "You've already used all your clues." : "You don't have enough points for a clue.";
        displayMessage(message);
    }
    updateDisplay();
}

// Function to reveal a consonant given a letter
function revealConsonant(letter) {
    const consonants = "BCDFGHJKLMNPQRSTVWXYZ";
    const remainingConsonants = [...consonants].filter(c => c !== letter);
    return remainingConsonants[Math.floor(Math.random() * remainingConsonants.length)];
}

// Function to reveal a vowel given a letter
function revealVowel(letter) {
    const vowels = "AEIOU";
    const remainingVowels = [...vowels].filter(v => v !== letter);
    return remainingVowels[Math.floor(Math.random() * remainingVowels.length)];
}

// Function to check the game status (win, lose, or continue)
function checkGameStatus() {
    if (!guessWord.includes('_')) {
        // Update points and display a message for a correct guess
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
        // Display a message for game over
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

// Function to move to the next game level
function moveNextLevel() {
    const levelKeys = Object.keys(levels);
    const currentLevelIndex = levelKeys.indexOf(currentLevel);

    if (currentLevelIndex < levelKeys.length - 1) {
        // Move to the next level if available
        currentLevel = levelKeys[currentLevelIndex + 1];
        currentQuestionIndex = 0;
        initializeGame();
    } else {
        // If it's the last level, display a completion message
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
    
}




await initializeGame();
