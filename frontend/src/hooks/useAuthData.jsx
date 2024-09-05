import {useCookies} from "react-cookie";

const useAuthData = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['token', 'user', 'id']);

    const login = (data, rememberMe = false) => {
        const cookieOptions = {path: '/'};

        if (rememberMe) {
            cookieOptions.maxAge = 7 * 24 * 60 * 60; // Set cookie to expire in 7 days (1 week)
        }

        setCookie('token', data.token, cookieOptions);
        setCookie('user', data.user, cookieOptions);
        setCookie('id', data.id, cookieOptions);

        window.location.href = `/user-recipes`;
    };

    const logout = () => {
        removeCookie('token', {path: '/'});
        removeCookie('user', {path: '/'});
        removeCookie('id', {path: '/'});
        window.location.href = "/login";
    };

    const token = cookies.token;
    const username = cookies.user;
    const userId = cookies.id;

    return {login, logout, token, username, userId};
};

export default useAuthData;