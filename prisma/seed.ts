import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Create a sample admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@nohaarchive.com',
      role: 'admin',
    },
  });

  // Sample poems
  await prisma.poem.createMany({
    data: [
      {
        type: 'noha',
        titleUrdu: 'کربلا کی شام',
        titleEn: 'Evening of Karbala',
        contentUrdu: 'کربلا کی شام ہے، غم کا عالم عام ہے',
        contentEn: 'It is the evening of Karbala, sorrow is everywhere',
        poet: 'نامعلوم',
        status: 'approved',
        submittedById: admin.id,
      },
      {
        type: 'qaseeda',
        titleUrdu: 'مدحِ علی',
        titleEn: 'Praise of Ali',
        contentUrdu: 'علی کی مدح میں لکھوں، قلم کو روشنی دے دو',
        contentEn: 'Let me write in praise of Ali, give light to my pen',
        poet: 'نامعلوم',
        status: 'approved',
        submittedById: admin.id,
      },
      {
        type: 'folk',
        titleUrdu: 'پنجابی لوک گیت',
        titleEn: 'Punjabi Folk Song',
        contentUrdu: 'چن میرے مکھناں، دلدار میرے',
        contentEn: 'O moon, my beloved, my sweetheart',
        poet: 'نامعلوم',
        status: 'approved',
        submittedById: admin.id,
      },
    ],
  });
}

console.log('Seeding database...');

main()
  .then(() => {
    console.log('Seed data created!');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error('Error during seeding:');
    console.error(e);
    return prisma.$disconnect();
  });
