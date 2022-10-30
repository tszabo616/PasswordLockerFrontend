import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import classes from './MainNavigation.module.css';
import Button from './Button';
import AuthContext from '../store/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

export default function MainNavigation() {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();

    function loginHandler() {
        navigate('/login');
        navigate(0);
    }

    function logoutHandler() {
        authCtx.logout();
        navigate('/');
    }

    function profileHandler() {
        navigate('/user_profile');
    }

    function passwordsPageHandler() {
        navigate('/profile');
    }

    return (
        <header className={classes.header}>
            <NavLink to="/" className={classes.navLink}>
                <FontAwesomeIcon icon={faLock} className={classes.icon} />
                PASSWORD LOCKER
            </NavLink>
            
            <div className={classes.buttonContainer}>
                {!authCtx.isLoggedIn && (
                    <Button onClick={loginHandler} className={classes.navButton}>
                        Login
                    </Button>
                )}
                {authCtx.isLoggedIn && (
                    <Button onClick={logoutHandler} className={classes.navButton}>
                        Logout
                    </Button>
                )}
                {authCtx.isLoggedIn && (
                    <Button onClick={profileHandler} className={classes.navButton}>
                        Profile
                    </Button>
                )}
                {authCtx.isLoggedIn && (
                    <Button onClick={passwordsPageHandler} className={classes.navButton}>
                        Passwords
                    </Button>
                )}
            </div>
        </header>
    );
}
