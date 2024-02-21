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
let questionOrder = [];
let indexArray = [];

async function initializeGame() {
    await postQuestion();
	randomizeLevel(); // randomize question level numbers
	console.log(indexArray); // console log to check if indexArray values changes
	console.log(questionSet); // console log to check if question was imported properly. this will log the easy questions on startup.
	secretWord = chooseWord(); // choose word to be guessed
    guessWord = Array(secretWord.length).fill("_");
    incorrectGuesses = 0;
    cluesUsed = 0;
    updateDisplay();
}

function chooseWord() {
    const levelWords = levels[currentLevel]; // get set of answers from levels object
	console.log(levelWords);
	console.log(levelWords[indexArray[currentQuestionIndex]].split(""));
	return levelWords[indexArray[currentQuestionIndex]].split(""); // get index of question using the shuffled index order stored in indexArray
}

async function postQuestion() {
	try {
	switch (changeLevel) {
		case 0:
			currentLevel = "easy"
			questionSet = await splitQuestions("easy"); //pull easy questions
			console.log("easy questions: ", questionSet);
			console.log("current level: ", currentLevel);
			break;
		case 1:
			currentLevel = "hard"
			questionSet = await splitQuestions("hard"); //pull hard questions
			console.log("hard questions: ", questionSet);
			console.log("current level: ", currentLevel);
			break;
		case 2:
			currentLevel = "expert"
			questionSet = await splitQuestions("expert");//pull expert questions
			console.log("expert questions: ", questionSet);
			console.log("current level: ", currentLevel);
			break;
		}
	} catch (error) {
		console.error("error pulling text file data:", error);
		throw error;
	}
		
	
}

//function that returns array of questions based on difficulty parameter
async function splitQuestions(difficulty) {
	try {
		const questions = await getQuestions(); //get array of array-type questions
		const [easyQ, hardQ, expertQ] = questions; //get array of questons
		
		if (difficulty === "easy"){ //if the parameter's value is "easy" when this function is called, return array of easy questions
			console.log("return easy q: ", easyQ);
			return easyQ;
		} else if (difficulty === "hard"){ //if the parameter's value is "hard" when this function is called, return array of hard questions 
			console.log("return hard q: ", hardQ);
			return hardQ;
		} else if (difficulty === "expert"){ //if the parameter's value is "expert" when this function is called, return array of expert questions
			console.log("return expert q: ", expertQ);
			return expertQ;
		}
	
	} catch (error) {
		console.error("error splitting questions:", error);
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

// Function to update the display of the game
function updateDisplay() {
    const wordDisplay = document.getElementById('word-display');
    wordDisplay.innerHTML = guessWord.map(letter => `<span>${letter}</span>`).join('');
    updateLetterButtons();
    
    const question = document.getElementById('question-content');
	question.innerHTML = questionSet[indexArray[currentQuestionIndex]]; // post question at set index from indexArray's shuffle
	
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
        button.className = 'button';
        button.onclick = function () { checkGuess(letter); };
        
        // Disable the button if the letter is already in the container
        if (guessWord.includes(letter)) {
            button.disabled = true;
        }

        letterButtonsContainer.appendChild(button);
    }
	document.addEventListener("DOMContentLoaded", function() {
    var clickSound = document.getElementById("click-sound");
    var wrongGuessSound = document.getElementById("wrong-guess-sound");
    var clueButtonSound = document.getElementById("clue-button-sound");
  
    // Attach event listeners to all letter buttons
    var letterButtons = document.querySelectorAll(".letter-button");
    letterButtons.forEach(function(button) {
      button.addEventListener("click", function() {
        clickSound.currentTime = 0; // Reset the audio to play from the beginning
        clickSound.play(); // Play the click sound
      });
    });

    // Attach event listener to the clue button
    var clueButton = document.getElementById("clue-button");
    clueButton.addEventListener("click", function() {
      clueButtonSound.currentTime = 0; // Reset the audio to play from the beginning
      clueButtonSound.play(); // Play the clue button sound
    });
  });
  
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

 const clueButton = document.getElementById('clue-button');
    const clueOptionsBox = document.getElementById('clue-options');
    const vowelButton = document.getElementById('vowel-button');
    const consonantButton = document.getElementById('consonant-button');
    
    clueButton.onclick = function () { showClueOptions(); };
    
    function showClueOptions() {
        clueOptionsBox.style.display = 'block';
    }
    
    vowelButton.onclick = function () { getClue('vowel'); };
    consonantButton.onclick = function () { getClue('consonant'); };
    
    function getClue(clueType) {
        if (cluesUsed < 3 && points >= 25) {
            const unrevealedIndices = guessWord.reduce((indices, letter, index) => {
                if (letter === '_') {
                    indices.push(index);
                }
                return indices;
            }, []);
    
            if (unrevealedIndices.length > 0) {
                let randomIndex;
                if (clueType === 'vowel') {
                    randomIndex = revealVowel();
                } else if (clueType === 'consonant') {
                    randomIndex = revealConsonant();
                }
    
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
        clueOptionsBox.style.display = 'none'; // Hide the clue options box
        updateDisplay();
    }
    
    // Function to reveal a random vowel
    function revealVowel() {
        const vowels = "AEIOU";
        const remainingVowels = [...vowels].filter(v => !guessWord.includes(v));
        return remainingVowels[Math.floor(Math.random() * remainingVowels.length)];
    }
    
    // Function to reveal a random consonant
    function revealConsonant() {
        const consonants = "BCDFGHJKLMNPQRSTVWXYZ";
        const remainingConsonants = [...consonants].filter(c => !guessWord.includes(c));
        return remainingConsonants[Math.floor(Math.random() * remainingConsonants.length)];
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
			indexArray = [];
			moveNextLevel();
        } else {
            // Move to the next question
            currentQuestionIndex++;
            secretWord = chooseWord();
            guessWord = Array(secretWord.length).fill("_");
            incorrectGuesses = 0;
	    updateGuessButtons();
            updateDisplay();
        }
    } else if (incorrectGuesses >= 3) {
        // Display a message for game over
        displayMessage(`Game over! The word was ${secretWord.join('')}. You earned 0 points.`);

        if (currentQuestionIndex === levels[currentLevel].length - 1) {
            // If it's the last word for the current level, move to the next level
            displayMessage(`You've completed all questions for ${currentLevel} level! You earned ${points} points.`);
            changeLevel++;
			indexArray = [];
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

function randomizeLevel(){
	//randomize questionIndex, store the resulting array value inside questionOrder 
	itemNum = 0;
	
	while (itemNum<= 9){
		let x = Math.random() * 10;
			if (itemNum > x){
				indexArray.push(itemNum);
				itemNum++;
			} else if (itemNum < x) {
				indexArray.unshift(itemNum);
				itemNum++;
			}
	}
}

function displayMessage(message) {
    document.getElementById('message').innerText = message;
    document.getElementById('letter-buttons').innerHTML = "";
}

initializeGame();


    
  
   

    
