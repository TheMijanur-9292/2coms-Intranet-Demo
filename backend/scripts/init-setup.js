/**
 * Database Seed Script
 * Run: npm run seed
 * Creates initial company, department, and admin/employee users.
 */

require('dotenv').config();

// Register ts-node to allow direct TypeScript model imports
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'commonjs' },
});

const mongoose = require('mongoose');

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌  MONGODB_URI is not set in .env');
    process.exit(1);
  }

  console.log('🔌  Connecting to MongoDB...');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log('✅  Connected to MongoDB:', mongoose.connection.host);

  const User = require('../src/models/User').default;
  const Company = require('../src/models/Company').default;
  const Department = require('../src/models/Department').default;

  // ─── Company ────────────────────────────────────────────────────────────
  let company = await Company.findOne({ code: '2COMS' });
  if (!company) {
    company = await Company.create({
      name: '2COMS Group',
      code: '2COMS',
      domain: '2coms.com',
      description: 'Leading HR and staffing solutions company',
      settings: {
        allowCrossCompanyView: false,
        moderationRequired: true,
        gamificationEnabled: true,
        allowPublicAnnouncements: false,
        maxFileUploadSize: 10,
      },
      subscription: { plan: 'enterprise', maxUsers: 1000, isActive: true },
    });
    console.log('✅  Company created:', company.name);
  } else {
    console.log('ℹ️   Company already exists:', company.name);
  }

  // ─── Department ─────────────────────────────────────────────────────────
  let department = await Department.findOne({ companyId: company._id, code: 'HR' });
  if (!department) {
    department = await Department.create({
      name: 'Human Resources',
      code: 'HR',
      companyId: company._id,
      description: 'HR and People Operations',
      isActive: true,
      memberCount: 0,
    });
    console.log('✅  Department created:', department.name);
  } else {
    console.log('ℹ️   Department already exists:', department.name);
  }

  // ─── Admin user ─────────────────────────────────────────────────────────
  const adminEmail = 'admin@2coms.com';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      email: adminEmail,
      password: 'Admin123!',
      firstName: 'Admin',
      lastName: 'User',
      displayName: 'Admin User',
      employeeId: 'EMP001',
      companyId: company._id,
      departmentId: department._id,
      designation: 'System Administrator',
      role: 'admin',
      isActive: true,
    });
    console.log('✅  Admin user created:', admin.email);
  } else {
    console.log('ℹ️   Admin user already exists:', admin.email);
  }

  // ─── HR user ─────────────────────────────────────────────────────────────
  const hrEmail = 'hr@2coms.com';
  let hr = await User.findOne({ email: hrEmail });
  if (!hr) {
    hr = await User.create({
      email: hrEmail,
      password: 'HrAdmin123!',
      firstName: 'HR',
      lastName: 'Manager',
      displayName: 'HR Manager',
      employeeId: 'EMP002',
      companyId: company._id,
      departmentId: department._id,
      designation: 'HR Manager',
      role: 'hr',
      isActive: true,
    });
    console.log('✅  HR user created:', hr.email);
  } else {
    console.log('ℹ️   HR user already exists:', hr.email);
  }

  // ─── Employee user ───────────────────────────────────────────────────────
  const empEmail = 'employee@2coms.com';
  let emp = await User.findOne({ email: empEmail });
  if (!emp) {
    emp = await User.create({
      email: empEmail,
      password: 'Employee123!',
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'John Doe',
      employeeId: 'EMP003',
      companyId: company._id,
      departmentId: department._id,
      designation: 'Software Engineer',
      role: 'employee',
      isActive: true,
    });
    console.log('✅  Employee user created:', emp.email);
  } else {
    console.log('ℹ️   Employee user already exists:', emp.email);
  }

  console.log('\n🎉  Seed complete!\n');
  console.log('─'.repeat(50));
  console.log('Login credentials:');
  console.log('  Admin    → admin@2coms.com    / Admin123!');
  console.log('  HR       → hr@2coms.com       / HrAdmin123!');
  console.log('  Employee → employee@2coms.com / Employee123!');
  console.log('─'.repeat(50));

  await mongoose.connection.close();
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err.message);
  process.exit(1);
});
