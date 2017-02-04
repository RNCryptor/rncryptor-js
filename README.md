rncryptor-js
============

Rough JavaScript implementation of [RNCryptor](https://github.com/RNCryptor/RNCryptor).

## Example usage

```javascript
var settings = {
    hmac_salt: "FFGE/kyU1TY=",
    salt: "rfAaaGiNBFM=",
    password: 'spring'
};


var cryptor = new RNCryptor({
    HMAC_SALT: RNCryptor.helpers.base64ToHex(settings.hmac_salt),
    ENCRYPTION_SALT: RNCryptor.helpers.base64ToHex(settings.salt),
    PASSWORD: settings.password
});

encrypted_msg = cryptor.encrypt('top secret');

decrypted_msg = cryptor.decrypt(encrypted_msg); // => top secret

```

or you can setup RNCryptor without master password, via keys
```javascript
cryptor = new RNCryptor({
    KEY: '8872312fbc7e985943e079f1836220b55d22da3101c5d8328d17cf6eb4637469',
    HMAC_KEY: '0871e2b30fa7ff09b329560f0e4729e75611369fedac762c78332d0825cc676c',
    HMAC_SALT: RNCryptor.helpers.base64ToHex(settings.hmac_salt),
    ENCRYPTION_SALT: RNCryptor.helpers.base64ToHex(settings.salt)
});

```


The encrypted data contains:

version + options + salt + hmacSalt + iv + cipher + hmac

- version - version of the encryption logic
- options - never used
- salt - encryption salt, by which the encryption key is generated
- hmacSalt - salt by which the hmac key is generated
- iv - will used in aes
- cipher - encrypted data, the result of aes encryption
- hmac - hash(version + options + salt + hmacSalt + iv + cipher), used for checking that data isn't corrupted


SJCL (1.0.0) config:
./configure --without-all --with-aes --with-bitArray --with-codecHex --with-sha256 --with-sha1 --with-hmac --with-pbkdf2 --with-random --with-convenience --with-cbc


Example
=====

```
var rnCryptor = new RNCryptor({password: 'test'});
var encrypted = rnCryptor.encrypt('hello');
var decrypted = rnCryptor.decrypt(encrypted);
console.log(encrypted);
console.log(decrypted);
```

