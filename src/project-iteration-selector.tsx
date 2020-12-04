import React from "react";
import {RootState, updateCurrentIteration, updateCurrentProject} from "./actions";
import {connect, ConnectedProps} from "react-redux";
import {ProjectDescription} from "./db";

export const mapState = (state: RootState) => {
    return {
        projects: state.projects,
        iterations: state.iterations,
        currentProject: state.currentProject,
        currentIteration: state.currentIteration
    };
};

export const mapDispatchToProps = {
    updateCurrentProject,
    updateCurrentIteration
};

const connector = connect(mapState, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

type State = {
}

const ffor = (num: number, fun: (num: number) => any) => {
    let ret = [];
    for (let i = 0; i < num; i++) {
        ret.push(fun(i));
    }
    return ret;
};

class ProjectIterationSelector extends React.Component<Props, State> {

    render() {
        return (
            <div className={'project-iteration-selector'}>
                <div className={'project-iteration-description'}>
                    Project Name: Iteration
                </div>
                <div>
                    <select className={'project-selector'} onChange={ev => this.props.updateCurrentProject(this.props.projects[ev.target.selectedIndex])}>
                        {
                            this.props.projects.map((project, index) => {
                                return (
                                    <option key={project.Name} value={project.Name}>
                                        {project.Name}
                                    </option>
                                );
                            })
                        }
                    </select>
                    <span className={'separator'}>:</span>
                    <select className={'iteration-selector'} onChange={ev => this.props.updateCurrentIteration(parseInt(ev.target.value))}>
                        {
                            ffor(this.props.iterations, (iteration => {
                                return (
                                    <option key={iteration} value={iteration}>
                                        {iteration + 1}
                                    </option>
                                );
                            }))
                        }
                    </select>
                </div>
            </div>
        );
    }
}

export default connector(ProjectIterationSelector);