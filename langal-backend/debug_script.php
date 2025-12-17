$user = App\Models\User::latest()->first();
$profile = $user->profile;
$expert = $user->expert;
echo "User ID: " . $user->user_id . PHP_EOL;
echo "Profile Photo Path: " . ($profile ? $profile->profile_photo_url : 'NULL') . PHP_EOL;
echo "Profile Photo Full URL: " . ($profile ? $profile->profile_photo_url_full : 'NULL') . PHP_EOL;
echo "Certification Path: " . ($expert ? $expert->certification_document : 'NULL') . PHP_EOL;
echo "Certification Full URL: " . ($expert ? $expert->certification_document_url_full : 'NULL') . PHP_EOL;
