import React, { useContext } from 'react';

import classes from './UpdateModal.module.css';
import Button from '../Button';
import Modal from './Modal';
import ErrorLabel from '../ErrorLabel';
import Loading from '../Loading';
import AuthContext from '../../store/authContext';

export default function ConfirmModal(props) {
    const authCtx = useContext(AuthContext);

    return (
        <Modal onClose={props.onClose}>
            <form className={classes.Form} onSubmit={props.onSubmit}>
                <h1>{props.title}</h1>
                {props.hasError && (<ErrorLabel>Something went wrong. Try again.</ErrorLabel>)}
                {!props.isLoading && <Button type='submit'>Confirm</Button>}
                {props.isLoading && <Loading />}
            </form>
        </Modal>
    );
}