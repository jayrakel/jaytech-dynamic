// src/lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export { cloudinary };

export async function uploadToCloudinary(
  file: Buffer | string,
  options: {
    folder?: string;
    publicId?: string;
    resourceType?: 'image' | 'raw' | 'video' | 'auto';
    transformation?: object[];
  } = {}
) {
  return new Promise<{ url: string; publicId: string; width?: number; height?: number; size?: number; format?: string }>(
    (resolve, reject) => {
      const uploadOptions: any = {
        folder:        options.folder || 'jaytech',
        resource_type: options.resourceType || 'auto',
        ...( options.publicId ? { public_id: options.publicId } : {} ),
        ...( options.transformation ? { transformation: options.transformation } : {} ),
      };

      const uploadCallback = (error: any, result: any) => {
        if (error) return reject(error);
        resolve({
          url:      result.secure_url,
          publicId: result.public_id,
          width:    result.width,
          height:   result.height,
          size:     result.bytes,
          format:   result.format,
        });
      };

      if (typeof file === 'string') {
        cloudinary.uploader.upload(file, uploadOptions, uploadCallback);
      } else {
        const stream = cloudinary.uploader.upload_stream(uploadOptions, uploadCallback);
        stream.end(file);
      }
    }
  );
}

export async function deleteFromCloudinary(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}
