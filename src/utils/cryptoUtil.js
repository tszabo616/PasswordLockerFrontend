export async function encrypt(plainText, password, iv) {
    // Returns an ArrayBuffer
    const enc = new TextEncoder();

    // Derive a unique salt from password
    let saltBuffer = await crypto.subtle.digest('SHA-256', enc.encode(password));
    let salt = new Uint8Array(saltBuffer);

    // Derive key from password
    const keyMaterial = await window.crypto.subtle.importKey(
            "raw",
            enc.encode(password),
            {name: "PBKDF2"},
            false,
            ["deriveBits", "deriveKey"]
        );
    const key = await window.crypto.subtle.deriveKey(
            {
                "name": "PBKDF2",
                salt, 
                "iterations": 100000,
                "hash": "SHA-256"
            },
            keyMaterial,
            { "name": "AES-GCM", "length": 256},
            true,
            ["encrypt", "decrypt"]
        );
    
    return await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        enc.encode(plainText)
    );
}

export async function decrypt(cipherText, password, iv) {
    // Returns decrypted text as a string
    const enc = new TextEncoder();
    const dec = new TextDecoder();

    // Derive a unique salt from password
    let saltBuffer = await crypto.subtle.digest('SHA-256', enc.encode(password));
    let salt = new Uint8Array(saltBuffer);

    // Derive key from password
    const keyMaterial = await window.crypto.subtle.importKey(
            "raw",
            enc.encode(password),
            {name: "PBKDF2"},
            false,
            ["deriveBits", "deriveKey"]
        );
    const key = await window.crypto.subtle.deriveKey(
            {
                "name": "PBKDF2",
                salt, 
                "iterations": 100000,
                "hash": "SHA-256"
            },
            keyMaterial,
            { "name": "AES-GCM", "length": 256},
            true,
            ["encrypt", "decrypt"]
        );
    
    let decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        cipherText,
    );
    return dec.decode(decrypted);
}

export function getIV() {
    return window.crypto.getRandomValues(new Uint8Array(12));
}

export function uint8ArrayToHex(arrUint8) {
    const arr = Array.from(new Uint8Array(arrUint8));                     // convert buffer to byte array
    return arr.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
}

export function hexToUint8Array(hexString) {
    let result = [];
    for(let i=0; i<hexString.length; i+=2) {
        let s = hexString[i] + hexString[i+1];
        result.push(hexToDec(s));
    }
    return new Uint8Array(result);
}

function hexToDec(hexString) {
    return parseInt(hexString, 16);
}

// async function test() {
//     let plainText = "A very simple message that is a little bit longer.";
//     let password = "password";

//     // iv will be needed for decryption
//     const iv = window.crypto.getRandomValues(new Uint8Array(12));
//     //const iv = Uint8Array.from([202,244,197,6,202,203,70,227,187,254,236,201]);

//     const enc = new TextEncoder();
//     let dec = new TextDecoder();

//     console.log("iv: " + iv);
//     // console.log("key: " + JSON.stringify(key));
//     console.log("\n=================");

//     let encrypted = await encrypt(plainText, password, iv);
//     let decrypted = await decrypt(encrypted, password, iv);

//     let encryptedUint8 = new Uint8Array(encrypted);
//     const encryptedHex = uint8ArrayToHex(encryptedUint8);
//     let decrypted2 = await decrypt(hexToUint8Array(encryptedHex).buffer, password, iv);

//     console.log("encrypted: " + encrypted);
//     console.log("encryptedUint8: " + encryptedUint8);
//     console.log("encryptedHex: " + encryptedHex);
//     console.log("encryptedHex: " + hexToUint8Array(encryptedHex));

//     console.log("decrypted: " + decrypted);
//     console.log("decrypted2: " + decrypted2);
// }
