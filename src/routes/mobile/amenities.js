/**
 * @swagger
 * tags:
 *   - name: Mobile - Amenities
 *     description: Amenity endpoints for mobile app
 */

const express = require('express');
const { prisma } = require('../../config/database');

const router = express.Router();

/**
 * @swagger
 * /api/v1/m/amenities:
 *   get:
 *     summary: Get all amenities (Mobile)
 *     tags: [Mobile - Amenities]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: Amenities retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       icon:
 *                         type: string
 *                       category:
 *                         type: string
 */
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    const where = {};
    if (category) where.category = category;

    const amenities = await prisma.amenity.findMany({
      where,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });

    // Group by category
    const groupedAmenities = amenities.reduce((acc, amenity) => {
      const cat = amenity.category || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(amenity);
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        amenities,
        grouped: groupedAmenities,
      },
    });
  } catch (error) {
    console.error('Get amenities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get amenities',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @swagger
 * /api/v1/m/amenities/categories:
 *   get:
 *     summary: Get all amenity categories (Mobile)
 *     tags: [Mobile - Amenities]
 *     responses:
 *       200:
 *         description: Amenity categories retrieved successfully
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.amenity.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });

    res.json({
      success: true,
      data: categories.map(c => c.category).filter(Boolean),
    });
  } catch (error) {
    console.error('Get amenity categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get amenity categories',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;
