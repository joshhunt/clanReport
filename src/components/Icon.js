import React from "react";

const MembershipType = {
  Xbox: 1,
  Playstation: 2,
  Steam: 3,
  BattleNet: 4,
  Stadia: 5
};

const Icon = ({ name, solid, regular, light, duotone, brand, ...rest }) => {
  const prefix =
    {
      [solid ? "true" : "false"]: "fas",
      [regular ? "true" : "false"]: "far",
      [light ? "true" : "false"]: "fal",
      [duotone ? "true" : "false"]: "fad",
      [brand ? "true" : "false"]: "fab"
    }["true"] || "far";

  return <span className={`${prefix} fa-${name}`} {...rest}></span>;
};

export default Icon;

export const PlatformIcon = ({ type, ...rest }) => {
  const iconMap = {
    [MembershipType.Xbox]: "xbox",
    [MembershipType.Playstation]: "playstation",
    [MembershipType.Steam]: "steam",
    [MembershipType.BattleNet]: "battle-net",
    [MembershipType.Stadia]: "google"
  };

  return (
    <Icon
      brand
      name={iconMap[type.toString ? type.toString() : type]}
      {...rest}
    />
  );
};
