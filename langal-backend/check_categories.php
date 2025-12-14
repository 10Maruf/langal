<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Check if slug column exists
$columns = DB::getSchemaBuilder()->getColumnListing('marketplace_categories');
echo "Current columns: " . implode(', ', $columns) . "\n\n";

// Add slug column if it doesn't exist
if (!in_array('slug', $columns)) {
    echo "Adding 'slug' column...\n";
    DB::statement("ALTER TABLE marketplace_categories ADD COLUMN slug VARCHAR(50) NULL AFTER category_name_bn");
    echo "Column added!\n\n";
}

// Update slugs based on category_name
$slugMap = [
    'Crops' => 'crops',
    'ফসল' => 'crops',
    'Machinery' => 'machinery',
    'যন্ত্রপাতি' => 'machinery',
    'Fertilizer' => 'fertilizer',
    'সার' => 'fertilizer',
    'Seeds' => 'seeds',
    'বীজ' => 'seeds',
    'Livestock' => 'livestock',
    'গবাদি পশু' => 'livestock',
    'Tools' => 'tools',
    'হাতিয়ার' => 'tools',
    'Other' => 'other',
    'অন্যান্য' => 'other',
];

// Get all categories
$categories = DB::table('marketplace_categories')->get();
echo "Updating slugs...\n";
foreach($categories as $c) {
    $slug = $slugMap[$c->category_name] ?? $slugMap[$c->category_name_bn] ?? strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $c->category_name));
    
    DB::table('marketplace_categories')
        ->where('category_id', $c->category_id)
        ->update(['slug' => $slug]);
    
    echo "ID: {$c->category_id} | {$c->category_name} => slug: {$slug}\n";
}

echo "\nDone! Verifying...\n\n";

// Verify
$categories = DB::table('marketplace_categories')
    ->select('category_id', 'category_name', 'category_name_bn', 'slug')
    ->get();

foreach($categories as $c) {
    echo "ID: {$c->category_id} | {$c->category_name} | {$c->category_name_bn} | slug: {$c->slug}\n";
}
