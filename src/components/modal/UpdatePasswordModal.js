import React, {useState, useContext } from 'react';

import classes from './UpdateModal.module.css';
import Input from '../Input';
import Button from '../Button';
import Modal from './Modal';
import ErrorLabel from '../ErrorLabel';
import PasswordRequirements from '../requirements/PasswordRequirements';
import { validPassword } from '../../utils/authUtil';
import AuthContext from '../../store/authContext';
import {Strings} from '../../Strings';
import GeneralRequirements from '../requirements/GeneralRequirements';

export default function UpdatePasswordModal(props) {
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isValidNewPassword, setIsValidNewPassword] = useState(true);
    const [isValidConfirmNewPassword, setIsValidConfirmNewPassword] = useState(true);
    const [isNewPasswordConfirmed, setIsPasswordConfirmed] = useState(true);
    const [isValidCurrPassword, setIsValidCurrPassword] = useState(true);
    const [isValidConfirmCurrPassword, setIsValidConfirmCurrPassword] = useState(true);
    const [isCurrPasswordConfirmed, setIsCurrPasswordConfirmed] = useState(true);
    const authCtx = useContext(AuthContext);

    function checkInputs(
        enteredNewPassword,
        enteredConfirmNewPassword,
        enteredCurrPassword,
        enteredConfirmCurrPassword
    ) {
        // Check input validity
        const isValidEnteredNewPassword = validPassword(enteredNewPassword);
        const isValidEnteredConfirmNewPassword = validPassword(enteredConfirmNewPassword);
        const confirmedNewPassword = enteredNewPassword == enteredConfirmNewPassword;
        const isValidEnteredCurrPassword = validPassword(enteredCurrPassword);
        const isValidEnteredConfirmCurrPassword = validPassword(enteredConfirmCurrPassword);
        const confirmedCurrPassword = enteredCurrPassword == enteredConfirmCurrPassword;

        setIsValidNewPassword(isValidEnteredNewPassword);
        setIsValidConfirmNewPassword(isValidEnteredConfirmNewPassword);
        setIsPasswordConfirmed(confirmedNewPassword);
        setIsValidCurrPassword(isValidEnteredCurrPassword);
        setIsValidConfirmCurrPassword(isValidEnteredConfirmCurrPassword);
        setIsCurrPasswordConfirmed(confirmedCurrPassword);

        return (
            isValidEnteredNewPassword && isValidEnteredConfirmNewPassword &&
            confirmedNewPassword && confirmedCurrPassword &&
            isValidEnteredCurrPassword && isValidEnteredConfirmCurrPassword
        );
    }

    async function submitHandler(e) {
        e.preventDefault();
        setHasError(false);

        let newPasswordElem = document.getElementById('newPassword');
        let confirmNewPasswordElem = document.getElementById('confirmNewPassword');
        let currPasswordElem = document.getElementById('currPassword');
        let confirmCurrPasswordElem = document.getElementById('confirmCurrPassword');

        let enteredNewPassword = newPasswordElem.value.trim();
        let enteredConfirmNewPassword = confirmNewPasswordElem.value.trim();
        let enteredCurrPassword = currPasswordElem.value.trim();
        let enteredConfirmCurrPassword = confirmCurrPasswordElem.value.trim();

        const isValidInput = checkInputs(enteredNewPassword, enteredConfirmNewPassword,
                        enteredCurrPassword, enteredConfirmCurrPassword);

        if(!isValidInput) return;

        setIsLoading(true);
        let url = Strings.backendURL + 'api/v1/users/' + authCtx.username + '/password';

        let bodyObj = {
            newPassword: enteredNewPassword,
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
                })
            }
        })
        .then(() => {
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
                <h1>Update Account Password</h1>
                {hasError && (<ErrorLabel>{errorMessage}</ErrorLabel>)}
                <Input
                    type='password'
                    id='newPassword'
                    label='New Password:'
                    isValid={isValidNewPassword}
                    errorText='Please enter a valid password.'
                />
                <Input
                    type='password'
                    id='confirmNewPassword'
                    label='Confirm New Password:'
                    isValid={isValidConfirmNewPassword && isNewPasswordConfirmed}
                    errorText={!isNewPasswordConfirmed ? 'Please confirm the entered passwords match.' : 'Please enter a valid password.'}
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
                {isLoading && (
                    <div className={classes.control}>
                        <p className={classes.loading}>Loading...</p>
                    </div>
                )}
                <GeneralRequirements />
                <PasswordRequirements />
            </form>
        </Modal>
    );
}