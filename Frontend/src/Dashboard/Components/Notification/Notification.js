import React, {useState} from 'react'
import {Message, Icon} from 'semantic-ui-react'
import PropTypes from "prop-types";
import './Notification.scss'
const Notification = ({title, message, icon}) => {
    const [visible, setVisible] = useState(true);
    const handleDismiss = () => {
        setVisible(false);
    };
    return (
        visible ? (
            <div className="notification">
                <Message icon onDismiss={handleDismiss}>
                    <Icon name={icon} loading/>
                    <Message.Content>
                        <Message.Header>{title}</Message.Header>
                        {message}
                    </Message.Content>
                </Message>
            </div>
        ) : null
    )

}

Notification.propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    icon: PropTypes.string
};

Notification.defaultProps = {
    title: 'Just one second',
    message: 'We are fetching that content for you.',
    icon: 'circle notched'
};

export default Notification;