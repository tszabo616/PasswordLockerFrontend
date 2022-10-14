import React, { useState, useContext, useEffect } from 'react';

import classes from './PasswordItem.module.css';
import Button from './Button';
import EnterPasswordModal from './modal/EnterPasswordModal';
import EditPasswordObjModal from './modal/EditPasswordObjModal';
import ConfirmModal from './modal/ConfirmModal';
import ErrorLabel from './ErrorLabel';
import {Strings} from '../Strings';
import {
    decrypt,
    hexToUint8Array,
} from '../utils/cryptoUtil';
import AuthContext from '../store/authContext';

let passwordTimer;

export default function PasswordItem(props) {
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [decryptedPassword, setDecryptedPassword] = useState('');
    const [accountPassword, setAccountPassword] = useState('');
    const [isPasswordModalShown, setIsPasswordModalShown] = useState(false);
    const [isEditModalShown, setIsEditModalShown] = useState(false);
    const [isConfirmModalShown, setIsConfirmModalShown] = useState(false);
    const [isConfirmLoading, setIsConfirmLoading] = useState(false);
    const [hasConfirmError, setHasConfirmError] = useState(false);
    const [hasError, setHasError] = useState(false);
    const authCtx = useContext(AuthContext);
    
    useEffect(() => {
        if(accountPassword) handlePasswordVisibility()
    }, [accountPassword]);

    async function handlePasswordVisibility() {
        if(!isPasswordShown) {
            try{
                const decrypted = await decrypt(hexToUint8Array(props.password), accountPassword, hexToUint8Array(authCtx.iv));
                setDecryptedPassword(decrypted);
                passwordTimer = setTimeout(handleHidePassword, 5000); // 5 seconds
                handleShowPassword();
            } catch(err) {
                setHasError(true);
                handleHidePassword();
                clearTimeout(passwordTimer);
            }
        }
        else {
            clearTimeout(passwordTimer);
            handleHidePassword();
        }
    }

    function handleShowPassword() {
        setIsPasswordShown(true);
    }

    function handleHidePassword() {
        setIsPasswordShown(false);
        setDecryptedPassword('');
        setAccountPassword('');
    }

    function handleClosePasswordModal() {
        setIsPasswordModalShown(false);
    }

    function handleShowPasswordModal() {
        setHasError(false);
        setIsPasswordModalShown(true);
    }

    function handleCloseEditPasswordObjModal() {
        setIsEditModalShown(false);
    }

    function handleShowEditPasswordObjModal() {
        setHasError(false);
        setIsEditModalShown(true);
    }

    function handleCloseConfirmModal() {
        setIsConfirmModalShown(false);
    }

    function handleShowConfirmModal() {
        setHasConfirmError(false);
        setIsConfirmModalShown(true);
    }

    async function handleDelete(e) {
        e.preventDefault();
        setHasConfirmError(false);

        setIsConfirmLoading(true);
        let url = Strings.backendURL + 'api/v1/users/' + authCtx.username + '/password_object';

        let bodyObj = {
            website: props.website,
            description: props.description
        };

        fetch(url, {
            method: 'DELETE',
            body: JSON.stringify(bodyObj),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authCtx.token,
            },
        })
        .then((res) => {
            setIsConfirmLoading(false);
            if (res.ok) {
                return;
            } else {
                let errorMessage = 'Error!';
                throw new Error(errorMessage);
            }
        })
        .then(() => {
            handleCloseConfirmModal();
            props.onDelete(props.website, props.description)
        })
        .catch((err) => {
            setHasConfirmError(true);
            setIsConfirmLoading(false);
        });
    }
    
    return (
        <div className={classes.Item}>
            {isPasswordModalShown && <EnterPasswordModal onClose={handleClosePasswordModal} formId='accountPasswordForm' setAccountPassword={setAccountPassword}/>}
            {isEditModalShown && <EditPasswordObjModal onClose={handleCloseEditPasswordObjModal} website={props.website} description={props.description}
                                    onEdit={props.onEdit}/>}
            {isConfirmModalShown && <ConfirmModal title='Delete Website / Password' onClose={handleCloseConfirmModal} 
                                onSubmit={handleDelete} isLoading={isConfirmLoading} hasError={hasConfirmError}/> }
            {hasError && (<ErrorLabel className={classes.errorLabel}>{'Something went wrong.\nPlease try again.'}</ErrorLabel>)}
            <label className={classes.websiteLabel}>Website:</label>
            <label className={classes.descriptionLabel}>Description:</label>
            <label className={classes.passwordLabel}>{!hasError && isPasswordShown && 'Password:'}</label>
            <p className={classes.websiteText}>{props.website}</p>
            <p className={classes.descriptionText}>{props.description}</p>
            <p className={classes.passwordText}>{!hasError && isPasswordShown && decryptedPassword}</p>
            
            <div className={classes.ButtonContainer}>
                {(hasError || !isPasswordShown) && <Button onClick={handleShowPasswordModal} className={`${classes.ShowHideButton} ${classes.Button}`}><span>Show</span></Button>}
                {!hasError && isPasswordShown && <Button onClick={handleHidePassword} className={`${classes.ShowHideButton} ${classes.Button}`}><span>Hide</span></Button>}
                <Button onClick={handleShowEditPasswordObjModal} className={`${classes.UpdateButton} ${classes.Button}`}><span>Update</span></Button>
                <Button onClick={handleShowConfirmModal} className={`${classes.DeleteButton} ${classes.Button}`}><span>Delete</span></Button>
            </div>
            
        </div>
    );
}
