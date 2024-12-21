import React, { useContext } from 'react';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CloseIcon from '@mui/icons-material/Close';
import { NavLink } from 'react-router-dom';
import { Box, CardContent, Typography } from '@mui/material';
import EmulatorSettings from '../components/emulator/Settings';
import EmulatorContext, { EmulatorContextType } from '../contexts/emulators';

function Home(): React.ReactElement {
  const { getEmulator } = useContext(EmulatorContext) as EmulatorContextType;

  const emulator = getEmulator();

  return (
    <>
      <Typography variant="h1">GUI for GCP Emulators</Typography>

      <Typography variant="body1">
        This application provides a graphical interface for interacting with{' '}
        <a
          href="https://cloud.google.com/sdk/gcloud/reference/beta/emulators"
          target="_blank"
          className="underline decoration-solid underline-offset-4 decoration-pink-500"
          rel="noreferrer"
        >
          Google Cloud Platform™ Emulators
        </a>
        .
        <br />
        It&apos;s{' '}
        <span className="underline decoration-solid underline-offset-4 decoration-pink-500">
          not an official
        </span>{' '}
        Google™ application.
      </Typography>
      <Typography variant="body1" className="mt-4">
        I started the project as a simple test, to play with Tauri-App V2,
        ReactJs & Typescript and finally implement something that works with
        Pub/Sub. The project is under development and doesn&apos;t cover all the
        emulator APIs and isn&apos;t covered by tests. Despite this, I found the
        project useful and decided to keep it and develop it further.
      </Typography>

      <Typography variant="h2">Let&apos;s play</Typography>
      <EmulatorSettings
        host={emulator ? emulator.host : 'localhost'}
        port={emulator ? emulator.port : 8085}
        project_id={emulator ? emulator.project_id : 'project_id'}
      />

      <Typography variant="h2">The state of the project</Typography>

      <Box className="flex">
        <CardContent className="bg-green-100 rounded-xl p-4 mx-4 w-1/2">
          <Typography
            variant="h3"
            className="text-sm font-semibold text-green-800 uppercase"
          >
            Partially supported
          </Typography>
          <ul className="my-4 text-green-800 text-sm">
            <li>
              <NavLink to="/pubsub">Pub/Sub </NavLink>
              <CheckBoxIcon className="text-green-800" />
            </li>
          </ul>
        </CardContent>

        <CardContent className="bg-pink-100 rounded-xl p-4 mx-4  w-1/2">
          <Typography
            variant="h3"
            className="text-sm font-semibold text-pink-900 uppercase"
          >
            Not implemented
          </Typography>
          <ul className="my-4 text-pink-800 text-sm">
            <li>
              Bigtable <CloseIcon className="text-pink-800" />
            </li>
            <li>
              Datastore <CloseIcon className="text-pink-800" />
            </li>
            <li>
              Firestore <CloseIcon className="text-pink-800" />
            </li>
            <li>
              Spanner <CloseIcon className="text-pink-800" />
            </li>
          </ul>
        </CardContent>
      </Box>
      <Typography variant="body1" className="my-4">
        <strong>The project is Open Source</strong>,{' '}
        <a
          href="https://github.com/FabienD/gui-for-gcp-emulator"
          target="_blank"
          className="underline decoration-solid underline-offset-4 decoration-pink-500"
          rel="noreferrer"
        >
          feel free to contribute and/or use it
        </a>
        .
      </Typography>
    </>
  );
}

export default Home;
