import React, { useCallback, useContext, useState } from 'react';

import { Refresh } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import InfoIcon from '@mui/icons-material/Info';
import MessageIcon from '@mui/icons-material/Message';
import { Alert, Button, Tooltip } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
} from '@mui/x-data-grid';

import { deleteTopic } from '../../api/gcp.pubsub';
import EmulatorContext, { EmulatorContextType } from '../../contexts/emulators';
import { labelsToString, shortName } from '../../utils/pubsub';
import { SettingsType } from '../emulator/Settings';
import PublishMessage from './PublishMessage';
import { TopicNameType, TopicType } from './Topic';
import TopicDefinition from './TopicDefinition';

type TopicListProps = {
  topics: TopicType[];
  setTopics: React.Dispatch<React.SetStateAction<TopicType[]>>;
  getTopicsCallback: any;
};

function TopicList({
  topics,
  setTopics,
  getTopicsCallback,
}: TopicListProps): React.ReactElement {
  const [openPublishMessage, setOpenPublishMessage] = useState(false);
  const [openTopicDefinition, setOpenTopicDefinition] = useState(false);
  const [topicName, setTopicName] = useState<TopicNameType>();
  const { getEmulator } = useContext(EmulatorContext) as EmulatorContextType;
  const emulator = getEmulator();

  const handleDeleteClick = (id: GridRowId) => () => {
    deleteTopicAction({ name: id.toString() });
  };

  const handleMessageClick = (id: GridRowId) => () => {
    setTopicName({ name: id.toString() });
    setOpenPublishMessage(true);
  };

  const handleDefinitionClick = (id: GridRowId) => () => {
    setTopicName({ name: id.toString() });
    setOpenTopicDefinition(true);
  };

  const handleTopicsRefresh = () => {
    if (emulator != undefined) {
      getTopicsCallback({
        host: emulator.host,
        port: emulator.port,
        project_id: emulator.project_id,
      });
    }
  };

  const deleteTopicCallback = useCallback(
    async (settings: SettingsType, topicName: TopicNameType) => {
      const response = await deleteTopic(settings, topicName);
      const status = response.status;

      if (status == 200) {
        const filteredTopics = topics.filter(
          (t: TopicType) => shortName(t.name) !== topicName.name,
        );
        setTopics(filteredTopics);
      }
    },
    [topics],
  );

  const deleteTopicAction = useCallback(
    async (topicName: TopicNameType) => {
      if (emulator != undefined) {
        deleteTopicCallback(
          {
            host: emulator.host,
            port: emulator.port,
            project_id: emulator.project_id,
          },
          {
            name: topicName.name,
          },
        ).catch(console.error);
      }
    },
    [emulator, deleteTopicCallback],
  );

  const columns: GridColDef[] = [
    {
      headerName: 'ID',
      field: 'id',
      minWidth: 150,
    },
    {
      headerName: 'Name',
      field: 'name',
      flex: 1,
    },
    {
      headerName: 'Labels',
      field: 'labels',
      minWidth: 200,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      minWidth: 150,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <Tooltip title="Information" key="information">
            <GridActionsCellItem
              icon={<InfoIcon />}
              label="Information"
              onClick={handleDefinitionClick(id)}
              color="inherit"
            />
          </Tooltip>,
          <Tooltip title="Publish a message" key="publish">
            <GridActionsCellItem
              icon={<MessageIcon />}
              label="Publish a message"
              onClick={handleMessageClick(id)}
              color="inherit"
            />
          </Tooltip>,
          <Tooltip title="Delete" key="delete">
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />
          </Tooltip>,
        ];
      },
    },
  ];

  const rows = topics.map((topic: TopicType) => {
    return {
      id: shortName(topic.name),
      name: topic.name,
      labels: labelsToString(topic),
      //messageRetentionDuration: topic.messageRetentionDuration,
      //state: topic.state,
      //messageStoragePolicy: topic.messageStoragePolicy,
      //schemaSettings: topic.schemaSettings
    };
  });

  return (
    <>
      {topics.length == 0 ? (
        <Alert severity="info" className="my-5">
          No topics
        </Alert>
      ) : (
        <>
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
            <Button onClick={handleTopicsRefresh} startIcon={<Refresh />}>
              topics list
            </Button>
          </div>

          <PublishMessage
            open={openPublishMessage}
            setOpen={setOpenPublishMessage}
            topicName={topicName}
          />
          <TopicDefinition
            open={openTopicDefinition}
            setOpen={setOpenTopicDefinition}
            topicName={topicName}
          />
        </>
      )}
    </>
  );
}

export default TopicList;
