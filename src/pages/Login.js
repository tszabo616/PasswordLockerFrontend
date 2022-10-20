import React, { useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import classes from './Login.module.css';
import Button from '../components/Button';
import Loading from '../components/Loading';
import GeneralRequirements from '../components/requirements/GeneralRequirements';
import PasswordRequirements from '../components/requirements/PasswordRequirements';
import AuthContext from '../store/authContext';
import {
    validEmail,
    validUsername,
    validPhoneNumber,
    validPassword,
} from '../utils/authUtil';
import {
    getIV,
    uint8ArrayToHex
} from '../utils/cryptoUtil';
import Input from '../components/Input';
import ErrorLabel from '../components/ErrorLabel';
import UsernameRequirements from '../components/requirements/UsernameRequirements';


export default function Login() {
    const emailInputRef = useRef();
    const usernameInputRef = useRef();
    const phoneNumberInputRef = useRef();
    const passwordInputRef = useRef();

    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isValidUsername, setIsValidUsername] = useState(true);
    const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);
    const [isValidPassword, setIsValidPassword] = useState(true);
    

    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();

    function checkLoginInputs(enteredUsername, enteredPassword) {
        // Check input validity
        const isValidEnteredUsername = validUsername(enteredUsername);
        const isValidEnteredPassword = validPassword(enteredPassword);

        setIsValidUsername(isValidEnteredUsername);
        setIsValidPassword(isValidEnteredPassword);

        return isValidEnteredUsername && isValidEnteredPassword;
    }

    function checkRegisterInputs(
        enteredEmail,
        enteredUsername,
        enteredPhoneNumber,
        enteredPassword
    ) {
        // Check input validity
        const isValidEnteredEmail = validEmail(enteredEmail);
        const isValidEnteredUsername = validUsername(enteredUsername);
        const isValidEnteredPhoneNumber = validPhoneNumber(enteredPhoneNumber);
        const isValidEnteredPassword = validPassword(enteredPassword);

        setIsValidEmail(isValidEnteredEmail);
        setIsValidUsername(isValidEnteredUsername);
        setIsValidPhoneNumber(isValidEnteredPhoneNumber);
        setIsValidPassword(isValidEnteredPassword);

        return (
            isValidEnteredEmail &&
            isValidEnteredUsername &&
            isValidEnteredPhoneNumber &&
            isValidEnteredPassword
        );
    }

    function switchToRegisterHandler() {
        setIsLogin(false);
    }

    async function submitHandler(e) {
        e.preventDefault();
        setHasError(false);

        // Get current input values
        let enteredUsername = usernameInputRef.current.value.trim();
        let enteredEmail;
        let enteredPhoneNumber;
        let enteredPassword = passwordInputRef.current.value.trim();

        if (!isLogin) {
            enteredEmail = emailInputRef.current.value.trim();
            enteredPhoneNumber = phoneNumberInputRef.current.value.trim();
        }

        // Check input validity
        const isValidInput = isLogin
            ? checkLoginInputs(enteredUsername, enteredPassword)
            : checkRegisterInputs(
                enteredEmail,
                enteredUsername,
                enteredPhoneNumber,
                enteredPassword
              );

        if (!isValidInput) return;

        setIsLoading(true);
        let url;
        if(isLogin) url = process.env.REACT_APP_BACKEND_URL + 'api/v1/auth/login';
        else url = process.env.REACT_APP_BACKEND_URL + 'api/v1/auth/register';
        let bodyObj;

        if(isLogin) {
            bodyObj = {
                username: enteredUsername,
                password: enteredPassword,
            };
        } else {
            bodyObj = {
                username: enteredUsername,
                email: enteredEmail,
                phoneNumber: enteredPhoneNumber,
                password: enteredPassword,
                iv: uint8ArrayToHex(getIV()),
            };
        }

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(bodyObj),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((res) => {
            setIsLoading(false);
            if (res.ok) {
                return res.json();
            } else {
                return res.json().then((data) => {
                    let err = 'Authentication failed!';
                    setErrorMessage(err);
                    if (data && data.error) {
                        setErrorMessage(data.error);
                    }
                    throw new Error(err);
                });
            }
        })
        .then((data) => {
            authCtx.login(enteredUsername, data.token, data.iv, data.expirationDate);
            navigate('/profile');
        })
        .catch((err) => {
            setHasError(true);
            setIsLoading(false);
        });
    }

    return (
        <React.Fragment>
            <form className={classes.Login} onSubmit={submitHandler}>
                <h1>{isLogin ? 'Login' : 'Create New Account'}</h1>
                {hasError && (<ErrorLabel>{errorMessage}</ErrorLabel>)}
                <Input
                    type='text'
                    id='username'
                    label='Username:'
                    isValid={isValidUsername}
                    errorText='Please enter valid username.'
                    ref={usernameInputRef}
                />
                {!isLogin && (
                    <Input
                        type='text'
                        id='email'
                        label='Email:'
                        isValid={isValidEmail}
                        errorText='Please enter valid email.'
                        ref={emailInputRef}
                    />
                )}
                {!isLogin && (
                    <Input
                        type='tel'
                        id='phoneNumber'
                        label='Phone Number (###-###-####):'
                        isValid={isValidPhoneNumber}
                        errorText='Please enter valid phone number.'
                        ref={phoneNumberInputRef}
                        placeholder='000-000-0000'
                    />
                )}
                <Input
                    type='password'
                    id='password'
                    label='Password:'
                    isValid={isValidPassword}
                    errorText='Please enter password that meets the requirements.'
                    ref={passwordInputRef}
                />
                {!isLoading && (
                    <div className={classes.control}>
                        <Button type='submit' className={classes.Button}>
                            {isLogin ? 'Login' : 'Register'}
                        </Button>
                    </div>
                )}
                {!isLoading && isLogin && (
                    <div className={classes.control}>
                        <Button onClick={switchToRegisterHandler} className={classes.Button}>
                            Register
                        </Button>
                    </div>
                )}
                
                {isLoading && <Loading /> }
                <GeneralRequirements />
                <UsernameRequirements />
                <PasswordRequirements />
            </form>
        </React.Fragment>
    );
}
