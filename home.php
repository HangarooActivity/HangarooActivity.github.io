<?php
    session_start();
    if(isset($_SESSION["users"])){
        header("Location: login.php");
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hangaroo's Clues - Home</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap">
    <link rel="stylesheet" href="homepage.css"> 
</head>
<body>
    <div id="homepage-container">
        <h1>Welcome to Codearoo Web Quiz</h1>
        <div class="credits">
            <h2 class="made-by">Made by:</h2>
            <h3>Belbar, Borlongan, Manuel, Tantua, Tornea</h3>
        </div>
        <button id="start-game-button">Start Game</button>
    </div>

    <!-- Audio element for start game sound -->
    <audio id="startGame-sound" src="start_button.mp3"></audio>

    <script>
        document.getElementById("start-game-button").addEventListener("click", function() {
            // Play the start game sound
            var startGameSound = document.getElementById("startGame-sound");
            startGameSound.currentTime = 0; // Reset the audio to play from the beginning
            startGameSound.play();
            
            // Redirect to the game page
            window.location.href = "file:///Users/hannahpsalmbelbar/Downloads/hangaroo/index.html";
        });
    </script>
    
</body>
</html>
