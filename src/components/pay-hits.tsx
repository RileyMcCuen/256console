import React from "react";
import {Data, RootState, updateMTurkMode} from "../redux/actions";
import {connect, ConnectedProps} from "react-redux";
import {DataTable} from "./table";
import ButtonWithDescription from "./button-with-description";
import MTPool from "../aws/mturk";
const csvp = require('csv-parse');

export const mapState = (state: RootState) => {
    return {
        projects: state.projects,
        iterations: state.iterations,
        currentProject: state.currentProject,
        currentIteration: state.currentIteration,
        spiData: state.spiData,
        submitHITData: state.submitHITData,
        students: state.students,
        mturkMode: state.mturkMode,
    };
};

export const mapDispatchToProps = {
    updateMTurkMode,
};

const connector = connect(mapState, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

type State = {
    data: Data,
}

class PayHits extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            data: new Data([], []),
        };
    }

    updateCSVData(data: string[][]) {
        this.setState({data: new Data(data[0], data.slice(1))});
    }

    renderFileInput() {
        return (
            <form>
                <input
                    //ref={this.fileInput}
                    type={"file"}
                    accept={"text/csv"}
                    className={"input-file"}
                    name={"csv-input-1"}
                    id={"csv-input-1"}
                    onChange={event => {
                        const file = event.target.files?.item(0);
                        if (file) {
                            const fr = new FileReader();
                            fr.onloadend = () => {
                                if (fr.readyState === FileReader.DONE) {
                                    csvp(fr.result, {}, (err: any, out: string[][]) => {
                                        if (err) {
                                            alert(`Could not parse file correctly. Error: ${err}.`)
                                        } else {
                                            this.updateCSVData(out);
                                        }
                                    });
                                }
                            };
                            fr.readAsText(file, 'utf-8');
                        }
                    }}
                />
                <label
                    className={"csv-input"}
                    htmlFor={"csv-input-1"}
                >
                    Input File of HIT Payments here...
                </label>
            </form>
        );
    }

    render() {
        return (
            <div>
                {this.renderFileInput()}
                <ButtonWithDescription
                    buttonTitle={'Pay'}
                    description={'Resolves all of the HITs listed with the action that is provided for it. Valid actions are: approve, bonus, and reject.'}
                    buttonClass={'safe'}
                    onClick={() => {
                        MTPool.payHits(this.state.data);
                    }}
                    display={true}
                />
                {this.state.data.values.length === 0 ? null : <DataTable data={this.state.data} />}
            </div>
        );
    }
}

export default connector(PayHits);