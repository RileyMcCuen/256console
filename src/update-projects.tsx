import React from "react";
import { connect, ConnectedProps } from 'react-redux'
import {RootState, updateProjects} from "./actions";
import {store} from "./store";
import {ProjectDescription, table} from "./db";

const mapState = (state: RootState) => {
    return {
        projects: state.projects
    }
};

const mapDispatchToProps = {
    updateProjects
};

const connector = connect(mapState, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

type UpdateProjectProps = {
    project: ProjectDescription,
    selected: boolean,
    delete: () => any,
    update: (newVal: ProjectDescription) => any,
    select: (callback: () => any) => any
}

class UpdateProject extends React.Component<UpdateProjectProps, {editing: boolean, val: string, selected: boolean}> {

    private inputElem = React.createRef<HTMLInputElement>();
    private tagInputElem = React.createRef<HTMLInputElement>();

    constructor(props: UpdateProjectProps) {
        super(props);
        this.state = {
            selected: false,
            editing: false,
            val: props.project.Name
        };
    }

    render() {
        return (
            <li className={this.props.selected ? "update-project selected" : "update-project"} onClick={event => {
                event.stopPropagation();
                this.props.select(() => {});
            }}>
                <div className={"project-name"}>
                    <input type={'text'}
                           value={this.state.val}
                           disabled={!this.state.editing}
                           ref={this.inputElem}
                           onChange={ev => this.setState({val: ev.target.value})}
                    />
                    <button className={'danger'} onClick={() => this.props.delete()}>
                        Delete
                    </button>
                    <button disabled={this.state.editing}
                            onClick={() => {
                                this.setState({editing: true}, () => this.inputElem.current?.focus());
                            }}
                    >
                        Edit
                    </button>
                    <button disabled={!this.state.editing}
                            onClick={() => {
                                this.props.update(ProjectDescription.Create(this.state.val, this.props.project.TaskTags));
                                this.setState({editing: false});
                            }}
                    >
                        Save
                    </button>
                    <button disabled={!this.state.editing}
                            onClick={() => {
                                this.setState({val: this.props.project.Name, editing: false});
                            }}
                    >
                        Cancel
                    </button>
                </div>
                <div className={this.props.selected ? "project-tags" : "hide"}>
                    <h4>
                       Tags for tasks related to this project:
                    </h4>
                    <ul>
                        {
                            this.props.project.TaskTags.map(tag => {
                                return (
                                    <li key={tag}>
                                        {tag}
                                        <button
                                            className={"danger small"}
                                            onClick={() => {
                                                this.props.update(ProjectDescription.Create(this.props.project.Name, this.props.project.TaskTags.filter(t => t !== tag)))
                                            }}
                                        > Delete </button>
                                    </li>
                                );
                            })
                        }
                        <li>
                            <input
                                type={"text"}
                                placeholder={"New Tag Name Here..."}
                                ref={this.tagInputElem}
                            />
                            <button onClick={() => {
                                if (this.tagInputElem.current
                                    && this.tagInputElem.current.value !== ''
                                    && this.props.project.TaskTags.indexOf(this.tagInputElem.current.value) === -1
                                ) {
                                    this.props.update(ProjectDescription.Create(this.props.project.Name, [...this.props.project.TaskTags, this.tagInputElem.current.value]));
                                    this.tagInputElem.current.value = '';
                                }
                            }}> Add </button>
                        </li>
                    </ul>
                </div>
            </li>
        );
    }

}

class UpdateProjects extends React.Component<Props, {selected: number}> {

    private newInput = React.createRef<HTMLInputElement>();

    constructor(props: Props) {
        super(props);
        this.state = {
            selected: -1
        };
    }

    render() {
        return (
            <div className={"status-container"} onClick={() => {this.setState({selected: -1})}}>
                <h2>
                    Current Projects:
                </h2>
                <ul className={'projects'}>
                    {
                        this.props.projects.map((project, index) =>
                            <UpdateProject
                                project={project}
                                selected={index === this.state.selected}
                                delete={() => {
                                    store.dispatch((() => {
                                        return async (dispatch: any) => {
                                            const name = project.Name;
                                            const projectSave = ProjectDescription.Create(name, project.TaskTags);
                                            try {
                                                await table?.deleteEntity(projectSave);
                                                dispatch(
                                                    this.props.updateProjects(
                                                        this.props.projects.filter(
                                                            value => value.Name !== projectSave.Name
                                                        )
                                                    )
                                                );
                                            } catch (e) {
                                                alert(`Could not delete project. Send error output to Riley or debug: ${e}.`);
                                            }
                                        }
                                    })());
                                }}
                                update={(newVal: ProjectDescription) => {
                                    store.dispatch((() => {
                                        return async (dispatch: any) => {
                                            if (project.Name === newVal.Name
                                                && project.TaskTags.length === newVal.TaskTags.length
                                            ) {
                                                return;
                                            }
                                            try {
                                                await table?.deleteEntity(project);
                                                await table?.put(newVal);
                                                dispatch(
                                                    this.props.updateProjects(
                                                        [...this.props.projects.filter(
                                                            value => value.Name !== newVal.Name
                                                        ), newVal]
                                                    )
                                                );
                                            } catch (e) {
                                                alert(`Could not update project. Send error output to Riley or debug: ${e}.`);
                                            }
                                        }
                                    })());
                                }}
                                select={(callback) => {
                                    this.setState({selected: index}, callback);
                                }}
                                key={project.Name}
                            />)
                    }
                    <li>
                        <input ref={this.newInput} type={'text'} placeholder={'New Project Name...'} />
                        <button onClick={() => {
                                store.dispatch((() => {
                                    return async (dispatch: any) => {
                                        if (this.newInput.current && this.newInput.current.value.trim() !== '') { // check that input fits params
                                            try {
                                                const newProjectName = ProjectDescription.Create((this.newInput as any).current.value, []);
                                                await table?.put(newProjectName);
                                                dispatch(this.props.updateProjects([...this.props.projects, newProjectName]));
                                                this.newInput.current.value = '';
                                            } catch (e) {
                                                alert(`Could not add project. Send error output to Riley or debug: ${e}.`);
                                            }
                                        }
                                }})());
                        }}>
                            Add
                        </button>
                    </li>
                </ul>
            </div>
        );
    }

}

export default connector(UpdateProjects);