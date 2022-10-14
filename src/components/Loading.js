import React from 'react';
import classes from './Loading.module.css';

export default function Loading(props) {
    return (
            <div className={classes.loadingContainer}>
                <div className={`${classes.loading} ${props.className}`}></div>
                <div className={`${classes.loadingReverse} ${props.className}`}></div>
            </div>
            
        
    );
}