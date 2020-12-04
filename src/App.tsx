import React from 'react';
import './App.css';
import {HitManagementTab, PostHitManagementTab, SemesterManagementTab, SessionManagementTab} from "./tab";
import {RootState} from "./actions";
import {connect, ConnectedProps} from "react-redux";
import {Login} from "./login";

enum NavLocation {
    SessionManagement = 'Session',
    HITManagement = 'Deploy',
    PostHITManagement = 'Post Deployment',
    SemesterManagement = 'Semester Setup',
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
                    [
                        (<div className={"filler logo"} key={-1}>
                            CSE 256
                        </div>), ...this.rs.map((val, index) => {
                        const ind = index;
                        const navLocation = Object.values(NavLocation)[ind];
                        return (
                            <button ref={val} key={ind}
                                    className={this.props.startNavLocation === navLocation ? "active" : ""}
                                    onClick={() => this.updateActive(ind, navLocation)}>
                                {navLocation}
                            </button>
                        );
                    })]
                }
            </nav>
        );
    }

}

class Footer extends React.Component<{}, {}> {
    render() {
        return (
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
        );
    }
}

const mapState = (state: RootState) => {
    return {
        loggedIn: state.loggedIn
    };
};

const mapDispatchToProps = {};

const connector = connect(mapState, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

class App extends React.Component<Props, { navLocation: NavLocation }> {

    rs = {
        [NavLocation.SemesterManagement]: React.createRef<any>(),
        [NavLocation.HITManagement]: React.createRef<any>(),
        [NavLocation.PostHITManagement]: React.createRef<any>(),
        [NavLocation.SessionManagement]: React.createRef<any>(),
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            navLocation: NavLocation.SessionManagement,
        };
    }

    render() {
        return this.props.loggedIn ?
            (<div className="app">
                <NavBar startNavLocation={this.state.navLocation}
                        onUpdateActive={(navLocation) => this.setState({navLocation: navLocation})}/>
                <SessionManagementTab display={this.state.navLocation === NavLocation.SessionManagement}/>
                <HitManagementTab display={this.state.navLocation === NavLocation.HITManagement}/>
                <PostHitManagementTab display={this.state.navLocation === NavLocation.PostHITManagement}/>
                <SemesterManagementTab display={this.state.navLocation === NavLocation.SemesterManagement}/>
                <Footer/>
            </div>)
            :
            (<div className="app">
                <Login/>
            </div>);
    }
}

export default connector(App);
