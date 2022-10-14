import React, {useEffect } from 'react';

import classes from './Input.module.css';
import ErrorLabel from './ErrorLabel';

const Input = React.forwardRef((props, ref) => {

    useEffect(() => {
        let inputEl = document.getElementById(props.id);
        if(props.initialValue) inputEl.value = props.initialValue;
    }, [props.id, props.initialValue])

    return (
        <div className={classes.control}>
            <label htmlFor={props.id}>{props.label}</label>
            {!props.isValid && <ErrorLabel className={classes.error}>{props.errorText}</ErrorLabel>}
            <input type={props.type || 'text'} id={props.id} ref={ref} placeholder={props.placeholder}/>
        </div>
    );
});

export default Input;