import React, { Component } from 'react';
import { useTranslation } from 'react-i18next';

import DashBoarLayout from '../../Layout/DashBoarLayout';

// import MapCalendar from "../../../Views/Components/MapSection/subComponents/MapCalendar/MapCalendar"
import AddImagePopUp from "./AddImagePopUp/AddImagePopUp.js";

import "./MapCalendarPage.scss";

class MapCalendarPage extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
   

    componentDidMount(){
        window["token"] = localStorage.getItem("jwt_token");
    }

    isAdmin = true

    getAdmin(){
        return {
            isAdmin: true,
            token: localStorage.getItem("jwt_token"),
        }
    }


    render() {
        return (
            <div className="mapCalendar-page">
                <DashBoarLayout {...this.props}>
                    <div className="MapCalendar-ContainerPage">
                        <MapCalendar />
                    </div>
                </DashBoarLayout>
            </div>
        );
    }
}

export default MapCalendarPage;

const MapCalendar = () => {
    const { t, i18n } = useTranslation()
    const MAP_CALENDAR_COMING_SOON = t('MAP_CALENDAR_COMING_SOON', { returnObjects: true })
    return (
        <div className="MapCalendar-container-page">
            <AddImagePopUp />
            <iframe src="/MapCalendar/MapCalendar.html" width="100%" height="100%" />
        </div>
    );
}