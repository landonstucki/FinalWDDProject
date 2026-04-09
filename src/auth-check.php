<?php
session_start();

if (empty($_SESSION['logged_in'])) {
    header('Location: client-login.php');
    exit;
}