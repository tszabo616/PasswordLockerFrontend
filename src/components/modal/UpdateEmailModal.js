import React, {useState, useContext } from 'react';

import classes from './UpdateModal.module.css';
import Input from '../Input';
import Button from '../Button';
import Modal from './Modal';
import ErrorLabel from '../ErrorLabel';
import Loading from '../Loading';
import {
    validEmail,
    validPassword,
} from '../../utils/authUtil';
import AuthContext from '../../store/authContext';

export default function UpdateEmailModal(props) {
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isValidCurrPassword, setIsValidCurrPassword] = useState(true);
    const [isValidConfirmCurrPassword, setIsValidConfirmCurrPassword] = useState(true);
    const [isCurrPasswordConfirmed, setIsCurrPasswordConfirmed] = useState(true);
    const authCtx = useContext(AuthContext);

    function checkInputs(
        enteredEmail,
        enteredCurrPassword,
        enteredConfirmCurrPassword
    ) {
        // Check input validity
        const isValidEnteredEmail = validEmail(enteredEmail);
        const isValidEnteredCurrPassword = validPassword(enteredCurrPassword);
        const isValidEnteredConfirmCurrPassword = validPassword(enteredConfirmCurrPassword);
        const confirmedCurrPassword = enteredCurrPassword === enteredConfirmCurrPassword;

        setIsValidEmail(isValidEnteredEmail);
        setIsValidCurrPassword(isValidEnteredCurrPassword);
        setIsValidConfirmCurrPassword(isValidEnteredConfirmCurrPassword);
        setIsCurrPasswordConfirmed(confirmedCurrPassword);

        return (
            isValidEnteredEmail && confirmedCurrPassword &&
            isValidEnteredCurrPassword && isValidEnteredConfirmCurrPassword
        );
    }

    async function submitHandler(e) {
        e.preventDefault();
        setHasError(false);

        let emailElem = document.getElementById('email');
        let currPasswordElem = document.getElementById('currPassword');
        let confirmCurrPasswordElem = document.getElementById('confirmCurrPassword');

        let enteredEmail = emailElem.value.trim();
        let enteredCurrPassword = currPasswordElem.value.trim();
        let enteredConfirmCurrPassword = confirmCurrPasswordElem.value.trim();

        const isValidInput = checkInputs(enteredEmail, enteredCurrPassword, enteredConfirmCurrPassword);

        if(!isValidInput) return;

        setIsLoading(true);
        let url = process.env.REACT_APP_BACKEND_URL + 'api/v1/users/' + authCtx.username + '/email';

        let bodyObj = {
            email: enteredEmail,
            currPassword: enteredCurrPassword
        };

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(bodyObj),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authCtx.token,
            },
        })
        .then((res) => {
            setIsLoading(false);
            if (res.ok) {
                return;
            } else {
                return res.json().then((data) => {
                    let err = 'Error!';
                    setErrorMessage(err);
                    if (data && data.error) {
                        setErrorMessage(data.error);
                    }
                    throw new Error(err);
                });
            }
        })
        .then(() => {
            props.updateEmail(enteredEmail);
            props.onClose();
        })
        .catch((err) => {
            setHasError(true);
            setIsLoading(false);
        });
    }

    return (
        <Modal onClose={props.onClose}>
            <form className={classes.Form} onSubmit={submitHandler}>
                <h1>Update Email</h1>
                {hasError && (<ErrorLabel>{errorMessage}</ErrorLabel>)}
                <Input
                    type='text'
                    id='email'
                    label='Email:'
                    isValid={isValidEmail}
                    errorText='Please enter a valid email.'
                    initialValue={props.email}
                />
                <Input
                    type='password'
                    id='currPassword'
                    label='Current Password:'
                    isValid={isValidCurrPassword}
                    errorText='Please enter a valid password.'
                />
                <Input
                    type='password'
                    id='confirmCurrPassword'
                    label='Confirm Current Password:'
                    isValid={isValidConfirmCurrPassword && isCurrPasswordConfirmed}
                    errorText={!isCurrPasswordConfirmed ? 'Please confirm the entered passwords match.' : 'Please enter a valid password.'}
                />
                {!isLoading && <Button type='submit'>Update</Button>}
                {isLoading && <Loading />}
            </form>
        </Modal>
    );
}