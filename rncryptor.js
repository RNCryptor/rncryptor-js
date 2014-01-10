var RNCryptor = {};

/*
    Takes password string and salt WordArray
    Returns key WordArray
*/
RNCryptor.KeyForPassword = function(password, salt) {
    return CryptoJS.PBKDF2(password, salt, { keySize: 256/32, iterations: 1000 });
}

/*
  Takes password string and plaintext WordArray
  options:
    iv
    encryption_salt
    html_salt
  Returns ciphertext WordArray
*/
RNCryptor.Encrypt = function(password, plaintext, options) {
  options = options || {}
  var encryption_salt = options["encryption_salt"] || CryptoJS.lib.WordArray.random(64/8);
  var encryption_key = RNCryptor.KeyForPassword(password, encryption_salt);

  var hmac_salt = options["hmac_salt"] || CryptoJS.lib.WordArray.random(64/8)
  var hmac_key = RNCryptor.KeyForPassword(password, hmac_salt);

  var iv = options["iv"] || CryptoJS.lib.WordArray.random(64/8)

  var version = CryptoJS.enc.Hex.parse("03");
  var options = CryptoJS.enc.Hex.parse("01");
  
  var message = version.clone();
  message.concat(options);
  message.concat(encryption_salt);
  message.concat(hmac_salt);
  message.concat(iv);

  var encrypted = CryptoJS.AES.encrypt(plaintext, encryption_key, {iv: iv});
  message.concat(encrypted.ciphertext);

  var hmac = CryptoJS.HmacSHA256(message, hmac_key);

  message.concat(hmac);

  return message;
}