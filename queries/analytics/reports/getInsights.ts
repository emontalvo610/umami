import { CLICKHOUSE, PRISMA, runQuery } from 'lib/db';
import prisma from 'lib/prisma';
import clickhouse from 'lib/clickhouse';
import { EVENT_TYPE } from 'lib/constants';
import { QueryFilters } from 'lib/types';

export async function getInsights(
  ...args: [websiteId: string, groups: { name: string; type: string }[], filters: QueryFilters]
) {
  return runQuery({
    [PRISMA]: () => relationalQuery(...args),
    [CLICKHOUSE]: () => clickhouseQuery(...args),
  });
}

async function relationalQuery(
  websiteId: string,
  groups: { name: string; type: string }[],
  filters: QueryFilters,
): Promise<
  {
    x: string;
    y: number;
  }[]
> {
  const { parseFilters, rawQuery } = prisma;
  const { filterQuery, joinSession, params } = await parseFilters(websiteId, {
    ...filters,
    eventType: EVENT_TYPE.pageView,
  });

  return rawQuery(
    `
    select
      url_path,
      count(*) y
    from website_event
      ${joinSession}
    where website_event.website_id = {{websiteId::uuid}}
      and website_event.created_at between {{startDate}} and {{endDate}}
      and website_event.event_type = {{eventType}}
      ${filterQuery}
    group by 1
    `,
    params,
  );
}

async function clickhouseQuery(
  websiteId: string,
  groups: { name: string; type: string }[],
  filters: QueryFilters,
): Promise<
  {
    x: string;
    y: number;
  }[]
> {
  const { parseFilters, rawQuery } = clickhouse;
  const { filterQuery, params } = await parseFilters(websiteId, {
    ...filters,
    eventType: EVENT_TYPE.pageView,
  });

  return rawQuery(
    `
    select 
      ${parseFields(groups)}
    from website_event
    where website_id = {websiteId:UUID}
      and created_at between {startDate:DateTime} and {endDate:DateTime}
      and event_type = {eventType:UInt32}
      ${filterQuery}
    group by ${groups.map(({ name }) => name).join(',')}
    order by 1 desc
    limit 500
    `,
    params,
  );
}

function parseFields(fields) {
  const query = fields.reduce(
    (arr, field) => {
      const { name } = field;

      return arr.concat(name);
    },
    ['count(*) as views', 'count(distinct session_id) as visitors'],
  );

  return query.join(',\n');
}
