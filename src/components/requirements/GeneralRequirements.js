import classes from './Requirements.module.css';

export default function GeneralRequirements(props) {

    return (
        <section className={classes.requirements}>
            <h1>General Requirements:</h1>
            <ul className={classes.requirementsList}>
                <li>Must fill out all fields</li>
                <li>Cannot contain, start with, or end with white space</li>
            </ul>
        </section>
    );
}