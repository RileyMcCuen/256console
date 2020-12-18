import React from "react";
import Table from "./table";

class SubmitHits extends React.Component<any, any> {

    render() {
        return <div>
            <button className={"refresh basic"}> Sandbox Toggle </button>
            <button className={"refresh danger"}> Submit Hits </button>
            <Table />
        </div>
    }
}

export default SubmitHits;