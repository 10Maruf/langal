<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\MarketplaceListing;

// Create a test listing directly
try {
    $listing = MarketplaceListing::create([
        'seller_id' => 31,
        'category_id' => 1,
        'title' => 'Test Listing',
        'description' => 'Test Description',
        'price' => 1000,
        'currency' => 'BDT',
        'listing_type' => 'sell',
        'full_location_bn' => 'ঢাকা, বাংলাদেশ',
        'contact_phone' => '01712345678',
        'status' => 'active',
        'views_count' => 0,
        'saves_count' => 0,
        'contacts_count' => 0,
        'tags' => [],
        'images' => [],
    ]);
    echo "SUCCESS! Listing created with ID: " . $listing->listing_id . "\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Full trace:\n" . $e->getTraceAsString() . "\n";
}
