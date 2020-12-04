import React from "react";
import DBStatus from "./db-status";
import ProjectIterationSelector from "./project-iteration-selector";
import UpdateProjects from "./update-projects";
import Table from "./table";
import {Logout} from "./login";
import ButtonWithDescription from "./button-with-description";
import StudentFileInput from "./file-input";
import HITGenerator from "./hit-generator";

interface TabProps {
    actions: {name: string, description: string, component: JSX.Element}[];
    display: boolean
}

interface TabState {
    index: number
}

export class Tab extends React.Component<TabProps, TabState> {

    constructor(props: TabProps) {
        super(props);
        this.state = {
            index: 0,
        }
    }

    display(index: number) {
        this.setState({index});
    }

    render() {
        return (
            <div className={this.props.display ? "tab" : "tab hide"}>
                <div className={"tab-content"}>
                    <div className={"sidebar"}>
                        {
                            [...this.props.actions.map((action, index) => (
                                <button
                                    className={index === this.state.index ? 'action active' : 'action'}
                                    onClick={() => this.display(index)}
                                    key={index}
                                >
                                    {
                                        action.name
                                    }
                                </button>
                            )), <div className={"sidebar-filler"} key={this.props.actions.length}> </div>]
                        }
                    </div>
                    <div className={"output-container"}>
                        <div className={"output"}>
                            {this.props.children ? this.props.children: null}
                            {
                                this.props.actions.map((action, index) => {
                                    return (
                                        <div
                                            className={index === this.state.index ? 'component-wrapper' : 'component-wrapper hide'}
                                            key={index}
                                        >
                                            <div className={'tab-header'}>
                                                <h1>
                                                    {
                                                        action.name
                                                    }
                                                </h1>
                                                <p className={"description"}>
                                                    {
                                                        action.description
                                                    }
                                                </p>
                                            </div>
                                            {
                                                action.component
                                            }
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

interface ConcreteTabProps {
    display: boolean;
}

export class SemesterManagementTab extends React.Component<ConcreteTabProps, {}> {

    render() {
        return <Tab
            display={this.props.display}
            actions={[
                {
                    name: 'Clear Database',
                    description: 'Deletes all data from the database that is specific to a semester. Retains login data and other non-semester specific data.',
                    component: (<div>
                                    <div>
                                        <ButtonWithDescription buttonTitle={'Clear Database'}
                                                               description={'Clicking this button will delete all data from the database that is not meant to be carried over. This includes: HIT assignments, Student ID to HIT ID mappings and more. Click this button once the semester is completely over and you are ready to clean out all of the old data.'}
                                                               buttonClass={'danger'} onClick={() => {}} display={true} />
                                    </div>
                                    <DBStatus/>
                                </div>)
                },
                {
                    name: 'Change Projects',
                    description: 'Allows you to view and change projects for this course.',
                    component: <UpdateProjects/>
                }
            ]}
        />
    }

}

export class HitManagementTab extends React.Component<ConcreteTabProps, {}> {

    render() {
        return <Tab
                display={this.props.display}
                actions={[
                    {
                        name: 'Generate HITs',
                        description: 'Generate HITs for each student. HITs will be generated based on current project and iteration as well as information about which HITs that they have had for previous iterations.',
                        component: (
                            <div>
                                <HITGenerator/>
                                <DBStatus/>
                                <Table />
                            </div>)
                    }
                ]}
        >
            <ProjectIterationSelector />
        </Tab>
    }

}

export class PostHitManagementTab extends React.Component<ConcreteTabProps, {}> {

    render() {
        return <Tab
            display={this.props.display}
            actions={[]}
        />
    }

}

export class SessionManagementTab extends React.Component<ConcreteTabProps, {}> {

    render() {
        return <Tab
            display={this.props.display}
            actions={
                [
                    {
                        name: 'Load Student Credentials',
                        description: 'Load in student credentials if you need to interact with students and/or their Mturk accounts.',
                        component:
                            <div>
                                <StudentFileInput />
                                <ButtonWithDescription
                                    buttonTitle={'Download CSV Template...'}
                                    description={'This will download a CSV Template that you can then fill out with student credentials. This template has correctly spelt and formatted headers so that there are no validation errors when uploading it later.'}
                                    buttonClass={'safe'}
                                    onClick={() => {
                                        const uri = 'data:text/plain;charset=utf-8,' + encodeURIComponent("WUSTL Key,AWS IAM ID, AWS IAM SECRET\n");
                                        const a = document.createElement('a');
                                        a.style.display = 'none';
                                        a.href = uri;
                                        a.download = 'student-credentials.csv';
                                        document.body.appendChild(a);
                                        a.click();
                                        a.remove();
                                    }}
                                    display={true}
                                />
                            </div>
                    },
                    {
                        name: 'Logout',
                        description: 'Use this to log out of the application.',
                        component: <Logout />
                    },
                ]}
        />
    }

}
