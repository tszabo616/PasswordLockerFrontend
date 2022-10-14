import classes from './Button.module.css';

export default function Button(props) {
    return (
        <button type={props.type || 'button'} onClick={props.onClick} className={`${classes.Button} ${props.className}`}>
            {props.children}
        </button>
    );
}