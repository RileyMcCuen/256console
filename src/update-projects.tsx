import React from "react";
import {connect, ConnectedProps} from 'react-redux'
import {RootState, updateProjects} from "./actions";
import {store} from "./store";
import {ProjectDescription, table, Task} from "./db";

interface UpdateTasksProps {
    tasks: Task[];
    updateTasks: (newTasks: string) => any;
}

interface UpdateTasksState {
    taskIndex: number;
    tag: string;
    description: string;
}

class UpdateTasks extends React.Component<UpdateTasksProps, UpdateTasksState> {

    constructor(props: UpdateTasksProps) {
        super(props);
        this.state = {
            taskIndex: -2,
            tag: '',
            description: '',
        };
    }

    render() {
        return (
            <div className={'update-tasks'}>
                <ul>
                    <li
                        key={'TitleLI'}
                    >
                        Tasks
                    </li>
                    {
                        this.props.tasks.map((tag, index) => {
                            return (
                                // Might not update properly if key is tag name and tag is not changed
                                <li
                                    key={tag.tag}
                                    onClick={() => this.setState({taskIndex: index, tag: tag.tag, description: tag.description})}
                                >
                                    {tag.tag}
                                </li>
                            );
                        })
                    }
                    <li
                        key={'NewTag'}
                        onClick={() => this.setState({taskIndex: -1, tag: '', description: ''})}
                    >
                        New Tag
                    </li>
                </ul>
                <div className={'form-container'}>
                    {
                        this.state.taskIndex > -2 ? <form
                            onSubmit={ev => {
                                ev.preventDefault();
                                if (
                                    this.state.taskIndex === -2
                                    || this.state.tag === ''
                                    || this.state.description === ''
                                ) {
                                    return; // is not in a submittable stage (-2) or task is in an invalid state
                                }
                                if (this.state.taskIndex === -1) {
                                    this.props.updateTasks(JSON.stringify([...this.props.tasks, new Task(this.state.tag, this.state.description)])); // new tag has been made
                                } else if (
                                    this.state.tag === this.props.tasks[this.state.taskIndex].tag
                                    && this.state.description === this.props.tasks[this.state.taskIndex].description
                                ) {
                                    return; // no changes have been made
                                } else {
                                    let copy = [...this.props.tasks];
                                    copy[this.state.taskIndex] = new Task(this.state.tag, this.state.description);
                                    this.props.updateTasks(JSON.stringify(copy)); // update
                                    this.setState({taskIndex: -2, tag: '', description: ''});
                                }
                            }}
                        >
                            <input
                                type={'text'}
                                placeholder={'Task Name...'}
                                value={this.state.tag}
                                onChange={ev => this.setState({tag: ev.target.value})}
                            />
                            <textarea
                                placeholder={'Description...'}
                                value={this.state.description}
                                onChange={ev => this.setState({description: ev.target.value})}
                            ></textarea>
                            <div>
                                <button type={"submit"}> Save</button>
                                <button
                                    onClick={() => {
                                        if (this.state.taskIndex >= 0) {
                                            this.setState({
                                                tag: this.props.tasks[this.state.taskIndex].tag,
                                                description: this.props.tasks[this.state.taskIndex].description
                                            });
                                        } else {
                                            this.setState({tag: '', description: ''});
                                        }
                                    }}
                                > Cancel
                                </button>
                            </div>
                        </form>
                            : <div> Select a tag in the list to the left to edit it, or select 'New Task' at the bottom of the list to create a new task. </div>
                    }
                </div>
            </div>
        );
    }
}

const mapState = (state: RootState) => {
    return {
        projects: state.projects
    };
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

class UpdateProject extends React.Component<UpdateProjectProps, { editing: boolean, val: string, selected: boolean }> {

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
                this.props.select(() => {
                });
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
                                this.props.update(ProjectDescription.Create(this.state.val, this.props.project.Tasks));
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
                    <UpdateTasks tasks={this.props.project.parsedTags}
                                 updateTasks={(newVal: string) => this.props.update(ProjectDescription.Create(this.props.project.Name, newVal))}/>
                </div>
            </li>
        );
    }

}

class UpdateProjects extends React.Component<Props, { selected: number }> {

    private newInput = React.createRef<HTMLInputElement>();

    constructor(props: Props) {
        super(props);
        this.state = {
            selected: 0
        };
    }

    render() {
        return (
            <div className={"status-container"} onClick={() => {
                this.setState({selected: -1})
            }}>
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
                                            const projectSave = ProjectDescription.Create(name, project.Tasks);
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
                                            const tasks = project.parsedTags;
                                            if (project.Name === newVal.Name
                                                && tasks.length === newVal.parsedTags.length
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
                        <input ref={this.newInput} type={'text'} placeholder={'New Project Name...'}/>
                        <button onClick={() => {
                            store.dispatch((() => {
                                return async (dispatch: any) => {
                                    if (this.newInput.current && this.newInput.current.value.trim() !== '') { // check that input fits params
                                        try {
                                            const newProjectName = ProjectDescription.Create((this.newInput as any).current.value, '');
                                            await table?.put(newProjectName);
                                            dispatch(this.props.updateProjects([...this.props.projects, newProjectName]));
                                            this.newInput.current.value = '';
                                        } catch (e) {
                                            alert(`Could not add project. Send error output to Riley or debug: ${e}.`);
                                        }
                                    }
                                }
                            })());
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