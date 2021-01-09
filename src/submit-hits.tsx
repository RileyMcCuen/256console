import React from "react";
import Table from "./table";
import {RootState, updateCurrentIteration, updateCurrentProject} from "./actions";
import {connect, ConnectedProps} from "react-redux";
import MTPool from "./mturk";

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

class SubmitHits extends React.Component<Props, State> {

    render() {
        return <div>
            <button
                className={"refresh basic"}
                onClick={() => {

                }}
            > Sandbox Toggle </button>
            <button
                className={"refresh danger"}
                onClick={() => {
                    this.props.students.forEach(stud => {
                        MTPool.uploadHits({
                            "riley.mccuen": [
                                "https://cse256-sp2021.github.io/pages-test-deployment/"
                            ],
                            "instructor": [
                                "https://cse256-sp2021.github.io/pages-test-deployment/"
                            ]
                        })
                    })
                }}
            > Submit Hits </button>
            <Table />
        </div>
    }
}

export default connector(SubmitHits);