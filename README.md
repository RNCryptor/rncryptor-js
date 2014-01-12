rncryptor-js
============

Rough JavaScript implementation of [RNCryptor](https://github.com/RNCryptor/RNCryptor).

Currently uses a hard-coded 1000 PBKDF2 iterations, which makes its file format incompatible with the default RNCryptor format. If you want it to work with the ObjC RNCryptor, you can, though, by setting the `rounds` to 1000 in the settings struct, both for the encryption key and the HMAC key.

You must install sjcl as well as rncryptor-js. Note that plaintext and ciphertext are sjcl.bitArrays, not as strings. It is currently up to you to convert.

BTW: This project would love an owner. I hate JavaScript. But I love secure systems. There is too much JavaScript out there not to provide an easy-to-use crypto framework that interoperates well with other platforms. So I started working on it. But if you're good a JavaScript and would like to work on this, I can talk you through the crypto. As you can see from this implementation, the code isn't actually very complicated since it relies on SJCL for the all the heavy lifting.

SJCL (1.0.0) config:
./configure --without-all --with-aes --with-bitArray --with-codecHex --with-sha256 --with-sha1 --with-hmac --with-pbkdf2 --with-random --with-convenience --with-cbc
