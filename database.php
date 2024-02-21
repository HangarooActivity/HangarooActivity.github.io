<?php
 
    $hostName = "localhost";
    $dbUser = "id21906586_admin";
    $dbPassword = "Database1!";
    $dbName = "id21906586_login_register";
    $conn = mysqli_connect($hostName, $dbUser, $dbPassword, $dbName);
    if (!$conn) {
        die("Something went wrong!");
    }
 
?>