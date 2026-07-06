import prisma from '../db';

export const SearchHistoryService = {
  /**
   * Save a search query. Keeps only the last 10 unique searches.
   */
  async addSearch(userId: string, rawQuery: string) {
    const query = rawQuery.trim();
    if (!query) return null;

    // Check if query already exists in history
    const existing = await prisma.searchHistory.findFirst({
      where: { userId, query },
    });

    if (existing) {
      // Update timestamp to put it at the top
      await prisma.searchHistory.update({
        where: { id: existing.id },
        data: { createdAt: new Date() },
      });
    } else {
      // Add new history record
      await prisma.searchHistory.create({
        data: { userId, query },
      });
    }

    // Clean up older queries if history exceeds 10 records
    const historyCount = await prisma.searchHistory.count({
      where: { userId },
    });

    if (historyCount > 10) {
      const oldestToKeep = await prisma.searchHistory.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: 10,
        take: 1,
      });

      if (oldestToKeep.length > 0) {
        await prisma.searchHistory.deleteMany({
          where: {
            userId,
            createdAt: { lte: oldestToKeep[0].createdAt },
          },
        });
      }
    }

    return true;
  },

  /**
   * Fetch the last 10 unique search queries
   */
  async getHistory(userId: string) {
    const list = await prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return list.map((item) => ({
      id: item.id,
      query: item.query,
      createdAt: item.createdAt.toISOString(),
    }));
  },

  /**
   * Clears all search history for a user
   */
  async clearHistory(userId: string) {
    await prisma.searchHistory.deleteMany({
      where: { userId },
    });
    return true;
  },
};
export default SearchHistoryService;
