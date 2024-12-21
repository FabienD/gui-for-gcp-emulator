import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Nav from '../components/navigation/Nav';
import PageLogo from './PageLogo';
import { getVersion } from '@tauri-apps/api/app';
import Status from '../components/emulator/Status';

function PageLayout(): React.ReactElement {
  const [version, setVersion] = useState('');

  useEffect(() => {
    async function getAppVersion() {
      const appVersion = await getVersion();
      setVersion(appVersion);
    }

    if (version === '') {
      getAppVersion();
    }
  });

  return (
    <>
      <div className="fixed inset-y-0 z-50 flex w-48 flex-col">
        <nav className="h-full bg-gradient-to-b from-blue-950 to-blue-800">
          <PageLogo />
          <Nav title="Products" />
        </nav>
        <footer className="absolute bottom-2 left-2 text-xs	text-blue-300">
          version {version}
        </footer>
      </div>
      <main className="pl-48 py-5">
        <div className="mx-auto px-4">
          <Outlet />
          <Status />
        </div>
      </main>
    </>
  );
}

export default PageLayout;
