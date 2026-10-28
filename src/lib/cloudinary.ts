import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Check if Cloudinary environment variables are available
export const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
}

/**
 * Upload an image (base64 string or data URI) to Cloudinary with automatic optimization
 */
export async function uploadToCloudinary(
  fileDataUri: string,
  folder = 'aerc_media'
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured) {
    throw new Error(
      'Cloudinary is not configured. Please define CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.'
    );
  }

  const response: UploadApiResponse = await cloudinary.uploader.upload(fileDataUri, {
    folder,
    resource_type: 'auto',
    transformation: [
      { quality: 'auto', fetch_format: 'auto' },
    ],
  });

  return {
    url: response.secure_url,
    publicId: response.public_id,
    format: response.format,
    bytes: response.bytes,
    width: response.width,
    height: response.height,
  };
}

/**
 * Delete a media file from Cloudinary by its publicId
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (!isCloudinaryConfigured || !publicId) return false;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (err) {
    console.error('Failed to delete asset from Cloudinary:', err);
    return false;
  }
}

/**
 * Generate an optimized Cloudinary delivery URL with responsive dimensions and quality options
 */
export function getOptimizedCloudinaryUrl(
  urlOrPublicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
  } = {}
): string {
  if (!urlOrPublicId) return '';

  // If it's a Cloudinary URL or public ID and Cloudinary is configured
  if (isCloudinaryConfigured && (urlOrPublicId.includes('res.cloudinary.com') || !urlOrPublicId.startsWith('/'))) {
    const transformations: string[] = [];
    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.crop) transformations.push(`c_${options.crop}`);
    transformations.push(`q_${options.quality || 'auto'}`);
    transformations.push(`f_${options.format || 'auto'}`);

    if (urlOrPublicId.includes('res.cloudinary.com')) {
      const parts = urlOrPublicId.split('/upload/');
      if (parts.length === 2) {
        return `${parts[0]}/upload/${transformations.join(',')}/${parts[1]}`;
      }
    }

    return cloudinary.url(urlOrPublicId, {
      transformation: [
        {
          width: options.width,
          height: options.height,
          crop: options.crop || 'fill',
          quality: options.quality || 'auto',
          fetch_format: options.format || 'auto',
        },
      ],
      secure: true,
    });
  }

  // Fallback to original path
  return urlOrPublicId;
}

/**
 * Hybrid storage uploader: uploads to Cloudinary when configured,
 * or writes to local public/uploads/ when running in offline/local dev mode.
 */
export async function uploadFileToStorage(
  file: File,
  folder = 'aerc_media'
): Promise<CloudinaryUploadResult> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  if (isCloudinaryConfigured) {
    const mimeType = file.type || 'image/jpeg';
    const base64 = buffer.toString('base64');
    const dataUri = `data:${mimeType};base64,${base64}`;
    return await uploadToCloudinary(dataUri, folder);
  }

  // Fallback: save locally in public/uploads
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const timestamp = Date.now();
  const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filename = `${timestamp}-${sanitizedOriginalName}`;
  const filePath = path.join(uploadsDir, filename);

  await fs.promises.writeFile(filePath, buffer);

  const ext = path.extname(file.name).replace('.', '').toLowerCase() || 'jpg';
  const localUrl = `/uploads/${filename}`;

  return {
    url: localUrl,
    publicId: filename,
    format: ext,
    bytes: file.size,
    width: null as unknown as number,
    height: null as unknown as number,
  };
}

/**
 * Delete a media file from either Cloudinary or local public/uploads
 */
export async function deleteMediaFile(url: string, publicId?: string | null): Promise<boolean> {
  if (isCloudinaryConfigured && publicId && !url.startsWith('/')) {
    return await deleteFromCloudinary(publicId);
  }

  // If local upload in /uploads
  if (url && url.startsWith('/uploads/')) {
    const filename = path.basename(url);
    const localPath = path.join(process.cwd(), 'public', 'uploads', filename);
    if (fs.existsSync(localPath)) {
      try {
        await fs.promises.unlink(localPath);
        return true;
      } catch (err) {
        console.error('Failed to unlink local file:', err);
        return false;
      }
    }
  }

  return true;
}

export { cloudinary };
