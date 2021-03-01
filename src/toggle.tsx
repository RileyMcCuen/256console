import React from 'react';

type Props = {
    onChange: (num: number) => any;
    toggles: {text: string, action?: () => any}[];
    default?: number;
}

type State = {
    active: number;
}

export class Toggle extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        if (props.default) {
            this.state = {
                active: props.default
            };
        } else {
            this.state = {
                active: 0
            };
        }
    }

    onClick(active: number) {
        this.props.onChange(active);
        this.setState({active: active});
    }

    render() {
        return (
            <div className="toggle-container">
                {
                    this.props.toggles.map((toggle, ind) =>
                        <button
                            key={toggle.text}
                            className={this.state.active === ind ? "safe toggle active" : "safe toggle"}
                            onClick={() => {
                                this.onClick(ind);
                                if (toggle.action) {
                                    toggle.action();
                                }
                            }}
                        >
                            {toggle.text}
                        </button>
                    )
                }
            </div>
        );
    }
}