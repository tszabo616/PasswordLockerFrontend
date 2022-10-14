import classes from './Requirements.module.css';

export default function PasswordRequirements(props) {

    return (
        <section className={classes.requirements}>
            <h1>Password Requirements:</h1>
            <ul className={classes.requirementsList}>
                <li>Must be at least 8 characters in length</li>
                <li>Must contain at least one lower case character</li>
                <li>Must contain at least one upper case character</li>
                <li>Must contain at least one number</li>
                <li>
                    {
                        'Must contain at least one special character (!@#$%^&?_+)'
                    }
                </li>
            </ul>
        </section>
    );
}