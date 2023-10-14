'use client';
import Page from 'components/layout/Page';
import Empty from 'components/common/Empty';
import ReportsTable from '../../../../(main)/reports/ReportsTable';
import { useMessages, useWebsiteReports } from 'components/hooks';
import Link from 'next/link';
import { Button, Flexbox, Icon, Icons, Text } from 'react-basics';
import WebsiteHeader from '../WebsiteHeader';

export function WebsiteReports({ websiteId }) {
  const { formatMessage, labels } = useMessages();
  const {
    reports,
    error,
    isLoading,
    deleteReport,
    filter,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
  } = useWebsiteReports(websiteId);

  const hasData = (reports && reports.data.length !== 0) || filter;

  const handleDelete = async id => {
    await deleteReport(id);
  };

  if (isLoading || error) {
    return <Page loading={isLoading} error={error} />;
  }

  return (
    <>
      <WebsiteHeader websiteId={websiteId} />
      <Flexbox alignItems="center" justifyContent="end">
        <Link href={`/reports/create`}>
          <Button variant="primary">
            <Icon>
              <Icons.Plus />
            </Icon>
            <Text>{formatMessage(labels.createReport)}</Text>
          </Button>
        </Link>
      </Flexbox>
      {hasData && (
        <ReportsTable
          data={reports.data}
          onDelete={handleDelete}
          onFilterChange={handleFilterChange}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          filterValue={filter}
        />
      )}
      {!hasData && <Empty />}
    </>
  );
}

export default WebsiteReports;
