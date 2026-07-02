import { PrismaClient } from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: any;

const prisma = new PrismaClient();

const defaultIncomeCategories = [
  { name: 'Salary', color: '#10B981', icon: 'briefcase', description: 'Regular employment monthly income salary payments', sortOrder: 1 },
  { name: 'Freelancing', color: '#3B82F6', icon: 'laptop', description: 'Contracting, freelance work, and side projects income', sortOrder: 2 },
  { name: 'Business', color: '#8B5CF6', icon: 'building', description: 'Company earnings, distributions, and business profits', sortOrder: 3 },
  { name: 'Investments', color: '#F59E0B', icon: 'trending-up', description: 'Stock dividends, mutual fund gains, and asset sales', sortOrder: 4 },
  { name: 'Rental Income', color: '#06B6D4', icon: 'home', description: 'Real estate tenant rental payments received', sortOrder: 5 },
  { name: 'Interest', color: '#14B8A6', icon: 'percent', description: 'Bank interest earnings and government bond coupon yields', sortOrder: 6 },
  { name: 'Refund', color: '#6B7280', icon: 'rotate-ccw', description: 'Cashbacks, returned products, and expense reimbursement credits', sortOrder: 7 },
  { name: 'Bonus', color: '#EC4899', icon: 'gift', description: 'Performance bonuses, corporate incentives, and holiday awards', sortOrder: 8 },
  { name: 'Gift Received', color: '#EF4444', icon: 'heart', description: 'Gifts, monetary checks, and inheritance deposits', sortOrder: 9 },
  { name: 'Other Income', color: '#9CA3AF', icon: 'wallet', description: 'Miscellaneous miscellaneous cash inputs', sortOrder: 10 },
];

const defaultExpenseCategories = [
  { name: 'Food & Dining', color: '#EF4444', icon: 'utensils', description: 'Dining out, cafes, bistros, delivery, and restaurant bills', sortOrder: 11 },
  { name: 'Groceries', color: '#F59E0B', icon: 'shopping-cart', description: 'Supermarket food, household supplies, and kitchen provisions', sortOrder: 12 },
  { name: 'Fuel', color: '#3B82F6', icon: 'droplet', description: 'Gasoline, diesel, EV battery charges, and fuel refills', sortOrder: 13 },
  { name: 'Transportation', color: '#06B6D4', icon: 'car', description: 'Public transit, subways, rideshares, parking, and tolls', sortOrder: 14 },
  { name: 'Shopping', color: '#EC4899', icon: 'shopping-bag', description: 'Apparel, accessories, home decor, electronics, and goods', sortOrder: 15 },
  { name: 'Entertainment', color: '#8B5CF6', icon: 'gamepad', description: 'Movies, theatres, events, concerts, games, and hobbies', sortOrder: 16 },
  { name: 'Travel', color: '#10B981', icon: 'plane', description: 'Flights, hotel bookings, lodging, rentals, and vacation trips', sortOrder: 17 },
  { name: 'Healthcare', color: '#14B8A6', icon: 'heart-pulse', description: 'Doctor visits, pharmacy medications, dental, and medical costs', sortOrder: 18 },
  { name: 'Insurance', color: '#6366F1', icon: 'shield', description: 'Health, auto, home, life, and personal insurance premium payments', sortOrder: 19 },
  { name: 'Education', color: '#F43F5E', icon: 'graduation-cap', description: 'Tuitions, textbooks, courses, training, and school supplies', sortOrder: 20 },
  { name: 'Bills & Utilities', color: '#06B6D4', icon: 'zap', description: 'Electricity, water, sewer, trash, gas, internet, and phones', sortOrder: 21 },
  { name: 'Subscriptions', color: '#6366F1', icon: 'tv', description: 'Streaming, SaaS, magazines, gym memberships, and services', sortOrder: 22 },
  { name: 'EMI / Loans', color: '#EF4444', icon: 'credit-card', description: 'Mortgages, student loans, auto loans, and card payments', sortOrder: 23 },
  { name: 'Rent', color: '#8B5CF6', icon: 'home', description: 'Monthly housing apartment or leasing rent payments', sortOrder: 24 },
  { name: 'Taxes', color: '#6B7280', icon: 'file-text', description: 'Income, property, sales, and municipal tax payments', sortOrder: 25 },
  { name: 'Charity', color: '#EC4899', icon: 'heart', description: 'Non-profit donations, philanthropy, tithing, and relief aids', sortOrder: 26 },
  { name: 'Personal Care', color: '#F59E0B', icon: 'sparkles', description: 'Haircuts, cosmetics, spa treatments, hygiene, and grooming', sortOrder: 27 },
  { name: 'Pets', color: '#10B981', icon: 'dog', description: 'Veterinary services, pet food, toys, medicines, and grooming', sortOrder: 28 },
  { name: 'Family', color: '#3B82F6', icon: 'users', description: 'Child care, kids supplies, elder support, and family gifts', sortOrder: 29 },
  { name: 'Other Expense', color: '#9CA3AF', icon: 'tag', description: 'Miscellaneous miscellaneous cash outlays', sortOrder: 30 },
];

async function main() {
  console.log('[Seed]: Starting category database seeding...');

  for (const cat of defaultIncomeCategories) {
    const exists = await prisma.category.findFirst({
      where: {
        name: cat.name,
        type: 'INCOME',
        userId: null,
      },
    });

    if (exists) {
      await prisma.category.update({
        where: { id: exists.id },
        data: {
          description: cat.description,
          sortOrder: cat.sortOrder,
          color: cat.color,
          icon: cat.icon,
        },
      });
    } else {
      await prisma.category.create({
        data: {
          name: cat.name,
          type: 'INCOME',
          color: cat.color,
          icon: cat.icon,
          description: cat.description,
          sortOrder: cat.sortOrder,
        },
      });
    }
  }

  for (const cat of defaultExpenseCategories) {
    const exists = await prisma.category.findFirst({
      where: {
        name: cat.name,
        type: 'EXPENSE',
        userId: null,
      },
    });

    if (exists) {
      await prisma.category.update({
        where: { id: exists.id },
        data: {
          description: cat.description,
          sortOrder: cat.sortOrder,
          color: cat.color,
          icon: cat.icon,
        },
      });
    } else {
      await prisma.category.create({
        data: {
          name: cat.name,
          type: 'EXPENSE',
          color: cat.color,
          icon: cat.icon,
          description: cat.description,
          sortOrder: cat.sortOrder,
        },
      });
    }
  }

  console.log('[Seed]: Category database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('[Seed]: Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
