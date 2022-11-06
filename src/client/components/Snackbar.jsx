import { showNotification } from '@mantine/notifications';

const NOT_DELEGATED = 'not_delegated';
const delegationText =
    "From our test of the hive blockchain, it does not appear that the entered username has delegated 'splintersuite' posting authority.  Double check your username spelling and/or refer to our blogpost for information on delegating posting authority, or alternatively use splintersuite with your posting key.";
const postingKeyText =
    'The Posting Key you entered does not appear to be a valid key for the hive blockchain.   Are you sure you entered it properly?';

const Snackbar = (props) => {
    if (props?.alert != null && props?.alert !== '') {
        showNotification({
            title: 'Error',
            message:
                props?.alert === NOT_DELEGATED
                    ? delegationText
                    : postingKeyText,
            color: 'purple',
            autoClose: false,
        });
        props.handleResetAlert();
    }
};

export default Snackbar;
