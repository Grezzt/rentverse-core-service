/**
 * Unified Storage Service
 * Supports both S3/MinIO and Cloudinary
 * Switch between providers using STORAGE_PROVIDER env variable
 */

const s3UploadService = require('./fileUpload');
const cloudinaryUploadService = require('./cloudinaryUpload');

// Determine which storage provider to use
const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || 'cloudinary';

class UnifiedStorageService {
  constructor() {
    this.provider = STORAGE_PROVIDER;
    this.service = this.getServiceInstance();

    console.log(`📦 Using storage provider: ${this.provider.toUpperCase()}`);
  }

  /**
   * Get appropriate service instance based on provider
   */
  getServiceInstance() {
    switch (this.provider) {
      case 's3':
        return s3UploadService;
      case 'cloudinary':
        return cloudinaryUploadService;
      default:
        console.warn(
          `⚠️  Unknown storage provider: ${this.provider}, defaulting to Cloudinary`
        );
        return cloudinaryUploadService;
    }
  }

  /**
   * Upload single file
   */
  async uploadFile(file, folder = 'uploads', options = {}) {
    try {
      return await this.service.uploadFile(file, folder, options);
    } catch (error) {
      console.error(`${this.provider.toUpperCase()} upload error:`, error);
      throw error;
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(files, folder = 'uploads', options = {}) {
    try {
      return await this.service.uploadMultipleFiles(files, folder, options);
    } catch (error) {
      console.error(
        `${this.provider.toUpperCase()} multiple upload error:`,
        error
      );
      throw error;
    }
  }

  /**
   * Delete file
   */
  async deleteFile(identifier, resourceType = 'image') {
    try {
      return await this.service.deleteFile(identifier, resourceType);
    } catch (error) {
      console.error(`${this.provider.toUpperCase()} delete error:`, error);
      throw error;
    }
  }

  /**
   * Delete multiple files
   */
  async deleteMultipleFiles(identifiers, resourceType = 'image') {
    try {
      return await this.service.deleteMultipleFiles(identifiers, resourceType);
    } catch (error) {
      console.error(
        `${this.provider.toUpperCase()} multiple delete error:`,
        error
      );
      throw error;
    }
  }

  /**
   * Validate file
   */
  validateFile(file, allowedTypes = null) {
    return this.service.validateFile(file, allowedTypes);
  }

  /**
   * Get current storage provider
   */
  getProvider() {
    return this.provider;
  }

  /**
   * Get max file size
   */
  getMaxFileSize() {
    return this.service.maxFileSize;
  }

  /**
   * Get allowed image types
   */
  getAllowedImageTypes() {
    return this.service.allowedImageTypes;
  }

  /**
   * Get allowed file types
   */
  getAllowedFileTypes() {
    return this.service.allowedFileTypes;
  }
}

// Export singleton instance
const storageService = new UnifiedStorageService();

module.exports = storageService;
