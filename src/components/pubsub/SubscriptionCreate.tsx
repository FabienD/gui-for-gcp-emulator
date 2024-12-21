import React, { useCallback, useContext } from 'react';

import {
  Alert,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import EmulatorContext, { EmulatorContextType } from '../../contexts/emulators';
import { createSubscription } from '../../api/gcp.pubsub';
import { SettingsType } from '../emulator/Settings';
import { SubscriptionType } from './Subscription';
import { TopicType } from './Topic';

type SubscriptionCreateProps = {
  topics: TopicType[];
  subscriptions: SubscriptionType[];
  setSubscriptions: React.Dispatch<React.SetStateAction<SubscriptionType[]>>;
};

type SubscriptionFormType = {
  name: string;
  topic: string;
  pushConfig: boolean;
  pushEndpoint?: string;
};

function buildSubscription(data: SubscriptionFormType): SubscriptionType {
  if (
    data.pushConfig &&
    data.pushEndpoint != undefined &&
    data.pushEndpoint != ''
  ) {
    const subscription: SubscriptionType = {
      name: data.name,
      topic: data.topic,
      pushConfig: {
        pushEndpoint: data.pushEndpoint,
      },
    };
    return subscription;
  }

  const subscription: SubscriptionType = {
    name: data.name,
    topic: data.topic,
  };

  return subscription;
}

function SubscriptionCreate({
  topics,
  subscriptions,
  setSubscriptions,
}: SubscriptionCreateProps): React.ReactElement {
  const { getEmulator } = useContext(EmulatorContext) as EmulatorContextType;
  const emulator = getEmulator();

  const [Error, setError] = React.useState<string | undefined>(undefined);
  const [IsCreated, setIsCreated] = React.useState(false);

  const { control, watch, reset, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      topic: '',
      pushConfig: false,
      pushEndpoint: '',
    },
  });
  const watchPushConfig = watch('pushConfig');

  const createSubscriptionCallback = useCallback(
    async (settings: SettingsType, subscription: SubscriptionType) => {
      const response = await createSubscription(settings, subscription);
      const status = response.status;
      const content = await response.json();

      if (status === 200 && content != undefined && content.name != undefined) {
        setIsCreated(true);
        setSubscriptions([...subscriptions, content]);
        reset();
      } else {
        if (content.error != undefined && content.error.message != undefined) {
          setError(content.error.message);
        } else {
          setError('Unknown error');
        }
      }

      setTimeout(resetAlerts, 3000);
    },
    [subscriptions],
  );

  const onSubmit: SubmitHandler<SubscriptionFormType> = (Formdata): void => {
    resetAlerts();

    if (Formdata.name === undefined || Formdata.name === '') {
      setError('Subscription name is required');
      return;
    }
    if (Formdata.topic === undefined || Formdata.topic === '') {
      setError('Topic name is required');
      return;
    }

    if (emulator != undefined) {
      createSubscriptionCallback(emulator, buildSubscription(Formdata)).catch(
        console.error,
      );
      reset();
    }
  };

  const resetAlerts = () => {
    setIsCreated(false);
    setError(undefined);
  };

  return (
    <>
      <Box
        component="form"
        name="subscition_create"
        noValidate
        autoComplete="off"
        className="grid grid-cols-2 gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              required
              id="name"
              label="Name"
              size="small"
              variant="filled"
            />
          )}
        />

        <Controller
          name="topic"
          control={control}
          render={({ field }) => (
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel
                id="subscription-topic-select-label"
                size="small"
                variant="filled"
              >
                Topic name
              </InputLabel>
              <Select
                {...field}
                required
                id="topic"
                labelId="subscription-topic-select-label"
                label="Topic"
                size="small"
                variant="filled"
              >
                {topics.map(topic => (
                  <MenuItem value={topic.name} key={topic.name}>
                    {topic.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        <Controller
          name="pushConfig"
          control={control}
          render={({ field }) => (
            <FormGroup>
              <FormControlLabel
                control={<Switch {...field} id="pushConfig" />}
                label="Push Subscription"
              />
            </FormGroup>
          )}
        />

        {watchPushConfig && (
          <Controller
            name="pushEndpoint"
            control={control}
            render={({ field }) => (
              <FormControl component="fieldset" className="col-span-2">
                <FormLabel component="legend">Push config</FormLabel>
                <FormGroup>
                  <TextField
                    {...field}
                    id="pushEndpoint"
                    label="Endpoint"
                    size="small"
                    variant="filled"
                  />
                </FormGroup>
              </FormControl>
            )}
          />
        )}

        <Box className="col-span-2">
          <Button variant="contained" type="submit" className="mt-2 mb-5">
            Create
          </Button>
          {Error != undefined && <Alert severity="error">{Error}</Alert>}
          {IsCreated && (
            <Alert severity="success">Subscription is created</Alert>
          )}
        </Box>
      </Box>
      <Box></Box>
    </>
  );
}

export default SubscriptionCreate;
