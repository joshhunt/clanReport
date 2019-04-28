import React, { Component } from "react";
import { Link } from "react-router";
import cx from "classnames";

import BungieImage from "src/components/BungieImage";
import Icon from "src/components/Icon";

import s from "./styles.styl";

export function Player({ className, userInfo, children, linkedActivityId }) {
  const hasLink = linkedActivityId && linkedActivityId !== "0";
  return (
    <a
      className={cx(className, s.player)}
      target="_blank"
      rel="noopener"
      href={hasLink && `https://destinytracker.com/d2/pgcr/${linkedActivityId}`}
    >
      <div className={s.playerWell}>
        <BungieImage className={s.playerIcon} src={userInfo.iconPath} />
      </div>

      <div className={s.playerMain}>
        <div className={s.playerName}>{userInfo.displayName}</div>
        <div className={s.playerAlt}>{children}</div>
      </div>

      {hasLink && (
        <div className={s.iconWell}>
          <Icon name="external-link-square" />
        </div>
      )}
    </a>
  );
}

export default class PlayerList extends Component {
  render() {
    const {
      entries,
      title,
      small,
      titleLink,
      playerClassName,
      className
    } = this.props;

    console.log({ entries });

    return (
      <div className={cx(className, s.root, { [s.small]: small })}>
        <div className={s.top}>
          <h3 className={s.title}>
            <Link to={titleLink}>{title}</Link>
          </h3>
        </div>

        <ol className={s.list}>
          {entries.map((entry, index) => (
            <li className={s.listItem} key={index}>
              <Player
                userInfo={entry.player.destinyUserInfo}
                className={playerClassName}
                linkedActivityId={entry.value.activityId}
              >
                {entry.value.basic.displayValue}
              </Player>
            </li>
          ))}
        </ol>
      </div>
    );
  }
}
