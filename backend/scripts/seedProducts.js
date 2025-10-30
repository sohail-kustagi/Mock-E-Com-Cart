const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Product = require('../models/Product');

dotenv.config({ path: require('path').resolve(__dirname, '..', '.env') });

const products = [
  {
    name: 'Urban Oversized Hoodie',
  price: 49.99,
    imageUrl:
      'https://images.unsplash.com/photo-1523398002811-999ca8dec234?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3RyZWV0d2VhcnxlbnwxfHx8fDE3NjE2ODU2NTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description:
      'Streetwear vibes meet comfort. Perfect for chill hangout days or late-night coffee runs with the squad.',
    vibe: 'Urban Streetwear Energy',
    category: 'Fashion - Streetwear',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Grey', 'Beige'],
    rating: 4.8,
    reviews: 156,
  },
  {
    name: 'Festive Ethnic Kurta Set',
  price: 69.99,
    imageUrl:
      'https://images.unsplash.com/photo-1668371679302-a8ec781e876e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBldGhuaWMlMjB3ZWFyfGVufDF8fHx8MTc2MTY4ODQ3MHww&ixlib=rb-4.1.0&q=80&w=1080',
    description:
      'Bring that festive glow-up! Traditional elegance with a modern twist. Stand out at every celebration.',
    vibe: 'Cozy Diwali Glow-up',
    category: 'Fashion - Ethnic',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Maroon', 'Royal Blue', 'Emerald Green'],
    rating: 4.9,
    reviews: 243,
  },
  {
    name: 'Glam Makeup Palette',
  price: 24.99,
    imageUrl:
      'https://images.unsplash.com/photo-1723150512429-bfa92988d845?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWtldXAlMjBiZWF1dHklMjBwcm9kdWN0c3xlbnwxfHx8fDE3NjE2NDAxNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: '15 stunning shades for every mood. From office chic to party glam, we have you covered.',
    vibe: 'Soft Girl Aesthetic',
    category: 'Beauty - Makeup',
    colors: ['Warm Tones', 'Cool Tones', 'Neutrals'],
    rating: 4.7,
    reviews: 89,
  },
  {
    name: 'Retro Sneaker Drops',
  price: 84.99,
    imageUrl:
      'https://images.unsplash.com/photo-1656944227480-98180d2a5155?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNob2VzfGVufDF8fHx8MTc2MTY3MDUwNnww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Limited edition kicks that scream main-character energy. Step up your shoe game instantly.',
    vibe: 'Y2K Nostalgia',
    category: 'Fashion - Footwear',
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['White/Blue', 'Black/Red', 'Cream'],
    rating: 4.9,
    reviews: 312,
  },
  {
    name: 'Boho Printed Dress',
  price: 44.99,
    imageUrl:
      'https://images.unsplash.com/photo-1759992878772-e83a691a6d8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2hvJTIwZHJlc3MlMjBmYXNoaW9ufGVufDF8fHx8MTc2MTcyMzE2M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Breezy, flowy, and totally Insta-worthy. Your go-to for brunch dates and beach escapes.',
    vibe: 'Cottagecore Dreams',
    category: 'Fashion - Dresses',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Floral Print', 'Abstract', 'Geometric'],
    rating: 4.6,
    reviews: 127,
  },
  {
    name: 'Minimalist Watch Collection',
  price: 59.99,
    imageUrl:
      'https://images.unsplash.com/photo-1716234479503-c460b87bdf98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwd2VhcmFibGV8ZW58MXx8fHwxNzYxNjU2NzU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Less is more. Sleek design that pairs with everything from formals to casuals.',
    vibe: 'Clean Minimalist',
    category: 'Lifestyle - Accessories',
    colors: ['Silver', 'Gold', 'Rose Gold'],
    rating: 4.8,
    reviews: 201,
  },
  {
    name: 'Designer Sunglasses',
  price: 34.99,
    imageUrl:
      'https://images.unsplash.com/photo-1722842529941-825976fc14f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHN1bmdsYXNzZXN8ZW58MXx8fHwxNzYxNjc3Nzg1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'UV protection with a side of sass. Looking cool never goes out of style.',
    vibe: 'Main Character Energy',
    category: 'Lifestyle - Eyewear',
    colors: ['Black', 'Tortoise', 'Pink'],
    rating: 4.5,
    reviews: 78,
  },
  {
    name: 'Wireless Earbuds Pro',
  price: 99.99,
    imageUrl:
      'https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGVhcmJ1ZHN8ZW58MXx8fHwxNzYxNjkxMDEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Your soundtrack to life. Crystal clear audio for workouts, commutes, and everything in between.',
    vibe: 'Tech Savvy',
    category: 'Lifestyle - Tech',
    colors: ['White', 'Black', 'Mint'],
    rating: 4.7,
    reviews: 189,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME,
    });

    await Product.deleteMany();
    await Product.insertMany(products);

    console.log('Products seeded successfully');
  } catch (error) {
    console.error('Failed to seed products:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
