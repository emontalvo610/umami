import { Team } from '@prisma/client';
import { NextApiRequestQueryBody } from 'interface/api/nextApi';
import { allowQuery } from 'lib/auth';
import { UmamiApi } from 'lib/constants';
import { useAuth } from 'lib/middleware';
import { NextApiResponse } from 'next';
import { methodNotAllowed, ok, unauthorized } from 'next-basics';
import { deleteTeam, getTeam, updateTeam } from 'queries';

export interface TeamRequestQuery {
  id: string;
}

export interface TeamRequestBody {
  name: string;
}

export default async (
  req: NextApiRequestQueryBody<TeamRequestQuery, TeamRequestBody>,
  res: NextApiResponse<Team>,
) => {
  await useAuth(req, res);

  const { id: teamId } = req.query;

  if (req.method === 'GET') {
    if (!(await allowQuery(req, UmamiApi.AuthType.Team))) {
      return unauthorized(res);
    }
    const user = await getTeam({ id: teamId });

    return ok(res, user);
  }

  if (req.method === 'POST') {
    const { name } = req.body;

    if (!(await allowQuery(req, UmamiApi.AuthType.TeamOwner))) {
      return unauthorized(res, 'You must be the owner of this team.');
    }

    const updated = await updateTeam({ name }, { id: teamId });

    return ok(res, updated);
  }

  if (req.method === 'DELETE') {
    if (!(await allowQuery(req, UmamiApi.AuthType.TeamOwner))) {
      return unauthorized(res, 'You must be the owner of this team.');
    }

    await deleteTeam(teamId);

    return ok(res);
  }

  return methodNotAllowed(res);
};
