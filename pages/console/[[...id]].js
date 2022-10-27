import React from 'react';
import Layout from 'components/layout/Layout';
import TestConsole from 'components/pages/TestConsole';
import useRequireLogin from 'hooks/useRequireLogin';
import useUser from 'hooks/useUser';

export default function ConsolePage({ enabled, pageDisabled }) {
  const { loading } = useRequireLogin();
  const { user } = useUser();

  if (pageDisabled || loading || !enabled || !user?.isAdmin) {
    return null;
  }

  return (
    <Layout>
      <TestConsole />
    </Layout>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      pageDisabled: !!process.env.DISABLE_UI,
      enabled: !!process.env.ENABLE_TEST_CONSOLE,
    },
  };
}
