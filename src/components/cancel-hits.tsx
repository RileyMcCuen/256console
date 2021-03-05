import React from "react";
import {RootState} from "../redux/actions";
import {connect, ConnectedProps} from "react-redux";
import MTPool from "../aws/mturk";

export const mapState = (state: RootState) => {
    return {
        projects: state.projects,
        iterations: state.iterations,
        currentProject: state.currentProject,
        currentIteration: state.currentIteration,
        spiData: state.spiData,
        students: state.students,
    };
};

export const mapDispatchToProps = {
};

const connector = connect(mapState, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

type State = {
}

class CancelHits extends React.Component<Props, State> {

    render() {
        return (
            <div className={"status-container"}>
                <button className={"status-update safe right"} onClick={async () => {
                    MTPool.cancelHits();
                }}>
                    Cancel
                </button>
                <h2>
                    Cancel all HITs.
                </h2>
                <p>
                    Cancels all live hits for all individuals listed in the current credentials file.
                </p>
            </div>
        );
    }
}

export default connector(CancelHits);