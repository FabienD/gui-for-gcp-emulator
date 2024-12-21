import React, { useContext } from 'react';
import TopicList from './TopicList';
import TopicCreate from './TopicCreate';
import Alert from '@mui/material/Alert';
import EmulatorContext, { EmulatorContextType } from '../../contexts/emulators';

type TopicNameType = {
  readonly name: string;
};

type TopicType = TopicNameType & {
  readonly labels?: {
    [key: string]: string;
  };
  readonly messageRetentionDuration?: string;
  readonly messageStoragePolicy?: messageStoragePolicy;
  readonly schemaSettings?: schemaSettings;
};

type messageStoragePolicy = {
  readonly allowedPersistenceRegions: Array<string>;
  readonly enforceInTransit: boolean;
};

type schemaSettings = {
  readonly schema: string;
  encoding: string;
  firstRevisionId: string;
  lastRevisionId: string;
};

type TopicProps = {
  topics: TopicType[];
  setTopics: React.Dispatch<React.SetStateAction<TopicType[]>>;
  getTopicsCallback: any;
};

function Topic({
  topics,
  setTopics,
  getTopicsCallback,
}: TopicProps): React.ReactElement {
  const { isConnected } = useContext(EmulatorContext) as EmulatorContextType;

  return isConnected() ? (
    <>
      <TopicCreate topics={topics} setTopics={setTopics} />
      <TopicList
        topics={topics}
        setTopics={setTopics}
        getTopicsCallback={getTopicsCallback}
      />
    </>
  ) : (
    <Alert severity={isConnected() ? 'info' : 'warning'}>
      The emulator is not configured or the connection is not validated.
    </Alert>
  );
}

export default Topic;
export type { TopicNameType, TopicType };
