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
                onClick={async () => {
                    const hitData: {[key: string]: {count: number, url: string}[]} = {};
                    this.props.students.forEach(stud => {
                        const urls: {count: number, url: string}[] = [];
                        if (this.props.spiData) {
                            const studHitConfigData = this.props.spiData[stud.wustlKey][this.props.currentProject.Name][this.props.currentIteration];
                            if (studHitConfigData) {
                                if (studHitConfigData.name1 !== '' && studHitConfigData.count1 !== 3) {
                                    urls.push({count: 3 - studHitConfigData.count1, url: `${stud.url}/?wustl_key=${stud.wustlKey}&amp;sandbox=false&amp;project=${this.props.currentProject.Name}&amp;iteration=${this.props.currentIteration}&amp;tag=${studHitConfigData.name1}`}); // TODO: make sandbox toggleable
                                }
                                if (studHitConfigData.name2 !== '' && studHitConfigData.count2 !== 3) {
                                    urls.push({count: 3 - studHitConfigData.count1, url: `${stud.url}/?wustl_key=${stud.wustlKey}&amp;sandbox=true&amp;project=${this.props.currentProject.Name}&amp;iteration=${this.props.currentIteration}&amp;tag=${studHitConfigData.name2}`}); // TODO: make sandbox toggleable
                                }
                                if (studHitConfigData.name2 !== '' && studHitConfigData.count3 !== 3) {
                                    urls.push({count: 3 - studHitConfigData.count1, url: `${stud.url}/?wustl_key=${stud.wustlKey}&amp;sandbox=true&amp;project=${this.props.currentProject.Name}&amp;iteration=${this.props.currentIteration}&amp;tag=${studHitConfigData.name3}`}); // TODO: make sandbox toggleable
                                }
                            }
                        }
                        hitData[stud.wustlKey] = urls;
                    });
                    const resp = await MTPool.uploadHits(hitData);
                }}
            > Submit Hits </button>
            <Table />
        </div>
    }
}

export default connector(SubmitHits);