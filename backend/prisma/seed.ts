import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seeding Trains
  await prisma.train.createMany({
    data: [
      { trainNumber: "12343", name: "Rajdhani Express", source: "Howrah Jn", destination: "New Delhi", departure: new Date('2024-02-12T08:00:00Z'), arrival: new Date('2024-02-12T20:00:00Z') },
      { trainNumber: "12837", name: "Puri Mail", source: "Howrah Jn", destination: "Puri", departure: new Date('2024-02-13T09:00:00Z'), arrival: new Date('2024-02-13T18:00:00Z') },
      { trainNumber: "14837", name: "Mumbai Mail", source: "Howrah Jn", destination: "Mumbai", departure: new Date('2024-02-14T10:00:00Z'), arrival: new Date('2024-02-15T22:00:00Z') },
      { trainNumber: "13089", name: "Bikaner Express", source: "Sealdah", destination: "Bikaner", departure: new Date('2024-02-15T11:00:00Z'), arrival: new Date('2024-02-16T23:00:00Z') },
      { trainNumber: "13147", name: "Uttarbanga Express", source: "Sealdah", destination: "NJP", departure: new Date('2024-02-16T12:00:00Z'), arrival: new Date('2024-02-16T22:30:00Z') },
      { trainNumber: "13149", name: "Kanchankanya Express", source: "Sealdah", destination: "Alipurduar Jn", departure: new Date('2024-02-17T13:00:00Z'), arrival: new Date('2024-02-18T05:00:00Z') },
      { trainNumber: "22208", name: "Duronto Express", source: "Sealdah", destination: "Puri", departure: new Date('2024-02-18T14:00:00Z'), arrival: new Date('2024-02-18T21:30:00Z') }
    ],
    skipDuplicates: true  // Prevents duplicate train entries
  });

  console.log('✅ Trains seeded successfully!');

  // Fetch all trains (to get their IDs)
  const allTrains = await prisma.train.findMany();

  // Define unique fares for each train
  const trainFares: Record<string, { [key: string]: number }> = {
    "12343": { "1st AC": 4000, "2nd AC": 2800, "3rd AC": 2000, "Sleeper": 1200, "Chair Car": 800 },
    "12837": { "1st AC": 3500, "2nd AC": 2600, "3rd AC": 1800, "Sleeper": 1000, "Chair Car": 700 },
    "14837": { "1st AC": 3700, "2nd AC": 2700, "3rd AC": 1900, "Sleeper": 1100, "Chair Car": 750 },
    "13089": { "1st AC": 3800, "2nd AC": 2900, "3rd AC": 2100, "Sleeper": 1300, "Chair Car": 850 },
    "13147": { "1st AC": 3600, "2nd AC": 2750, "3rd AC": 1950, "Sleeper": 1150, "Chair Car": 780 },
    "13149": { "1st AC": 3450, "2nd AC": 2550, "3rd AC": 1750, "Sleeper": 950, "Chair Car": 650 },
    "22208": { "1st AC": 4100, "2nd AC": 3000, "3rd AC": 2200, "Sleeper": 1400, "Chair Car": 900 }
  };

  const trains = await prisma.train.findMany();

  for (let i = 0; i < trains.length; i++) {
    await prisma.train.update({
      where: { id: trains[i].id },
      data: { arrival: new Date(trains[i].departure.getTime() + (i + 1) * 3600000) } // 1 hour apart
    });
  }

  

  // Force update existing records
  await prisma.train.updateMany({
    data: { source: "Howrah Jn" },
    where: { source: "Howrah" } // Update only trains with the old value
  });
  
  

  for (const train of allTrains) {
    for (const [type, price] of Object.entries(trainFares[train.trainNumber] || {})) {
      await prisma.trainClass.upsert({
        where: {
          trainId_type: { trainId: train.id, type }  // Ensuring uniqueness
        },
        update: { price }, // Update price if class exists
        create: { trainId: train.id, type, price } // Create if not exists
      }).catch(() => {
        console.warn(`⚠️ Train class ${type} already exists for Train ${train.trainNumber}, skipping...`);
      });
    }
  }

  console.log('✅ Train classes with unique fares seeded successfully!');
}

main()
  .catch(e => console.error('❌ Seeding error:', e))
  .finally(() => prisma.$disconnect());
