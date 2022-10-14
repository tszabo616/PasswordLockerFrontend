import React, { useState, useContext, useEffect } from 'react';

import AuthContext from '../store/authContext';
import classes from './UserProfile.module.css';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ErrorLabel from '../components/ErrorLabel';
import UpdateEmailModal from '../components/modal/UpdateEmailModal';
import UpdatePhoneNumberModal from '../components/modal/UpdatePhoneNumberModal';
import UpdatePasswordModal from '../components/modal/UpdatePasswordModal';
import {Strings} from '../Strings';

export default function UserProfile() {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [email, setEmail] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [emailModalIsShown, setEmailModalIsShown] = useState(false);
    const [phoneModalIsShown, setPhoneModalIsShown] = useState(false);
    const [passwordModalIsShown, setPasswordModalIsShown] = useState(false);
    const authCtx = useContext(AuthContext);

    function handleShowEmailModal() {
        setEmailModalIsShown(true);
    }

    function handleCloseEmailModal() {
        setEmailModalIsShown(false);
    }

    function handleUpateEmail(newEmail) {
        setEmail(newEmail);
    }

    function handleShowPhoneModal() {
        setPhoneModalIsShown(true);
    }

    function handleClosePhoneModal() {
        setPhoneModalIsShown(false);
    }

    function handleUpatePhoneNumber(newPhoneNumber) {
        setPhoneNumber(newPhoneNumber);
    }

    function handleShowPasswordModal() {
        setPasswordModalIsShown(true);
    }

    function handleClosePasswordModal() {
        setPasswordModalIsShown(false);
    }

    let url = Strings.backendURL + 'api/v1/users/' + authCtx.username + '/profile_info';

    useEffect(() => {
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authCtx.token,
            },
        })
        .then((res) => {
            setIsLoading(false);
            if (res.ok) {
                return res.json();
            } else {
                return res.json().then((data) => {
                    let errorMessage = 'Failed to load profile information.';
                    throw new Error(errorMessage);
                });
            }
        })
        .then((data) => {
            setEmail(data.email);
            setPhoneNumber(data.phoneNumber);
        })
        .catch((err) => {
            //alert(err);
            setHasError(true);
            setIsLoading(false);
        });
    }, []);

    return (
        <React.Fragment>
            {emailModalIsShown && <UpdateEmailModal onClose={handleCloseEmailModal} updateEmail={handleUpateEmail} email={email} />}
            {phoneModalIsShown && <UpdatePhoneNumberModal onClose={handleClosePhoneModal} updatePhoneNumber={handleUpatePhoneNumber} phoneNumber={phoneNumber} />}
            {passwordModalIsShown && <UpdatePasswordModal onClose={handleClosePasswordModal}/>}
            <h1 className={classes.Welcome}>Welcome!</h1>
            {isLoading && <Loading />}
            {!isLoading && hasError && (
                <div className={classes.Container}>
                    <ErrorLabel>Failed to load profile information.</ErrorLabel>
                </div>
            )}
            {!isLoading && !hasError && (
                <div className={classes.container}>
                    <h3>Profile Information</h3>
                    <label className={`${classes.Label} ${classes.UsernameLabel}`}>Username:</label>
                    <label className={`${classes.Label} ${classes.EmailLabel}`}>Email:</label>
                    <label className={`${classes.Label} ${classes.PhoneNumberLabel}`}>Phone Number:</label>
                    <p className={`${classes.Text} ${classes.UsernameText}`}>{authCtx.username}</p>
                    <p className={`${classes.Text} ${classes.EmailText}`}>{email}</p>
                    <p className={`${classes.Text} ${classes.PhoneNumberText}`}>{phoneNumber}</p>
                    <div className={classes.ButtonsContainer}>
                        <Button onClick={handleShowEmailModal} className={classes.Button}>Update Email</Button>
                        <Button onClick={handleShowPhoneModal} className={classes.Button}>Update Phone Number</Button>
                        <Button onClick={handleShowPasswordModal} className={classes.Button}>Update Password</Button>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
}