import { parseCollectRequest } from 'lib/utils';
import { savePageView, saveEvent } from 'lib/db';
import { allowPost } from 'lib/middleware';

export default async (req, res) => {
  await allowPost(req, res);

  const values = parseCollectRequest(req);

  if (values.success) {
    const { type, website_id, session_id, url, referrer, event_type, event_value } = values;

    if (type === 'pageview') {
      await savePageView(website_id, session_id, url, referrer).catch(() => {
        values.success = 0;
      });
    } else if (type === 'event') {
      await saveEvent(website_id, session_id, url, event_type, event_value).catch(() => {
        values.success = 0;
      });
    }
  }

  res.status(200).json({ success: values.success });
};
