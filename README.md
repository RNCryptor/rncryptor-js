rncryptor-js
============

(In Progress) JavaScript implementation of RNCryptor.

THIS IS NOT A REAL, WORKING PRODUCT YET. (It does currently read and write modified RNCryptor files, however.)

Currently uses a hard-coded 1000 PBKDF2 iterations, which makes its file format incompatible with the default RNCryptor format. If you want it to work with the ObjC RNCryptor, you can, though, by setting the `rounds` to 1000 in the settings struct, both for the encryption key and the HMAC key.

I don't know yet if 1000 rounds is fast enough. I may still make changes to the format that rncryptor-js uses. You have been warned. This is pre-alpha software. It passes the test vectors, though.
