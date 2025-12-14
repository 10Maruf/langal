<?php
/**
 * Complete fix for all remaining English text in Chattogram division
 */

$host = 'localhost';
$dbname = 'langol_krishi_sahayak';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Complete Chattogram Division Fix...\n\n";
    
    // Comprehensive post office translations
    $allPostOffices = [
        // From the list we just saw
        'Al- Amin Baria Madra' => 'আল-আমিন বাড়িয়া মাদ্রাসা',
        'B.I.T Post Office' => 'বি.আই.টি পোস্ট অফিস',
        'Baitul Ijjat' => 'বাইতুল ইজ্জত',
        'Bangra' => 'বাংড়া',
        'Barabkunda' => 'বড়বকুন্ডা',
        'Barashalghar' => 'বারশালঘর',
        'Barma' => 'বর্মা',
        'Baroidhala' => 'বারইধালা',
        'Batisa' => 'বাটিসা',
        'Battali' => 'বাট্টালী',
        'Bayezid Bostami' => 'বায়েজিদ বোস্তামী',
        'Bazalia' => 'বাজালিয়া',
        'Beenajuri' => 'বীনাজুরী',
        'Beezbag' => 'বিজবাগ',
        'Betbunia' => 'বেতবুনিয়া',
        'Bhandar Sharif' => 'ভান্ডার শরীফ',
        'Bipulasar' => 'বিপুলাসার',
        'Bodalcourt' => 'বোদালকোর্ট',
        'Chandia' => 'চান্দিয়া',
        'Chandidar' => 'চান্দিদার',
        
        // More common names
        'Chandra' => 'চন্দ্রা',
        'Dosh Gharia' => 'দশঘরিয়া',
        'Basur' => 'বাসুর',
        'Khalafat' => 'খিলাফত',
        'Nanu' => 'নানু',
        'Saha' => 'সাহা',
        'Fateh' => 'ফতেহ',
        'Fateপুর' => 'ফতেহপুর',
        'Nanuপুর' => 'নানুপুর',
        'Basurহাট' => 'বাসুরহাট',
        'Khalafatবাজার' => 'খিলাফতবাজার',
        'Sahaটali' => 'সাহাটালী',
        
        // Additional Chattogram post offices
        'Abutorab' => 'আবু তোরাব',
        'Adamdighi' => 'আদমদীঘি',
        'Adhuনগর' => 'আধুনগর',
        'Agla' => 'আগলা',
        'Ahlaআবাদ' => 'আহলাআবাদ',
        'Akবরনগর' => 'আকবরনগর',
        'Alakdi' => 'আলকদী',
        'Alamনগর' => 'আলমনগর',
        'Alampurটাঙ্গি' => 'আলমপুরটাঙ্গি',
        'Alkara' => 'আলকরা',
        'Ambagan' => 'আমবাগান',
        'Andulবারিয়া' => 'আন্দুলবারিয়া',
        'Angaria' => 'আঙ্গারিয়া',
        'Arani' => 'আরানী',
        'Arish মঞ্জিল' => 'আরিশ মঞ্জিল',
        'Asadnagar' => 'আসাদনগর',
        'Babunagar' => 'বাবুনগর',
        'Bachhamiar Hat' => 'বাচ্ছামিয়ার হাট',
        'Badamতলি' => 'বাদামতলি',
        'Badamtali' => 'বাদামতলী',
        'Bagar Bazar' => 'বাগাড় বাজার',
        'Baganবাড়ী' => 'বাগানবাড়ী',
        'Baganbazar' => 'বাগানবাজার',
        'Baiddar Bazar' => 'বৈদ্দার বাজার',
        'Bairagirhat' => 'বৈরাগীরহাট',
        'Baizid Bostami' => 'বায়েজিদ বোস্তামী',
        'Bakshগঞ্জ' => 'বকশগঞ্জ',
        'Baluchara' => 'বালুচরা',
        'Balurhat' => 'বালুরহাট',
        'Banigram' => 'বনীগ্রাম',
        'Baniyaগাঁও' => 'বনিয়াগাঁও',
        'Bara Auliaপুর' => 'বড় আউলিয়াপুর',
        'Barabভুঁইয়া' => 'বড়ভুঁইয়া',
        'Barahatia' => 'বড়হাটিয়া',
        'Baralekha' => 'বড়লেখা',
        'Baria' => 'বাড়িয়া',
        'Barমা' => 'বর্মা',
        'Bashkhali' => 'বাঁশখালী',
        'Bashtala' => 'বাশতলা',
        'Bazra' => 'বজরা',
        'Begunবাড়ী' => 'বেগুনবাড়ী',
        'Bhati Para' => 'ভাটি পাড়া',
        'Bhuigar' => 'ভূইগড়',
        'Boalkhali' => 'বোয়ালখালী',
        'Bolakhal' => 'বোলাখাল',
        'Boxirhat' => 'বক্সিরহাট',
        'Cadet College' => 'ক্যাডেট কলেজ',
        'Cadetকলেজ' => 'ক্যাডেট কলেজ',
        'Cement Factory' => 'সিমেন্ট ফ্যাক্টরি',
        'Chaklaনাবাদ' => 'চাকলানাবাদ',
        'Chakmarkul' => 'চাকমারকুল',
        'Chalitabazar' => 'চালিতাবাজার',
        'Char Alexসেন্ডার' => 'চর আলেকজান্ডার',
        'Char Alexander' => 'চর আলেকজান্ডার',
        'Char Clark' => 'চর ক্লার্ক',
        'Charপাগলা' => 'চরপাগলা',
        'Charpata' => 'চরপাতা',
        'Chartak' => 'চরটাক',
        'Chatirchar' => 'ছাতিরচর',
        'Chiringga' => 'চিরিঙ্গা',
        'Chowdhury Hat' => 'চৌধুরী হাট',
        'Dautia' => 'দাউটিয়া',
        'Dohazari' => 'দোহাজারী',
        'Fazilপুর' => 'ফাজিলপুর',
        'Fouzdarhat' => 'ফৌজদারহাট',
        'Garduara' => 'গার্দুয়ারা',
        'Guliarkot' => 'গুলিয়ারকোট',
        'Guzra Noapara' => 'গুজরা নোয়াপাড়া',
        'Haidgaon' => 'হাইদগাঁও',
        'Hajirহাট' => 'হাজিরহাট',
        'Halodia' => 'হালদিয়া',
        'Hazipara' => 'হাজিপাড়া',
        'Ichanagar' => 'ইছানগর',
        'Jamira' => 'জমিরা',
        'Jogonnathhat' => 'জগন্নাথহাট',
        'Joyaghat' => 'জয়াঘাট',
        'Juldha' => 'জুলধা',
        'Kabirhat' => 'কবিরহাট',
        'Kalurghat' => 'কালুরঘাট',
        'Karerhat' => 'কাড়েরহাট',
        'Katirhat' => 'কাটিরহাট',
        'Kodalপুর' => 'কোদালপুর',
        'Kumira' => 'কুমিরা',
        'Laskarhat' => 'লস্করহাট',
        'Madunaghat' => 'মধুনাঘাট',
        'Madrasa' => 'মাদ্রাসা',
        'Maizdee' => 'মাইজদী',
        'Maijdee' => 'মাইজদী',
        'Manikpur' => 'মানিকপুর',
        'Mirsharai' => 'মীরসরাই',
        'Mirzakalu' => 'মির্জাকালু',
        'Mohamaya' => 'মহামায়া',
        'Naagmud' => 'নাগমুদ',
        'Nangolমোরা' => 'নাঙ্গলমোরা',
        'Noapara' => 'নোয়াপাড়া',
        'Oxygen' => 'অক্সিজেন',
        'Paindong' => 'পাইনদং',
        'Patharghata' => 'পাথরঘাটা',
        'Puabashimulia' => 'পুয়াবাশিমুলিয়া',
        'Rajaganj' => 'রাজাগঞ্জ',
        'Rajanagar' => 'রাজানগর',
        'Ramদাশমুন্সি' => 'রামদাশমুন্সি',
        'Ramganj' => 'রামগঞ্জ',
        'Rangunia' => 'রাঙ্গুনিয়া',
        'Rauzan' => 'রাউজান',
        'Roujan' => 'রাউজান',
        'Rouzan' => 'রাউজান',
        'Sabekbar' => 'সবেকবার',
        'Sahaপুর' => 'সাহাপুর',
        'Satkania' => 'সাতকানিয়া',
        'Shaহাজীপুর' => 'শাহাজীপুর',
        'Shaহজীবাজার' => 'শাহজীবাজার',
        'Shilok' => 'শিলক',
        'Sitakunda' => 'সীতাকুণ্ড',
        'Sonaichhari' => 'সোনাইছড়ি',
        'Sonaikপেন' => 'সোনাইকপেন',
        'Suaganj' => 'সুয়াগঞ্জ',
        'Tamoraddi' => 'তামোরদ্দি',
        'Ujantia' => 'উজানটিয়া',
        'Ujanটিয়া' => 'উজানটিয়া',
    ];
    
    echo "Step 1: Translating all post offices...\n";
    $count = 0;
    foreach ($allPostOffices as $en => $bn) {
        $stmt = $pdo->prepare("
            UPDATE location 
            SET post_office_bn = :bn 
            WHERE (post_office = :en OR post_office_bn = :en)
            AND division = 'Chattogram'
        ");
        $stmt->execute([':bn' => $bn, ':en' => $en]);
        $c = $stmt->rowCount();
        if ($c > 0) {
            echo "  ✓ $en → $bn ($c records)\n";
            $count += $c;
        }
    }
    echo "Total: Fixed $count post office records\n\n";
    
    // Fix remaining upazila issues
    $upazilaFixes = [
        'Chhagalnaia' => 'ছাগলনাইয়া',
        'Rouzan' => 'রাউজান',
        'Roujan' => 'রাউজান',
    ];
    
    echo "Step 2: Fixing upazila names...\n";
    $count = 0;
    foreach ($upazilaFixes as $en => $bn) {
        $stmt = $pdo->prepare("
            UPDATE location 
            SET upazila_bn = :bn 
            WHERE (upazila = :en OR upazila_bn = :en)
            AND division = 'Chattogram'
        ");
        $stmt->execute([':bn' => $bn, ':en' => $en]);
        $c = $stmt->rowCount();
        if ($c > 0) {
            echo "  ✓ $en → $bn ($c records)\n";
            $count += $c;
        }
    }
    echo "Total: Fixed $count upazila records\n\n";
    
    // Pattern-based cleanup for any remaining mixed text
    echo "Step 3: Pattern-based cleanup...\n";
    
    $patterns = [
        ['টali', 'টালী'],
        ['হাট', 'হাট'],
        ['বাজার', 'বাজার'],
        ['পুর', 'পুর'],
        ['নগর', 'নগর'],
        ['গঞ্জ', 'গঞ্জ'],
        ['বাড়ী', 'বাড়ী'],
        ['Court', 'কোর্ট'],
        ['Port', 'বন্দর'],
        ['Market', 'মার্কেট'],
        ['College', 'কলেজ'],
        ['Bazar', 'বাজার'],
    ];
    
    $count = 0;
    foreach ($patterns as [$old, $new]) {
        $stmt = $pdo->prepare("
            UPDATE location 
            SET post_office_bn = REPLACE(post_office_bn, :old, :new),
                upazila_bn = REPLACE(upazila_bn, :old, :new)
            WHERE division = 'Chattogram'
            AND (post_office_bn LIKE CONCAT('%', :old, '%') OR upazila_bn LIKE CONCAT('%', :old, '%'))
        ");
        $stmt->execute([':old' => $old, ':new' => $new]);
        $count += $stmt->rowCount();
    }
    echo "✓ Fixed $count pattern instances\n\n";
    
    // Final verification
    $stats = $pdo->query("
        SELECT 
            COUNT(*) as total,
            COUNT(CASE WHEN district_bn REGEXP '[অ-ৰ]' THEN 1 END) as dist_bn,
            COUNT(CASE WHEN upazila_bn REGEXP '[অ-ৰ]' THEN 1 END) as upz_bn,
            COUNT(CASE WHEN post_office_bn REGEXP '[অ-ৰ]' THEN 1 END) as po_bn
        FROM location 
        WHERE division = 'Chattogram'
    ")->fetch(PDO::FETCH_ASSOC);
    
    echo "=================================\n";
    echo "FINAL CHATTOGRAM DIVISION STATUS:\n";
    echo "=================================\n";
    echo "Total Records: {$stats['total']}\n";
    echo "Districts (বাংলা): {$stats['dist_bn']}/{$stats['total']} (" . round(($stats['dist_bn']/$stats['total'])*100, 1) . "%)\n";
    echo "Upazilas (বাংলা): {$stats['upz_bn']}/{$stats['total']} (" . round(($stats['upz_bn']/$stats['total'])*100, 1) . "%)\n";
    echo "Post Offices (বাংলা): {$stats['po_bn']}/{$stats['total']} (" . round(($stats['po_bn']/$stats['total'])*100, 1) . "%)\n\n";
    
    // Check for any remaining English
    echo "Remaining English check:\n";
    $remaining = $pdo->query("
        SELECT COUNT(*) as cnt
        FROM location 
        WHERE division = 'Chattogram'
        AND (
            post_office = post_office_bn 
            OR upazila = upazila_bn
        )
        AND post_office NOT REGEXP '[অ-ৰ]'
    ")->fetch(PDO::FETCH_ASSOC);
    
    echo "Records with English text: {$remaining['cnt']}\n\n";
    
    // Show samples
    echo "Random verification samples:\n";
    $samples = $pdo->query("
        SELECT postal_code, post_office, post_office_bn, upazila_bn, district_bn 
        FROM location 
        WHERE division = 'Chattogram' 
        ORDER BY RAND() 
        LIMIT 10
    ");
    
    while ($row = $samples->fetch(PDO::FETCH_ASSOC)) {
        $hasBangla = (preg_match('/[অ-ৰ]/', $row['post_office_bn']) && 
                      preg_match('/[অ-ৰ]/', $row['upazila_bn']) && 
                      preg_match('/[অ-ৰ]/', $row['district_bn']));
        $icon = $hasBangla ? '✓' : '✗';
        echo "$icon {$row['postal_code']}: {$row['post_office_bn']}, {$row['upazila_bn']}, {$row['district_bn']}\n";
    }
    
    echo "\n✅ CHATTOGRAM DIVISION COMPLETE!\n";
    
} catch (PDOException $e) {
    die("Error: " . $e->getMessage() . "\n");
}
