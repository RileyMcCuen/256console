import React from 'react';
import ExpandButton from './expand-button.png';
import './App.css';

enum NavLocation {
    SemesterManagement = 'Semester Management',
    HITManagement = 'HIT Management',
    PostHITManagement = 'Post HIT Management'
}

class NavBar extends React.Component<{ startNavLocation: NavLocation, onUpdateActive: (input: NavLocation) => any }, { currentActive: { index: number, navLocation: NavLocation } }> {
    rs = new Array<() => React.RefObject<HTMLButtonElement>>(Object.keys(NavLocation).length).fill(() => React.createRef<HTMLButtonElement>(), 0, Object.keys(NavLocation).length).map(fun => fun());

    constructor(props: { startNavLocation: NavLocation, onUpdateActive: (input: NavLocation) => any }) {
        super(props);
        this.state = {
            currentActive: {index: 0, navLocation: NavLocation.SemesterManagement}
        };
    }

    updateActive(index: number, navLocation: NavLocation) {
        const oldActive = this.state.currentActive;
        if (oldActive.index === index) {
            return;
        }
        this.rs[oldActive.index].current?.classList.remove('active');
        this.rs[index].current?.classList.add('active');
        this.setState({currentActive: {index: index, navLocation: navLocation}});
        this.props.onUpdateActive(navLocation);
    }

    render() {
        return (
            <nav className="header">
                {
                    this.rs.map((val, index) => {
                        const ind = index;
                        const navLocation = Object.values(NavLocation)[ind];
                        return (
                            <button ref={val} key={ind}
                                    className={this.props.startNavLocation === navLocation ? "active" : ""}
                                    onClick={() => this.updateActive(ind, navLocation)}>
                                {navLocation}
                            </button>
                        );
                    })
                }
            </nav>
        );
    }

}

interface Openable {
    open: boolean;
}

class Closer extends React.Component<{ title: string, open: boolean, onClose: (open: boolean) => any }, {}> {

    render() {
        return (
            <div className={"closer"}>
                <h3 className={"subsubtitle"}>
                    {this.props.title}
                </h3>
                <button className={"close"} onClick={() => this.props.onClose(!this.props.open)}>
                    {
                        this.props.open ? <img src={ExpandButton} alt={"^"} className={"flip"}/> : <img alt={"^"} src={ExpandButton}/>
                    }
                </button>
            </div>
        );
    }

}

interface Displayable {
    display: boolean;
}

interface SemesterManagementProps extends Displayable {

}

interface SemesterManagementState {
    createDBOpen: boolean;
    validateDBOpen: boolean;
    // validateDBOutput: string;
    deleteDBOpen: boolean;
    clearDBOpen: boolean;
    updateProjectsOpen: boolean;
}

class SemesterManagement extends React.Component<SemesterManagementProps, SemesterManagementState> {

    createDB = React.createRef<Closer>();
    validateDB = React.createRef<Closer>();
    deleteDB = React.createRef<Closer>();
    clearDB = React.createRef<Closer>();
    updateProjects = React.createRef<Closer>();

    constructor(props: SemesterManagementProps) {
        super(props);
        this.state = {
            createDBOpen: false,
            validateDBOpen: false,
            // validateDBOutput: 'Have not checked on db during this session.',
            deleteDBOpen: false,
            clearDBOpen: false,
            updateProjectsOpen: false
        };
    }

    render() {
        return (
            <div className={this.props.display ? "page" : "hide"}>
                <h1 className={"title"}>
                    Semester Management
                </h1>
                <p className={"purpose"}>
                    This page is for handling semester wide changes such as initializing the database, clearing out old
                    data, or other long term maintenance tasks. These actions should only be needed at the beginning and
                    end of each semester.
                </p>
                <div className={"content"}>
                    <div className={"actions"}>
                        <h2 className={"subtitle"}>
                            Actions
                        </h2>
                        <div className={"action"}>
                            <Closer title={"Create Database"} open={this.state.createDBOpen}
                                    onClose={open => this.setState({createDBOpen: open})} ref={this.createDB}/>
                            <div className={this.state.createDBOpen ? "content" : "hide"}>
                                <p className={"description"}>
                                    Creates a DynamoDB database with no data. This only needs to happen if the database has been deleted. If the database has only been cleared do not use this.
                                </p>
                                <button className={"act safe"}
                                        title={"If you click this button, no negative consequences can happen except an error because the database already exists."}>
                                    Create
                                </button>
                            </div>
                        </div>
                        <div className={"action"}>
                            <Closer title={"Validate Database"} open={this.state.validateDBOpen}
                                    onClose={open => this.setState({validateDBOpen: open})} ref={this.validateDB}/>
                            <div className={this.state.validateDBOpen ? "content" : "hide"}>
                                <p className={"description"}>
                                    Validates that the database is running and accessible. If you are encountering database issues this is a good first place to start.
                                </p>
                                {/*<p className={"output"}>*/}
                                {/*    {*/}
                                {/*        this.state.validateDBOutput*/}
                                {/*    }*/}
                                {/*</p>*/}
                                <button className={"act safe"}
                                        title={"This is a perfectly safe action to run at all times."}>
                                    Validate
                                </button>
                            </div>
                        </div>
                        <div className={"action"}>
                            <Closer title={"Delete Database"} open={this.state.deleteDBOpen}
                                    onClose={open => this.setState({deleteDBOpen: open})} ref={this.deleteDB}/>
                            <div className={this.state.deleteDBOpen ? "content" : "hide"}>
                                <p className={"description"}>
                                    Deletes the entire database from DynamoDB. This should only be used in testing or if migrating infrastructure and any important data is backed up already.
                                </p>
                                <button className={"act danger"}
                                        title={"This is an irreversible action. Make sure that you mean to do this before you click the button."}>
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div className={"action"}>
                            <Closer title={"Clear Database"} open={this.state.clearDBOpen}
                                    onClose={open => this.setState({clearDBOpen: open})} ref={this.clearDB}/>
                            <div className={this.state.clearDBOpen ? "content" : "hide"}>
                                <p className={"description"}>
                                    Clears all data from the database. Run this once at the end of the semester to free up
                                    as much space as possible.
                                </p>
                                <button className={"act danger"}
                                        title={"This is an irreversible action. Make sure that you mean to do this before you click the button."}>
                                    Clear
                                </button>
                            </div>
                        </div>
                        <div className={"action"}>
                            <Closer title={"Update Projects"} open={this.state.updateProjectsOpen}
                                    onClose={open => this.setState({updateProjectsOpen: open})} ref={this.updateProjects}/>
                            <div className={this.state.updateProjectsOpen ? "content" : "hide"}>
                                <p className={"description"}>
                                    Updates the list of projects for the semester. These will be used throughout the app to populate drop down menus and other forms.
                                </p>
                                <button className={"act safe"}
                                        title={"If you make any mistakes uploading a new list of projects it can be easily fixed by uploading a new list of projects."}>
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={"statuses"}>
                        <h2 className={"subtitle"}>
                            Statuses
                        </h2>
                        <div className={"status"}>
                            <h3>
                                Database
                            </h3>
                            <div>
                                Created - Validated on 10/21/20
                            </div>
                        </div>
                        <div className={"status"}>
                            <h3>
                                Projects
                            </h3>
                            <ul>
                                <li>
                                    <div>
                                        Information Foraging
                                    </div>
                                    <div>
                                        Iteration 1
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        Cognitive Load
                                    </div>
                                    <div>
                                        Iteration 0
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        Gender Mag
                                    </div>
                                    <div>
                                        Iteration 0
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

interface HITManagementProps extends Displayable {

}

class HITManagement extends React.Component<HITManagementProps, any> {

    render() {
        return (
            <div className={this.props.display ? "page" : "hide"}>
                HIT Management
            </div>
        );
    }

}

interface PostHITManagementProps extends Displayable {

}

class PostHITManagement extends React.Component<PostHITManagementProps, any> {

    render() {
        return (
            <div className={this.props.display ? "page" : "hide"}>
                Post HIT Management
            </div>
        );
    }

}

class App extends React.Component<{}, { navLocation: NavLocation }> {

    rs = {
        [NavLocation.SemesterManagement]: React.createRef<any>(),
        [NavLocation.HITManagement]: React.createRef<any>(),
        [NavLocation.PostHITManagement]: React.createRef<any>(),
    };

    constructor(props: {}) {
        super(props);
        this.state = {
            navLocation: NavLocation.SemesterManagement,
        };
    }

    render() {
        return (
            <div className="app">
                <NavBar startNavLocation={this.state.navLocation}
                        onUpdateActive={(navLocation) => this.setState({navLocation: navLocation})}/>
                <SemesterManagement display={this.state.navLocation === NavLocation.SemesterManagement}/>
                <HITManagement display={this.state.navLocation === NavLocation.HITManagement}/>
                <PostHITManagement display={this.state.navLocation === NavLocation.PostHITManagement}/>
                <div className={"footer"}>
                    <div className={"attribution"}>
                        Icons made by&nbsp;
                        <a href="https://www.flaticon.com/authors/google" title="Google">
                            Google
                        </a>
                        &nbsp;from&nbsp;
                        <a href="https://www.flaticon.com/" title="Flaticon">
                            www.flaticon.com
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
