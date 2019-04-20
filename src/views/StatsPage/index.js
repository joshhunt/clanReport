import React, { useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";

import ReactTable from "react-table";
import "react-table/react-table.css";

import TriumphSummary from "src/components/TriumphSummary";
import PrettyDate from "src/components/Date";

function makeRows(data, voluspaData) {
  return Object.entries(data).map(([hash, score]) => ({
    hash,
    score,
    voluspa: voluspaData && Number(voluspaData[hash])
  }));
}

function percent(value, total) {
  const raw = (value / total) * 100;
  return Math.round(raw * 100) / 100;
}

function fetchStats() {
  return fetch("https://api.clan.report/results.json").then(r => r.json());
}

const RECORDS = "records";
const COLLECTIBLES = "collectibles";
const VALID_MODES = [RECORDS, COLLECTIBLES];
const TYPE_MAP = {
  [RECORDS]: "Record",
  [COLLECTIBLES]: "Collectible"
};

function StatsPage({
  DestinyRecordDefinition,
  DestinyCollectibleDefinition,
  route
}) {
  const mode = route.mode;
  const DEFINITION_MAP = {
    [RECORDS]: DestinyRecordDefinition,
    [COLLECTIBLES]: DestinyCollectibleDefinition
  };

  const [statsResponse, setStatsResponse] = useState();
  const [voluspaTriumphs, setVoluspaTriumphs] = useState();

  console.log("running...");

  useEffect(() => {
    fetchStats().then(setStatsResponse);
  }, []);

  useEffect(() => {
    fetch("https://voluspa-a.braytech.org/statistics/triumphs")
      .then(r => r.json())
      .then(d => setVoluspaTriumphs(d.Response.data));
  }, []);

  const definition = DEFINITION_MAP[mode];

  if (!VALID_MODES.includes(mode)) {
    return <h2>invalid mode</h2>;
  }

  if (!statsResponse || !definition) {
    return <pre>loading...</pre>;
  }

  const baseStats = statsResponse[mode];

  const baseline = Object.values(baseStats).reduce((acc, score) => {
    return Math.max(acc, score);
  }, 0);

  const rows = Object.values(definition)
    .filter(def => def.displayProperties.name)
    .map(def => {
      return {
        def,
        hash: def && def.hash,
        score: baseStats[def.hash] || 0,
        voluspa: voluspaTriumphs && voluspaTriumphs[def.hash]
      };
    });

  const columns = [
    {
      Header: "Row",
      accessor: "hash",
      filterable: true,
      filterMethod: ({ value }, secondArg) => {
        const def = secondArg._original.def;

        return (
          def &&
          def.displayProperties.name
            .toLowerCase()
            .includes(value && value.toLowerCase())
        );
      },
      Cell: props => {
        return (
          <span>
            <TriumphSummary
              record={props.original.def}
              typeOverride={TYPE_MAP[mode]}
            />
          </span>
        );
      }
    },
    {
      Header: "# obtained",
      accessor: "score",
      Cell: props => <span>{props.value.toLocaleString()}</span>,
      filterable: false
    },
    {
      Header: "% obtained",
      accessor: "score",
      filterable: false,
      Cell: props => <span>{percent(props.value, baseline)}%</span>
    },
    mode === RECORDS && {
      Header: "VOLUSPA",
      accessor: "voluspa",
      Cell: props => <span>{props.value}%</span>
    }
  ].filter(Boolean);

  return (
    <div>
      <h2>Stats - {TYPE_MAP[mode]}</h2>

      <p>
        <Link to="/stats/collectibles">Collectibles</Link>
        {" // "}
        <Link to="/stats/records">Records</Link>
      </p>

      <p>
        <div>baseline: {baseline.toLocaleString()}</div>
        <div>duration: {statsResponse.duration / 1000}s</div>
        <div>
          stats from <PrettyDate date={statsResponse.createdAt} />
        </div>
      </p>

      <ReactTable data={rows} columns={columns} />
    </div>
  );
}

function mapStateToProps(state) {
  return {
    DestinyRecordDefinition: state.definitions.DestinyRecordDefinition,
    DestinyCollectibleDefinition: state.definitions.DestinyCollectibleDefinition
  };
}

export default connect(mapStateToProps)(StatsPage);