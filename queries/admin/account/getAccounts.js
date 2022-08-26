import { prisma, runQuery } from 'lib/db/relational';

export async function getAccounts() {
  return runQuery(
    prisma.account.findMany({
      orderBy: [
        { is_admin: 'desc' },
        {
          username: 'asc',
        },
      ],
      select: {
        user_id: true,
        username: true,
        is_admin: true,
        created_at: true,
        updated_at: true,
      },
    }),
  );
}
