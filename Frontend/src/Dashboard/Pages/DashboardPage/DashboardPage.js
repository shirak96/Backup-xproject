import React from "react";
import DashBoarLayout from "../../Layout/DashBoarLayout";


export default class DashboardPage extends React.Component {
    render() {
        return (
            <div>
                <DashBoarLayout {...this.props}>
                    Dashboard
                </DashBoarLayout>
            </div>
        )
    }
}
