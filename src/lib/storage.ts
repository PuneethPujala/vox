import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const STORAGE_TYPE = process.env.STORAGE_TYPE || 'local';
const LOCAL_STORAGE_PATH = process.env.LOCAL_STORAGE_PATH || './uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760');
const ALLOWED_FILE_TYPES = (process.env.ALLOWED_FILE_TYPES || '').split(',');

export interface FileUploadResult {
  path: string;
  size: number;
  type: string;
}

async function ensureUploadDir(): Promise<void> {
  if (!existsSync(LOCAL_STORAGE_PATH)) {
    await mkdir(LOCAL_STORAGE_PATH, { recursive: true });
  }
}

export async function uploadFile(
  buffer: Buffer,
  fileName: string,
  fileType: string
): Promise<FileUploadResult> {
  validateFile(buffer, fileType);

  if (STORAGE_TYPE === 's3') {
    return uploadToS3(buffer, fileName, fileType);
  }

  return uploadToLocal(buffer, fileName, fileType);
}

function validateFile(buffer: Buffer, fileType: string): void {
  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum allowed size of ${MAX_FILE_SIZE} bytes`);
  }

  if (ALLOWED_FILE_TYPES.length > 0 && !ALLOWED_FILE_TYPES.includes(fileType)) {
    throw new Error(`File type ${fileType} is not allowed`);
  }
}

async function uploadToLocal(
  buffer: Buffer,
  fileName: string,
  fileType: string
): Promise<FileUploadResult> {
  await ensureUploadDir();

  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = join(LOCAL_STORAGE_PATH, `${timestamp}-${sanitizedFileName}`);

  await writeFile(filePath, buffer);

  return {
    path: filePath,
    size: buffer.length,
    type: fileType,
  };
}

async function uploadToS3(
  buffer: Buffer,
  fileName: string,
  fileType: string
): Promise<FileUploadResult> {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const s3Path = `vendor-documents/${timestamp}-${sanitizedFileName}`;

  console.log(`[S3 Stub] Would upload file to S3: ${s3Path}`);
  console.log(`[S3 Stub] File size: ${buffer.length} bytes, type: ${fileType}`);

  return {
    path: s3Path,
    size: buffer.length,
    type: fileType,
  };
}
