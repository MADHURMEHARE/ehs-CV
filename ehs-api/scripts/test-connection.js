const mongoose = require('mongoose');

// Test database connection
const testConnection = async () => {
  try {
    console.log('🔍 Testing MongoDB connection...');
    
    // Try to connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ehs_cv_formatter';
    console.log(`📍 Connecting to: ${mongoURI}`);
    
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully!');
    
    // Get database info
    const db = mongoose.connection.db;
    const adminDb = db.admin();
    
    // Get database stats
    const stats = await db.stats();
    console.log('\n📊 Database Information:');
    console.log('========================');
    console.log(`Database: ${stats.db}`);
    console.log(`Collections: ${stats.collections}`);
    console.log(`Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📋 Collections:');
    console.log('===============');
    
    if (collections.length === 0) {
      console.log('❌ No collections found');
    } else {
      collections.forEach((col, index) => {
        console.log(`${index + 1}. ${col.name}`);
      });
    }
    
    // Test each collection
    console.log('\n🧪 Testing Collections:');
    console.log('========================');
    
    for (const collection of collections) {
      try {
        const count = await db.collection(collection.name).countDocuments();
        console.log(`✅ ${collection.name}: ${count} documents`);
      } catch (error) {
        console.log(`❌ ${collection.name}: Error - ${error.message}`);
      }
    }
    
    // Show sample data if available
    if (collections.length > 0) {
      console.log('\n📄 Sample Data Preview:');
      console.log('=========================');
      
      for (const collection of collections.slice(0, 3)) { // Show first 3 collections
        try {
          const sample = await db.collection(collection.name).findOne();
          if (sample) {
            console.log(`\n${collection.name.toUpperCase()}:`);
            console.log(JSON.stringify(sample, null, 2).substring(0, 300) + '...');
          } else {
            console.log(`\n${collection.name.toUpperCase()}: No documents found`);
          }
        } catch (error) {
          console.log(`\n${collection.name.toUpperCase()}: Error reading data`);
        }
      }
    }
    
    console.log('\n🎉 Database connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    
    if (error.name === 'MongoNetworkError') {
      console.log('\n💡 Troubleshooting Tips:');
      console.log('==========================');
      console.log('1. Make sure MongoDB is running');
      console.log('2. Check if MongoDB is installed');
      console.log('3. Verify the connection string');
      console.log('4. Check firewall settings');
    }
    
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
    }
    process.exit(0);
  }
};

// Run the test
testConnection();

