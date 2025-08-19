const mongoose = require('mongoose');
require('dotenv').config();

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ehs_cv_formatter';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    return false;
  }
};

// Sample user data
const sampleUsers = [
  {
    email: 'admin@ehs.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isActive: true,
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // password
  },
  {
    email: 'user@ehs.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    isActive: true,
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // password
  },
  {
    email: 'reviewer@ehs.com',
    firstName: 'Jane',
    lastName: 'Reviewer',
    role: 'reviewer',
    isActive: true,
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // password
  }
];

// Sample CV data
const sampleCVs = [
  {
    userId: null, // Will be set after user creation
    originalFileName: 'sample-cv-1.pdf',
    originalFileUrl: '/uploads/sample-cv-1.pdf',
    status: 'uploaded',
    registrationForm: {
      title: 'Mr',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+44 123 456 7890',
      jobTitle: 'Software Developer',
      desiredSalary: '£45,000',
      nationality: 'British',
      languages: 'English, Spanish',
      currentDBS: 'Yes, I have a current DBS',
      drivingLicence: 'Yes, I have a driving licence',
      preferredLocation: 'London',
      noticePeriod: '2 weeks',
      certified: true,
      dated: new Date().toISOString().split('T')[0]
    },
    processedData: {
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        jobTitle: 'Software Developer',
        nationality: 'British',
        dateOfBirth: '1990-05-15',
        maritalStatus: 'Single'
      },
      profile: 'Experienced software developer with 5+ years in web development',
      experience: [
        {
          id: '1',
          company: 'Tech Corp',
          position: 'Senior Developer',
          startDate: '2020-01',
          endDate: '2023-12',
          current: false,
          description: ['Led development team of 5 developers', 'Implemented CI/CD pipeline']
        }
      ],
      education: [
        {
          id: '1',
          institution: 'University of London',
          degree: 'BSc Computer Science',
          field: 'Computer Science',
          startDate: '2015-09',
          endDate: '2018-06'
        }
      ],
      skills: ['JavaScript', 'React', 'Node.js', 'Python'],
      interests: ['Coding', 'Reading', 'Travel'],
      languages: ['English', 'Spanish']
    }
  }
];

// Sample registration data
const sampleRegistrations = [
  {
    userId: null, // Will be set after user creation
    formData: {
      title: 'Ms',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+44 987 654 3210',
      jobTitle: 'Healthcare Assistant',
      desiredSalary: '£25,000',
      nationality: 'British',
      languages: 'English',
      currentDBS: 'Yes, I have a current DBS',
      drivingLicence: 'No, I don\'t have a driving licence',
      preferredLocation: 'Manchester',
      noticePeriod: '1 week',
      certified: true,
      dated: new Date().toISOString().split('T')[0]
    },
    submittedAt: new Date()
  }
];

// Setup database collections and sample data
const setupDatabase = async () => {
  try {
    console.log('🚀 Starting database setup...');
    
    // Connect to database
    const connected = await connectDB();
    if (!connected) {
      process.exit(1);
    }

    // Get database instance
    const db = mongoose.connection.db;
    
    // Create collections if they don't exist
    console.log('📋 Creating collections...');
    
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    if (!collectionNames.includes('users')) {
      await db.createCollection('users');
      console.log('✅ Created users collection');
    }
    
    if (!collectionNames.includes('cvs')) {
      await db.createCollection('cvs');
      console.log('✅ Created cvs collection');
    }
    
    if (!collectionNames.includes('registrations')) {
      await db.createCollection('registrations');
      console.log('✅ Created registrations collection');
    }

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.collection('users').deleteMany({});
    await db.collection('cvs').deleteMany({});
    await db.collection('registrations').deleteMany({});

    // Insert sample users
    console.log('👥 Inserting sample users...');
    const UserModel = mongoose.model('User', new mongoose.Schema({}));
    const insertedUsers = await UserModel.insertMany(sampleUsers);
    console.log(`✅ Inserted ${insertedUsers.length} users`);

    // Insert sample CVs with proper user IDs
    console.log('📄 Inserting sample CVs...');
    const CVModel = mongoose.model('CV', new mongoose.Schema({}));
    const sampleCVsWithUsers = sampleCVs.map((cv, index) => ({
      ...cv,
      userId: insertedUsers[index % insertedUsers.length]._id
    }));
    const insertedCVs = await CVModel.insertMany(sampleCVsWithUsers);
    console.log(`✅ Inserted ${insertedCVs.length} CVs`);

    // Insert sample registrations with proper user IDs
    console.log('📝 Inserting sample registrations...');
    const RegistrationModel = mongoose.model('Registration', new mongoose.Schema({}));
    const sampleRegistrationsWithUsers = sampleRegistrations.map((reg, index) => ({
      ...reg,
      userId: insertedUsers[index % insertedUsers.length]._id
    }));
    const insertedRegistrations = await RegistrationModel.insertMany(sampleRegistrationsWithUsers);
    console.log(`✅ Inserted ${insertedRegistrations.length} registrations`);

    // Create indexes
    console.log('🔍 Creating indexes...');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1, isActive: 1 });
    await db.collection('cvs').createIndex({ userId: 1 });
    await db.collection('cvs').createIndex({ status: 1 });
    await db.collection('registrations').createIndex({ userId: 1 });
    console.log('✅ Indexes created');

    // Display sample data
    console.log('\n📊 Sample Data Summary:');
    console.log('========================');
    
    const userCount = await db.collection('users').countDocuments();
    const cvCount = await db.collection('cvs').countDocuments();
    const registrationCount = await db.collection('registrations').countDocuments();
    
    console.log(`👥 Users: ${userCount}`);
    console.log(`📄 CVs: ${cvCount}`);
    console.log(`📝 Registrations: ${registrationCount}`);
    
    console.log('\n🔑 Sample Login Credentials:');
    console.log('============================');
    console.log('Admin: admin@ehs.com / password');
    console.log('User: user@ehs.com / password');
    console.log('Reviewer: reviewer@ehs.com / password');
    
    console.log('\n🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the setup
setupDatabase();

