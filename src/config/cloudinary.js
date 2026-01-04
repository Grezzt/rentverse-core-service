const cloudinary = require('cloudinary').v2;

// Check if Cloudinary is configured
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name-here';

let cloudinaryInstance = null;
let cloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  apiKey: process.env.CLOUDINARY_API_KEY || '',
  apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  folder: process.env.CLOUDINARY_FOLDER || 'rentverse',
};

if (isCloudinaryConfigured) {
  try {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: cloudinaryConfig.cloudName,
      api_key: cloudinaryConfig.apiKey,
      api_secret: cloudinaryConfig.apiSecret,
      secure: true, // Always use HTTPS
    });

    cloudinaryInstance = cloudinary;

    console.log('✅ Cloudinary storage configured successfully');
    console.log(`   Cloud Name: ${cloudinaryConfig.cloudName}`);
    console.log(`   Folder Prefix: ${cloudinaryConfig.folder}`);
  } catch (error) {
    console.error('❌ Failed to configure Cloudinary storage:', error.message);
  }
} else {
  console.warn(
    '⚠️  Cloudinary storage not configured. File upload features will be disabled.'
  );
  console.warn(
    'Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in your .env file'
  );
}

module.exports = {
  cloudinary: cloudinaryInstance,
  cloudinaryConfig,
  isCloudinaryConfigured,
};
