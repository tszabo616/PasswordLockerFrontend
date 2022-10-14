import classes from './ErrorLabel.module.css';

export default function ErrorLabel(props) {
    return (
        <p className={`${classes.error} ${props.className}`}>{props.children}</p>
    );
}