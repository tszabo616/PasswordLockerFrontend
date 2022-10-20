import React, {useState, useContext } from 'react';

import classes from './UpdateModal.module.css';
import Input from '../Input';
import Button from '../Button';
import Modal from './Modal';
import ErrorLabel from '../ErrorLabel';
import Loading from '../Loading';
import {
    validPhoneNumber,
    validPassword,
} from '../../utils/authUtil';
import AuthContext from '../../store/authContext';

export default function UpdatePhoneNumberModal(props) {
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);
    const [isValidCurrPassword, setIsValidCurrPassword] = useState(true);
    const [isValidConfirmCurrPassword, setIsValidConfirmCurrPassword] = useState(true);
    const [isCurrPasswordConfirmed, setIsCurrPasswordConfirmed] = useState(true);
    const authCtx = useContext(AuthContext);

    function checkInputs(
        enteredPhoneNumber,
        enteredCurrPassword,
        enteredConfirmCurrPassword
    ) {
        // Check input validity
        const isValidEnteredPhoneNumber = validPhoneNumber(enteredPhoneNumber);
        const isValidEnteredCurrPassword = validPassword(enteredCurrPassword);
        const isValidEnteredConfirmCurrPassword = validPassword(enteredConfirmCurrPassword);
        const confirmedCurrPassword = enteredCurrPassword === enteredConfirmCurrPassword;

        setIsValidPhoneNumber(isValidEnteredPhoneNumber);
        setIsValidCurrPassword(isValidEnteredCurrPassword);
        setIsValidConfirmCurrPassword(isValidEnteredConfirmCurrPassword);
        setIsCurrPasswordConfirmed(confirmedCurrPassword);

        return (
            isValidEnteredPhoneNumber && confirmedCurrPassword &&
            isValidEnteredCurrPassword && isValidEnteredConfirmCurrPassword
        );
    }

    async function submitHandler(e) {
        e.preventDefault();
        setHasError(false);

        let phoneNumberElem = document.getElementById('phoneNumber');
        let currPasswordElem = document.getElementById('currPassword');
        let confirmCurrPasswordElem = document.getElementById('confirmCurrPassword');

        let enteredPhoneNumber = phoneNumberElem.value.trim();
        let enteredCurrPassword = currPasswordElem.value.trim();
        let enteredConfirmCurrPassword = confirmCurrPasswordElem.value.trim();

        const isValidInput = checkInputs(enteredPhoneNumber, enteredCurrPassword, enteredConfirmCurrPassword);

        if(!isValidInput) return;

        setIsLoading(true);
        let url = process.env.REACT_APP_BACKEND_URL + 'api/v1/users/' + authCtx.username + '/phone_number';

        let bodyObj = {
            phoneNumber: enteredPhoneNumber,
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
            props.updatePhoneNumber(enteredPhoneNumber);
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
                <h1>Update Phone Number</h1>
                {hasError && (<ErrorLabel>{errorMessage}</ErrorLabel>)}
                <Input
                    type='tel'
                    id='phoneNumber'
                    label='Phone Number (###-###-####):'
                    isValid={isValidPhoneNumber}
                    errorText='Please enter valid phone number.'
                    initialValue={props.phoneNumber}
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