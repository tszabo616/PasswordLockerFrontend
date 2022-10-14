const emailRegex = /^\w.*@.*\w$/;
const phoneNumberRegex = /\d{3}-\d{3}-\d{4}/;
const upperCaseRegex = /.*[A-Z].*/;
const lowerCaseRegex = /.*[a-z].*/;
const whiteSpaceRegex = /.*[\s].*/;
const numberRegex = /.*[0-9].*/;
const specialRegex = /.*[!@#$%^&?_+].*/;

export function validEmail(email) {
    return emailRegex.test(email);
}

export function validUsername(username) {
    const minLength = hasMinLength(username);
    const whiteSpace = hasWhiteSpace(username);
    return !whiteSpace && minLength;
}

export function validPhoneNumber(number) {
    return phoneNumberRegex.test(number);
}

export function validPassword(password) {
    const upper = hasUpperCase(password);
    const lower = hasLowerCase(password);
    const whiteSpace = hasWhiteSpace(password);
    const number = hasNumber(password);
    const special = hasSpecial(password);
    const minLength = hasMinLength(password);
    return upper && lower && !whiteSpace && number && special && minLength;
}

export function hasUpperCase(text) {
    return upperCaseRegex.test(text);
}

export function hasLowerCase(text) {
    return lowerCaseRegex.test(text);
}

export function hasWhiteSpace(text) {
    return whiteSpaceRegex.test(text);
}

export function hasNumber(text) {
    return numberRegex.test(text);
}

export function hasSpecial(text) {
    return specialRegex.test(text);
}

export function hasMinLength(text) {
    return text.length >= 8;
}


