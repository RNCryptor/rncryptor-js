rncryptor-js
============

Rough JavaScript implementation of [RNCryptor](https://github.com/RNCryptor/RNCryptor).

[![Build Status](https://travis-ci.org/alexey-sh/rncryptor-js.svg?branch=master)](https://travis-ci.org/alexey-sh/rncryptor-js)

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

