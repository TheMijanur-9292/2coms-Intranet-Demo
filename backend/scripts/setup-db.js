const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in environment variables');
  process.exit(1);
}

async function setupDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;

    // Create indexes for Users collection
    console.log('Creating indexes for Users...');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ companyId: 1, email: 1 });
    await db.collection('users').createIndex({ companyId: 1, departmentId: 1 });
    await db.collection('users').createIndex({ companyId: 1, role: 1 });
    await db.collection('users').createIndex({ employeeId: 1, companyId: 1 }, { unique: true });
    await db.collection('users').createIndex({ 'gamification.points': -1 });

    // Create indexes for Posts collection
    console.log('Creating indexes for Posts...');
    await db.collection('posts').createIndex({ companyId: 1, createdAt: -1 });
    await db.collection('posts').createIndex({ companyId: 1, status: 1, 'moderation.status': 1 });
    await db.collection('posts').createIndex({ companyId: 1, type: 1, createdAt: -1 });
    await db.collection('posts').createIndex({ authorId: 1, createdAt: -1 });
    await db.collection('posts').createIndex({ 'engagement.engagementScore': -1 });
    await db.collection('posts').createIndex({ content: 'text' });

    // Create indexes for Announcements collection
    console.log('Creating indexes for Announcements...');
    await db.collection('announcements').createIndex({ companyId: 1, publishDate: -1 });
    await db.collection('announcements').createIndex({ companyId: 1, isPinned: -1, priority: -1, publishDate: -1 });
    await db.collection('announcements').createIndex({ title: 'text', content: 'text' });

    // Create indexes for RecognitionPosts collection
    console.log('Creating indexes for RecognitionPosts...');
    await db.collection('recognitionposts').createIndex({ companyId: 1, createdAt: -1 });
    await db.collection('recognitionposts').createIndex({ recognizedUserId: 1, createdAt: -1 });

    // Create indexes for NewJoinees collection
    console.log('Creating indexes for NewJoinees...');
    await db.collection('newjoinees').createIndex({ userId: 1 }, { unique: true });
    await db.collection('newjoinees').createIndex({ companyId: 1, isActive: 1, startDate: -1 });

    // Create indexes for Companies collection
    console.log('Creating indexes for Companies...');
    await db.collection('companies').createIndex({ code: 1 }, { unique: true });
    await db.collection('companies').createIndex({ name: 1 }, { unique: true });

    // Create indexes for Departments collection
    console.log('Creating indexes for Departments...');
    await db.collection('departments').createIndex({ companyId: 1, code: 1 }, { unique: true });

    // Create indexes for Leaderboards collection
    console.log('Creating indexes for Leaderboards...');
    await db.collection('leaderboards').createIndex({ companyId: 1, period: 1 }, { unique: true });

    console.log('Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
