import Page from 'components/layout/Page';
import PageHeader from 'components/layout/PageHeader';
import WebsiteAddForm from 'components/pages/settings/websites/WebsiteAddForm';
import WebsitesTable from 'components/pages/settings/websites/WebsitesTable';
import useApi from 'components/hooks/useApi';
import useMessages from 'components/hooks/useMessages';
import useUser from 'components/hooks/useUser';
import { ROLES } from 'lib/constants';
import { Button, Icon, Icons, Modal, ModalTrigger, Text, useToasts } from 'react-basics';
import { useState } from 'react';

export function WebsitesList({
  showTeam,
  showEditButton = true,
  showHeader = true,
  includeTeams,
  onlyTeams,
}) {
  const { formatMessage, labels, messages } = useMessages();
  const { user } = useUser();
  const [params, setParams] = useState({});
  const { get, useQuery } = useApi();
  const { data, isLoading, error, refetch } = useQuery(
    ['websites', includeTeams, onlyTeams],
    () =>
      get(`/users/${user?.id}/websites`, {
        includeTeams,
        onlyTeams,
        ...params,
      }),
    { enabled: !!user },
  );
  const { showToast } = useToasts();

  const handleChange = params => {
    setParams(params);
  };

  const handleSave = async () => {
    await refetch();
    showToast({ message: formatMessage(messages.saved), variant: 'success' });
  };

  const addButton = (
    <>
      {user.role !== ROLES.viewOnly && (
        <ModalTrigger>
          <Button variant="primary">
            <Icon>
              <Icons.Plus />
            </Icon>
            <Text>{formatMessage(labels.addWebsite)}</Text>
          </Button>
          <Modal title={formatMessage(labels.addWebsite)}>
            {close => <WebsiteAddForm onSave={handleSave} onClose={close} />}
          </Modal>
        </ModalTrigger>
      )}
    </>
  );

  return (
    <Page loading={isLoading} error={error}>
      {showHeader && <PageHeader title={formatMessage(labels.websites)}>{addButton}</PageHeader>}
      <WebsitesTable
        data={data}
        showTeam={showTeam}
        showEditButton={showEditButton}
        onChange={handleChange}
      />
    </Page>
  );
}

export default WebsitesList;
