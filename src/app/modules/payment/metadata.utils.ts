/**
 * Utility functions for handling Stripe metadata compression and decompression
 * Stripe has a 500 character limit per metadata field, so we need to compress large data
 */

/**
 * Compresses data to fit within Stripe's metadata character limit
 * @param data - The data to compress
 * @param maxChars - Maximum characters per metadata field (default: 1500 as requested)
 * @returns Object with compressed metadata fields
 */
export function compressMetadata(data: any, maxChars: number = 1500): Record<string, string> {
  const jsonString = JSON.stringify(data);
  console.log('=== METADATA COMPRESSION ===');
  console.log('Original JSON length:', jsonString.length);
  console.log('Max chars per field:', maxChars);
  
  // If data fits in one field, return it directly
  if (jsonString.length <= maxChars) {
    console.log('Data fits in single field');
    return { cartData: jsonString };
  }
  
  // Split data into multiple fields if it exceeds the limit
  const metadata: Record<string, string> = {};
  const chunks = [];
  
  // Split the JSON string into chunks that fit within the limit
  for (let i = 0; i < jsonString.length; i += maxChars) {
    chunks.push(jsonString.slice(i, i + maxChars));
  }
  
  console.log('Splitting into', chunks.length, 'chunks');
  
  // Store chunks in metadata with prefix
  chunks.forEach((chunk, index) => {
    const chunkKey = `cartData_${index.toString().padStart(2, '0')}`;
    metadata[chunkKey] = chunk;
    console.log(`Chunk ${index}: key=${chunkKey}, length=${chunk.length}`);
  });
  
  // Add chunk count for reconstruction
  metadata.cartData_chunks = chunks.length.toString();
  console.log('Final compressed metadata:', metadata);
  
  return metadata;
}

/**
 * Decompresses metadata that was split into multiple fields
 * @param metadata - The metadata object from Stripe
 * @returns The decompressed data
 */
export function decompressMetadata(metadata: Record<string, string>): any {
  console.log('=== METADATA DECOMPRESSION ===');
  console.log('Input metadata keys:', Object.keys(metadata));
  
  // Check if we have chunked data
  const chunkCount = metadata.cartData_chunks;
  console.log('Chunk count found:', chunkCount);
  
  if (chunkCount) {
    // Reconstruct chunked data
    const chunks: string[] = [];
    const numChunks = parseInt(chunkCount);
    console.log('Reconstructing from', numChunks, 'chunks');
    
    for (let i = 0; i < numChunks; i++) {
      const chunkKey = `cartData_${i.toString().padStart(2, '0')}`;
      const chunk = metadata[chunkKey];
      console.log(`Processing chunk ${i}: key=${chunkKey}, found=${!!chunk}, length=${chunk?.length || 0}`);
      
      if (chunk) {
        chunks.push(chunk);
      } else {
        throw new Error(`Missing metadata chunk: ${chunkKey}`);
      }
    }
    
    const jsonString = chunks.join('');
    console.log('Reconstructed JSON length:', jsonString.length);
    
    try {
      const parsed = JSON.parse(jsonString);
      console.log('Successfully parsed JSON');
      return parsed;
    } catch (error) {
      console.log('JSON parse error:', error);
      throw error;
    }
  } else {
    // Handle single field data
    const cartData = metadata.cartData;
    console.log('Single field data found, length:', cartData?.length || 0);
    
    if (!cartData) {
      throw new Error('No cart data found in metadata');
    }
    
    try {
      const parsed = JSON.parse(cartData);
      console.log('Successfully parsed single field JSON');
      return parsed;
    } catch (error) {
      console.log('Single field JSON parse error:', error);
      throw error;
    }
  }
}

/**
 * Validates that metadata doesn't exceed the character limit
 * @param metadata - The metadata object to validate
 * @param maxChars - Maximum characters per field
 * @returns Boolean indicating if metadata is valid
 */
export function validateMetadataSize(metadata: Record<string, string>, maxChars: number = 1500): boolean {
  return Object.values(metadata).every(value => value.length <= maxChars);
}
