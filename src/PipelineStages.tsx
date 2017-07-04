import * as React from "react";
import {graphql} from "react-apollo";
import gql from "graphql-tag";

import {PipelineStageTable} from "./PipelineStageTable";
import {Loading} from "./Loading";
import {PipelineStageCreate} from "./PipelineStageCreate";
import {ProjectMenuNavbar} from "./components/helpers/ProjectMenuNavbar";
import {AllProjectsId} from "./components/helpers/ProjectMenu";
import {IPipelineStage, IProject} from "./models/QueryInterfaces";
import {InjectedGraphQLProps} from "react-apollo/lib/graphql";

const ProjectsQuery = gql`query { 
  projects {
    id
    name
    description
    root_path
    sample_number
    is_processing
  }
}`;


const PipelineQuery = gql`query { 
    pipelineStages {
      id
      name
      description
      previous_stage_id
      dst_path
      depth
      is_processing
      function_type
      project {
        id
        name
        is_processing
      }
      task {
        id
        name
      }
      previous_stage {
        id
        name
      }
      performance {
        id
        num_in_process
        num_ready_to_process
        num_execute
        num_complete
        num_error
        num_cancel
        cpu_average
        cpu_high
        cpu_low
        memory_average
        memory_high
        memory_low
        duration_average
        duration_high
        duration_low
      }
    }
}`;

const SetPipelineStageStatusMutation = gql`
  mutation SetPipelineStageStatusMutation($id: String, $shouldBeActive: Boolean) {
    setPipelineStageStatus(id:$id, shouldBeActive:$shouldBeActive) {
      id
      is_processing
    }
  }
`;

const DeletePipelineStageMutation = gql`
  mutation DeletePipelineStageMutation($id: String!) {
    deletePipelineStage(id:$id)
  }
`;


export class PipelineStagesContainer extends React.Component<any, any> {
    public render() {
        return (
            <PipelineStages/>
        );
    }
}

@graphql(PipelineQuery, {
    options: {
        pollInterval: 5 * 1000
    }
})
@graphql(SetPipelineStageStatusMutation, {
    props: ({mutate}) => ({
        setStatusMutation: (id: string, shouldBeActive: boolean) => mutate({
            variables: {
                id: id,
                shouldBeActive: shouldBeActive
            }
        })
    })
})
@graphql(DeletePipelineStageMutation, {
    props: ({mutate}) => ({
        deleteMutation: (id: string) => mutate({
            variables: {
                id: id
            }
        })
    })
})
class PipelineStages extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {pipelinesForProjectId: ""};
    }

    private onPipelinesForProjectIdChanged = (id: string) => {
        this.setState({pipelinesForProjectId: id}, null);
    };

    private onSetProjectStatus = (id: string, shouldBeActive: boolean) => {
        this.props.setStatusMutation(id, shouldBeActive)
        .then(async () => {
            await this.props.data.refetch();
        }).catch((err) => {
            console.log(err);
        });
    };

    private onDeleteProject = (id: string) => {
        this.props.deleteMutation(id)
        .then(async () => {
            await this.props.data.refetch();
        }).catch((err) => {
            console.log(err);
        });
    };

    public render() {
        const loading = !this.props.data || this.props.data.loading;

        const pipelineStages = !loading ? this.props.data.pipelineStages : [];

        return (
            <div>
                {this.props.loading ? <Loading/> :
                    <TablePanel pipelineStages={pipelineStages}
                                     pipelinesForProjectId={this.state.pipelinesForProjectId}
                                     refetch={this.props.data.refetch}
                                     updateStatusCallback={this.onSetProjectStatus}
                                     deleteCallback={this.onDeleteProject}
                                     onPipelinesForProjectIdChanged={this.onPipelinesForProjectIdChanged}/>}
            </div>
        );
    }
}

interface MyQueryProps {
    projects: IProject[];

}

interface ITablePanelProps extends InjectedGraphQLProps<MyQueryProps> {
    pipelineStages: IPipelineStage[];
    pipelinesForProjectId: string;

    updateStatusCallback(id: string, shouldBeActive: boolean);
    deleteCallback(id: string);
    onPipelinesForProjectIdChanged(id: string);

    refetch?(variables?: any): any;
}

@graphql(ProjectsQuery, {
    options: {
        pollInterval: 5 * 1000
    }
})
class TablePanel extends React.Component<ITablePanelProps, any> {
    constructor(props) {
        super(props);

        this.state = {
            projectId: AllProjectsId
        };
    }

    private onProjectSelectionChange(eventKey) {
        this.setState({projectId: eventKey}, null);
    }

    public render() {
        return (
            <div>
                <ProjectMenuNavbar keyPrefix="createStageSelectProjectTopLevel" projects={this.props.data.projects}
                                   selectedProjectId={this.state.projectId}
                                   onProjectSelectionChange={(eventKey) => this.onProjectSelectionChange(eventKey)}
                                   includeAllProjects={true}>
                </ProjectMenuNavbar>
                <PipelineStageTable selectedProjectId={this.state.projectId}
                                    pipelineStages={this.props.pipelineStages}
                                    updateStatusCallback={this.props.updateStatusCallback}
                                    deleteCallback={this.props.deleteCallback}/>
                <PipelineStageCreate projects={this.props.data.projects}
                                              pipelinesForProjectId={this.props.pipelinesForProjectId}
                                              refetch={this.props.refetch}
                                              onPipelinesForProjectIdChanged={this.props.onPipelinesForProjectIdChanged}/>
            </div>
        );
    }
}
