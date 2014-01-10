var verify_kdf_short = function(vector) {
  var key = RNCryptor.KeyForPassword(vector["password"], CryptoJS.enc.Hex.parse(vector["salt_hex"]));
  equal(key.toString(), vector["key_hex"].replace(/\s/g,''));
}

var verify_password_short = function(vector) {
  var ciphertext = RNCryptor.Encrypt(vector["password"], 
                                     CryptoJS.enc.Hex.parse(vector["plaintext_hex"].replace(/\s/g,'')), 
                                     { "encryption_salt": CryptoJS.enc.Hex.parse(vector["enc_salt_hex"].replace(/\s/g,'')),
                                       "hmac_salt": CryptoJS.enc.Hex.parse(vector["hmac_salt_hex"].replace(/\s/g,'')),
                                       "iv": CryptoJS.enc.Hex.parse(vector["iv_hex"].replace(/\s/g,''))
                                     });

  equal(ciphertext.toString(), vector["ciphertext_hex"].replace(/\s/g,''));
}
