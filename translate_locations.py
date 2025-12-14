import pandas as pd
import json
import time
from deep_translator import GoogleTranslator

def translate_text(text, cache):
    if not isinstance(text, str):
        return text
    
    text = text.strip()
    if not text:
        return text
        
    if text in cache:
        return cache[text]
    
    try:
        # Retry logic
        for attempt in range(3):
            try:
                translated = GoogleTranslator(source='auto', target='bn').translate(text)
                if translated:
                    print(f"Translated: {text} -> {translated}")
                    cache[text] = translated
                    return translated
            except Exception as e:
                if attempt == 2:
                    print(f"Error translating {text}: {e}")
                    return text
                time.sleep(1)
    except Exception as e:
        print(f"Fatal error for {text}: {e}")
        return text
        
    return text

def main():
    print("Loading data...")
    df = pd.read_csv('locations.csv')
    
    # Load existing translations
    try:
        with open('existing_translations.json', 'r', encoding='utf-8') as f:
            cache = json.load(f)
        print(f"Loaded {len(cache)} existing translations.")
    except FileNotFoundError:
        cache = {}
        print("No existing translations found.")

    # Columns to translate
    columns = ['division', 'district', 'upazila', 'post_office']
    
    # Pre-populate cache with unique values to avoid redundant API calls
    unique_values = set()
    for col in columns:
        unique_values.update(df[col].dropna().unique())
    
    print(f"Found {len(unique_values)} unique values to process.")
    
    # Translate unique values first
    translator = GoogleTranslator(source='auto', target='bn')
    
    count = 0
    total = len(unique_values)
    
    for val in unique_values:
        if val not in cache:
            translate_text(val, cache)
            count += 1
            if count % 10 == 0:
                print(f"Progress: {count}/{total} new translations...")
                # Save cache periodically
                with open('translation_cache_temp.json', 'w', encoding='utf-8') as f:
                    json.dump(cache, f, ensure_ascii=False, indent=2)
    
    # Apply translations
    print("Applying translations to dataframe...")
    for col in columns:
        df[f'{col}_bn'] = df[col].map(lambda x: cache.get(x.strip() if isinstance(x, str) else x, x))
    
    # Reorder columns
    final_columns = [
        'postal_code', 
        'post_office', 'post_office_bn',
        'upazila', 'upazila_bn',
        'district', 'district_bn',
        'division', 'division_bn'
    ]
    
    # Ensure all columns exist
    for col in final_columns:
        if col not in df.columns:
            df[col] = ''
            
    df_final = df[final_columns]
    
    output_file = 'locations_translated.csv'
    df_final.to_csv(output_file, index=False, encoding='utf-8')
    print(f"Saved translated data to {output_file}")
    
    # Save final cache
    with open('final_translations.json', 'w', encoding='utf-8') as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()
