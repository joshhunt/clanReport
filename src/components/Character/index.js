import React from "react";
import { connect } from "react-redux";

import BungieImage from "src/components/BungieImage";

import s from "./styles.styl";

const name = def => def && def.displayProperties.name;

function Character({ character, classDef, genderDef, raceDef }) {
  const { red, green, blue, alpha } = character.emblemColor || {};

  const background =
    character.emblemColor && `rgba(${red}, ${green}, ${blue}, ${alpha})`;

  return (
    <div className={s.root} style={{ background }}>
      <BungieImage className={s.bgImage} src={character.emblemBackgroundPath} />
      <div className={s.content}>
        <div className={s.main}>
          <div className={s.charClass}>{name(classDef)}</div>
          <div className={s.genderRace}>
            {name(raceDef)} {name(genderDef)}
          </div>
        </div>

        <div className={s.sub}>
          <div className={s.light}>{character.light}</div>
          <div className={s.level}>
            Level {character.levelProgression.level}
          </div>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state, ownProps) {
  const { character } = ownProps;

  const classDefs = state.definitions.DestinyClassDefinition;
  const genderDefs = state.definitions.DestinyGenderDefinition;
  const raceDefs = state.definitions.DestinyRaceDefinition;

  const classDef = classDefs && classDefs[character.classHash];
  const genderDef = genderDefs && genderDefs[character.genderHash];
  const raceDef = raceDefs && raceDefs[character.raceHash];

  return {
    classDef,
    genderDef,
    raceDef
  };
}

export default connect(mapStateToProps)(Character);
