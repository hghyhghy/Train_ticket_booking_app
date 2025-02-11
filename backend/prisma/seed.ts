import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.train.createMany({
    data: [
      { trainNumber: "12343", name: "Rajdhani Express", source: "Howrah", destination: "New Delhi", departure: new Date('2024-02-12T08:00:00Z') },
      { trainNumber: "12837", name: "Puri Mail", source: "Howrah", destination: "Puri", departure: new Date('2024-02-13T09:00:00Z') },
      { trainNumber: "14837", name: "Mumbai Mail", source: "Howrah", destination: "Mumbai", departure: new Date('2024-02-14T10:00:00Z') },
      { trainNumber: "13089", name: "Bikaner Express", source: "Sealdah", destination: "Bikaner", departure: new Date('2024-02-15T11:00:00Z') },
      { trainNumber: "13147", name: "Uttarbanga Express", source: "Sealdah", destination: "NJP", departure: new Date('2024-02-16T12:00:00Z') },
      { trainNumber: "13148", name: "Kanchankanya Express", source: "Sealdah", destination: "Alipurduar Jn", departure: new Date('2024-02-17T13:00:00Z') },
      { trainNumber: "22208", name: "Duronto Express", source: "Sealdah", destination: "Puri", departure: new Date('2024-02-18T14:00:00Z') }
    ],
    skipDuplicates: true // Prevents errors if the same train data already exists
  });

  console.log('Seeding completed!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
