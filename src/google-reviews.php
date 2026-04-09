<?php
header('Content-Type: application/json');

$apiKey = 'Removed';
$placeId = 'Removed';

if (!$apiKey || !$placeId) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Missing API key or Place ID'
    ]);
    exit;
}

$query = http_build_query([
    'place_id' => $placeId,
    'fields' => 'name,rating,user_ratings_total,reviews,url',
    'reviews_sort' => 'newest',
    'key' => $apiKey
]);

$url = "https://maps.googleapis.com/maps/api/place/details/json?$query";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
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
        'error' => 'Google request failed',
        'raw' => $response
    ]);
    exit;
}

$data = json_decode($response, true);

if (!is_array($data)) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Invalid JSON from Google'
    ]);
    exit;
}

if (($data['status'] ?? '') !== 'OK') {
    http_response_code(500);
    echo json_encode([
        'error' => 'Google Places error',
        'status' => $data['status'] ?? 'UNKNOWN',
        'message' => $data['error_message'] ?? ''
    ]);
    exit;
}

$result = $data['result'] ?? [];

$reviews = array_map(function ($review) {
    return [
        'author_name' => $review['author_name'] ?? 'Google User',
        'author_url' => $review['author_url'] ?? '',
        'rating' => (int) ($review['rating'] ?? 0),
        'relative_time_description' => $review['relative_time_description'] ?? '',
        'text' => $review['text'] ?? '',
        'profile_photo_url' => $review['profile_photo_url'] ?? ''
    ];
}, $result['reviews'] ?? []);

echo json_encode([
    'name' => $result['name'] ?? '',
    'rating' => (float) ($result['rating'] ?? 0),
    'user_ratings_total' => (int) ($result['user_ratings_total'] ?? 0),
    'url' => $result['url'] ?? 'https://google.com/',
    'reviews' => $reviews
]);