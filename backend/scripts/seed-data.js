const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in environment variables');
  process.exit(1);
}

async function seedData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;

    // Seed Badges
    console.log('Seeding badges...');
    const badges = [
      {
        name: 'First Post',
        description: 'Created your first post',
        icon: '🎯',
        category: 'engagement',
        pointsRequired: 0,
        rarity: 'common',
      },
      {
        name: 'Social Butterfly',
        description: 'Created 10 posts',
        icon: '🦋',
        category: 'engagement',
        pointsRequired: 100,
        rarity: 'common',
      },
      {
        name: 'Comment Champion',
        description: 'Added 100 comments',
        icon: '💬',
        category: 'community',
        pointsRequired: 500,
        rarity: 'rare',
      },
      {
        name: 'Top Recognized',
        description: 'Received 10 appreciations',
        icon: '⭐',
        category: 'recognition',
        pointsRequired: 250,
        rarity: 'epic',
      },
      {
        name: 'Welcome Committee',
        description: 'Welcomed 5 new joinees',
        icon: '👋',
        category: 'community',
        pointsRequired: 50,
        rarity: 'rare',
      },
    ];

    await db.collection('badges').insertMany(badges);
    console.log('Badges seeded successfully');

    console.log('Seed data completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
