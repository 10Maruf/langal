<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MarketplaceCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'category_id' => 1,
                'category_name' => 'crops',
                'category_name_bn' => 'ফসল ও শাকসবজি',
                'description' => 'সব ধরনের ফসল, শাকসবজি এবং কৃষিপণ্য',
                'icon_url' => '🌾',
                'parent_id' => null,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'category_id' => 2,
                'category_name' => 'machinery',
                'category_name_bn' => 'যন্ত্রপাতি',
                'description' => 'কৃষি যন্ত্রপাতি, ট্রাক্টর, পাওয়ার টিলার ইত্যাদি',
                'icon_url' => '🚜',
                'parent_id' => null,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'category_id' => 3,
                'category_name' => 'fertilizer',
                'category_name_bn' => 'সার ও কীটনাশক',
                'description' => 'রাসায়নিক সার, জৈব সার, কীটনাশক',
                'icon_url' => '🧪',
                'parent_id' => null,
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'category_id' => 4,
                'category_name' => 'seeds',
                'category_name_bn' => 'বীজ ও চারা',
                'description' => 'উন্নত জাতের বীজ, চারা, কলম',
                'icon_url' => '🌱',
                'parent_id' => null,
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'category_id' => 5,
                'category_name' => 'livestock',
                'category_name_bn' => 'গবাদি পশু',
                'description' => 'গরু, ছাগল, মুরগি, হাঁস ইত্যাদি',
                'icon_url' => '🐄',
                'parent_id' => null,
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'category_id' => 6,
                'category_name' => 'tools',
                'category_name_bn' => 'হাতিয়ার',
                'description' => 'কোদাল, কাস্তে, লাঙল ও অন্যান্য হাতিয়ার',
                'icon_url' => '🔧',
                'parent_id' => null,
                'is_active' => true,
                'sort_order' => 6,
            ],
            [
                'category_id' => 7,
                'category_name' => 'other',
                'category_name_bn' => 'অন্যান্য',
                'description' => 'অন্যান্য কৃষি সম্পর্কিত পণ্য ও সেবা',
                'icon_url' => '📦',
                'parent_id' => null,
                'is_active' => true,
                'sort_order' => 7,
            ],
        ];

        foreach ($categories as $category) {
            DB::table('marketplace_categories')->updateOrInsert(
                ['category_id' => $category['category_id']],
                $category
            );
        }

        $this->command->info('Marketplace categories seeded successfully!');
    }
}
