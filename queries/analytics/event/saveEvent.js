import { CLICKHOUSE, KAFKA, RELATIONAL, URL_LENGTH } from 'lib/constants';
import clickhouse from 'lib/clickhouse';
import kafka from 'lib/kafka';
import { prisma, runQuery } from 'lib/relational';
import { runAnalyticsQuery } from 'lib/db';

export async function saveEvent(...args) {
  return runAnalyticsQuery({
    [RELATIONAL]: () => relationalQuery(...args),
    [CLICKHOUSE]: () => clickhouseQuery(...args),
    [KAFKA]: () => kafkaQuery(...args),
  });
}

async function relationalQuery(website_id, { session_id, url, event_name, event_data }) {
  const data = {
    website_id,
    session_id,
    url: url?.substr(0, URL_LENGTH),
    event_name: event_name?.substr(0, 50),
  };

  if (event_data) {
    data.event_data = {
      create: {
        event_data: event_data,
      },
    };
  }

  return runQuery(
    prisma.event.create({
      data,
    }),
  );
}

async function clickhouseQuery(website_id, { event_uuid, session_uuid, url, event_name }) {
  const params = [
    website_id,
    event_uuid,
    session_uuid,
    url?.substr(0, URL_LENGTH),
    event_name?.substr(0, 50),
  ];

  return clickhouse.rawQuery(
    `
    insert into umami.event (created_at, website_id, session_uuid, url, event_name)
    values (${clickhouse.getDateFormat(new Date())},  $1, $2, $3, $4);`,
    params,
  );
}

async function kafkaQuery(website_id, { event_uuid, session_uuid, url, event_name }) {
  const params = {
    event_uuid: event_uuid,
    website_id: website_id,
    session_uuid: session_uuid,
    created_at: kafka.getDateFormat(new Date()),
    url: url?.substr(0, URL_LENGTH),
    event_name: event_name?.substr(0, 50),
  };

  await kafka.sendMessage(params, 'event');
}
