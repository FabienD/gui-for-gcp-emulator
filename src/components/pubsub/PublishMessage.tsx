import React, { useContext } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';

import { TopicNameType } from './Topic';
import { publishMessage } from '../../api/gcp.pubsub';
import EmulatorContext, { EmulatorContextType } from '../../contexts/emulators';

type PublishMessageProps = {
  open: boolean;
  topicName: TopicNameType | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

interface PubSubMessageAttributeType {
  [key: string]: string;
}

interface PubSubMessageType {
  attributes: PubSubMessageAttributeType[] | undefined;
  data: string;
}

interface PubSubMessageForm {
  messageData: string;
}

function PublishMessage({
  open,
  topicName,
  setOpen,
}: PublishMessageProps): React.ReactElement {
  const { getEmulator } = useContext(EmulatorContext) as EmulatorContextType;
  const [Error, setError] = React.useState<string | undefined>(undefined);
  const [IsPublished, setIsPublished] = React.useState(false);
  const emulator = getEmulator();

  const { handleSubmit, control, reset } = useForm<PubSubMessageForm>({
    defaultValues: {
      messageData: '',
    },
  });

  const onSubmit: SubmitHandler<PubSubMessageForm> = async data => {
    resetAlerts();

    const message = {
      attributes: undefined,
      data: btoa(data.messageData),
    };
    if (topicName !== undefined && emulator !== undefined) {
      const response = await publishMessage(emulator, topicName, message);
      const status = response.status;
      const content = await response.json();

      if (
        status === 200 &&
        content != undefined &&
        content.messageIds != undefined
      ) {
        setIsPublished(true);
        reset();
      } else {
        if (content.error != undefined && content.error.message != undefined) {
          setError(content.error.message);
        } else {
          setError('Unknown error');
        }
      }
    }

    reset();
    setTimeout(() => {
      resetStates();
    }, 5000);
  };

  const resetAlerts = () => {
    setIsPublished(false);
    setError(undefined);
  };

  const resetStates = () => {
    resetAlerts();
    setOpen(false);
  };

  const handleClose = () => resetStates();

  return (
    <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleClose}>
      {topicName !== undefined && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Publish message</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography variant="subtitle1" marginBottom={2}>
                Define the <strong>raw value</strong> of the pubsub{' '}
                <strong>data message attribute only</strong>. The raw content
                will be base64 encoded by the application.
              </Typography>
              <Controller
                name="messageData"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="pubsub-message-data"
                    label="Raw data attribute value"
                    multiline
                    rows={15}
                    fullWidth={true}
                  />
                )}
              />
            </DialogContentText>
            {Error != undefined && <Alert severity="error">{Error}</Alert>}
            {IsPublished && (
              <Alert severity="success">Message is published</Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button
              variant="contained"
              size="small"
              type="submit"
              onClick={handleSubmit(onSubmit)}
            >
              Publish
            </Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
}

export default PublishMessage;
export type { PubSubMessageType };
