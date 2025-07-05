import { createClient } from '@supabase/supabase-js';

// The environment variables contain the anon key and service role key
// We need to extract the project reference from the JWT and construct the URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const serviceRoleKey = import.meta.env.VITE_SUPABASE_URL; // This is actually the service role key

if (!supabaseAnonKey) {
  throw new Error('Missing Supabase anon key');
}

// Extract project reference from the anon key JWT
let projectRef = '';
try {
  const payload = JSON.parse(atob(supabaseAnonKey.split('.')[1]));
  projectRef = payload.ref;
} catch (error) {
  throw new Error('Invalid Supabase anon key format');
}

const supabaseUrl = `https://${projectRef}.supabase.co`;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage helpers for character images
export const uploadCharacterImage = async (file: File, characterId: number): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `character-${characterId}-${Date.now()}.${fileExt}`;
  const filePath = `characters/${fileName}`;

  const { data, error } = await supabase.storage
    .from('character-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('character-images')
    .getPublicUrl(data.path);

  return publicUrl;
};

export const deleteCharacterImage = async (imageUrl: string): Promise<void> => {
  if (!imageUrl) return;
  
  // Extract the file path from the URL
  const url = new URL(imageUrl);
  const filePath = url.pathname.split('/character-images/')[1];
  
  if (filePath) {
    const { error } = await supabase.storage
      .from('character-images')
      .remove([filePath]);
    
    if (error) {
      console.error('Failed to delete image:', error.message);
    }
  }
};