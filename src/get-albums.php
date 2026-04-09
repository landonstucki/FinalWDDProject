<?php
header('Content-Type: application/json');

$cloudName = 'Removed';
$apiKey = 'Removed';
$apiSecret = 'Removed';

$url = "https://api.cloudinary.com/v1_1/{$cloudName}/resources/image/upload?max_results=200&tags=true";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERPWD, $apiKey . ":" . $apiSecret);
curl_setopt($ch, CURLOPT_TIMEOUT, 20);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode([
        'error' => 'cURL error',
        'details' => curl_error($ch)
    ]);
    curl_close($ch);
    exit;
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    http_response_code($httpCode ?: 500);
    echo json_encode([
        'error' => 'Cloudinary request failed',
        'raw' => $response
    ]);
    exit;
}

$data = json_decode($response, true);

if (!is_array($data)) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Invalid JSON from Cloudinary'
    ]);
    exit;
}

$resources = $data['resources'] ?? [];
$albums = [];

foreach ($resources as $item) {
    $tags = $item['tags'] ?? [];

    foreach ($tags as $tag) {
        if (strpos($tag, 'album_') !== 0) {
            continue;
        }

        $slug = substr($tag, 6);

        if (!isset($albums[$slug])) {
            $albums[$slug] = [
                'slug' => $slug,
                'name' => ucwords(str_replace('-', ' ', $slug)),
                'cover' => $item['secure_url'] ?? '',
                'images' => []
            ];
        }

        $albums[$slug]['images'][] = [
            'image' => $item['secure_url'] ?? '',
            'fullImage' => $item['secure_url'] ?? '',
            'alt' => $item['display_name'] ?? $slug,
            'title' => ucwords(str_replace('-', ' ', $slug)),
            'description' => ''
        ];
    }
}

echo json_encode([
    'albums' => array_values($albums),
    'resource_count' => count($resources),
    'debug_resources' => array_map(function ($r) {
        return [
            'public_id' => $r['public_id'] ?? '',
            'display_name' => $r['display_name'] ?? '',
            'tags' => $r['tags'] ?? []
        ];
    }, $resources)
]);