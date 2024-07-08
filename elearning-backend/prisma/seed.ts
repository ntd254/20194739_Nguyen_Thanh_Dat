import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.user.upsert({
    where: { email: 'dat@gmail.com' },
    update: {},
    create: {
      id: 'fca9a90c-b297-4f25-956b-311eaa117be9',
      avatar:
        'https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png?f=webp',
      email: 'dat@gmail.com',
      name: 'Dat',
      verified: true,
      password: '$2a$12$EKDJMWsyTPCcFNTtnU8lyOOFPvQf1tApOMIRVOw/IdiYCZl3J5via',
      stripeAccount: {
        connectOrCreate: {
          where: { userId: 'fca9a90c-b297-4f25-956b-311eaa117be9' },
          create: {
            accountId: 'acct_1P2G3RP4wEix6JZx',
            chargesEnabled: true,
            detailsSubmitted: true,
            payoutsEnabled: true,
          },
        },
      },
    },
  });

  await prisma.video.upsert({
    where: { id: 'fc5d33e6-e029-48ab-9154-f1b06daef9fe' },
    update: {},
    create: {
      id: 'fc5d33e6-e029-48ab-9154-f1b06daef9fe',
      duration: 200,
      objectKey: 'video/1.mp4',
    },
  });

  await prisma.course.upsert({
    where: { id: '1a819e38-14cb-4496-88d6-70fdc03f7741' },
    update: {},
    create: {
      id: '1a819e38-14cb-4496-88d6-70fdc03f7741',
      title: 'React',
      description: 'React is a JavaScript library for building user interfaces',
      price: 100000,
      public: true,
      thumbnail:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png',
      department: 'CNTT',
      teacherId: 'fca9a90c-b297-4f25-956b-311eaa117be9',
      sections: {
        create: {
          title: 'React Basics',
          order: 1,
          lessons: {
            create: {
              title: 'Introduction to React',
              order: 1,
              videoId: 'fc5d33e6-e029-48ab-9154-f1b06daef9fe',
            },
          },
        },
      },
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
