<?php
    session_start();
    if(isset($_SESSION["users"]) && $_SESSION["users"] === "yes"){
        header("Location: home.php");
        exit();
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
    <title>Login Page</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="logre.css">

</head>
<body>
    <div class="container">
        <?php
           if(isset ($_POST["login"])){
            $email = $_POST["email"];
            $password = $_POST["password"];
                require_once "database.php";
                $sql = "SELECT * FROM users WHERE email = '$email'";
                $result = mysqli_query($conn, $sql);
                $users = mysqli_fetch_array($result, MYSQLI_ASSOC);
                if ($users) {
                    if(password_verify($password, $users["Password"])) {
                       $_SESSION["users"] = "yes";
                       echo "<div class = 'alert alert-success'> You are now logged in successfully! </div>";
                       echo '<script> setTimeout(() => window.location.href = "home.php", 3000); </script>';
                       exit();
                } else {
                    echo "<div class= 'alert alert-danger'> Password does not match </div>";
                }
            } else {
                echo "<div class= 'alert alert-danger'> Email does not match </div>";
                }
            }

        ?>
        <form action="login.php" method="post">
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" name="email" class= "form-control" required>
            </div>

            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" name="password" class= "form-control" required>
            </div>

            <div class="form-btn">
                <label for="login"></label>
                <input type="submit" value="Login" name="login" class= "btn btn-primary">
            </div>

        </form>
        <div><p>Not Registered yet? <a href="index.php"> Register Here</a></div>
    </div>
</body>
</html>
