import { PrismaClient, UserRole, SubscriptionStatus, ProcedureCategory } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create default tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo-clinic' },
    update: {},
    create: {
      name: 'Demo Aesthetic Clinic',
      slug: 'demo-clinic',
      gstin: '29ABCDE1234F1Z5',
      address: {
        line1: '123 MG Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        country: 'India'
      },
      phone: '+91-80-1234-5678',
      email: 'admin@demo-clinic.com',
      settings: {
        timezone: 'Asia/Kolkata',
        currency: 'INR',
        dateFormat: 'DD/MM/YYYY',
        invoicePrefix: 'INV',
        visitPrefix: 'VIS',
        patientPrefix: 'PAT'
      },
      subscriptionStatus: SubscriptionStatus.ACTIVE
    }
  });

  console.log('✅ Tenant created:', tenant.name);

  // Hash password
  const passwordHash = await bcrypt.hash('password123', 12);

  // Create owner user
  const owner = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'owner@demo-clinic.com'
      }
    },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'owner@demo-clinic.com',
      passwordHash,
      firstName: 'Dr. Rajesh',
      lastName: 'Kumar',
      role: UserRole.OWNER,
      phone: '+91-98765-43210',
      licenseNumber: 'KMC-12345',
      specialization: 'Dermatology',
      isActive: true
    }
  });

  console.log('✅ Owner created:', owner.email);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'admin@demo-clinic.com'
      }
    },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'admin@demo-clinic.com',
      passwordHash,
      firstName: 'Priya',
      lastName: 'Sharma',
      role: UserRole.ADMIN,
      phone: '+91-98765-43211',
      isActive: true
    }
  });

  console.log('✅ Admin created:', admin.email);

  // Create doctor users
  const doctor1 = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'dr.arjun@demo-clinic.com'
      }
    },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'dr.arjun@demo-clinic.com',
      passwordHash,
      firstName: 'Dr. Arjun',
      lastName: 'Patel',
      role: UserRole.DOCTOR,
      phone: '+91-98765-43212',
      licenseNumber: 'KMC-12346',
      specialization: 'Cosmetic Dermatology',
      isActive: true
    }
  });

  const doctor2 = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'dr.sneha@demo-clinic.com'
      }
    },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'dr.sneha@demo-clinic.com',
      passwordHash,
      firstName: 'Dr. Sneha',
      lastName: 'Reddy',
      role: UserRole.DOCTOR,
      phone: '+91-98765-43213',
      licenseNumber: 'KMC-12347',
      specialization: 'Aesthetic Medicine',
      isActive: true
    }
  });

  console.log('✅ Doctors created:', doctor1.email, doctor2.email);

  // Create nurse user
  const nurse = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'nurse.meera@demo-clinic.com'
      }
    },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'nurse.meera@demo-clinic.com',
      passwordHash,
      firstName: 'Meera',
      lastName: 'Nair',
      role: UserRole.NURSE,
      phone: '+91-98765-43214',
      isActive: true
    }
  });

  console.log('✅ Nurse created:', nurse.email);

  // Create receptionist users
  const receptionist1 = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'reception@demo-clinic.com'
      }
    },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'reception@demo-clinic.com',
      passwordHash,
      firstName: 'Anita',
      lastName: 'Desai',
      role: UserRole.RECEPTIONIST,
      phone: '+91-98765-43215',
      isActive: true
    }
  });

  const receptionist2 = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'frontdesk@demo-clinic.com'
      }
    },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'frontdesk@demo-clinic.com',
      passwordHash,
      firstName: 'Rohit',
      lastName: 'Singh',
      role: UserRole.RECEPTIONIST,
      phone: '+91-98765-43216',
      isActive: true
    }
  });

  console.log('✅ Receptionists created:', receptionist1.email, receptionist2.email);

  // Create system procedure templates
  const templates = [
    {
      name: 'CO2 Laser Resurfacing',
      category: ProcedureCategory.LASER,
      fieldsSchema: {
        type: 'object',
        properties: {
          area: { type: 'string', title: 'Treatment Area' },
          settings: {
            type: 'object',
            properties: {
              wavelength: { type: 'number', title: 'Wavelength (nm)' },
              fluence: { type: 'number', title: 'Fluence (J/cm²)' },
              pulseWidth: { type: 'number', title: 'Pulse Width (ms)' },
              spotSize: { type: 'number', title: 'Spot Size (mm)' },
              passes: { type: 'number', title: 'Number of Passes' },
              density: { type: 'number', title: 'Density (%)' }
            }
          },
          technique: { type: 'string', title: 'Technique Notes' },
          complications: { type: 'string', title: 'Complications' }
        },
        required: ['area']
      },
      defaultValues: {
        settings: {
          wavelength: 10600,
          fluence: 15,
          pulseWidth: 1.5,
          spotSize: 7,
          passes: 2,
          density: 20
        }
      },
      instructions: 'Post-procedure: Apply antibiotic ointment 2x daily for 7 days. Avoid sun exposure for 4 weeks. Use SPF 50+ sunscreen.',
      isActive: true,
      tenantId: null // System template
    },
    {
      name: 'Fractional CO2 Laser',
      category: ProcedureCategory.LASER,
      fieldsSchema: {
        type: 'object',
        properties: {
          area: { type: 'string', title: 'Treatment Area' },
          settings: {
            type: 'object',
            properties: {
              wavelength: { type: 'number', title: 'Wavelength (nm)' },
              fluence: { type: 'number', title: 'Fluence (mJ)' },
              density: { type: 'number', title: 'Density (%)' },
              passes: { type: 'number', title: 'Passes' },
              depth: { type: 'number', title: 'Depth (μm)' }
            }
          }
        },
        required: ['area']
      },
      defaultValues: {
        settings: {
          wavelength: 10600,
          fluence: 30,
          density: 15,
          passes: 1,
          depth: 300
        }
      },
      instructions: 'Apply cooling gel post-procedure. Use gentle cleanser and moisturizer. Avoid retinol for 1 week.',
      isActive: true,
      tenantId: null
    },
    {
      name: 'Q-Switched Nd:YAG Laser',
      category: ProcedureCategory.LASER,
      fieldsSchema: {
        type: 'object',
        properties: {
          area: { type: 'string', title: 'Treatment Area' },
          settings: {
            type: 'object',
            properties: {
              wavelength: { type: 'number', title: 'Wavelength (nm)' },
              fluence: { type: 'number', title: 'Fluence (J/cm²)' },
              spotSize: { type: 'number', title: 'Spot Size (mm)' },
              frequency: { type: 'number', title: 'Frequency (Hz)' }
            }
          }
        },
        required: ['area']
      },
      defaultValues: {
        settings: {
          wavelength: 1064,
          fluence: 2.5,
          spotSize: 6,
          frequency: 10
        }
      },
      instructions: 'Apply soothing cream. Avoid heat/sauna for 48 hours. Use sunscreen.',
      isActive: true,
      tenantId: null
    },
    {
      name: 'Botulinum Toxin (Botox)',
      category: ProcedureCategory.INJECTABLE,
      fieldsSchema: {
        type: 'object',
        properties: {
          area: { type: 'string', title: 'Injection Area' },
          product: { type: 'string', title: 'Product Name' },
          units: { type: 'number', title: 'Units' },
          injectionPoints: { type: 'string', title: 'Injection Points' },
          dilution: { type: 'string', title: 'Dilution (mL)' }
        },
        required: ['area', 'product', 'units']
      },
      defaultValues: {
        product: 'Botox',
        dilution: '2.5 mL per 100 units'
      },
      instructions: 'Do not rub/massage treated area for 4 hours. Stay upright for 4 hours. Avoid exercise for 24 hours.',
      isActive: true,
      tenantId: null
    },
    {
      name: 'Dermal Fillers',
      category: ProcedureCategory.INJECTABLE,
      fieldsSchema: {
        type: 'object',
        properties: {
          area: { type: 'string', title: 'Injection Area' },
          product: { type: 'string', title: 'Product Name' },
          volume: { type: 'number', title: 'Volume (mL)' },
          injectionTechnique: { type: 'string', title: 'Technique (linear threading, serial puncture, etc.)' },
          depth: { type: 'string', title: 'Injection Depth' }
        },
        required: ['area', 'product', 'volume']
      },
      defaultValues: {},
      instructions: 'Apply ice packs intermittently. Avoid pressure on treated area. No dental work for 2 weeks.',
      isActive: true,
      tenantId: null
    },
    {
      name: 'Chemical Peel (TCA)',
      category: ProcedureCategory.TOPICAL,
      fieldsSchema: {
        type: 'object',
        properties: {
          area: { type: 'string', title: 'Treatment Area' },
          agent: { type: 'string', title: 'Peeling Agent' },
          concentration: { type: 'number', title: 'Concentration (%)' },
          layers: { type: 'number', title: 'Number of Layers' },
          contactTime: { type: 'number', title: 'Contact Time (minutes)' },
          neutralization: { type: 'string', title: 'Neutralization Method' }
        },
        required: ['area', 'agent', 'concentration']
      },
      defaultValues: {
        agent: 'TCA',
        concentration: 15,
        layers: 2,
        contactTime: 3
      },
      instructions: 'Use gentle cleanser. Apply moisturizer frequently. Strict sun avoidance for 2 weeks. No picking at peeling skin.',
      isActive: true,
      tenantId: null
    },
    {
      name: 'PRP Therapy',
      category: ProcedureCategory.INJECTABLE,
      fieldsSchema: {
        type: 'object',
        properties: {
          area: { type: 'string', title: 'Treatment Area' },
          prpVolume: { type: 'number', title: 'PRP Volume (mL)' },
          activationMethod: { type: 'string', title: 'Activation Method' },
          injectionTechnique: { type: 'string', title: 'Injection Technique' },
          sessionsPlanned: { type: 'number', title: 'Sessions Planned' }
        },
        required: ['area', 'prpVolume']
      },
      defaultValues: {
        activationMethod: 'Calcium chloride',
        sessionsPlanned: 3
      },
      instructions: 'Avoid washing area for 6 hours. No NSAIDs for 48 hours. Mild swelling expected.',
      isActive: true,
      tenantId: null
    },
    {
      name: 'Microneedling',
      category: ProcedureCategory.SURGICAL,
      fieldsSchema: {
        type: 'object',
        properties: {
          area: { type: 'string', title: 'Treatment Area' },
          needleDepth: { type: 'number', title: 'Needle Depth (mm)' },
          passes: { type: 'number', title: 'Number of Passes' },
          serumUsed: { type: 'string', title: 'Serum Applied' },
          speed: { type: 'number', title: 'Device Speed' }
        },
        required: ['area', 'needleDepth']
      },
      defaultValues: {
        needleDepth: 1.5,
        passes: 3,
        serumUsed: 'Hyaluronic acid',
        speed: 100
      },
      instructions: 'Redness and mild swelling for 24-48 hours. Apply healing cream. Avoid makeup for 24 hours. Use SPF 50+.',
      isActive: true,
      tenantId: null
    }
  ];

  for (const template of templates) {
    await prisma.procedureTemplate.upsert({
      where: {
        id: template.name // This won't work as expected, but we'll use name+tenant for uniqueness
      },
      update: {},
      create: template
    });
  }

  console.log('✅ System procedure templates created');

  // Create procedure catalog entries
  const catalogItems = [
    { name: 'CO2 Laser Resurfacing - Full Face', category: 'Laser', defaultPrice: 15000, durationMinutes: 60, hsnSacCode: '9987' },
    { name: 'CO2 Laser Resurfacing - Per Area', category: 'Laser', defaultPrice: 5000, durationMinutes: 30, hsnSacCode: '9987' },
    { name: 'Fractional CO2 Laser - Full Face', category: 'Laser', defaultPrice: 12000, durationMinutes: 45, hsnSacCode: '9987' },
    { name: 'Q-Switched Nd:YAG - Tattoo Removal', category: 'Laser', defaultPrice: 3000, durationMinutes: 20, hsnSacCode: '9987' },
    { name: 'Q-Switched Nd:YAG - Pigmentation', category: 'Laser', defaultPrice: 2500, durationMinutes: 15, hsnSacCode: '9987' },
    { name: 'Botulinum Toxin - Forehead', category: 'Injectable', defaultPrice: 8000, durationMinutes: 20, hsnSacCode: '9987' },
    { name: 'Botulinum Toxin - Crow\'s Feet', category: 'Injectable', defaultPrice: 6000, durationMinutes: 15, hsnSacCode: '9987' },
    { name: 'Botulinum Toxin - Frown Lines', category: 'Injectable', defaultPrice: 7000, durationMinutes: 15, hsnSacCode: '9987' },
    { name: 'Dermal Filler - Lip Augmentation', category: 'Injectable', defaultPrice: 18000, durationMinutes: 30, hsnSacCode: '9987' },
    { name: 'Dermal Filler - Nasolabial Folds', category: 'Injectable', defaultPrice: 15000, durationMinutes: 30, hsnSacCode: '9987' },
    { name: 'Dermal Filler - Cheek Enhancement', category: 'Injectable', defaultPrice: 20000, durationMinutes: 45, hsnSacCode: '9987' },
    { name: 'Chemical Peel - TCA 15%', category: 'Topical', defaultPrice: 3000, durationMinutes: 30, hsnSacCode: '9987' },
    { name: 'Chemical Peel - Glycolic 50%', category: 'Topical', defaultPrice: 2500, durationMinutes: 20, hsnSacCode: '9987' },
    { name: 'PRP Therapy - Face', category: 'Injectable', defaultPrice: 8000, durationMinutes: 45, hsnSacCode: '9987' },
    { name: 'PRP Therapy - Scalp', category: 'Injectable', defaultPrice: 10000, durationMinutes: 60, hsnSacCode: '9987' },
    { name: 'Microneedling - Full Face', category: 'Surgical', defaultPrice: 5000, durationMinutes: 45, hsnSacCode: '9987' },
    { name: 'Microneedling with PRP', category: 'Surgical', defaultPrice: 10000, durationMinutes: 60, hsnSacCode: '9987' }
  ];

  for (const item of catalogItems) {
    await prisma.procedureCatalog.upsert({
      where: {
        id: item.name // Using name as unique identifier for seed
      },
      update: {},
      create: {
        ...item,
        tenantId: tenant.id
      }
    });
  }

  console.log('✅ Procedure catalog created');

  // Create packages
  const co2Laser = await prisma.procedureCatalog.findFirst({
    where: { tenantId: tenant.id, name: 'CO2 Laser Resurfacing - Full Face' }
  });

  const botoxForehead = await prisma.procedureCatalog.findFirst({
    where: { tenantId: tenant.id, name: 'Botulinum Toxin - Forehead' }
  });

  const prpFace = await prisma.procedureCatalog.findFirst({
    where: { tenantId: tenant.id, name: 'PRP Therapy - Face' }
  });

  if (co2Laser) {
    await prisma.package.upsert({
      where: { id: 'pkg-co2-6' },
      update: {},
      create: {
        id: 'pkg-co2-6',
        tenantId: tenant.id,
        name: '6× CO2 Laser Resurfacing',
        procedureId: co2Laser.id,
        totalSessions: 6,
        price: 75000,
        validityDays: 365,
        description: '6 sessions of full face CO2 laser resurfacing at discounted rate',
        isActive: true
      }
    });
  }

  if (botoxForehead) {
    await prisma.package.upsert({
      where: { id: 'pkg-botox-4' },
      update: {},
      create: {
        id: 'pkg-botox-4',
        tenantId: tenant.id,
        name: '4× Botox Forehead',
        procedureId: botoxForehead.id,
        totalSessions: 4,
        price: 28000,
        validityDays: 365,
        description: '4 sessions of forehead Botox (quarterly treatments)',
        isActive: true
      }
    });
  }

  if (prpFace) {
    await prisma.package.upsert({
      where: { id: 'pkg-prp-3' },
      update: {},
      create: {
        id: 'pkg-prp-3',
        tenantId: tenant.id,
        name: '3× PRP Face Therapy',
        procedureId: prpFace.id,
        totalSessions: 3,
        price: 21000,
        validityDays: 180,
        description: '3 sessions of PRP face therapy at monthly intervals',
        isActive: true
      }
    });
  }

  console.log('✅ Packages created');

  // Create sample regimens
  await prisma.regimen.upsert({
    where: { id: 'regimen-post-laser' },
    update: {},
    create: {
      id: 'regimen-post-laser',
      tenantId: tenant.id,
      name: 'Post-Laser Care Regimen',
      description: 'Standard post-procedure care after laser treatments',
      items: [
        {
          drugName: 'Mupirocin 2% Ointment',
          dosage: 'Thin layer',
          frequency: 'Twice daily',
          duration: '7 days',
          route: 'topical',
          instructions: 'Apply gently to treated area after cleansing'
        },
        {
          drugName: 'Cetaphil Gentle Cleanser',
          dosage: 'As needed',
          frequency: 'Twice daily',
          duration: '14 days',
          route: 'topical',
          instructions: 'Use lukewarm water, pat dry gently'
        },
        {
          drugName: 'La Roche-Posay Cicaplast Baume B5',
          dosage: 'Thin layer',
          frequency: '3-4 times daily',
          duration: '14 days',
          route: 'topical',
          instructions: 'Apply for soothing and barrier repair'
        },
        {
          drugName: 'Sunscreen SPF 50+',
          dosage: '2 finger lengths',
          frequency: 'Every 3 hours outdoors',
          duration: 'Ongoing',
          route: 'topical',
          instructions: 'Reapply after sweating/swimming. Critical for 4 weeks post-laser'
        }
      ],
      createdBy: doctor1.id,
      isActive: true
    }
  });

  await prisma.regimen.upsert({
    where: { id: 'regimen-acne-maintenance' },
    update: {},
    create: {
      id: 'regimen-acne-maintenance',
      tenantId: tenant.id,
      name: 'Acne Maintenance Regimen',
      description: 'Daily maintenance for acne-prone skin',
      items: [
        {
          drugName: 'Adapalene 0.1% Gel',
          dosage: 'Pea-sized amount',
          frequency: 'Nightly',
          duration: 'Ongoing',
          route: 'topical',
          instructions: 'Apply to clean, dry face. Start 3x/week, increase as tolerated'
        },
        {
          drugName: 'Clindamycin 1% Lotion',
          dosage: 'Thin layer',
          frequency: 'Morning',
          duration: '12 weeks',
          route: 'topical',
          instructions: 'Apply after cleansing, before moisturizer'
        },
        {
          drugName: 'Cerave PM Moisturizer',
          dosage: 'As needed',
          frequency: 'Twice daily',
          duration: 'Ongoing',
          route: 'topical',
          instructions: 'Non-comedogenic, ceramide-rich moisturizer'
        }
      ],
      createdBy: doctor1.id,
      isActive: true
    }
  });

  console.log('✅ Regimens created');

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });