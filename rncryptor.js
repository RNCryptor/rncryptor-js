var RNCryptor = {};

CryptoJS.enc.u8array = {
        /**
         * Converts a word array to a Uint8Array.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {Uint8Array} The Uint8Array.
         *
         * @static
         *
         * @example
         *
         *     var u8arr = CryptoJS.enc.u8array.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            // Convert
            var u8 = new Uint8Array(sigBytes);
            for (var i = 0; i < sigBytes; i++) {
                var byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                u8[i]=byte;
            }

            return u8;
        },

        /**
         * Converts a Uint8Array to a word array.
         *
         * @param {string} u8Str The Uint8Array.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.u8array.parse(u8arr);
         */
        parse: function (u8arr) {
            // Shortcut
            var len = u8arr.length;

            // Convert
            var words = [];
            for (var i = 0; i < len; i++) {
                words[i >>> 2] |= (u8arr[i] & 0xff) << (24 - (i % 4) * 8);
            }

            return CryptoJS.lib.WordArray.create(words, len);
        }
    };

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

RNCryptor.Decrypt = function(password, ciphertext, options) {
  options = options || {}

  var message = ciphertext.toString(CryptoJS.enc.u8array);

  var version = message[0];
  var options = message[1];

  var encryption_salt = CryptoJS.enc.u8array.parse(message.subarray(2, 10));
  var encryption_key = RNCryptor.KeyForPassword(password, encryption_salt);

  var hmac_salt = CryptoJS.enc.u8array.parse(message.subarray(10, 18));
  var hmac_key = RNCryptor.KeyForPassword(password, hmac_salt);

  var iv = CryptoJS.enc.u8array.parse(message.subarray(18, 34));

  var ciphertext = CryptoJS.enc.u8array.parse(message.subarray(34, -32));

  var hmac = CryptoJS.enc.u8array.parse(message.subarray(-32));

  // Docs say you can pass a WordArray, but it actually has to be Base64.
  var decrypted = CryptoJS.AES.decrypt(ciphertext.toString(CryptoJS.enc.Base64), encryption_key, {iv: iv});

  // FIXME: Check HMAC

  return decrypted;
}