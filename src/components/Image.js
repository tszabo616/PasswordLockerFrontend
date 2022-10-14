import React from 'react';

import classes from './Image.module.css';

export default function Image(props) {
    return (
        <div className={classes.imageContainer}>
            <img alt={props.alt} src={props.src} className={`${classes.image} ${props.className}`}/>
            <p className={`${classes.imageText} ${props.className}`}>{props.text}</p>
        </div>
    );
}