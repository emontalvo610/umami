import { useAuth, useCors } from 'lib/middleware';
import { NextApiRequestQueryBody } from 'lib/types';
import { NextApiResponse } from 'next';
import { methodNotAllowed, ok, unauthorized } from 'next-basics';
import { createReport, getReports } from 'queries';
import { canViewWebsite } from 'lib/auth';
import { uuid } from 'lib/crypto';

export interface ReportRequestBody {
  websiteId: string;
  name: string;
  type: string;
  description: string;
  parameters: {
    window: string;
    urls: string[];
  };
}

export default async (
  req: NextApiRequestQueryBody<any, ReportRequestBody>,
  res: NextApiResponse,
) => {
  await useCors(req, res);
  await useAuth(req, res);

  const { websiteId } = req.query;

  const {
    user: { id: userId },
  } = req.auth;

  if (req.method === 'GET') {
    if (!(websiteId && (await canViewWebsite(req.auth, websiteId)))) {
      return unauthorized(res);
    }

    const data = await getReports({ websiteId });

    return ok(res, data);
  }

  if (req.method === 'POST') {
    const { websiteId, type, name, description, parameters } = req.body;

    const result = await createReport({
      id: uuid(),
      userId,
      websiteId,
      type,
      name,
      description,
      parameters: JSON.stringify(parameters),
    } as any);

    return ok(res, result);
  }

  return methodNotAllowed(res);
};
