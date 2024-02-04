import { Prisma, TeamUser } from '@prisma/client';
import { uuid } from 'lib/crypto';
import prisma from 'lib/prisma';
import { FilterResult, TeamUserSearchFilter } from 'lib/types';
import TeamUserFindManyArgs = Prisma.TeamUserFindManyArgs;

export async function getTeamUser(teamId: string, userId: string): Promise<TeamUser> {
  return prisma.client.teamUser.findFirst({
    where: {
      teamId,
      userId,
    },
  });
}

export async function getTeamUsers(
  criteria: TeamUserFindManyArgs,
  filters?: TeamUserSearchFilter,
): Promise<FilterResult<TeamUser[]>> {
  const { query } = filters;

  const where: Prisma.TeamUserWhereInput = {
    ...criteria.where,
    ...prisma.getSearchParameters(query, [{ user: { username: 'contains' } }]),
  };

  return prisma.pagedQuery(
    'teamUser',
    {
      ...criteria,
      where,
    },
    filters,
  );
}

export async function createTeamUser(
  userId: string,
  teamId: string,
  role: string,
): Promise<TeamUser> {
  return prisma.client.teamUser.create({
    data: {
      id: uuid(),
      userId,
      teamId,
      role,
    },
  });
}

export async function updateTeamUser(teamUserId: string, data: any): Promise<TeamUser> {
  return prisma.client.teamUser.update(
    {
      where: {
        id: teamUserId,
      },
    },
    data,
  );
}

export async function deleteTeamUser(teamId: string, userId: string): Promise<TeamUser> {
  const { client } = prisma;

  return client.teamUser.deleteMany({
    where: {
      teamId,
      userId,
    },
  });
}
