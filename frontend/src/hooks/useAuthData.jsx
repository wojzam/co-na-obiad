import {useCookies} from "react-cookie";

const useAuthData = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['token', 'user', 'id']);

    const login = (data) => {
        setCookie('token', data.token, {path: '/'});
        setCookie('user', data.user, {path: '/'});
        setCookie('id', data.id, {path: '/'});
    };

    const logout = () => {
        removeCookie('token', {path: '/'});
        removeCookie('user', {path: '/'});
        removeCookie('id', {path: '/'});
    };

    const token = cookies.token;
    const username = cookies.user;
    const userId = cookies.id;

    return {login, logout, token, username, userId};
};

export default useAuthData;