import React, {useState, useContext } from 'react';

import classes from './AddPasswordObjModal.module.css';
import Input from '../Input';
import Button from '../Button';
import Modal from './Modal';
import ErrorLabel from '../ErrorLabel';
import AuthContext from '../../store/authContext';
import {
    encrypt,
    hexToUint8Array,
    uint8ArrayToHex,
} from '../../utils/cryptoUtil';
import {Strings} from '../../Strings';

export default function EditPasswordObjModal(props) {
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isValidWebsite, setIsValidWebsite] = useState(true);
    const [isValidDescription, setIsValidDescription] = useState(true);
    const [isValidPassword, setIsValidPassword] = useState(true);
    const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(true);
    const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(true);
    const [isValidAccountPassword, setIsValidAccountPassword] = useState(true);
    const [isValidConfirmAccountPassword, setIsValidConfirmAccountPassword] = useState(true);
    const [isAccountPasswordConfirmed, setIsAccountPasswordConfirmed] = useState(true);

    const authCtx = useContext(AuthContext);

    function isValidInput(text) {
        return text.length > 0;
    }

    async function submitHandler(e) {
        e.preventDefault();
        setHasError(false);

        let websiteElem = document.getElementById('website');
        let descriptionElem = document.getElementById('description');
        let passwordElem = document.getElementById('password');
        let confirmPasswordElem = document.getElementById('confirmPassword');
        let accountPasswordElem = document.getElementById('accountPassword');
        let confirmAccountPasswordElem = document.getElementById('confirmAccountPassword');

        let enteredWebsite = websiteElem.value.trim();
        let enteredDescription = descriptionElem.value.trim();;
        let enteredPassword = passwordElem.value.trim();
        let enteredConfirmPassword = confirmPasswordElem.value.trim();
        let enteredAccountPassword = accountPasswordElem.value.trim();
        let enteredConfirmAccountPassword = confirmAccountPasswordElem.value.trim();

        let validWebsite = isValidInput(enteredWebsite);
        let validDescription = isValidInput(enteredDescription);
        let validPassword = isValidInput(enteredPassword);
        let validConfirmPassword = isValidInput(enteredConfirmPassword);
        let confirmedPassword = enteredPassword == enteredConfirmPassword;
        let validAccountPassword = isValidInput(enteredAccountPassword)
        let validConfirmAccountPassword = isValidInput(enteredConfirmAccountPassword)
        let confirmedAccountPassword = enteredAccountPassword == enteredConfirmAccountPassword;

        setIsValidWebsite(validWebsite);
        setIsValidDescription(validDescription);
        setIsValidPassword(validPassword);
        setIsValidConfirmPassword(validConfirmPassword);
        setIsPasswordConfirmed(confirmedPassword);
        setIsValidAccountPassword(validAccountPassword);
        setIsValidConfirmAccountPassword(validConfirmAccountPassword);
        setIsAccountPasswordConfirmed(confirmedAccountPassword);

        if(!validWebsite || !validDescription || !validPassword || !validConfirmPassword || !confirmedPassword || !validAccountPassword 
            || !validConfirmAccountPassword || !confirmedAccountPassword) return;

        setIsLoading(true);
        let url = Strings.backendURL + 'api/v1/users/' + authCtx.username + '/passwords_list';
        const encryptedPassword = await encrypt(enteredPassword, enteredAccountPassword, hexToUint8Array(authCtx.iv));
        let bodyObj = {
            currWebsite: props.website,
            currDescription: props.description,
            newWebsite: enteredWebsite,
            newDescription: enteredDescription,
            newPassword: uint8ArrayToHex(encryptedPassword),
            accountPassword: enteredAccountPassword,
        };

        fetch(url, {
            method: 'PUT',
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
            props.onEdit(props.website, props.description, enteredWebsite, enteredDescription, uint8ArrayToHex(encryptedPassword));
            props.onClose();
        })
        .catch((err) => {
            setHasError(true);
            setIsLoading(false);
        });
    }

    return (
        <Modal onClose={props.onClose}>
            <form className={classes.AddPassword} onSubmit={submitHandler}>
                <h1>Edit Password</h1>
                {hasError && (<ErrorLabel>{errorMessage}</ErrorLabel>)}
                <Input
                    type='text'
                    id='website'
                    label='Website:'
                    isValid={isValidWebsite}
                    errorText='Please enter a website.'
                    initialValue={props.website}
                />
                <Input
                    type='text'
                    id='description'
                    label='Description:'
                    isValid={isValidDescription}
                    errorText='Please enter a description.'
                    initialValue={props.description}
                />
                <Input
                    type='password'
                    id='password'
                    label='Password:'
                    isValid={isValidPassword}
                    errorText='Please enter a password.'
                />
                <Input
                    type='password'
                    id='confirmPassword'
                    label='Confirm Password:'
                    isValid={isValidConfirmPassword && isPasswordConfirmed}
                    errorText={!isPasswordConfirmed ? 'Please confirm the entered passwords match.' : 'Please enter a password.'}
                />
                <Input
                    type='password'
                    id='accountPassword'
                    label='Password Locker Password:'
                    isValid={isValidAccountPassword}
                    errorText='Please enter a password.'
                />
                <Input
                    type='password'
                    id='confirmAccountPassword'
                    label='Confirm Password Locker Password:'
                    isValid={isValidConfirmAccountPassword && isAccountPasswordConfirmed}
                    errorText={!isAccountPasswordConfirmed ? 'Please confirm the entered passwords match.' : 'Please enter a password.'}
                />
                {!isLoading && <Button type='submit'>Update</Button>}
                {isLoading && (
                    <div className={classes.control}>
                        <p className={classes.loading}>Loading...</p>
                    </div>
                )}
            </form>
        </Modal>
    );
}