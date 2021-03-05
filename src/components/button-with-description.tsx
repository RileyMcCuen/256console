import React from "react";

type Props = {
    buttonTitle: string;
    description: string;
    buttonClass: string;
    onClick: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
    display: boolean;
};

type State = {
    display: boolean;
};

export default class ButtonWithDescription extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            display: false
        }
    }

    render() {
        return this.props.display ? (
            <div className={'button-with-description'}>
                <div className={'button-container'}>
                    <button onClick={this.props.onClick} className={this.props.buttonClass}>{this.props.buttonTitle}</button>
                    <button className="info" onClick={() => this.setState({display: !this.state.display})}>Info</button>
                </div>
                <div className={this.state.display ? 'action-description' : 'action-description hide'}>{this.props.description}</div>
            </div>
        ): null;
    }
}
