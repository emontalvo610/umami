import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Link from 'components/common/Link';
import WebsiteChart from 'components/metrics/WebsiteChart';
import Page from 'components/layout/Page';
import EmptyPlaceholder from 'components/common/EmptyPlaceholder';
import Button from 'components/common/Button';
import useFetch from 'hooks/useFetch';
import Arrow from 'assets/arrow-right.svg';
import Chart from 'assets/chart-bar.svg';
import styles from './WebsiteList.module.css';

export default function WebsiteList({ userId }) {
  const { data } = useFetch('/websites', { params: { user_id: userId } });
  const [showCharts, setShowCharts] = useState(true);

  if (!data) {
    return null;
  }

  if (data.length === 0) {
    return (
      <Page>
        <EmptyPlaceholder
          msg={
            <FormattedMessage
              id="message.no-websites-configured"
              defaultMessage="You don't have any websites configured."
            />
          }
        >
          <Link href="/settings" icon={<Arrow />} iconRight>
            <FormattedMessage id="message.go-to-settings" defaultMessage="Go to settings" />
          </Link>
        </EmptyPlaceholder>
      </Page>
    );
  }

  return (
    <Page>
      <div className={styles.menubar}>
        <Button
          tooltip={<FormattedMessage id="message.toggle-charts" defaultMessage="Toggle charts" />}
          icon={<Chart />}
          onClick={() => setShowCharts(!showCharts)}
        />
      </div>
      {data.map(({ website_id, name, domain }) => (
        <div key={website_id} className={styles.website}>
          <WebsiteChart
            websiteId={website_id}
            title={name}
            domain={domain}
            showChart={showCharts}
            showLink
          />
        </div>
      ))}
    </Page>
  );
}
