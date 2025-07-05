import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Validate URL format
let validatedUrl = supabaseUrl;
if (!supabaseUrl.startsWith('http')) {
  // If URL doesn't start with http, it might be a JWT token or project reference
  // Try to extract project reference from JWT and construct URL
  try {
    const payload = JSON.parse(atob(supabaseUrl.split('.')[1]));
    if (payload.ref) {
      validatedUrl = `https://${payload.ref}.supabase.co`;
    } else {
      throw new Error('Invalid Supabase URL format: ' + supabaseUrl);
    }
  } catch (error) {
    console.error('Invalid Supabase URL format:', supabaseUrl);
    throw new Error('Invalid Supabase URL format: ' + supabaseUrl);
  }
}

export const supabase = createClient(validatedUrl, supabaseAnonKey);

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
    console.error('Upload error:', error);
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
  
  try {
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
  } catch (error) {
    console.error('Error parsing image URL for deletion:', error);
  }
};

// Cleanup all images for a character (useful when deleting a character)
export const deleteAllCharacterImages = async (characterId: number): Promise<void> => {
  try {
    const { data: files, error } = await supabase.storage
      .from('character-images')
      .list('characters', {
        search: `character-${characterId}-`
      });

    if (error) {
      console.error('Error listing character images:', error.message);
      return;
    }

    if (files && files.length > 0) {
      const filePaths = files.map(file => `characters/${file.name}`);
      const { error: deleteError } = await supabase.storage
        .from('character-images')
        .remove(filePaths);

      if (deleteError) {
        console.error('Error deleting character images:', deleteError.message);
      }
    }
  } catch (error) {
    console.error('Error in deleteAllCharacterImages:', error);
  }
};

// Cleanup all images for a project (useful when deleting a project)
export const deleteAllProjectImages = async (projectId: number): Promise<void> => {
  try {
    // Get all characters for this project first
    const response = await fetch(`/api/projects/${projectId}/characters`);
    if (!response.ok) return;
    
    const characters = await response.json();
    
    // Delete images for each character
    for (const character of characters) {
      if (character.imageUrl) {
        await deleteCharacterImage(character.imageUrl);
      }
    }
  } catch (error) {
    console.error('Error in deleteAllProjectImages:', error);
  }
};