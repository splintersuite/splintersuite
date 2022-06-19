import util from '../util';
import userService from '../services/user';

const login = async (event, payload) => {
    const { username, key } = payload;

    await userService.setKey(username, key);
    await userService.setUsername(username);

    if (username) {
        await userService.fetchUser({ username });
    }

    return util.success();
};

const logout = async (event) => {
    const username = await userService.getUsername();

    await userService.removeKey(username);
    await userService.clear();

    return util.success();
};

const get = async (event) => {
    const user = await userService.getUser();

    return util.success({ user });
};

const updateRentals = async (event, payload) => {
    const { rentals } = payload;

    const username = await userService.getUsername();
    await userService.updateRentals(username, rentals);

    return util.success();
};

const updateRentalListings = async (event, payload) => {
    const { rentalListings } = payload;

    await userService.updateRentalListings({ rentalListings });

    return util.success();
};

export default { login, logout, get, updateRentals, updateRentalListings };
