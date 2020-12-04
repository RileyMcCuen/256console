import React from "react";
import { connect, ConnectedProps } from 'react-redux'
import {RootState, StudentProjectIteration} from "./actions";

const mapState = (state: RootState) => {
    return {
        currentProject: state.currentProject,
        currentIteration: state.currentIteration,
        spiData: state.spiData,
        students: state.students
    }
};

const mapDispatchToProps = {};

const connector = connect(mapState, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

class Table extends React.Component<Props, {displayTable: boolean}> {

    private tableRef = React.createRef<HTMLTableElement>();

    constructor(props: Props) {
        super(props);
        this.state = {
            displayTable: false
        };
    }

    render() {
        return (
            <div className={'table-container'}>
                <div className={'table-description'}>
                    <button
                        className={'right safe'}
                        onClick={() => {
                            this.setState({displayTable: !this.state.displayTable});
                        }}
                    >
                        Display
                    </button>
                    <h2>
                        {this.props.currentProject.Name} : {this.props.currentIteration + 1}
                    </h2>
                    <p>
                        Below is the data collected for iteration [{this.props.currentIteration + 1}] of project [{this.props.currentProject.Name}].
                    </p>
                </div>
                <table className={this.state.displayTable ? '' : 'hide'} ref={this.tableRef}>
                    <thead>
                        <tr>
                        <th>
                            WUSTL Key
                        </th>
                        <th>
                            HIT 1
                        </th>
                        <th>
                            HIT 1 Count
                        </th>
                        <th>
                            HIT 2
                        </th>
                        <th>
                            Hit 2 Count
                        </th>
                        <th>
                            HIT 3
                        </th>
                        <th>
                            Hit 3 Count
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.students.map((student, index) => {
                            let spiData: StudentProjectIteration = {
                                name1: 'none',
                                name2: 'none',
                                name3: 'none',
                                count1: 0,
                                count2: 0,
                                count3: 0
                            };
                            if (this.props.spiData) {
                                const spiDataForStud = this.props.spiData[student.wustlKey];
                                if (spiDataForStud !== undefined) {
                                    const projDataForStud = spiDataForStud[this.props.currentProject.Name];
                                    if (projDataForStud !== undefined) {
                                        const iterDataForStud = projDataForStud[this.props.currentIteration];
                                        if (iterDataForStud !== undefined) {
                                            spiData = iterDataForStud;
                                        }
                                    }
                                }
                            }
                            return (
                                <tr key={index}>
                                    <th>
                                        {student.wustlKey}
                                    </th>
                                    <td>
                                        {spiData.name1}
                                    </td>
                                    <td>
                                        {spiData.count1}
                                    </td>
                                    <td>
                                        {spiData.name2}
                                    </td>
                                    <td>
                                        {spiData.count2}
                                    </td>
                                    <td>
                                        {spiData.name3}
                                    </td>
                                    <td>
                                        {spiData.count3}
                                    </td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
            </div>
        );
    }

}

export default connector(Table);
