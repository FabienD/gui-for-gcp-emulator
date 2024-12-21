import React, { useCallback, useContext, useEffect } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { TopicNameType, TopicType } from './Topic';
import { getTopic } from '../../api/gcp.pubsub';
import EmulatorContext, { EmulatorContextType } from '../../contexts/emulators';
import { SettingsType } from '../emulator/Settings';
import { labelsToString, shortName } from '../../utils/pubsub';

type TopicDefinitionProps = {
  open: boolean;
  topicName: TopicNameType | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function TopicDefinition({
  open,
  topicName,
  setOpen,
}: TopicDefinitionProps): React.ReactElement {
  const handleClose = () => setOpen(false);
  const { getEmulator } = useContext(EmulatorContext) as EmulatorContextType;
  const [topic, setTopic] = React.useState<TopicType | undefined>(undefined);
  const emulator = getEmulator();

  const getTopicCallback = useCallback(
    async (settings: SettingsType, topicName: TopicNameType) => {
      const response = await getTopic(settings, topicName);
      const content = await response.json();

      if (content !== undefined && content.name !== undefined) {
        setTopic(content);
      } else {
        setTopic(undefined);
      }
    },
    [],
  );

  useEffect(() => {
    if (emulator !== undefined && topicName !== undefined) {
      getTopicCallback(
        {
          host: emulator.host,
          port: emulator.port,
          project_id: emulator.project_id,
        },
        topicName,
      ).catch(console.error);
    }
  }, [topicName, emulator]);

  return (
    <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleClose}>
      {topic !== undefined && (
        <>
          <DialogTitle color="primary">Topic definition</DialogTitle>
          <DialogContent>
            <List>
              <ListItem key="short_name" dense>
                <ListItemText
                  primary="Short name"
                  secondary={shortName(topic.name)}
                />
              </ListItem>
              <ListItem key="name" dense>
                <ListItemText primary="Name" secondary={topic.name} />
              </ListItem>
              <ListItem key="labels" dense>
                <ListItemText
                  primary="Labels"
                  secondary={labelsToString(topic)}
                />
              </ListItem>
              <ListItem key="messageRetentionDuration" dense>
                <ListItemText
                  primary="Message retention duration"
                  secondary={topic.messageRetentionDuration}
                />
              </ListItem>
            </List>
          </DialogContent>
        </>
      )}
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TopicDefinition;
