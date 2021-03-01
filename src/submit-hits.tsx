import React from "react";
import Table, {DataTable} from "./table";
import {Data, fetchSPIData, MTurkMode, RootState, updateMTurkMode} from "./actions";
import {connect, ConnectedProps} from "react-redux";
import MTPool from "./mturk";
import {Toggle} from "./toggle";
import {url} from "inspector";

export const mapState = (state: RootState) => {
    return {
        projects: state.projects,
        iterations: state.iterations,
        currentProject: state.currentProject,
        currentIteration: state.currentIteration,
        spiData: state.spiData,
        csvData: state.csvData,
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
    activeTable: number,
    price: string
}

class SubmitHits extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            activeTable: 0,
            price: '0.40'
        };
    }

    getDiffData() {
        fetchSPIData();
        let values: string[][] = [];
        const ret = new Data(this.props.csvData.header, []);
        try {
            const spiData = this.props.spiData;
            if (spiData !== null) {
                this.props.csvData.values.forEach(row => {
                    const studData = spiData[row[0]];
                    if (studData) {
                        const projData = studData[this.props.currentProject.Name];
                        if (projData) {
                            const iterData = projData[this.props.currentIteration];
                            if (iterData) {
                                const taskData = iterData.tasks.find(item => item.name === row[1]);
                                if (taskData) {
                                    values.push([
                                        row[0],
                                        row[1],
                                        '' + taskData.count
                                    ]);
                                    return;
                                }
                            }
                        }
                    }
                    values.push(row);
                });
            } else {
                values = this.props.csvData.values;
            }
            ret.values = values;
            console.log(values)
            return ret;
        } catch (e) {
            alert(e);
            console.log(this.props.csvData.values)
            return this.props.csvData;
        }
    }

    render() {
        console.log(this.props.spiData);
        return <div>
            <button
                className={"refresh danger"}
                onClick={async () => {
                    const hitData: {[key: string]: {count: number, url: string, price: string}[]} = {};
                    //this.props.cs
                    this.props.csvData.values.forEach(row => {
                        const urls: {count: number, url: string, price: string}[] = [];
                        const wKey = row[0];
                        const tasks = row.slice(1);
                        let countSoFar: {[key: string]: number} = {};
                        tasks.forEach(tag => {
                            countSoFar[tag] = 0;
                        });
                        if (this.props.spiData) {
                            // const studHitConfigData = this.props.spiData[stud.wustlKey][this.props.currentProject.Name][this.props.currentIteration];
                            const studConfig = this.props.spiData[wKey];
                            if (studConfig) {
                                const studProjConfig = studConfig[this.props.currentProject.Name];
                                if (studProjConfig) {
                                    const studHitConfigData = studProjConfig[this.props.currentIteration];
                                    if (studHitConfigData) {
                                        tasks.forEach(tag => {
                                            const task = studHitConfigData.tasks.find(task => task.name === tag);
                                            if (task) {
                                                countSoFar[tag] = task.count;
                                            }
                                        });
                                    }
                                }
                            }
                        }
                        const stud = this.props.students.find(stud => stud.wustlKey === wKey);
                        console.log(wKey);
                        if (stud) {
                            tasks.forEach(tag => {
                                urls.push({
                                    count:  Math.max(0, 3 - countSoFar[tag]),
                                    url: `${stud.url}/?wustl_key=${stud.wustlKey}&amp;sandbox=${this.props.mturkMode === MTurkMode.SANDBOX}&amp;project=${this.props.currentProject.Name}&amp;iteration=${this.props.currentIteration}&amp;tag=${tag}`,
                                    price: this.state.price
                                });
                            });
                        }
                        hitData[wKey] = urls;
                        console.log(urls);
                    });
                    const resp = await MTPool.uploadHits(hitData, this.props.mturkMode);
                    for(let i = 0; i < resp.length; i++) {
                        console.log(await resp[i]);
                    }
                }}
            > Submit Hits </button>
            <Toggle
                onChange={(num: number) => {
                    const sandbox = num === 0; // 1 is real mturk
                    // set the global state of sandbox to true
                }}
                default={this.props.mturkMode === MTurkMode.SANDBOX ? 0 : 1}
                toggles={[
                    {
                        text: "Submit to Sandbox MTurk",
                        action: () => {
                            this.props.updateMTurkMode(MTurkMode.SANDBOX);
                        }
                    },
                    {
                        text: "Submit to Real MTurk",
                        action: () => {
                            this.props.updateMTurkMode(MTurkMode.REAL);
                        }
                    }
                ]}
            />
            <Toggle
                onChange={(num: number) => {
                    this.setState({activeTable: num});
                    console.log(num);
                }}
                toggles={[
                    {
                        text: "Original Assignments",
                    },
                    {
                        text: "Remaining Assignments",
                    }
                ]}
            />
            <div className={'payment-input'}>
                <label>
                    Payout per HIT:
                </label>
                <input type={'number'} value={this.state.price} onChange={ev => this.setState({price: parseFloat(ev.target.value).toFixed(2)})} min={.05} max={.95} step={0.05}/>
            </div>
            {
                this.state.activeTable === 0 ? <Table/> : <DataTable data={this.getDiffData()}/>
            }
        </div>
    }
}

export default connector(SubmitHits);