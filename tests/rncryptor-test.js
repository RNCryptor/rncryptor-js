test("KDF: One byte", function() {
  var key = RNCryptor.KeyForPassword("a", CryptoJS.enc.Hex.parse("0102030405060708"));
  equal(key.toString(), "fc632b0c a6b23eff 9a9dc3e0 e585167f 5a328916 ed19f835 58be3ba9 828797cd".replace(/\s/g,''));
});

