import React, { useContext, useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

import { invoke } from '@tauri-apps/api/core';
import { Alert, Box, InputAdornment, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import BoltIcon from '@mui/icons-material/Bolt';

import EmulatorContext, { EmulatorContextType } from '../../contexts/emulators';

type SettingsType = {
  host: string;
  port: number;
  project_id: string;
};

function EmulatorSettings({
  host,
  port,
  project_id,
}: SettingsType): React.ReactElement {
  const { saveEmulator } = useContext(EmulatorContext) as EmulatorContextType;
  const [settings, setSettings] = useState<SettingsType>();
  const [checkConnection, setIsCheckConnection] = useState<boolean | undefined>(
    undefined,
  );

  const { control, handleSubmit } = useForm({
    defaultValues: {
      host,
      port,
      project_id,
    },
  });
  const onSubmit: SubmitHandler<SettingsType> = (data): void => {
    setSettings({
      host: data.host,
      port: parseInt(data.port.toString()),
      project_id: data.project_id,
    });
  };

  useEffect(() => {
    if (settings != undefined) {
      invoke<boolean>('check_connection', { ...settings }).then((res): void => {
        if (res) {
          saveEmulator({ ...settings, is_connected: true });
          setIsCheckConnection(true);
        } else {
          setIsCheckConnection(false);
        }
      });

      setTimeout(resetAlerts, 3000);
    }
  }, [settings]);

  const resetAlerts = () => {
    setIsCheckConnection(undefined);
  };

  return (
    <>
      <Box
        component="form"
        name="settings"
        noValidate
        autoComplete="off"
        className="flex gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="host"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              required
              id="host"
              label="Host"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">http://</InputAdornment>
                  ),
                },
              }}
              size="small"
              variant="filled"
            />
          )}
        />

        <Controller
          name="port"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              required
              id="port"
              type="number"
              label="port"
              size="small"
              variant="filled"
            />
          )}
        />

        <Controller
          name="project_id"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              required
              id="project_id"
              label="Project id"
              size="small"
              variant="filled"
            />
          )}
        />

        <Button
          variant="contained"
          size="small"
          type="submit"
          startIcon={<BoltIcon />}
        >
          Connect
        </Button>

        {checkConnection === false && (
          <Alert severity="error">Unable to connect.</Alert>
        )}
        {checkConnection === true && (
          <Alert severity="success">Emulator is connected.</Alert>
        )}
      </Box>
    </>
  );
}

export default EmulatorSettings;
export type { SettingsType };
