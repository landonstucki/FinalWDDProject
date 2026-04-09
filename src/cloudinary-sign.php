<?php
require_once 'auth-check.php';
header('Content-Type: application/json');

$apiSecret = 'Removed';

$folder = $_POST['folder'] ?? '';
$tags = $_POST['tags'] ?? '';
$uploadPreset = $_POST['upload_preset'] ?? '';
$source = $_POST['source'] ?? 'uw';

$timestamp = time();

$params = [
    'folder' => $folder,
    'source' => $source,
    'tags' => $tags,
    'timestamp' => $timestamp,
    'upload_preset' => $uploadPreset
];

ksort($params);

$parts = [];
foreach ($params as $key => $value) {
    if ($value !== '') {
        $parts[] = $key . '=' . $value;
    }
}

$stringToSign = implode('&', $parts);
$signature = sha1($stringToSign . $apiSecret);

echo json_encode([
    'signature' => $signature,
    'timestamp' => $timestamp
]);