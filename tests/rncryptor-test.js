var verify_kdf_short = function(vector) {
  var key = RNCryptor.KeyForPassword(vector["password"], CryptoJS.enc.Hex.parse(vector["salt_hex"]));
  equal(key.toString(), vector["key_hex"].replace(/\s/g,''));
}
