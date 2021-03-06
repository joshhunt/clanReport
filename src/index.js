import "./lib/ls";

import React from "react";
import ReactDOM from "react-dom";

import AppRouter from "./AppRouter";
import "./index.module.css";

const render = (App) => {
  ReactDOM.render(<App />, document.getElementById("root"));
};

render(AppRouter);
