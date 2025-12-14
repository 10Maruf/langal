<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

$listings = DB::table('marketplace_listings')
    ->select('listing_id', 'title', 'full_location_bn', 'postal_code', 'village')
    ->get();

echo "=== Marketplace Listings ===\n\n";
foreach ($listings as $l) {
    echo "ID: {$l->listing_id}\n";
    echo "Title: {$l->title}\n";
    echo "full_location_bn: " . ($l->full_location_bn ?: '(empty)') . "\n";
    echo "postal_code: " . ($l->postal_code ?: '(empty)') . "\n";
    echo "village: " . ($l->village ?: '(empty)') . "\n";
    echo "---\n";
}
