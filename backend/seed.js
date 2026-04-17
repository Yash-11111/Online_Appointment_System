
require('dotenv').config();
const mongoose = require('mongoose');

    // ─── Models 
const User       = require('./models/User');
const Department = require('./models/Department');
const Doctor     = require('./models/Doctor');
const Slot       = require('./models/Slot');

// ─── Seed Data 

const ADMIN = {
  name:     'Super Admin',
  email:    'admin@hospital.com',
  password: 'Admin@1234',
  role:     'admin',
  phone:    '9999999999',
  gender:   'other',
};

const DEPARTMENTS = [
  { name: 'Cardiology',       description: 'Heart and cardiovascular system disorders' },
  { name: 'Neurology',        description: 'Brain, spine, and nervous system conditions' },
  { name: 'Orthopedics',      description: 'Bones, joints, ligaments, and muscles' },
  { name: 'Dermatology',      description: 'Skin, hair, and nail diseases' },
  { name: 'Pediatrics',       description: 'Medical care for infants, children, and adolescents' },
  { name: 'General Medicine', description: 'Diagnosis and treatment of common illnesses' },
  { name: 'Gynecology',       description: 'Female reproductive health and obstetrics' },
  { name: 'Ophthalmology',    description: 'Eye care and vision disorders' },
];

const DOCTORS = [
  {
    name: 'Dr. Arjun Sharma',    email: 'arjun.sharma@hospital.com',
    password: 'Doctor@1234', phone: '9811111111', gender: 'male',
    deptName: 'Cardiology',       specialization: 'Interventional Cardiology',
    experience: 12, qualifications: ['MBBS', 'MD', 'DM Cardiology'],
    consultationFee: 800,
    bio: 'Expert in angioplasty and cardiac catheterization with 12+ years experience.',
  },
  {
    name: 'Dr. Priya Nair',       email: 'priya.nair@hospital.com',
    password: 'Doctor@1234', phone: '9822222222', gender: 'female',
    deptName: 'Neurology',        specialization: 'Epilepsy & Stroke',
    experience: 9, qualifications: ['MBBS', 'MD Neurology'],
    consultationFee: 700,
    bio: 'Specializes in epilepsy management and stroke rehabilitation.',
  },
  {
    name: 'Dr. Rakesh Gupta',     email: 'rakesh.gupta@hospital.com',
    password: 'Doctor@1234', phone: '9833333333', gender: 'male',
    deptName: 'Orthopedics',      specialization: 'Joint Replacement',
    experience: 15, qualifications: ['MBBS', 'MS Ortho', 'Fellowship Joint Replacement'],
    consultationFee: 900,
    bio: 'Pioneer in minimally invasive joint replacement surgeries.',
  },
  {
    name: 'Dr. Sneha Kulkarni',   email: 'sneha.kulkarni@hospital.com',
    password: 'Doctor@1234', phone: '9844444444', gender: 'female',
    deptName: 'Dermatology',      specialization: 'Cosmetic & Clinical Dermatology',
    experience: 7, qualifications: ['MBBS', 'MD Dermatology'],
    consultationFee: 600,
    bio: 'Expert in acne, psoriasis, and cosmetic procedures.',
  },
  {
    name: 'Dr. Vivek Mehta',      email: 'vivek.mehta@hospital.com',
    password: 'Doctor@1234', phone: '9855555555', gender: 'male',
    deptName: 'Pediatrics',       specialization: 'Neonatology',
    experience: 10, qualifications: ['MBBS', 'MD Pediatrics', 'Fellowship NICU'],
    consultationFee: 500,
    bio: 'Dedicated to newborn and infant care with a focus on NICU management.',
  },
  {
    name: 'Dr. Anita Verma',      email: 'anita.verma@hospital.com',
    password: 'Doctor@1234', phone: '9866666666', gender: 'female',
    deptName: 'General Medicine', specialization: 'Internal Medicine',
    experience: 8, qualifications: ['MBBS', 'MD General Medicine'],
    consultationFee: 400,
    bio: 'Comprehensive care for adult patients with a focus on preventive medicine.',
  },
  {
    name: 'Dr. Suman Roy',        email: 'suman.roy@hospital.com',
    password: 'Doctor@1234', phone: '9877777777', gender: 'female',
    deptName: 'Gynecology',       specialization: 'High-Risk Pregnancy',
    experience: 11, qualifications: ['MBBS', 'MS Gynecology & Obstetrics'],
    consultationFee: 700,
    bio: 'Specialist in high-risk pregnancies and laparoscopic gynecological surgeries.',
  },
  {
    name: 'Dr. Farhan Khan',      email: 'farhan.khan@hospital.com',
    password: 'Doctor@1234', phone: '9888888888', gender: 'male',
    deptName: 'Ophthalmology',    specialization: 'Retina & Vitreous',
    experience: 6, qualifications: ['MBBS', 'MS Ophthalmology', 'Fellowship Vitreoretinal Surgery'],
    consultationFee: 650,
    bio: 'Specializes in diabetic retinopathy, macular degeneration, and retinal surgery.',
  },
];

// ─── Slot helpers ─────────────────────────────────────────────────────────────

function generateTimeSlots(startHour, endHour) {
  const slots = [];
  for (let h = startHour; h < endHour; h++) {
    for (const m of [0, 30]) {
      const start  = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
      const endMin = m + 30;
      const endH   = endMin >= 60 ? h + 1 : h;
      const end    = `${String(endH).padStart(2,'0')}:${String(endMin % 60).padStart(2,'0')}`;
      slots.push({ startTime: start, endTime: end });
    }
  }
  return slots;
}

function nextNDates(n = 7) {
  const dates = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect("mongodb://127.0.0.1:27017/hospitalDB");
  console.log('  Connected to MongoDB\n');

  // ── 1. Admin ──────────────────────────────────────────────────────────────
  let admin = await User.findOne({ email: ADMIN.email });
  if (admin) {
    console.log(`  Admin already exists  →  ${ADMIN.email}`);
  } else {
    admin = await User.create(ADMIN);
    console.log(`  Admin created          →  ${ADMIN.email}  /  password: ${ADMIN.password}`);
  }

  // ── 2. Departments ────────────────────────────────────────────────────────
  const deptMap = {};
  for (const d of DEPARTMENTS) {
    let dept = await Department.findOne({ name: d.name });
    if (!dept) {
      dept = await Department.create(d);
      console.log(`  Department created     →  ${d.name}`);
    } else {
      console.log(`   Dept already exists   →  ${d.name}`);
    }
    deptMap[d.name] = dept._id;
  }

  // ── 3. Doctors ────────────────────────────────────────────────────────────
  const doctorIds = [];
  for (const d of DOCTORS) {
    let userDoc = await User.findOne({ email: d.email });
    if (userDoc) {
      console.log(`ℹ  Doctor already exists →  ${d.email}`);
      const existing = await Doctor.findOne({ user: userDoc._id });
      if (existing) doctorIds.push(existing._id);
      continue;
    }

    const { deptName, specialization, experience, qualifications, consultationFee, bio, ...userFields } = d;
    const user   = await User.create({ ...userFields, role: 'doctor' });
    const doctor = await Doctor.create({
      user: user._id,
      department: deptMap[deptName],
      specialization, experience,
      qualifications, consultationFee, bio,
    });
    doctorIds.push(doctor._id);
    console.log(`  Doctor created         →  ${d.name}  (${deptName})`);
  }

  // ── 4. Slots ──────────────────────────────────────────────────────────────
  console.log('\n⏰  Generating slots for the next 7 days...');

  const dates     = nextNDates(7);
  const timePairs = [
    ...generateTimeSlots(9, 13),   // 09:00–13:00 (8 slots)
    ...generateTimeSlots(17, 20),  // 17:00–20:00 (6 slots)
  ];

  let slotCount = 0;
  for (const doctorId of doctorIds) {
    for (const date of dates) {
      const toInsert = timePairs.map(t => ({
        doctor:    doctorId,
        date,
        startTime: t.startTime,
        endTime:   t.endTime,
        isBooked:  false,
        isActive:  true,
      }));

      try {
        const result = await Slot.insertMany(toInsert, { ordered: false });
        slotCount += result.length;
      } catch (err) {
        if (err.code === 11000 || err.writeErrors) {
          // Partial insert — some already existed, count what was inserted
          const inserted = err.insertedDocs ? err.insertedDocs.length : 0;
          slotCount += inserted;
        } else {
          throw err;
        }
      }
    }
  }

  console.log(`  Slots seeded           →  ${slotCount} new slot(s) across ${doctorIds.length} doctor(s)`);

  console.log('\n🎉  Seeding complete!\n');
  console.log('─────────────────────────────────────────────────────────');
  console.log('  Admin login');
  console.log('  Email   : admin@hospital.com');
  console.log('  Password: Admin@1234');
  console.log('─────────────────────────────────────────────────────────');
  console.log('  All doctor passwords: Doctor@1234');
  console.log('─────────────────────────────────────────────────────────');
  console.log('  Slots: 09:00–13:00 & 17:00–20:00 (30-min) × 7 days');
  console.log('─────────────────────────────────────────────────────────\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('  Seed failed:', err.message);
  process.exit(1);
});
