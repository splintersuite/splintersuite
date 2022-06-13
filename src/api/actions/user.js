import axios from '../util/axiosInstance';

const fetchUserData = async ({ username }) => {
    try {
        const userData = await axios.get(
            `${process.env.SERVER_URL}/getUserData`,
            {
                params: { username },
            }
        );
        return userData;
    } catch (err) {
        throw err;
    }
};

export default { fetchUserData };
