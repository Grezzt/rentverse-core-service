const {
  cloudinary,
  isCloudinaryConfigured,
  cloudinaryConfig,
} = require('../config/cloudinary');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const streamifier = require('streamifier');

class CloudinaryUploadService {
  constructor() {
    this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB default
    this.allowedImageTypes = (
      process.env.ALLOWED_IMAGE_TYPES ||
      'image/jpeg,image/jpg,image/png,image/webp'
    ).split(',');
    this.allowedFileTypes = (
      process.env.ALLOWED_FILE_TYPES ||
      'image/jpeg,image/jpg,image/png,image/webp,application/pdf'
    ).split(',');
  }

  /**
   * Check if Cloudinary is configured
   */
  checkCloudinaryConfig() {
    if (!isCloudinaryConfigured) {
      throw new Error(
        'Cloudinary storage is not configured. Please check your environment variables.'
      );
    }
  }

  /**
   * Validate file type and size
   */
  validateFile(file, allowedTypes = null) {
    if (!file) {
      throw new Error('No file provided');
    }

    const types = allowedTypes || this.allowedFileTypes;
    if (!types.includes(file.mimetype)) {
      throw new Error(`Invalid file type. Allowed types: ${types.join(', ')}`);
    }

    if (file.size > this.maxFileSize) {
      throw new Error(
        `File size exceeds maximum allowed size of ${this.maxFileSize / 1024 / 1024}MB`
      );
    }

    return true;
  }

  /**
   * Generate folder path for Cloudinary
   */
  generateFolderPath(subfolder = 'uploads') {
    const baseFolder = cloudinaryConfig.folder || 'rentverse';
    return `${baseFolder}/${subfolder}`;
  }

  /**
   * Generate unique filename
   */
  generateUniqueFilename(originalName) {
    const ext = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, ext);
    const uniqueId = uuidv4();
    const timestamp = Date.now();

    // Sanitize filename: remove special characters, spaces, etc.
    const sanitizedName = nameWithoutExt
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50); // Limit length

    return `${sanitizedName}-${timestamp}-${uniqueId}`;
  }

  /**
   * Upload file buffer to Cloudinary
   * @param {Buffer} buffer - File buffer from multer
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} Upload result with URL and metadata
   */
  uploadFromBuffer(buffer, options = {}) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder || this.generateFolderPath(),
          public_id: options.public_id,
          resource_type: options.resource_type || 'auto',
          transformation: options.transformation,
          tags: options.tags,
          context: options.context,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

  /**
   * Upload single file to Cloudinary
   * @param {Object} file - Multer file object
   * @param {String} folder - Subfolder name (properties, profiles, documents, etc.)
   * @param {Object} options - Additional upload options
   * @returns {Promise<Object>} Upload result
   */
  async uploadFile(file, folder = 'uploads', options = {}) {
    try {
      // Check Cloudinary configuration
      this.checkCloudinaryConfig();

      // Validate file
      this.validateFile(file);

      // Generate unique filename
      const publicId = this.generateUniqueFilename(file.originalname);
      const folderPath = this.generateFolderPath(folder);

      // Determine resource type
      let resourceType = 'auto';
      if (file.mimetype.startsWith('image/')) {
        resourceType = 'image';
      } else if (file.mimetype.startsWith('video/')) {
        resourceType = 'video';
      } else if (file.mimetype === 'application/pdf') {
        resourceType = 'raw';
      }

      // Upload to Cloudinary
      const result = await this.uploadFromBuffer(file.buffer, {
        folder: folderPath,
        public_id: publicId,
        resource_type: resourceType,
        ...options,
      });

      // Return formatted result
      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        size: result.bytes,
        resourceType: result.resource_type,
        createdAt: result.created_at,
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  /**
   * Upload multiple files to Cloudinary
   * @param {Array} files - Array of multer file objects
   * @param {String} folder - Subfolder name
   * @param {Object} options - Additional upload options
   * @returns {Promise<Array>} Array of upload results
   */
  async uploadMultipleFiles(files, folder = 'uploads', options = {}) {
    try {
      this.checkCloudinaryConfig();

      if (!files || files.length === 0) {
        throw new Error('No files provided');
      }

      // Upload all files in parallel
      const uploadPromises = files.map(file =>
        this.uploadFile(file, folder, options)
      );

      const results = await Promise.all(uploadPromises);

      return results;
    } catch (error) {
      console.error('Cloudinary multiple upload error:', error);
      throw new Error(`Failed to upload files: ${error.message}`);
    }
  }

  /**
   * Delete file from Cloudinary
   * @param {String} publicId - Cloudinary public ID
   * @param {String} resourceType - Resource type (image, video, raw)
   * @returns {Promise<Object>} Deletion result
   */
  async deleteFile(publicId, resourceType = 'image') {
    try {
      this.checkCloudinaryConfig();

      if (!publicId) {
        throw new Error('Public ID is required');
      }

      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });

      return result;
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Delete multiple files from Cloudinary
   * @param {Array} publicIds - Array of Cloudinary public IDs
   * @param {String} resourceType - Resource type
   * @returns {Promise<Object>} Deletion result
   */
  async deleteMultipleFiles(publicIds, resourceType = 'image') {
    try {
      this.checkCloudinaryConfig();

      if (!publicIds || publicIds.length === 0) {
        throw new Error('No public IDs provided');
      }

      const result = await cloudinary.api.delete_resources(publicIds, {
        resource_type: resourceType,
      });

      return result;
    } catch (error) {
      console.error('Cloudinary multiple delete error:', error);
      throw new Error(`Failed to delete files: ${error.message}`);
    }
  }

  /**
   * Get optimized image URL with transformations
   * @param {String} publicId - Cloudinary public ID
   * @param {Object} transformations - Transformation options
   * @returns {String} Transformed image URL
   */
  getOptimizedUrl(publicId, transformations = {}) {
    try {
      this.checkCloudinaryConfig();

      const {
        width,
        height,
        crop = 'fill',
        quality = 'auto',
        format = 'auto',
        gravity = 'auto',
      } = transformations;

      const options = {
        secure: true,
        transformation: [],
      };

      // Add transformations
      const transform = {
        quality,
        fetch_format: format,
      };

      if (width) transform.width = width;
      if (height) transform.height = height;
      if (crop) transform.crop = crop;
      if (gravity) transform.gravity = gravity;

      options.transformation.push(transform);

      return cloudinary.url(publicId, options);
    } catch (error) {
      console.error('Cloudinary URL generation error:', error);
      return '';
    }
  }

  /**
   * Get file info from Cloudinary
   * @param {String} publicId - Cloudinary public ID
   * @param {String} resourceType - Resource type
   * @returns {Promise<Object>} File information
   */
  async getFileInfo(publicId, resourceType = 'image') {
    try {
      this.checkCloudinaryConfig();

      const result = await cloudinary.api.resource(publicId, {
        resource_type: resourceType,
      });

      return result;
    } catch (error) {
      console.error('Cloudinary get file info error:', error);
      throw new Error(`Failed to get file info: ${error.message}`);
    }
  }

  /**
   * List files in a folder
   * @param {String} folder - Folder path
   * @param {Object} options - List options
   * @returns {Promise<Object>} List of files
   */
  async listFiles(folder, options = {}) {
    try {
      this.checkCloudinaryConfig();

      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: folder,
        max_results: options.max_results || 100,
        next_cursor: options.next_cursor,
      });

      return result;
    } catch (error) {
      console.error('Cloudinary list files error:', error);
      throw new Error(`Failed to list files: ${error.message}`);
    }
  }
}

// Export singleton instance
const cloudinaryUploadService = new CloudinaryUploadService();

module.exports = cloudinaryUploadService;
