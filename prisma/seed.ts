import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

const poemTypes = ['noha', 'qaseeda', 'folk'] as const;
const urduWords = [
  'محبت', 'غم', 'کربلا', 'علی', 'حسین', 'شام', 'صبح', 'یاد', 'دعا', 'خواب',
  'چراغ', 'دل', 'آنسو', 'خون', 'وفا', 'دوست', 'دشمن', 'پھول', 'خوشبو', 'چاند'
];
const englishWords = [
  'love', 'sorrow', 'Karbala', 'Ali', 'Hussain', 'evening', 'morning', 'memory',
  'prayer', 'dream', 'lamp', 'heart', 'tears', 'blood', 'loyalty', 'friend',
  'enemy', 'flower', 'fragrance', 'moon'
];
const urduPoets = ['نامعلوم', 'میر', 'غالب', 'اقبال', 'فیض', 'جون ایلیا', 'پروین شاکر', '']

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomUrduText(wordCount: number) {
  return Array.from({ length: wordCount }, () => randomFrom(urduWords)).join(' ');
}

function randomEnglishText(wordCount: number) {
  return Array.from({ length: wordCount }, () => randomFrom(englishWords)).join(' ');
}

function maybe<T>(value: T): T | undefined {
  return Math.random() < 0.7 ? value : undefined; // 70% chance to include
}

async function main() {
  // Create a sample admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@nohaarchive.com',
      role: 'admin',
    },
  });

  // Generate 100 random poems
  const poems = Array.from({ length: 100 }, (_, i) => {
    const type = randomFrom(poemTypes);
    return {
      type,
      titleUrdu: randomUrduText(2 + Math.floor(Math.random() * 3)),
      titleEn: maybe(randomEnglishText(2 + Math.floor(Math.random() * 3))),
      contentUrdu: randomUrduText(10 + Math.floor(Math.random() * 30)),
      contentEn: maybe(randomEnglishText(10 + Math.floor(Math.random() * 30))),
      poet: maybe(randomFrom(urduPoets)),
      year: maybe(1900 + Math.floor(Math.random() * 125)),
      status: 'approved',
      submittedById: admin.id,
    };
  });

  await prisma.poem.createMany({ data: poems });
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
