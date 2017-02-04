

var encryptedFirst = "AgGt8BpoaI0EUxRRhP5MlNU2UaBS3XcJngM3d7+9izTsrloZtnzFkaq7lMpn5wh/o3EJ6X6t6Gx2 FZhS/lEE1GDXi40dR6EwD7lKlrwEke+VNBuSyg9X8nwK5cuCnFsYRwk= ";
var decryptedFirst = 'localhosteditable';

var encryptedSecond = "AgGt8BpoaI0EUxRRhP5MlNU2Dqo86sTyREDi/9qARa9B+tIuJrGKSfy2eev8B/kCyGg9wLYXKQPFCMFSjvcKbLlnuBHTiuHsMo1eaPll5e+hkQ==";
var decryptedSecond = 'ios';

var encryptedThird = "AgGt8BpoaI0EUxRRhP5MlNU2r3W6tkIik92RDTxWYF1Er189aBfBPBT4q+06OhDGno5tqzRX8sMJ1HfLI2ptISPdOun196BkloVtO5O/LtIz4Q==";
var decryptedThird = 'oldweb';


var settings = {
    hmac_salt: "FFGE/kyU1TY=",
    salt: "rfAaaGiNBFM=",
    password: 'spring'
};
var cryptor = new RNCryptor({
    hmacSalt: RNCryptor.utils.base64ToHex(settings.hmac_salt),
    encryptionSalt: RNCryptor.utils.base64ToHex(settings.salt),
    password: settings.password
});


QUnit.module('with password');
test('decrypt data 1', function () {
    equal(decryptedFirst, cryptor.decrypt(encryptedFirst))
});

test('decrypt data 2', function () {
    equal(decryptedSecond, cryptor.decrypt(encryptedSecond))
});

test('decrypt data 3', function () {
    equal(decryptedThird, cryptor.decrypt(encryptedThird))
});

test('decryptself encrypted data', function () {
    equal(decryptedFirst, cryptor.decrypt(cryptor.encrypt(decryptedFirst)))
});

QUnit.module('without password, with key and hmac key');
cryptor = new RNCryptor({
    key: '8872312fbc7e985943e079f1836220b55d22da3101c5d8328d17cf6eb4637469',
    hmacKey: '0871e2b30fa7ff09b329560f0e4729e75611369fedac762c78332d0825cc676c',
    hmacSalt: RNCryptor.utils.base64ToHex(settings.hmac_salt),
    encryptionSalt: RNCryptor.utils.base64ToHex(settings.salt)
});

test('decrypt data 1', function () {
    equal(decryptedFirst, cryptor.decrypt(encryptedFirst))
});

test('decrypt data 2', function () {
    equal(decryptedSecond, cryptor.decrypt(encryptedSecond))
});

test('decrypt data 3', function () {
    equal(decryptedThird, cryptor.decrypt(encryptedThird))
});

test('decryptself encrypted data', function () {
    equal(decryptedFirst, cryptor.decrypt(cryptor.encrypt(decryptedFirst)))
});

QUnit.module('Catching errors');
test('without password and keys should throw error', function (assert) {
    var cryptor = new RNCryptor({
        hmacSalt: RNCryptor.utils.base64ToHex(settings.hmac_salt),
        encryptionSalt: RNCryptor.utils.base64ToHex(settings.salt),
        password: settings.password
    });

    assert.throws(function () {
        cryptor.decrypt('asd')
    }, "incorrect data for decryption");
    

});