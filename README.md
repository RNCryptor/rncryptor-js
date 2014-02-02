rncryptor-js
============

Rough JavaScript implementation of [RNCryptor](https://github.com/RNCryptor/RNCryptor).

It is very possible that this is too slow for you. Please let me know what kinds of performance you're seeing.

You must install sjcl as well as rncryptor-js. Note that plaintext and ciphertext are sjcl.bitArrays, not as strings. It is currently up to you to convert.

BTW: This project would love an owner. I hate JavaScript. But I love secure systems. There is too much JavaScript out there not to provide an easy-to-use crypto framework that interoperates well with other platforms. So I started working on it. But if you're good a JavaScript and would like to work on this, I can talk you through the crypto. As you can see from this implementation, the code isn't actually very complicated since it relies on SJCL for the all the heavy lifting.

SJCL (1.0.0) config:
./configure --without-all --with-aes --with-bitArray --with-codecHex --with-sha256 --with-sha1 --with-hmac --with-pbkdf2 --with-random --with-convenience --with-cbc
