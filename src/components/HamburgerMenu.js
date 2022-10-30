import { useContext, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';

import classes from './HamburgerMenu.module.css';
import Button from './Button';
import AuthContext from '../store/authContext';

const portalElement = document.getElementById('overlays');

const Menu = (props) => {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();

    function loginHandler() {
        props.onClick();
        navigate('/login');
        navigate(0);
    }

    function logoutHandler() {
        props.onClick();
        authCtx.logout();
        navigate('/');
    }

    function profileHandler() {
        props.onClick();
        navigate('/user_profile');
    }

    function passwordsPageHandler() {
        props.onClick();
        navigate('/profile');
    }

    return (
        <div className={classes.container}>
            {!authCtx.isLoggedIn && (
                <Button onClick={loginHandler} className={classes.Button}>
                    Login
                </Button>
            )}
            {authCtx.isLoggedIn && (
                <Button onClick={logoutHandler} className={classes.Button}>
                    Logout
                </Button>
            )}
            {authCtx.isLoggedIn && (
                <Button onClick={profileHandler} className={classes.Button}>
                    Profile
                </Button>
            )}
            {authCtx.isLoggedIn && (
                <Button onClick={passwordsPageHandler} className={classes.Button}>
                    Passwords
                </Button>
            )}
        </div>
    );
};

export default function HamburgerMenu(props) {
    
    return (
        <Fragment>
            {ReactDOM.createPortal(<Menu onClick={props.onClick}>{props.children}</Menu>, portalElement)}
        </Fragment>
    );
}
