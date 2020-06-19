import React from "react";
import { memoize } from "lodash";

import Item from "../Item";

import s from "./styles.module.css";

const getTotalPrimevalDamage = memoize((teamMembers) => {
  return teamMembers.reduce((acc, teamMember) => {
    return (
      acc +
      (teamMember.extended.values.primevalDamage
        ? teamMember.extended.values.primevalDamage.basic.value
        : 0)
    );
  }, 0);
});

function percent(fraction) {
  if (isNaN(fraction)) {
    return "-";
  }
  return `${Math.round(fraction * 100)}%`;
}

export function stat(stats, statName) {
  return stats[statName] && stats[statName].basic.displayValue;
}

const field = (label, statKey) => ({ label, stat: statKey });

const WEAPONS_FIELD = field("weapons", (stats, teamMember) => {
  return (
    teamMember.extended.weapons &&
    teamMember.extended.weapons.map((weapon) => {
      return <Item className={s.item} hash={weapon.referenceId} />;
    })
  );
});

const GAMBIT_FIELDS = [
  field("most deposited", "motesDeposited"),
  field("picked up", "motesPickedUp"),
  field("lost", "motesLost"),
  field("denied", "motesDenied"),
  field("degraded", "motesDegraded"),
  field("invasions", "invasions"),
  field("invader deaths", "invaderDeaths"),
  field("invaders killed", "invaderKills"),
  field("invasion kills", "invasionKills"),
  field("primeval damage", (stats, teamMember, teamMembers) => {
    return stats.primevalDamage
      ? percent(
          stats.primevalDamage.basic.value / getTotalPrimevalDamage(teamMembers)
        )
      : null;
  }),
  field("blockers", (stats) => {
    return [
      `${stat(stats, "smallBlockersSent")}`,
      `${stat(stats, "mediumBlockersSent")}`,
      `${stat(stats, "largeBlockersSent")}`,
    ].join(" / ");
  }),
  WEAPONS_FIELD,
];

const FALLBACK_FIELDS = [WEAPONS_FIELD];

const activityHashIs = (pgcr, hash) =>
  pgcr.activityDetails.directorActivityHash === hash;

export default [
  {
    test: (pgcr) =>
      activityHashIs(pgcr, 3577607128) || activityHashIs(pgcr, 1183187383),
    fields: GAMBIT_FIELDS,
  },

  {
    test: (pgcr) => pgcr.activityDetails.modes.includes(5),
    fields: [WEAPONS_FIELD],
  },

  { test: () => true, fields: FALLBACK_FIELDS },
];
