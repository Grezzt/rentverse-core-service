# 📝 Create Property - Complete Examples

## Overview

Panduan lengkap cara create property dengan upload gambar ke Cloudinary.

---

## 🎯 Flow Create Property

```
1. Upload gambar ke Cloudinary (optional, bisa upload nanti)
2. Create property dengan image URLs
3. Property masuk status PENDING_REVIEW (jika auto-approve OFF)
```

---

## 1️⃣ Upload Images Dulu (Recommended)

### Endpoint

```
POST /api/upload/property-images
```

### Headers

```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data
```

### Body (form-data)

```
files: [file1.jpg, file2.jpg, file3.jpg]
```

### cURL Example

```bash
curl -X POST http://localhost:3000/api/upload/property-images \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "files=@/path/to/bedroom.jpg" \
  -F "files=@/path/to/living-room.jpg" \
  -F "files=@/path/to/kitchen.jpg"
```

### Response

```json
{
  "success": true,
  "message": "3 property images uploaded successfully",
  "data": {
    "images": [
      {
        "url": "https://res.cloudinary.com/debmlrrkg/image/upload/v1704326400/rentverse/properties/bedroom-1704326400-abc123.jpg",
        "publicId": "rentverse/properties/bedroom-1704326400-abc123",
        "format": "jpg",
        "width": 1920,
        "height": 1080,
        "size": 245678,
        "resourceType": "image"
      },
      {
        "url": "https://res.cloudinary.com/debmlrrkg/image/upload/v1704326401/rentverse/properties/living-room-1704326401-def456.jpg",
        "publicId": "rentverse/properties/living-room-1704326401-def456",
        "format": "jpg",
        "width": 1920,
        "height": 1080,
        "size": 312456,
        "resourceType": "image"
      },
      {
        "url": "https://res.cloudinary.com/debmlrrkg/image/upload/v1704326402/rentverse/properties/kitchen-1704326402-ghi789.jpg",
        "publicId": "rentverse/properties/kitchen-1704326402-ghi789",
        "format": "jpg",
        "width": 1920,
        "height": 1080,
        "size": 198765,
        "resourceType": "image"
      }
    ],
    "count": 3
  }
}
```

---

## 2️⃣ Create Property

### Endpoint

```
POST /api/properties
```

### Headers

```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

### Body (JSON)

**Required Fields:**

- `title` (string)
- `address` (string)
- `city` (string)
- `state` (string)
- `zipCode` (string)
- `price` (number)
- `propertyTypeId` (uuid)

**Optional Fields:**

- `description` (string)
- `country` (string, default: "MY")
- `currencyCode` (string, default: "MYR")
- `latitude` (number)
- `longitude` (number)
- `placeId` (string)
- `bedrooms` (integer, default: 0)
- `bathrooms` (integer, default: 0)
- `areaSqm` (number)
- `furnished` (boolean, default: false)
- `isAvailable` (boolean, default: true)
- `images` (array of strings - URLs from upload)
- `amenityIds` (array of uuids)
- `projectName` (string)
- `developer` (string)

### cURL Example

```bash
curl -X POST http://localhost:3000/api/properties \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Luxury Penthouse in KLCC",
    "description": "Stunning 3-bedroom penthouse with panoramic city views in the heart of Kuala Lumpur City Centre. Features premium finishes, private balcony, and access to world-class amenities including infinity pool, gym, and concierge service.",
    "address": "Jalan Pinang, KLCC",
    "city": "Kuala Lumpur",
    "state": "Kuala Lumpur",
    "country": "MY",
    "zipCode": "50450",
    "latitude": 3.1516,
    "longitude": 101.7121,
    "placeId": "ChIJ5-U6m9w61TERqB3wOx4BKYw",
    "price": 8500.00,
    "currencyCode": "MYR",
    "propertyTypeId": "your-property-type-uuid-here",
    "bedrooms": 3,
    "bathrooms": 3,
    "areaSqm": 180.0,
    "furnished": true,
    "isAvailable": true,
    "images": [
      "https://res.cloudinary.com/debmlrrkg/image/upload/v1704326400/rentverse/properties/bedroom-1704326400-abc123.jpg",
      "https://res.cloudinary.com/debmlrrkg/image/upload/v1704326401/rentverse/properties/living-room-1704326401-def456.jpg",
      "https://res.cloudinary.com/debmlrrkg/image/upload/v1704326402/rentverse/properties/kitchen-1704326402-ghi789.jpg"
    ],
    "amenityIds": [
      "amenity-ac-uuid",
      "amenity-pool-uuid",
      "amenity-gym-uuid",
      "amenity-security-uuid",
      "amenity-parking-uuid"
    ]
  }'
```

### Response

```json
{
  "success": true,
  "message": "Property created successfully",
  "data": {
    "property": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "code": "PROP-20260104-1234",
      "title": "Luxury Penthouse in KLCC",
      "description": "Stunning 3-bedroom penthouse...",
      "address": "Jalan Pinang, KLCC",
      "city": "Kuala Lumpur",
      "state": "Kuala Lumpur",
      "country": "MY",
      "zipCode": "50450",
      "latitude": 3.1516,
      "longitude": 101.7121,
      "price": "8500.00",
      "currencyCode": "MYR",
      "bedrooms": 3,
      "bathrooms": 3,
      "areaSqm": 180.0,
      "furnished": true,
      "isAvailable": true,
      "status": "PENDING_REVIEW",
      "images": [
        "https://res.cloudinary.com/debmlrrkg/image/upload/v1704326400/rentverse/properties/bedroom-1704326400-abc123.jpg",
        "https://res.cloudinary.com/debmlrrkg/image/upload/v1704326401/rentverse/properties/living-room-1704326401-def456.jpg",
        "https://res.cloudinary.com/debmlrrkg/image/upload/v1704326402/rentverse/properties/kitchen-1704326402-ghi789.jpg"
      ],
      "createdAt": "2026-01-04T10:30:00.000Z",
      "updatedAt": "2026-01-04T10:30:00.000Z"
    }
  }
}
```

---

## 3️⃣ JavaScript/TypeScript Example

### React Example (with Axios)

```javascript
import axios from 'axios';
import { useState } from 'react';

const API_URL = 'http://localhost:3000/api';
const token = localStorage.getItem('token'); // Your JWT token

const CreatePropertyForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    price: '',
    bedrooms: 0,
    bathrooms: 0,
    areaSqm: '',
    furnished: false,
    propertyTypeId: '',
  });

  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  // Step 1: Upload Images
  const handleImageUpload = async files => {
    try {
      const formData = new FormData();

      // Add multiple files
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      const response = await axios.post(
        `${API_URL}/upload/property-images`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        const urls = response.data.data.images.map(img => img.url);
        setImageUrls(urls);
        alert(`${urls.length} images uploaded successfully!`);
        return urls;
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload images');
      throw error;
    }
  };

  // Step 2: Create Property
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload images first if any
      let uploadedImageUrls = imageUrls;
      if (images.length > 0 && imageUrls.length === 0) {
        uploadedImageUrls = await handleImageUpload(images);
      }

      // Create property data
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        areaSqm: parseFloat(formData.areaSqm),
        images: uploadedImageUrls,
      };

      const response = await axios.post(`${API_URL}/properties`, propertyData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        alert('Property created successfully!');
        console.log('Created property:', response.data.data.property);
        // Reset form or redirect
      }
    } catch (error) {
      console.error('Create property error:', error);
      alert('Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Property</h2>

      {/* Title */}
      <input
        type="text"
        placeholder="Property Title"
        value={formData.title}
        onChange={e => setFormData({ ...formData, title: e.target.value })}
        required
      />

      {/* Description */}
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={e =>
          setFormData({ ...formData, description: e.target.value })
        }
      />

      {/* Address */}
      <input
        type="text"
        placeholder="Address"
        value={formData.address}
        onChange={e => setFormData({ ...formData, address: e.target.value })}
        required
      />

      {/* City */}
      <input
        type="text"
        placeholder="City"
        value={formData.city}
        onChange={e => setFormData({ ...formData, city: e.target.value })}
        required
      />

      {/* Price */}
      <input
        type="number"
        placeholder="Monthly Rent (MYR)"
        value={formData.price}
        onChange={e => setFormData({ ...formData, price: e.target.value })}
        required
      />

      {/* Bedrooms */}
      <input
        type="number"
        placeholder="Bedrooms"
        value={formData.bedrooms}
        onChange={e =>
          setFormData({ ...formData, bedrooms: parseInt(e.target.value) })
        }
      />

      {/* Bathrooms */}
      <input
        type="number"
        placeholder="Bathrooms"
        value={formData.bathrooms}
        onChange={e =>
          setFormData({ ...formData, bathrooms: parseInt(e.target.value) })
        }
      />

      {/* Area */}
      <input
        type="number"
        placeholder="Area (sqm)"
        value={formData.areaSqm}
        onChange={e => setFormData({ ...formData, areaSqm: e.target.value })}
      />

      {/* Furnished */}
      <label>
        <input
          type="checkbox"
          checked={formData.furnished}
          onChange={e =>
            setFormData({ ...formData, furnished: e.target.checked })
          }
        />
        Furnished
      </label>

      {/* Images */}
      <div>
        <label>Property Images:</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={e => setImages(e.target.files)}
        />
        {imageUrls.length > 0 && <p>{imageUrls.length} images uploaded</p>}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Property'}
      </button>
    </form>
  );
};

export default CreatePropertyForm;
```

---

## 4️⃣ React Native Example

```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const CreatePropertyScreen = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    price: '',
    bedrooms: '0',
    bathrooms: '0',
    areaSqm: '',
    propertyTypeId: 'your-property-type-uuid',
  });

  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pick images
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages(result.assets);
    }
  };

  // Upload images
  const uploadImages = async () => {
    try {
      const formData = new FormData();

      images.forEach((image, index) => {
        formData.append('files', {
          uri: image.uri,
          type: 'image/jpeg',
          name: `property-image-${index}.jpg`,
        });
      });

      const response = await axios.post(
        `${API_URL}/upload/property-images`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        const urls = response.data.data.images.map(img => img.url);
        setImageUrls(urls);
        return urls;
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload images');
      throw error;
    }
  };

  // Create property
  const handleSubmit = async () => {
    if (!formData.title || !formData.address || !formData.city) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }

    setLoading(true);

    try {
      // Upload images first
      let urls = imageUrls;
      if (images.length > 0 && imageUrls.length === 0) {
        urls = await uploadImages();
      }

      // Create property
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        areaSqm: parseFloat(formData.areaSqm),
        images: urls,
      };

      const response = await axios.post(`${API_URL}/properties`, propertyData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        Alert.alert('Success', 'Property created successfully!');
        // Navigate back or reset form
      }
    } catch (error) {
      console.error('Create error:', error);
      Alert.alert('Error', 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Property</Text>

      <TextInput
        style={styles.input}
        placeholder="Property Title *"
        value={formData.title}
        onChangeText={text => setFormData({ ...formData, title: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        multiline
        value={formData.description}
        onChangeText={text => setFormData({ ...formData, description: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Address *"
        value={formData.address}
        onChangeText={text => setFormData({ ...formData, address: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="City *"
        value={formData.city}
        onChangeText={text => setFormData({ ...formData, city: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Monthly Rent (MYR) *"
        keyboardType="numeric"
        value={formData.price}
        onChangeText={text => setFormData({ ...formData, price: text })}
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Bedrooms"
          keyboardType="numeric"
          value={formData.bedrooms}
          onChangeText={text => setFormData({ ...formData, bedrooms: text })}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Bathrooms"
          keyboardType="numeric"
          value={formData.bathrooms}
          onChangeText={text => setFormData({ ...formData, bathrooms: text })}
        />
      </View>

      <Button title="Pick Images" onPress={pickImages} />

      {images.length > 0 && (
        <View style={styles.imagesPreview}>
          <Text>{images.length} images selected</Text>
          <View style={styles.imageGrid}>
            {images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image.uri }}
                style={styles.previewImage}
              />
            ))}
          </View>
        </View>
      )}

      <Button
        title={loading ? 'Creating...' : 'Create Property'}
        onPress={handleSubmit}
        disabled={loading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  imagesPreview: {
    marginVertical: 15,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
});

export default CreatePropertyScreen;
```

---

## 5️⃣ Postman Collection Example

### Step 1: Upload Images

**Request:**

```
POST http://localhost:3000/api/upload/property-images
Headers:
  Authorization: Bearer YOUR_TOKEN
Body (form-data):
  files: [select multiple images]
```

### Step 2: Copy Image URLs from Response

### Step 3: Create Property

**Request:**

```
POST http://localhost:3000/api/properties
Headers:
  Authorization: Bearer YOUR_TOKEN
  Content-Type: application/json
Body (raw JSON):
```

```json
{
  "title": "Modern Apartment in KLCC",
  "description": "Beautiful 2 bedroom apartment with amazing city view",
  "address": "Jalan Ampang",
  "city": "Kuala Lumpur",
  "state": "Wilayah Persekutuan",
  "country": "MY",
  "zipCode": "50450",
  "latitude": 3.1516,
  "longitude": 101.7121,
  "price": 2500,
  "currencyCode": "MYR",
  "propertyTypeId": "get-this-from-property-types-endpoint",
  "bedrooms": 2,
  "bathrooms": 2,
  "areaSqm": 850.5,
  "furnished": true,
  "isAvailable": true,
  "images": [
    "https://res.cloudinary.com/debmlrrkg/image/upload/v1704326400/rentverse/properties/image1.jpg",
    "https://res.cloudinary.com/debmlrrkg/image/upload/v1704326401/rentverse/properties/image2.jpg",
    "https://res.cloudinary.com/debmlrrkg/image/upload/v1704326402/rentverse/properties/image3.jpg"
  ]
}
```

---

## 6️⃣ Get Property Type ID First

Sebelum create property, Anda perlu property type ID:

```bash
GET http://localhost:3000/api/property-types
```

Response akan berisi list property types dengan ID mereka:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-apartment",
      "code": "APT",
      "name": "Apartment"
    },
    {
      "id": "uuid-house",
      "code": "HOUSE",
      "name": "House"
    }
  ]
}
```

Copy ID yang sesuai untuk field `propertyTypeId`.

---

## 📝 Validation Rules

Required fields yang harus ada:

- ✅ `title` - Property title
- ✅ `address` - Full address
- ✅ `city` - City name
- ✅ `state` - State/province
- ✅ `zipCode` - Postal code
- ✅ `price` - Monthly rent
- ✅ `propertyTypeId` - Property type UUID

Optional tapi recommended:

- 📸 `images` - Array of image URLs
- 📍 `latitude` & `longitude` - For map display
- 🏠 `bedrooms`, `bathrooms` - Property details
- 📐 `areaSqm` - Size

---

## 🎯 Tips

1. **Upload images terlebih dahulu** sebelum create property
2. **Save image URLs** dari response upload
3. **Gunakan propertyTypeId** yang valid dari database
4. **Latitude/Longitude** akan membuat property muncul di map
5. **Images array** pertama akan jadi featured image
6. **Status** akan otomatis `PENDING_REVIEW` (jika auto-approve OFF)

---

**Happy coding! 🚀**
