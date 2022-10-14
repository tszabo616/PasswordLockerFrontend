import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import MainNavigation from './components/MainNavigation';
import MainFooter from './components/MainFooter';
import AuthContext from './store/authContext';
import Home from './pages/Home';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import PasswordsPage from './pages/PasswordsPage';
import classes from './App.module.css';

function App() {
    const authCtx = useContext(AuthContext);

    return (
        <React.Fragment>
            <MainNavigation />
            <div className={classes.body}>
                <Routes>
                    <Route path='/' element={<Home />} />
                    {!authCtx.isLoggedIn && (
                        <Route path='/login' element={<Login />} />
                    )}
                    {authCtx.isLoggedIn && (
                        <Route path='/user_profile' element={<UserProfile />} />
                    )}
                    {authCtx.isLoggedIn && (
                        <Route path='/profile' element={<PasswordsPage />} />
                    )}
                    <Route path='*' element={<Navigate to='/' replace />} />
                </Routes>
            </div>
            <MainFooter />
        </React.Fragment>
    );
}

export default App;
