import React from "react";
import { connect } from "react-redux";
import cx from "classnames";

import s from "./styles.styl";

function Objective({ def, instance }) {
  const percentage =
    Math.min(instance.progress / instance.completionValue, 1) * 100;

  return (
    <div className={s.objective}>
      <div className={instance.complete ? s.checkboxTicked : s.checkboxEmpty} />

      <div className={s.objectiveMain}>
        <div className={s.objectiveTrack} style={{ width: `${percentage}%` }} />

        <div className={s.objectiveText}>
          {(def && def.progressDescription) || "Completed"}
        </div>

        <div className={s.objectiveProgress}>
          {instance.progress}
          <span className={s.slash}> / </span>
          {instance.completionValue}
        </div>
      </div>
    </div>
  );
}

function Objectives({ className, objectives, objectiveDefs }) {
  return (
    <div className={cx(s.objectives, className)}>
      {objectives.map(obj => {
        const def = objectiveDefs[obj.objectiveHash];
        return <Objective def={def} instance={obj} />;
      })}
    </div>
  );
}

function mapStateToProps({ definitions }) {
  return {
    objectiveDefs: definitions.DestinyObjectiveDefinition || {}
  };
}

export default connect(mapStateToProps)(Objectives);
