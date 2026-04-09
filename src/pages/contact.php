<?php
// contact.php — processor only (no HTML output)

function post($key) {
  return isset($_POST[$key]) ? trim((string)$_POST[$key]) : "";
}

function redirect_to_contact($params = []) {
  // Always redirect back to contact.html in the same folder as this script
  $base = dirname($_SERVER["PHP_SELF"]);
  $url = rtrim($base, "/") . "/contact.html";

  $query = http_build_query($params);
  header("Location: " . $url . ($query ? ("?" . $query) : ""));
  exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  // If someone visits contact.php directly, just bounce them back
  redirect_to_contact();
}

// Read fields
$name    = post("name");
$email   = post("email");
$phone   = post("phone");
$message = post("message");

// Honeypot
$honeypot = post("website");
if ($honeypot !== "") {
  redirect_to_contact(["status" => "error", "error" => "spam"]);
}

// Validation
if (strlen($name) < 2 || strlen($name) > 50) {
  redirect_to_contact(["status" => "error", "error" => "name"]);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  redirect_to_contact(["status" => "error", "error" => "email"]);
}
if (strlen($phone) < 7 || strlen($phone) > 20) {
  redirect_to_contact(["status" => "error", "error" => "phone"]);
}
if (strlen($message) < 10) {
  redirect_to_contact(["status" => "error", "error" => "message"]);
}

// Destination email
$to = "tstucki@myctl.net";
$subject = "New message from Stucki Homes contact form";

// Body
$body  = "New contact form submission:\n\n";
$body .= "Name: {$name}\n";
$body .= "Email: {$email}\n";
$body .= "Phone: {$phone}\n\n";
$body .= "Message:\n{$message}\n";

// Headers: IMPORTANT — set this to a real domain email you own on Hostinger
$fromEmail = "no-reply@yourdomain.com"; // CHANGE THIS
$headers  = "From: Stucki Homes <{$fromEmail}>\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send
$sent = mail($to, $subject, $body, $headers);

if ($sent) {
  redirect_to_contact(["status" => "success"]);
} else {
  redirect_to_contact(["status" => "error", "error" => "send"]);
}
