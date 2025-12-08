/**
 * Post-generation script to fix Orval response types
 * Converts Promise<{data: T, status, headers}> to Promise<T>
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const srcDir = './src';
const files = readdirSync(srcDir).filter(f => f.endsWith('.ts') && !f.includes('mutator') && !f.includes('index') && !f.includes('schemas'));

for (const file of files) {
  const filePath = join(srcDir, file);
  let content = readFileSync(filePath, 'utf-8');
  
  // Extract data type from response type definitions
  // Pattern: export type createResponse201 = { data: UrlDto, status: 201 }
  const responseMap = new Map();
  
  // Match response type definitions and extract the data type
  const typeDefRegex = /export type (\w+Response)(\d+)? = \{\s*data:\s*(\w+)/g;
  let match;
  
  while ((match = typeDefRegex.exec(content)) !== null) {
    const baseName = match[1]; // e.g., "createResponse"
    const dataType = match[3]; // e.g., "UrlDto"
    responseMap.set(baseName, dataType);
  }
  
  // Replace function signatures: Promise<xxxResponse> => Promise<DataType>
  for (const [responseType, dataType] of responseMap.entries()) {
    // Replace return type annotation
    content = content.replace(
      new RegExp(`Promise<${responseType}>`, 'g'),
      `Promise<${dataType}>`
    );
    
    // Replace customFetch generic parameter
    content = content.replace(
      new RegExp(`customFetch<${responseType}>`, 'g'),
      `customFetch<${dataType}>`
    );
  }
  
  writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Fixed types in ${file}`);
}

console.log('🎉 All response types fixed!');

