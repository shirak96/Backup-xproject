import React from 'react'
import { useTranslation } from 'react-i18next'

import './MapCalendar.scss'

// const MapCalendar = () => {
//   const { t, i18n } = useTranslation()



//   const MAP_CALENDAR_COMING_SOON = t('MAP_CALENDAR_COMING_SOON', { returnObjects: true })
//   return (
//     <div className="MapCalendar-container">
//       <iframe src="./Build/MapCalendar.html" width="100%" height="100%" />
//       {/* <div className="underConstruction-box">
//         <p>{MAP_CALENDAR_COMING_SOON[0]}</p>
//         <p>{MAP_CALENDAR_COMING_SOON[1]}</p>
//       </div> */}
//     </div>
//   )
// }


class MapCalendar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  
  componentDidMount() {
    window["token"] = null;
  }


  render() {
    return (
      <div className="MapCalendar-container">
        <iframe src="./MapCalendar/MapCalendar.html" />
      </div>
    )
  }
}

export default MapCalendar