import React from "react";
import {downloadAllFiles} from "./aws-service";
import {RootState} from "./actions";
import {connect, ConnectedProps} from "react-redux";
import ButtonWithDescription from "./button-with-description";

export const mapState = (state: RootState) => {
    return {
        currentIteration: state.currentIteration,
        currentProject: state.currentProject
    };
};

export const mapDispatchToProps = {};

const connector = connect(mapState, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

type State = {
}

export default connector(class DownloadZip extends React.Component<Props, State> {

    async download(iteration: number) {
        const data = await downloadAllFiles(this.props.currentProject.Name, iteration);

        // https://davidwalsh.name/javascript-download
        const a = document.createElement("a");
        a.style.display = "none";
        document.body.appendChild(a);

        // Set the HREF to a Blob representation of the data to be downloaded
        a.href = window.URL.createObjectURL(data);

        // Use download attribute to set set desired file name
        a.setAttribute("download", `${this.props.currentProject.Name}_${this.props.currentIteration}.zip`);

        // Trigger the download by simulating click
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
    }

    render() {
        return (
            <div>
                <ButtonWithDescription
                    buttonTitle={'Download All 0th Logs'}
                    description={'Downloads all logs in iteration 0. Iteration 0 is meant for use in collecting base line data and not meant for collecting information on student\'s hits.'}
                    buttonClass={'safe'}
                    onClick={() => this.download(0)}
                    display={true}
                />
                <ButtonWithDescription
                    buttonTitle={`Download All Logs for ${this.props.currentProject.Name} project, iteration ${this.props.currentIteration}.`}
                    description={'Downloads all logs for the currently selected project and iteration. This is meant for collecting logs for student\'s hits following a successful HIT deployment to MTurk.'}
                    buttonClass={'safe'}
                    onClick={() => this.download(this.props.currentIteration)}
                    display={true}
                />
            </div>
        );
    }
});