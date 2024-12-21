import React, { useCallback, useContext, useState } from 'react';

import { Alert, Button, Tooltip } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';

import { SubscriptionNameType, SubscriptionType } from './Subscription';
import { SettingsType } from '../emulator/Settings';
import { deleteSubscription } from '../../api/gcp.pubsub';
import EmulatorContext, { EmulatorContextType } from '../../contexts/emulators';
import PullMessage from './PullMessage';
import { Refresh } from '@mui/icons-material';
import { shortName } from '../../utils/pubsub';

type SubscriptionsListProps = {
  subscriptions: SubscriptionType[];
  setSubscriptions: React.Dispatch<React.SetStateAction<SubscriptionType[]>>;
  getSubscriptionsCallback: any;
};

function SubscriptionList({
  subscriptions,
  setSubscriptions,
  getSubscriptionsCallback,
}: SubscriptionsListProps): React.ReactElement {
  const { getEmulator } = useContext(EmulatorContext) as EmulatorContextType;
  const emulator = getEmulator();
  const [open, setOpen] = useState(false);
  const [subscriptionName, setSubscriptionName] =
    useState<SubscriptionNameType>();

  const handleDeleteClick = (id: GridRowId) => () => {
    deleteSubscriptionAction(id.toString());
  };

  const handlePullMessageClick = (id: GridRowId) => () => {
    setOpen(true);
    setSubscriptionName({ name: id.toString() });
  };

  const handleSubscriptionsRefresh = () => {
    if (emulator != undefined) {
      getSubscriptionsCallback({
        host: emulator.host,
        port: emulator.port,
        project_id: emulator.project_id,
      });
    }
  };

  const deleteSubscriptionCallback = useCallback(
    async (settings: SettingsType, subscriptionName: SubscriptionNameType) => {
      const response = await deleteSubscription(settings, subscriptionName);
      const status = response.status;

      if (status == 200) {
        const filteredTopics = subscriptions.filter(
          (t: SubscriptionType) => t.name !== subscriptionName.name,
        );
        setSubscriptions(filteredTopics);
      }
    },
    [subscriptions],
  );

  const deleteSubscriptionAction = useCallback(
    async (id: string) => {
      if (emulator != undefined) {
        deleteSubscriptionCallback(
          {
            host: emulator.host,
            port: emulator.port,
            project_id: emulator.project_id,
          },
          {
            name: id,
          },
        ).catch(console.error);
      }
    },
    [emulator, deleteSubscriptionCallback],
  );

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Subscription ID',
      width: 150,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 100,
    },
    {
      field: 'topic',
      headerName: 'Topic',
      width: 100,
    },
    {
      field: 'pushEndpoint',
      headerName: 'Push endpoint',
      width: 300,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <Tooltip title="Delete">
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />
          </Tooltip>,
          <Tooltip title="Pull Message">
            <GridActionsCellItem
              icon={<MarkChatReadIcon />}
              label="Pull Message"
              onClick={handlePullMessageClick(id)}
              color="inherit"
            />
          </Tooltip>,
        ];
      },
    },
  ];

  const rows = subscriptions.map((subscription: SubscriptionType) => {
    return {
      id: subscription.name,
      name: shortName(subscription.name),
      topic: shortName(subscription.topic),
      type: subscription.pushConfig?.pushEndpoint ? 'push' : 'pull',
      pushEndpoint: subscription.pushConfig?.pushEndpoint,
    };
  });

  return (
    <>
      {subscriptions.length == 0 ? (
        <Alert severity="info" className="my-5">
          No subscriptions
        </Alert>
      ) : (
        <div className="mt-10 w-full">
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10]}
          />
          <PullMessage
            open={open}
            setOpen={setOpen}
            subscriptionName={subscriptionName}
          />
          <Button onClick={handleSubscriptionsRefresh} startIcon={<Refresh />}>
            Subscriptions list
          </Button>
        </div>
      )}
    </>
  );
}

export default SubscriptionList;
