<?php

    /* Attempt MySQL server connection. Assuming you are running MySQL
    server with default setting (user 'root' with no password) */

    $link = mysqli_connect("localhost", "root", "", "prj");

    // Check connection

    if($link === false){
        die("ERROR: Could not connect. " . mysqli_connect_error());
    }

    // Escape user inputs for security
    $question = mysqli_real_escape_string($link, $_POST['question']);
    $answer = mysqli_real_escape_string($link, $_POST['answer']);
    

    // attempt insert query execution
    $sql = "INSERT INTO exam (question,answer) VALUES ('$question', '$answer')";

    if(mysqli_query($link, $sql)){
        echo "Records added successfully.";
    } else{
        echo "ERROR: Could not able to execute $sql. " . mysqli_error($link);
    }

    // close connection
    mysqli_close($link);
?>