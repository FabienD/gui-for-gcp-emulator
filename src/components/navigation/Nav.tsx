import React from 'react';
import { MenuList, Typography } from '@mui/material';
import NavItem, { NavItemProps } from './NavItem';

import bigtable from '../../assets/icons/bigtable.svg';
import firestore from '../../assets/icons/firestore.svg';
import pubsub from '../../assets/icons/pubsub.svg';
import spanner from '../../assets/icons/cloud_spanner.svg';
import datastore from '../../assets/icons/datastore.svg';

interface NavProps {
  title: string;
}

const items: Array<NavItemProps> = [
  { href: '/bigtable', icon: bigtable, name: 'Bigtable' },
  { href: '/datastore', icon: datastore, name: 'Datastore' },
  { href: '/firestore', icon: firestore, name: 'Firestore' },
  { href: '/pubsub', icon: pubsub, name: 'Pub/Sub' },
  { href: '/spanner', icon: spanner, name: 'Spanner' },
];

function Nav({ title }: NavProps): React.ReactElement {
  const navItems = items.map((item, index) => (
    <NavItem key={index} {...item} />
  ));

  return (
    <>
      <Typography className="py-4 pl-4 font-bold text-white">
        {title}
      </Typography>
      <MenuList>{navItems}</MenuList>
    </>
  );
}

export default Nav;
