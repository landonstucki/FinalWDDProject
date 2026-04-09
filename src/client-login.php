<?php
session_start();

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    $validUsername = 'troy';
    $validPassword = 'ilovelandon';

    if ($username === $validUsername && $password === $validPassword) {
        $_SESSION['logged_in'] = true;
        $_SESSION['username'] = $username;
        header('Location: upload.php');
        exit;
    } else {
        $error = 'Invalid login.';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stucki Homes Album Login</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f4f4;
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
    }

    .login-card {
      width: min(90%, 420px);
      background: white;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    }

    h1 {
      margin-top: 0;
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.4rem;
      font-weight: 600;
    }

    input {
      width: 100%;
      box-sizing: border-box;
      padding: 0.85rem 1rem;
      margin-bottom: 1rem;
      border: 1px solid #ccc;
      border-radius: 10px;
      font-size: 1rem;
    }

    button {
      width: 100%;
      padding: 0.9rem 1rem;
      border: 0;
      border-radius: 10px;
      background: #111;
      color: white;
      font-size: 1rem;
      cursor: pointer;
    }

    .error {
      color: #b00020;
      margin-top: 1rem;
    }
  </style>
</head>
<body>
  <div class="login-card">
    <h1>Stucki Homes Album Login</h1>

    <form method="post" action="">
      <label for="username">Username</label>
      <input id="username" type="text" name="username" required>

      <label for="password">Password</label>
      <input id="password" type="password" name="password" required>

      <button type="submit">Log In</button>
    </form>

    <?php if ($error): ?>
      <p class="error"><?php echo htmlspecialchars($error); ?></p>
    <?php endif; ?>
  </div>
</body>
</html>