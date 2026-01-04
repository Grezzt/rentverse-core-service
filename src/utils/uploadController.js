const storageService = require('../utils/storageService');

class UploadController {
  /**
   * Upload single file
   */
  async uploadSingle(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file provided',
        });
      }

      const folder = req.body.folder || 'uploads';
      const result = await storageService.uploadFile(req.file, folder);

      res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        data: result,
      });
    } catch (error) {
      console.error('Upload single file error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'File upload failed',
      });
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMultiple(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files provided',
        });
      }

      const folder = req.body.folder || 'uploads';
      const results = await storageService.uploadMultipleFiles(
        req.files,
        folder
      );

      res.status(200).json({
        success: true,
        message: `${results.length} files uploaded successfully`,
        data: {
          files: results,
          count: results.length,
        },
      });
    } catch (error) {
      console.error('Upload multiple files error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'File upload failed',
      });
    }
  }

  /**
   * Upload property images
   */
  async uploadPropertyImages(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No images provided',
        });
      }

      const results = await storageService.uploadMultipleFiles(
        req.files,
        'properties'
      );

      res.status(200).json({
        success: true,
        message: `${results.length} property images uploaded successfully`,
        data: {
          images: results,
          count: results.length,
        },
      });
    } catch (error) {
      console.error('Upload property images error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Property images upload failed',
      });
    }
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No avatar image provided',
        });
      }

      // Upload avatar to profiles folder
      const avatar = await storageService.uploadFile(req.file, 'profiles');

      res.status(200).json({
        success: true,
        message: 'Avatar uploaded successfully',
        data: avatar,
      });
    } catch (error) {
      console.error('Upload avatar error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Avatar upload failed',
      });
    }
  }

  /**
   * Delete file
   */
  async deleteFile(req, res) {
    try {
      const { identifier } = req.params; // publicId for Cloudinary, key for S3
      const { resourceType = 'image' } = req.body;

      if (!identifier) {
        return res.status(400).json({
          success: false,
          message: 'File identifier is required',
        });
      }

      const result = await storageService.deleteFile(identifier, resourceType);

      res.status(200).json({
        success: true,
        message: 'File deleted successfully',
        data: result,
      });
    } catch (error) {
      console.error('Delete file error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'File deletion failed',
      });
    }
  }

  /**
   * Delete multiple files
   */
  async deleteMultipleFiles(req, res) {
    try {
      const { identifiers, resourceType = 'image' } = req.body;

      if (
        !identifiers ||
        !Array.isArray(identifiers) ||
        identifiers.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: 'File identifiers array is required',
        });
      }

      const result = await storageService.deleteMultipleFiles(
        identifiers,
        resourceType
      );

      res.status(200).json({
        success: true,
        message: `${identifiers.length} files deleted successfully`,
        data: result,
      });
    } catch (error) {
      console.error('Delete multiple files error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Files deletion failed',
      });
    }
  }

  /**
   * Get storage info
   */
  async getStorageInfo(req, res) {
    try {
      res.status(200).json({
        success: true,
        data: {
          provider: storageService.getProvider(),
          maxFileSize: storageService.getMaxFileSize(),
          maxFileSizeMB: storageService.getMaxFileSize() / 1024 / 1024,
          allowedImageTypes: storageService.getAllowedImageTypes(),
          allowedFileTypes: storageService.getAllowedFileTypes(),
        },
      });
    } catch (error) {
      console.error('Get storage info error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get storage info',
      });
    }
  }

  /**
   * Get video thumbnail
   */
  async getVideoThumbnail(req, res) {
    try {
      const { publicId } = req.params;

      if (!publicId) {
        return res.status(400).json({
          success: false,
          message: 'Public ID is required',
        });
      }

      // Generate thumbnail URL for video
      const thumbnailUrl = storageService.getVideoThumbnailUrl
        ? await storageService.getVideoThumbnailUrl(publicId)
        : null;

      if (!thumbnailUrl) {
        return res.status(404).json({
          success: false,
          message: 'Video thumbnail not available',
        });
      }

      res.status(200).json({
        success: true,
        data: {
          publicId,
          thumbnailUrl,
        },
      });
    } catch (error) {
      console.error('Get video thumbnail error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get video thumbnail',
      });
    }
  }
}

module.exports = new UploadController();
