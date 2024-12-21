import React from 'react';
import { Routes, Route } from 'react-router-dom';

import PageLayout from './pages/PageLayout';
import Home from './pages/Home';
import NoMatch from './pages/NoMatch';
import Bigtable from './pages/Bigtable';
import Datastore from './pages/Datastore';
import Firestore from './pages/Firestore';
import Pubsub from './pages/Pubsub';
import Spanner from './pages/Spanner';

function App(): React.ReactElement {
  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        <Route index element={<Home />} />
        <Route path="bigtable" element={<Bigtable />} />
        <Route path="datastore" element={<Datastore />} />
        <Route path="firestore" element={<Firestore />} />
        <Route path="pubsub" element={<Pubsub />} />
        <Route path="spanner" element={<Spanner />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  );
}

export default App;
