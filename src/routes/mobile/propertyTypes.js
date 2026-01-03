/**
 * @swagger
 * tags:
 *   - name: Mobile - Property Types
 *     description: Property type endpoints for mobile app
 */

const express = require('express');
const { prisma } = require('../../config/database');

const router = express.Router();

/**
 * @swagger
 * /api/v1/m/property-types:
 *   get:
 *     summary: Get all property types (Mobile)
 *     tags: [Mobile - Property Types]
 *     responses:
 *       200:
 *         description: Property types retrieved successfully
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
 *                       propertyCount:
 *                         type: integer
 */
router.get('/', async (req, res) => {
  try {
    const propertyTypes = await prisma.propertyType.findMany({
      include: {
        _count: {
          select: {
            properties: {
              where: {
                status: 'APPROVED',
                isAvailable: true,
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const formattedTypes = propertyTypes.map(type => ({
      id: type.id,
      name: type.name,
      icon: type.icon,
      propertyCount: type._count.properties,
    }));

    res.json({
      success: true,
      data: formattedTypes,
    });
  } catch (error) {
    console.error('Get property types error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get property types',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @swagger
 * /api/v1/m/property-types/{id}:
 *   get:
 *     summary: Get property type by ID (Mobile)
 *     tags: [Mobile - Property Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property type retrieved successfully
 *       404:
 *         description: Property type not found
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const propertyType = await prisma.propertyType.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            properties: {
              where: {
                status: 'APPROVED',
                isAvailable: true,
              },
            },
          },
        },
      },
    });

    if (!propertyType) {
      return res.status(404).json({
        success: false,
        message: 'Property type not found',
      });
    }

    res.json({
      success: true,
      data: {
        id: propertyType.id,
        name: propertyType.name,
        icon: propertyType.icon,
        propertyCount: propertyType._count.properties,
      },
    });
  } catch (error) {
    console.error('Get property type error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get property type',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;
