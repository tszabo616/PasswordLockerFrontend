import React, { useState } from 'react';

import classes from './EnterPasswordModal.module.css';
import Input from '../Input';
import Button from '../Button';
import Modal from './Modal';
import ErrorLabel from '../ErrorLabel';
import Loading from '../Loading';

export default function EnterPasswordModal(props) {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isValidAccountPassword, setIsValidAccountPassword] = useState(true);

    function isValidInput(text) {
        return text.length > 0;
    }

    function submitHandler(e) {
        e.preventDefault();
        setHasError(false);
        setIsLoading(true);

        let accountPasswordElem = document.getElementById('accountPassword');
        let enteredAccountPassword = accountPasswordElem.value.trim();

        if(isValidInput(enteredAccountPassword)) setIsValidAccountPassword(true);
        else setIsValidAccountPassword(false);

        if(!isValidAccountPassword) return;

        props.setAccountPassword(enteredAccountPassword);
        props.onClose();
        setIsLoading(false);
    }

    return (
        <Modal onClose={props.onClose}>
             <form id={props.formId} className={classes.EnterPassword} onSubmit={submitHandler}>
                {hasError && (<ErrorLabel>Something went wrong. Try again.</ErrorLabel>)}
                <Input
                    type='password'
                    id='accountPassword'
                    label='Password Locker Password:'
                    isValid={isValidAccountPassword}
                    errorText='Please enter password.'
                />
                {!isLoading && <Button type='submit'>Submit</Button>}
                {isLoading && <Loading />}
             </form>
        </Modal>
    );
}