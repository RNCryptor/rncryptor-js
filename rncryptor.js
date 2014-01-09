var RNCryptor = {};

/*
    Takes password string and salt WordArray
*/
RNCryptor.KeyForPassword = function(password, salt) {
    return CryptoJS.PBKDF2(password, salt, { keySize: 256/32, iterations: 1000 });
}