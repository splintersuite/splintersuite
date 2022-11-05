import { showNotification } from '@mantine/notifications';

const NOT_DELEGATED = 'not_delegated';
const delegationText =
    "From our test of the hive blockchain, it does not appear that you have delegated 'splintersuite' posting authority.  Please refer to our blogpost if you have difficulty or use splintersuite with your posting key.";
const postingKeyText =
    'The Posting Key you entered does not appear to be a valid key for the hive blockchain.  Are you sure you entered it properly?';

const Snackbar = (props) => {
    if (props?.alert != null && props?.alert !== '') {
        return showNotification({
            title: 'Error',
            message:
                props?.alert === NOT_DELEGATED
                    ? delegationText
                    : postingKeyText,
            color: 'purple',
            autoClose: false,
            onClose: () => props.handleCloseAlert(),
        });
    }
};

export default Snackbar;
