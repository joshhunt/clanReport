import React from 'react';
import { Link } from 'react-router';

import { PlatformIcon } from 'src/components/Icon';

import s from './styles.styl';

export default function PlayerLink({
  player,
  compareTriumphsLink,
  saveRecentPlayer
}) {
  const { membershipId, membershipType, displayName } = player;

  let link;

  if (compareTriumphsLink) {
    if (window.location.href.includes('?players=')) {
      link = `/compare-triumphs/${
        window.location.search
      },${membershipType}/${membershipId}`;
    } else {
      link = `/compare-triumphs/?players=${membershipType}/${membershipId}`;
    }
  } else {
    link = `/${membershipType}/${membershipId}`;
  }

  return (
    <Link
      className={s.root}
      key={membershipId}
      to={link}
      onClick={() => saveRecentPlayer && saveRecentPlayer(player)}
    >
      <PlatformIcon
        className={s.platformIcon}
        membershipType={membershipType}
      />
      {displayName}
    </Link>
  );
}
