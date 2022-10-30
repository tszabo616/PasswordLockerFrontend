import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import classes from './MainNavigation.module.css';
import HamburgerMenu from './HamburgerMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faBars } from '@fortawesome/free-solid-svg-icons';

export default function MainNavigation() {
    const [menuIsShown, setMenuIsShown] = useState(false);

    function handleMenuVisibility() {
        if(menuIsShown) {
            setMenuIsShown(false);
        } else {
            setMenuIsShown(true);
        }
    }

    return (
        <header className={classes.header}>
            <NavLink to="/" className={classes.navLink} title='Go to home page'>
                <FontAwesomeIcon icon={faLock} className={classes.icon} />
                PASSWORD LOCKER
            </NavLink>
            
            <div className={classes.hamburgerButtonContainer} onClick={handleMenuVisibility} title='Menu'>
                <FontAwesomeIcon icon={faBars} className={menuIsShown ? classes.hamburgerButtonRotated : classes.hamburgerButton}/>
            </div>
            {menuIsShown && <HamburgerMenu onClick={handleMenuVisibility}/> }
        </header>
    );
}
