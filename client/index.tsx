import * as React from "react";
import * as ReactDOM from "react-dom";
import {Router, Route, IndexRedirect, browserHistory} from "react-router";

import {App} from "./App";
import {PipelineTileMapHighCharts} from "./PipelineTileMapHighCharts";
import {PipelineGraph} from "./PipelineGraph";
import {Workers} from "./components/workers/Workers";
import {TasksPanel} from "./components/tasks/Tasks";
import {PipelineStages} from "./components/stages/PipelineStages";
import {Projects} from "./components/projects/Projects";
import {Dashboard} from "./Dashboard";

import "react-table/react-table.css"
import "./util/overrides.css";

require("file-loader?name=index.html!../index.html");


const rootEl = document.getElementById("root");

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRedirect to="dashboard"/>
            <Route path="dashboard" component={Dashboard}/>
            <Route path="graph" component={PipelineGraph}/>
            <Route path="tilemap" component={PipelineTileMapHighCharts}/>
            <Route path="projects" component={Projects}/>
            <Route path="stages" component={PipelineStages}/>
            <Route path="tasks" component={TasksPanel}/>
            <Route path="workers" component={Workers}/>
        </Route>
    </Router>, rootEl
);
