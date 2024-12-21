import { createContext, useState } from 'react';

export type Emulator = {
  host: string;
  port: number;
  project_id: string;
  is_connected: boolean;
};

export type EmulatorContextType = {
  emulator: Emulator | undefined;
  saveEmulator: (emulator: Emulator) => void;
  isConnected: () => boolean;
  getEmulator: () => Emulator | undefined;
};

const EmulatorContext = createContext<EmulatorContextType | null>(null);

function EmulatorProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [emulator, setEmulator] = useState<Emulator>();

  const saveEmulator = (emulator: Emulator): void => {
    setEmulator(emulator);
  };

  const isConnected = (): boolean => {
    if (emulator !== undefined) {
      return emulator.is_connected;
    }

    return false;
  };

  const getEmulator = (): Emulator | undefined => {
    return emulator;
  };

  const valueToShare = {
    emulator,
    saveEmulator,
    isConnected,
    getEmulator,
  };

  return (
    <EmulatorContext.Provider value={valueToShare}>
      {children}
    </EmulatorContext.Provider>
  );
}

export { EmulatorProvider };
export default EmulatorContext;
