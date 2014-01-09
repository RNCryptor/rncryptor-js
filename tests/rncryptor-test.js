test("KDF: One byte", function() {
  var key = RNCryptor.KeyForPassword("a", CryptoJS.enc.Hex.parse("0102030405060708"));
  equal(key.toString(), "d48f10b7 ae39bd25 2bb68e1f af12acea 3474d7d7 702a15b2 ede3246e 82dbb2fd".replace(/\s/g,''));
});

