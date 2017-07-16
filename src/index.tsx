import * as React from "react";
import * as ReactDOM from "react-dom";
import {Router, Route, IndexRedirect, browserHistory} from "react-router";

import {App} from "./App";
import {DevView} from "./DevView";
import {PipelineTileMapHighCharts} from "./PipelineTileMapHighCharts";
import {PipelineGraph} from "./PipelineGraph";
import {Workers} from "./Workers";
import {TasksPanel} from "./components/tasks/Tasks";
import {PipelineStagesContainer} from "./PipelineStages";
import {ProjectsContainer} from "./Projects";
import {Dashboard} from "./Dashboard";

import "react-table/react-table.css"

import "./util/overrides.css";

const rootEl = document.getElementById("root");

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRedirect to="dashboard"/>
            <Route path="dashboard" component={Dashboard}/>
            <Route path="graph" component={PipelineGraph}/>
            <Route path="tilemap" component={PipelineTileMapHighCharts}/>
            <Route path="projects" component={ProjectsContainer}/>
            <Route path="stages" component={PipelineStagesContainer}/>
            <Route path="tasks" component={TasksPanel}/>
            <Route path="workers" component={Workers}/>
            <Route path="dev" component={DevView}/>
        </Route>
    </Router>, rootEl
);
