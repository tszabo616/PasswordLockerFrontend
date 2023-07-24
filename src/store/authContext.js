import React, { useState, useEffect, useCallback } from 'react';

const LS_USERNAME = 'username';
const LS_TOKEN = 'token';
const LS_IV = 'iv';
const LS_EXP_TIME = 'expirationTime';
let logoutTimer;

const AuthContext = React.createContext({
    username: '',
    token: '',
    iv: '',
    isLoggedIn: false,
    login: token => {},
    logout: () => {},
});

const calculateRemainingTime = expirationTime => {
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();
    const remainingDuration = adjExpirationTime - currentTime;

    return remainingDuration; // Milliseconds
};

const retrieveStoredToken = () => {
    const storedUsername = localStorage.getItem(LS_USERNAME);
    const storedToken = localStorage.getItem(LS_TOKEN);
    const storedIv = localStorage.getItem(LS_IV);
    const storedExpirationDate = localStorage.getItem(LS_EXP_TIME);

    const remainingTime = calculateRemainingTime(storedExpirationDate);

    // console.log(remainingTime); ///////////////////

    if (remainingTime <= 60 * 1000) {
        // Do not allow login if less than 1 minute remaining
        localStorage.removeItem(LS_USERNAME);
        localStorage.removeItem(LS_TOKEN);
        localStorage.removeItem(LS_IV);
        localStorage.removeItem(LS_EXP_TIME);
        return null;
    }

    return {
        username: storedUsername,
        token: storedToken,
        iv: storedIv,
        duration: remainingTime,
    };
};

export const AuthContextProvider = props => {
    const tokenData = retrieveStoredToken();

    let initialToken;
    let initialUsername;
    let initialIv;
    if (tokenData) {
        initialToken = tokenData.token;
        initialUsername = tokenData.username;
        initialIv = tokenData.iv;
    }

    const [token, setToken] = useState(initialToken);
    const [iv, setIv] = useState(initialIv);
    const [username, setUsername] = useState(initialUsername);
    const userIsLoggedIn = !!token;

    // console.log('Logged In: ' + userIsLoggedIn); //////////////////

    const logoutHandler = useCallback(() => {
        setUsername(null);
        setToken(null);
        localStorage.removeItem(LS_USERNAME);
        localStorage.removeItem(LS_TOKEN);
        localStorage.removeItem(LS_EXP_TIME);

        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    }, []);

    const loginHandler = (username, token, iv, expirationTime) => {
        setUsername(username);
        setToken(token);
        setIv(iv);

        localStorage.setItem(LS_USERNAME, username);
        localStorage.setItem(LS_TOKEN, token);
        localStorage.setItem(LS_IV, iv);
        localStorage.setItem(LS_EXP_TIME, expirationTime);

        const remainingTime = calculateRemainingTime(expirationTime);

        logoutTimer = setTimeout(logoutHandler, remainingTime);
    };

    useEffect(() => {
        if (tokenData) {
            logoutTimer = setTimeout(logoutHandler, tokenData.duration);
        }
    }, [tokenData, logoutHandler]);

    const contextValue = {
        username: username,
        token: token,
        iv: iv,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
