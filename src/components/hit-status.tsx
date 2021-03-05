import React from "react";
import {DataTable} from "./table";
import {Data, RootState} from "../redux/actions";
import {connect, ConnectedProps} from "react-redux";
import ButtonWithDescription from "./button-with-description";
import MTPool from "../aws/mturk";
import {SandboxToggle} from "./toggle";

export const mapState = (state: RootState) => {
    return {
        mturkMode: state.mturkMode
    };
};

export const mapDispatchToProps = {
};

const connector = connect(mapState, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

type State = {
    data: Data,
}

class HitStatuses extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            data: new Data([], []),
        };
    }

    render() {
        return (
            <div>
                <SandboxToggle />
                <ButtonWithDescription
                    buttonTitle={'Refresh'}
                    description={'Gets the current status of all HITs for all accounts.'}
                    buttonClass={'basic'}
                    onClick={async () => {
                        const data = await MTPool.getStatuses(this.props.mturkMode);
                        this.setState({data: data});
                    }}
                    display={true}
                />
                <DataTable data={this.state.data} />
            </div>
        );
    }
}

export default connector(HitStatuses);
