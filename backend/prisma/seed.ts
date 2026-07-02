import { PrismaClient } from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: any;

const prisma = new PrismaClient();

const defaultIncomeCategories = [
  { name: 'Salary', color: '#10B981', icon: 'briefcase' },
  { name: 'Freelance', color: '#3B82F6', icon: 'laptop' },
  { name: 'Investments', color: '#8B5CF6', icon: 'trending-up' },
  { name: 'Gifts', color: '#EC4899', icon: 'gift' },
  { name: 'Other Income', color: '#6B7280', icon: 'wallet' },
];

const defaultExpenseCategories = [
  { name: 'Housing', color: '#EF4444', icon: 'home' },
  { name: 'Groceries', color: '#F59E0B', icon: 'shopping-cart' },
  { name: 'Dining Out', color: '#10B981', icon: 'utensils' },
  { name: 'Transportation', color: '#3B82F6', icon: 'car' },
  { name: 'Utilities', color: '#06B6D4', icon: 'zap' },
  { name: 'Entertainment', color: '#8B5CF6', icon: 'film' },
  { name: 'Healthcare', color: '#14B8A6', icon: 'heart-pulse' },
  { name: 'Shopping', color: '#EC4899', icon: 'shopping-bag' },
  { name: 'Subscriptions', color: '#6366F1', icon: 'tv' },
  { name: 'Education', color: '#F43F5E', icon: 'graduation-cap' },
  { name: 'Other Expense', color: '#6B7280', icon: 'tag' },
];

async function main() {
  console.log("[Seed]: Starting database seeding...");

  for (const cat of defaultIncomeCategories) {
    const exists = await prisma.category.findFirst({
      where: {
        name: cat.name,
        type: "INCOME",
        userId: null,
      },
    });

    if (!exists) {
      await prisma.category.create({
        data: {
          name: cat.name,
          type: "INCOME",
          color: cat.color,
          icon: cat.icon,
          isActive: true,
        },
      });
    }
  }

  for (const cat of defaultExpenseCategories) {
    const exists = await prisma.category.findFirst({
      where: {
        name: cat.name,
        type: "EXPENSE",
        userId: null,
      },
    });

    if (!exists) {
      await prisma.category.create({
        data: {
          name: cat.name,
          type: "EXPENSE",
          color: cat.color,
          icon: cat.icon,
          isActive: true,
        },
      });
    }
  }

  console.log("[Seed]: Database seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error('[Seed]: Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
