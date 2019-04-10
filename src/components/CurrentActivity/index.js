import React from "react";
import { connect } from "react-redux";

function CurrentActivity({
  currentActivity,
  currentActivityDef,
  currentActivityModeDef
}) {
  return (
    <div>
      {currentActivityDef && (
        <span>
          {currentActivityModeDef &&
            `${currentActivityModeDef.displayProperties.name}: `}
          {currentActivityDef.displayProperties.name}{" "}
        </span>
      )}
    </div>
  );
}

function mapStateToProps(state, ownProps) {
  const { currentActivity } = ownProps;
  const {
    definitions: { DestinyActivityDefinition, DestinyActivityModeDefinition }
  } = state;

  let currentActivityDef =
    DestinyActivityDefinition &&
    currentActivity &&
    DestinyActivityDefinition[currentActivity.currentActivityHash];

  const currentActivityModeDef =
    DestinyActivityModeDefinition &&
    currentActivity &&
    DestinyActivityModeDefinition[currentActivity.currentActivityModeHash];

  return {
    currentActivityDef,
    currentActivityModeDef
  };
}

export default connect(mapStateToProps)(CurrentActivity);
