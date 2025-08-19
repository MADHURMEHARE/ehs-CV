const mongoose = require('mongoose');

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

// Initialize database with proper data
const initDatabase = async () => {
  try {
    console.log('🚀 Initializing database...');
    
    // Connect to database
    const connected = await connectDB();
    if (!connected) {
      process.exit(1);
    }

    // Get database instance
    const db = mongoose.connection.db;
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.collection('users').deleteMany({});
    await db.collection('cvs').deleteMany({});
    await db.collection('registrations').deleteMany({});
    await db.collection('embeddings').deleteMany({});
    console.log('✅ All collections cleared');

    // Create proper user documents
    console.log('👥 Creating sample users...');
    const usersData = [
      {
        email: 'admin@ehs.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user@ehs.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        isActive: true,
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'reviewer@ehs.com',
        firstName: 'Jane',
        lastName: 'Reviewer',
        role: 'reviewer',
        isActive: true,
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const usersResult = await db.collection('users').insertMany(usersData);
    console.log(`✅ Created ${usersResult.insertedCount} users`);

    // Create sample CV data
    console.log('📄 Creating sample CVs...');
    const cvData = [
      {
        userId: usersResult.insertedIds[1], // John Doe's CV
        originalFileName: 'john-doe-cv.pdf',
        originalFileUrl: '/uploads/john-doe-cv.pdf',
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
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const cvResult = await db.collection('cvs').insertMany(cvData);
    console.log(`✅ Created ${cvResult.insertedCount} CVs`);

    // Create sample registration data
    console.log('📝 Creating sample registrations...');
    const registrationData = [
      {
        userId: usersResult.insertedIds[2], // Jane Reviewer's registration
        formData: {
          title: 'Ms',
          firstName: 'Jane',
          lastName: 'Reviewer',
          email: 'jane.reviewer@example.com',
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
        submittedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const registrationResult = await db.collection('registrations').insertMany(registrationData);
    console.log(`✅ Created ${registrationResult.insertedCount} registrations`);

    // Create indexes
    console.log('🔍 Creating indexes...');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1, isActive: 1 });
    await db.collection('cvs').createIndex({ userId: 1 });
    await db.collection('cvs').createIndex({ status: 1 });
    await db.collection('registrations').createIndex({ userId: 1 });
    console.log('✅ Indexes created');

    // Display summary
    console.log('\n📊 Database Initialization Summary:');
    console.log('====================================');
    
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
    
    console.log('\n🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the initialization
initDatabase();

