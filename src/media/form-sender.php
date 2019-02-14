<?php header('Access-Control-Allow-Origin: *'); ?>
<?php
if(isset($_POST['email'])) {

    // EDIT THE 2 LINES BELOW AS REQUIRED
    $email_to = "solar.rust@gmail.com";
    $email_subject = "Пользователь заполнил форму на сайте";

    function died($error) {
        // your error code can go here
        echo "We are very sorry, but there were error(s) found with the form you submitted. ";
        echo "These errors appear below.<br /><br />";
        echo $error."<br /><br />";
        echo "Please go back and fix these errors.<br /><br />";
        die();
    }

    $name = $_POST['name']; // required
    $email_from = $_POST['email']; // required
    $telephone = $_POST['phone']; // not required
    $site = $_POST['site']; // not required

    $email_message = "Данные, которые оставил пользователь.\n\n";

    function clean_string($string) {
      $bad = array("content-type","bcc:","to:","cc:","href");
      return str_replace($bad,"",$string);
    }

    $email_message .= "Имя: ".clean_string($name)."\n";
    $email_message .= "Email: ".clean_string($email_from)."\n";
    $email_message .= "Телефон: ".clean_string($telephone)."\n";
    $email_message .= "Сайт: ".clean_string($site)."\n";

// create email headers
$headers = 'From: '.$email_from."\r\n".
'Reply-To: '.$email_from."\r\n" .
'X-Mailer: PHP/' . phpversion();
@mail($email_to, $email_subject, $email_message, $headers);
?>

<?php

}
?>