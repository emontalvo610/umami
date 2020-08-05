import React from 'react';
import Layout from 'components/Layout';
import WebsiteList from 'components/WebsiteList';
import useUser from 'hooks/useUser';

export default function HomePage() {
  const { loading } = useUser();

  if (loading) {
    return null;
  }

  return (
    <Layout>
      <WebsiteList />
    </Layout>
  );
}
