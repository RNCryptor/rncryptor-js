rncryptor-js
============

(In Progress) JavaScript implementation of [RNCryptor](https://github.com/RNCryptor/RNCryptor).

THIS IS NOT A REAL, WORKING PRODUCT YET. (It does currently read and write modified RNCryptor files, however.)

Currently uses a hard-coded 1000 PBKDF2 iterations, which makes its file format incompatible with the default RNCryptor format. If you want it to work with the ObjC RNCryptor, you can, though, by setting the `rounds` to 1000 in the settings struct, both for the encryption key and the HMAC key.

I don't know yet if 1000 rounds is fast enough. I may still make changes to the format that rncryptor-js uses. You have been warned. This is pre-alpha software. It passes the test vectors, though.

BTW: This project would love an owner. I hate JavaScript. But I love secure systems. There is too much JavaScript out there not to provide an easy-to-use crypto framework that interoperates well with other platforms. So I started working on it. But if you're good a JavaScript and would like to work on this, I can talk you through the crypto. As you can see from this implementation, the code isn't actually very complicated since it relies on CryptoJS for the all the heavy lifting.

SJCL (1.0.0) config:
./configure --without-all --with-aes --with-bitArray --with-codecHex --with-sha256 --with-sha1 --with-hmac --with-pbkdf2 --with-random --with-convenience --with-cbc
