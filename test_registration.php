<?php
use App\Models\User;
use App\Models\UserProfile;
use App\Models\Farmer;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

require __DIR__ . '/langal-backend/vendor/autoload.php';
$app = require __DIR__ . '/langal-backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    DB::beginTransaction();

    echo "Creating User...\n";
    $user = User::create([
        'phone' => '017' . rand(10000000, 99999999),
        'email' => null,
        'user_type' => 'farmer',
        'password_hash' => Hash::make('01700000000'),
        'is_verified' => true,
        'is_active' => true,
    ]);
    echo "User created with ID: " . $user->user_id . "\n";

    echo "Creating UserProfile...\n";
    UserProfile::create([
        'user_id' => $user->user_id,
        'full_name' => 'Test Farmer',
        'date_of_birth' => '1990-01-01',
        'father_name' => 'Test Father',
        'mother_name' => 'Test Mother',
        'address' => 'Test Address',
        'nid_number' => (string)rand(1000000000000, 9999999999999),
        'profile_photo_url' => null,
        'verification_status' => 'verified',
    ]);
    echo "UserProfile created.\n";

    echo "Creating Farmer...\n";
    Farmer::create([
        'user_id' => $user->user_id,
        'farm_size' => 1.5,
        'farm_type' => 'Crop',
        'experience_years' => 5,
        'krishi_card_number' => (string)rand(1000000000000, 9999999999999),
        'registration_date' => now(),
        'additional_info' => [],
    ]);
    echo "Farmer created.\n";

    DB::commit();
    echo "Success!\n";
} catch (\Exception $e) {
    DB::rollBack();
    echo "Error: " . $e->getMessage() . "\n";
}
