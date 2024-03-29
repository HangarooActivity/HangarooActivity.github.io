<?php
    session_start();
    if(!isset($_SESSION["users"])){
        header("Location: login.php");
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hangaroo's Clues</title>
    <link rel="stylesheet" href="styles.css">
    
</head>
<body>
    <button id="scoreboard-button">Scoreboard</button>

    <!-- Scoreboard modal -->
    <div id="scoreboard-modal" class="modal">
        <button id="scoreboard-close">Close</button>
        <div class="modal-content">
            <span id="scoreboard-close-icon" class="close">&times;</span>
            <h2>Scoreboard</h2>
            <div id="scoreboard-content">
                <!-- This div will be dynamically populated with username and scores -->
            </div>
        </div>
    </div>
    

<div id="question-container" class="question-container">
    <h1>Question</h1>
    <div id="question-content" class="question-content"></div>
</div>

<i class="glyphicon glyphicon-user" style="font-size:10vw;"></i>

<div id="guesses-container">
    <button class="guess-button" id="guess-1">X</button>
    <button class="guess-button" id="guess-2">X</button>
    <button class="guess-button" id="guess-3">X</button>
</div>
<!--comment-->
<div id="game-container">
    <h2>Hangaroo's Clues</h2>
    <div id="word-display"></div>
    <div id="attempts"></div>
    <div id="letter-buttons">
        <button class="letter-button" id="letter-A">A</button>
        <button class="letter-button" id="letter-B">B</button>
        <button class="letter-button" id="letter-C">C</button>
        <button class="letter-button" id="letter-D">D</button>
        <button class="letter-button" id="letter-E">E</button>
        <button class="letter-button" id="letter-F">F</button>
        <button class="letter-button" id="letter-G">G</button>
        <button class="letter-button" id="letter-H">H</button>
        <button class="letter-button" id="letter-I">I</button>
        <button class="letter-button" id="letter-J">J</button>
        <button class="letter-button" id="letter-K">K</button>
        <button class="letter-button" id="letter-L">L</button>
        <button class="letter-button" id="letter-M">M</button>
        <button class="letter-button" id="letter-N">N</button>
        <button class="letter-button" id="letter-O">O</button>
        <button class="letter-button" id="letter-P">P</button>
        <button class="letter-button" id="letter-Q">Q</button>
        <button class="letter-button" id="letter-R">R</button>
        <button class="letter-button" id="letter-S">S</button>
        <button class="letter-button" id="letter-T">T</button>
        <button class="letter-button" id="letter-U">U</button>
        <button class="letter-button" id="letter-V">V</button>
        <button class="letter-button" id="letter-W">W</button>
        <button class="letter-button" id="letter-X">X</button>
        <button class="letter-button" id="letter-Y">Y</button>
        <button class="letter-button" id="letter-Z">Z</button>
    </div>
    <div id="message"></div>
    <div id="points">Points: 0</div>
    <button id="clue-button" class="game-button">Get Clue</button>
</div>
 <!-- Help button -->
 <button id="help-button">Help</button>

 <!-- Message box -->
 <div id="message-box" class="message-box">
     <button id="close-button">Close</button>
     <h2>How to Play:</h2>
     <p>Welcome to Codearoo Web Quiz! Your objective is to guess the answer to the displayed question
        by selecting letters one at a time. Each question presents a series of dashes representing
         each letter of the answer. Click on the letter buttons provided to make your guesses. 
         For each correct guess, you'll earn 10 points, but be careful - you only have three 
         incorrect guesses available before the game ends. Feeling stuck? You can use a clue to 
         reveal a letter of the answer, but each clue costs 25 points. Try to guess the answer 
         before running out of attempts and aim for a high score by guessing as many correct letters
          as possible. Have fun playing and challenge yourself to beat your high score!</p>
          
<audio id="click-sound">
    <source src="click.mp3" type="audio/mpeg">
  </audio>
  <audio id="wrong-guess-sound">
    <source src="wrong_guess.mp3" type="audio/mpeg">
   
  </audio>
  <audio id="clue-button-sound">
    <source src="clue_button_sound.mp3" type="audio/mpeg">
    
  </audio>
  <audio id="help-audio">
    <source src="help_sound.mp3" type="audio/mpeg">
</audio>
<audio id="close-audio">
    <source src="close_sound.mp3" type="audio/mpeg">
</audio>
<audio id="scoreboard-button-audio">
    <source src="button_sound.mp3" type="audio/mpeg">
</audio>
<audio id="scoreboard-close-audio">
    <source src="close1_sound.mp3" type="audio/mpeg">
</audio>

<!-- Game End Modal -->
<div id="game-end-modal" class="modal">
    <div class="modal-content">
        <span class="close" onclick="closeModal()">&times;</span>
        <h2 id="end-game-message"></h2>
        <p id="end-game-score"></p>
    </div>
</div>


<script src="script.js"></script>

</body>
</html>
