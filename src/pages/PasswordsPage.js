import React, { useState, useContext, useEffect } from 'react';

import AuthContext from '../store/authContext';
import PasswordItem from '../components/PasswordItem';
import AddPasswordObjModal from '../components/modal/AddPasswordObjModal';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ErrorLabel from '../components/ErrorLabel';
import classes from './PasswordsPage.module.css';
import {Strings} from '../Strings';

export default function PasswordsPage() {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [passwordsList, setPasswordsList] = useState([]);
    const [addModalIsShown, setAddModalIsShown] = useState(false);
    const authCtx = useContext(AuthContext);

    function handleShowAddPassword() {
        setAddModalIsShown(true);
    }

    function handleCloseAddPassword() {
        setAddModalIsShown(false);
    }

    function handleAddPassword(website, description, password) {
        setPasswordsList(passwordList => {
            passwordList.push({
                website,
                description,
                password
            });
            return passwordList;
        })
    }

    function handleEditPassword(currWebsite, currDescription, newWebsite, newDescription, newPassword) {
        setPasswordsList(passwordList => {
            let newList = passwordList.map(obj => {
                    if(obj.website == currWebsite && obj.description == currDescription) {
                        obj.website = newWebsite;
                        obj.description = newDescription;
                        obj.password = newPassword;
                    }
                    return obj;
            });
            return newList;
        })
    }

    function handleDeletePassword(website, description) {
        setPasswordsList(passwordList => {
            let newPasswordList = passwordList.filter(obj => obj.website != website && obj.description != description);
            return newPasswordList;
        })
    }

    let url = Strings.backendURL + 'api/v1/users/' + authCtx.username + '/passwords_list';

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
                    let errorMessage = 'Failed to load list of passwords.';
                    throw new Error(errorMessage);
                });
            }
        })
        .then((data) => {
            setPasswordsList(data);
        })
        .catch((err) => {
            setHasError(true);
            setIsLoading(false);
        });
    }, [authCtx.token, url]);

    return (
        <React.Fragment>
            {addModalIsShown && <AddPasswordObjModal onClose={handleCloseAddPassword} addPasswordObj={handleAddPassword}/>}
            <h1 className={classes.Title}>Passwords</h1>
            <div className={classes.PasswordListContainer}>
                {hasError && (<ErrorLabel>Something went wrong while loading the passwords.</ErrorLabel>)}
                {!isLoading && !passwordsList.length && <p className={classes.NoPasswords}>Please add some passwords...</p>}
                {isLoading && <Loading />}
                <ul className={classes.PasswordList}>
                    {!isLoading && <li key='-1'><Button onClick={handleShowAddPassword} className={classes.Button}>Add Password</Button></li>}
                    {(passwordsList.length > 0) &&  
                            passwordsList.map((item, i) => <li key={i}><PasswordItem website={item.website} description={item.description} password={item.password}
                                                                                onDelete={handleDeletePassword} onEdit={handleEditPassword}/></li>)
                    }
                    {(passwordsList.length > 0) &&
                        <li key={passwordsList.length}><Button onClick={handleShowAddPassword} className={classes.Button}>Add Password</Button></li>
                    }
                </ul>
            </div>
        </React.Fragment>
    );
}
