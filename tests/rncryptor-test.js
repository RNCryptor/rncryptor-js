var verify_kdf_short = function(vector) {
  var key = RNCryptor.KeyForPassword(vector["password"], sjcl.codec.hex.toBits(vector["salt_hex"]));
  equal(sjcl.codec.hex.fromBits(key), vector["key_hex"].replace(/\s/g,''));
}

var verify_password_short = function(vector) {
  var ciphertext = RNCryptor.Encrypt(vector["password"], 
                                     sjcl.codec.hex.toBits(vector["plaintext_hex"].replace(/\s/g,'')), 
                                     { "encryption_salt": sjcl.codec.hex.toBits(vector["enc_salt_hex"].replace(/\s/g,'')),
                                       "hmac_salt": sjcl.codec.hex.toBits(vector["hmac_salt_hex"].replace(/\s/g,'')),
                                       "iv": sjcl.codec.hex.toBits(vector["iv_hex"].replace(/\s/g,''))
                                     });

  equal(sjcl.codec.hex.fromBits(ciphertext), vector["ciphertext_hex"].replace(/\s/g,''));

  var plaintext = RNCryptor.Decrypt(vector["password"],
                                    sjcl.codec.hex.toBits(vector["ciphertext_hex"].replace(/\s/g,'')), 
                                     { "encryption_salt": sjcl.codec.hex.toBits(vector["enc_salt_hex"].replace(/\s/g,'')),
                                       "hmac_salt": sjcl.codec.hex.toBits(vector["hmac_salt_hex"].replace(/\s/g,'')),
                                       "iv": sjcl.codec.hex.toBits(vector["iv_hex"].replace(/\s/g,''))
                                     });

  equal(sjcl.codec.hex.fromBits(plaintext), vector["plaintext_hex"].replace(/\s/g,''));
}
