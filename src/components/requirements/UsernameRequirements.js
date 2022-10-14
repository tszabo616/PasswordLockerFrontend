import classes from './Requirements.module.css';

export default function UsernameRequirements(props) {

    return (
        <section className={classes.requirements}>
            <h1>Username Requirements:</h1>
            <ul className={classes.requirementsList}>
                <li>Must be at least 8 characters in length</li>
            </ul>
        </section>
    );
}