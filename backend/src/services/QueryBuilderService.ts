import { Prisma } from '@prisma/client';
import prisma from '../db';
import { FilterRule, QueryGroup, AdvancedSearchPayload } from '../types/intelligence';

export const QueryBuilderService = {
  /**
   * Translates visual rules into Prisma query filters
   */
  async buildPrismaWhere(userId: string, payload: AdvancedSearchPayload): Promise<Prisma.TransactionWhereInput> {
    const conditions: Prisma.TransactionWhereInput[] = [{ userId }];

    // 1. Instant full-text wildcard search
    if (payload.searchTerm && payload.searchTerm.trim() !== '') {
      const term = payload.searchTerm.trim();
      conditions.push({
        OR: [
          { title: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } },
          { notes: { contains: term, mode: 'insensitive' } },
          { paymentMethod: { contains: term, mode: 'insensitive' } },
          { category: { name: { contains: term, mode: 'insensitive' } } },
        ],
      });
    }

    // 2. Query Builder visual rules
    if (payload.queryGroup && payload.queryGroup.rules && payload.queryGroup.rules.length > 0) {
      const parsedRules = await this.parseQueryGroup(payload.queryGroup);
      if (parsedRules) {
        conditions.push(parsedRules);
      }
    }

    return { AND: conditions };
  },

  /**
   * Recursively parses query builder groups
   */
  async parseQueryGroup(group: QueryGroup): Promise<Prisma.TransactionWhereInput | null> {
    if (!group.rules || group.rules.length === 0) return null;

    const prismaRules: Prisma.TransactionWhereInput[] = [];
    for (const rule of group.rules) {
      if ('logicalOperator' in rule) {
        const subGroup = await this.parseQueryGroup(rule);
        if (subGroup) prismaRules.push(subGroup);
      } else {
        const condition = await this.parseFilterRule(rule);
        if (condition) prismaRules.push(condition);
      }
    }

    if (prismaRules.length === 0) return null;
    return group.logicalOperator === 'AND' ? { AND: prismaRules } : { OR: prismaRules };
  },

  /**
   * Maps individual rule operators to Prisma criteria
   */
  async parseFilterRule(rule: FilterRule): Promise<Prisma.TransactionWhereInput | null> {
    const { field, operator, value } = rule;

    // Handle empty or invalid values
    if (value === undefined || value === null || value === '') return null;

    // Special field: budgetId mapping (filter transactions matching budget's categoryId)
    if (field === 'budgetId') {
      const budget = await prisma.budget.findUnique({
        where: { id: String(value) },
      });
      if (budget && budget.categoryId) {
        return { categoryId: budget.categoryId };
      }
      return { id: 'non-existent-id' };
    }

    // Special field: categoryArchived (soft-deleted active check)
    if (field === 'categoryArchived') {
      const isActive = value === 'true' || value === true ? false : true;
      return { category: { isActive } };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let parsedValue: any = value;

    // Cast data types appropriately
    if (field === 'amount') {
      if (Array.isArray(value)) {
        parsedValue = value.map(Number);
      } else {
        parsedValue = Number(value);
      }
    } else if (field === 'date') {
      if (Array.isArray(value)) {
        parsedValue = value.map((v) => new Date(v as any));
      } else {
        parsedValue = new Date(value as any);
      }
    }

    switch (operator) {
      case 'EQUALS':
        if (typeof parsedValue === 'string') {
          return { [field]: { equals: parsedValue, mode: 'insensitive' } };
        }
        return { [field]: parsedValue };

      case 'CONTAINS':
        return { [field]: { contains: String(parsedValue), mode: 'insensitive' } };

      case 'GREATER_THAN':
        return { [field]: { gt: parsedValue } };

      case 'LESS_THAN':
        return { [field]: { lt: parsedValue } };

      case 'IN': {
        const inArray = Array.isArray(parsedValue) ? parsedValue : [parsedValue];
        return { [field]: { in: inArray } };
      }

      case 'BETWEEN':
        if (Array.isArray(parsedValue) && parsedValue.length === 2) {
          return {
            [field]: {
              gte: parsedValue[0],
              lte: parsedValue[1],
            },
          };
        }
        return null;

      default:
        return null;
    }
  },

  /**
   * Runs advanced paginated search
   */
  async search(userId: string, payload: AdvancedSearchPayload) {
    const where = await this.buildPrismaWhere(userId, payload);
    const page = Math.max(1, payload.page || 1);
    const limit = Math.max(1, payload.limit || 10);
    const skip = (page - 1) * limit;

    const sortBy = payload.sortBy || 'date';
    const sortOrder = payload.sortOrder || 'desc';

    // Allow sorting by category name or regular transaction fields
    let orderBy: Prisma.TransactionOrderByWithRelationInput = { [sortBy]: sortOrder as Prisma.SortOrder };
    if (sortBy === 'categoryName') {
      orderBy = { category: { name: sortOrder as Prisma.SortOrder } };
    }

    const [total, transactions] = await Promise.all([
      prisma.transaction.count({ where }),
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: true,
          tags: true,
        },
      }),
    ]);

    return {
      transactions: transactions.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        amount: Number(t.amount),
        type: t.type,
        date: t.date.toISOString(),
        paymentMethod: t.paymentMethod,
        notes: t.notes,
        categoryName: t.category?.name || 'Uncategorized',
        categoryColor: t.category?.color || '#6B7280',
        tags: t.tags.map((tag) => ({ id: tag.id, name: tag.name, color: tag.color })),
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};
export default QueryBuilderService;
