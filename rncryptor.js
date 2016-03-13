"use strict";

(function (window) {

    window.RNCryptor = RNCryptor;

    var defaultSettings, helpers;

    defaultSettings = {
        PBKDF_ITERATIONS: 10000,
        ENCRYPTION_SALT: null,
        KEY: null,
        PASSWORD: null,
        PBKDF2_SIZE: 32,
        HMAC_SALT_LENGTH: 8,
        ENCRYPTION_SALT_LENGTH: 8,
        IV_LENGTH: 16,
        VERSION_LENGTH: 1,
        OPTIONS_LENGTH: 1,
        AES_MODE: 'cbc',
        HMAC_SALT: null
    };

    helpers = {
        stringToBase64: function (str) {
            return sjcl.codec.base64.fromBits(sjcl.codec.utf8String.toBits(str));
        },
        base64ToString: function (str) {
            return sjcl.codec.utf8String.fromBits(sjcl.codec.base64.toBits(str));
        },
        generateHMACSHA256: function (keyHex, msgHex) {
            var hmac, keyBit, msgBit, resultBit;
            keyBit = sjcl.codec.hex.toBits(keyHex);
            msgBit = sjcl.codec.hex.toBits(msgHex);
            hmac = new sjcl.misc.hmac(keyBit);
            resultBit = hmac.encrypt(msgBit);
            return sjcl.codec.hex.fromBits(resultBit);
        },
        generatePBKDF2WithSHA1: function (passwordText, saltHex, iter, keyLength) {
            var hmacSHA1, pbkdf2, saltBits;
            if (keyLength == null) {
                keyLength = 256;
            }
            hmacSHA1 = function (key) {
                var hasher;
                hasher = new sjcl.misc.hmac(key, sjcl.hash.sha1);
                this.encrypt = function () {
                    return hasher.encrypt.apply(hasher, arguments);
                };
            };
            saltBits = sjcl.codec.hex.toBits(saltHex);
            pbkdf2 = sjcl.misc.pbkdf2(passwordText, saltBits, iter, keyLength, hmacSHA1);
            return sjcl.codec.hex.fromBits(pbkdf2);
        },
        getRandomHex: function (len) {
            return sjcl.codec.hex.fromBits(sjcl.random.randomWords((len / 8) * 2));
        },
        hexTobin: function (hex) {
            var i, str;
            str = '';
            i = 0;
            while (i < hex.length) {
                str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
                i += 2;
            }
            return str;
        },
        stringToHex: function (str) {
            return sjcl.codec.hex.fromBits(sjcl.codec.utf8String.toBits(str));
        },
        hexToString: function (str) {
            return sjcl.codec.utf8String.fromBits(sjcl.codec.hex.toBits(str));
        },
        hexToBase64: function (hex) {
            return sjcl.codec.base64.fromBits(sjcl.codec.hex.toBits(hex));
        },
        base64ToHex: function (strInBase64) {
            return sjcl.codec.hex.fromBits(sjcl.codec.base64.toBits(strInBase64));
        },
        binToHex: function (binData) {
            return this.base64ToHex(this.btoa(binData));
        },
        chr: function (codePt) {
            return String.fromCharCode(codePt);
        },
        btoa: function (data) {
            return btoa(data);
        },
        atob: function (data) {
            return atob(data);
        },
        trim: function (str) {
            return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
        },
        cleanString: function (str) {
            return this.trim(str).replace(/\s+/g, '').replace(/(\r\n|\n|\r)/g, '');
        },
        extend: function (dest, source) {
            for (var i in source) {
                if (source.hasOwnProperty(i)) {
                    dest[i] = source[i];
                }
            }
            return dest;
        },
        sjcl: sjcl
    };

    function CryptoError(message, data) {
        var tmp = Error.apply(this, arguments);
        tmp.name = this.name = 'RNCryptor error!';
        data = data ? JSON.stringify(data) : '';
        this.message = (tmp.message || '') + '\n' + data;
        Object.defineProperty(this, 'stack', {
            get: function () {
                return tmp.stack
            }
        });
        return this
    }

    var IntermediateInheritor = function () {
    };
    IntermediateInheritor.prototype = Error.prototype;
    CryptoError.prototype = new IntermediateInheritor();


    RNCryptor.helpers = helpers;

    RNCryptor.CryptoError = CryptoError;

    /*
     @param params {Object}
     @param params.ENCRYPTION_SALT {String} Salt in hex
     @param params.HMAC_SALT {String}  Salt for HMAC
     @param params.HMAC_KEY [String] Encryption key. Or provide a PASSWORD
     @param params.KEY [String] Encryption key. Or provide a PASSWORD
     @param params.PASSWORD [String] Master password. Or provide a KEY

     @param params.PBKDF_ITERATIONS [Number]
     @param params.AES_MODE [String] See available mode in sjcl lib
     @param params.PBKDF2_SIZE [Number] Length in bytes.
     @param params.HMAC_SALT_LENGTH [Number]  Length in bytes.
     @param params.ENCRYPTION_SALT_LENGTH [Number] Length in bytes.
     @param params.IV_LENGTH [Number] Length in bytes.
     @param params.VERSION_LENGTH [Number] Length in bytes.
     @param params.OPTIONS_LENGTH [Number] Length in bytes.
     */

    function RNCryptor(params) {
        var that = this;
        params = helpers.extend(helpers.extend({}, defaultSettings), params);
        sjcl.beware["CBC mode is dangerous because it doesn't protect message integrity."]();
        if (!params.HMAC_KEY && typeof params.PASSWORD === 'string') {
            params.HMAC_KEY = helpers.generatePBKDF2WithSHA1(params.PASSWORD, params.HMAC_SALT, params.PBKDF_ITERATIONS);
        }
        if (!params.KEY && typeof params.PASSWORD === 'string') {
            params.KEY = helpers.generatePBKDF2WithSHA1(params.PASSWORD, params.ENCRYPTION_SALT, params.PBKDF_ITERATIONS);
        }
        params.options = helpers.chr(1);
        params.version = helpers.chr(2);
        this.settings = helpers.extend(helpers.extend({}, defaultSettings), params);
        ['KEY', 'HMAC_KEY', 'HMAC_SALT', 'ENCRYPTION_SALT'].forEach(function (key) {
            if (!that.settings[key]) {
                throw new CryptoError(key + " is not defined");
            }
        });
    }

    /**
     * @param {String} message
     * @return {String} Base 64 encoded encrypted message
     * */
    RNCryptor.prototype.encrypt = function (message) {
        var e, encrypted, encryptedBin, encryptedHex, encryptedMessage, encryptionSaltBin, hMacSaltBin, hmacHash,
            ivBin, ivBit, ivHex, keyBit, messageBit, msg, options, prp, version;
        version = this.settings.version;
        options = this.settings.options;
        encryptionSaltBin = helpers.hexTobin(this.settings.ENCRYPTION_SALT);
        hMacSaltBin = helpers.hexTobin(this.settings.HMAC_SALT);
        ivHex = helpers.getRandomHex(this.settings.IV_LENGTH);
        keyBit = sjcl.codec.hex.toBits(this.settings.KEY);
        ivBit = sjcl.codec.hex.toBits(ivHex);
        ivBin = helpers.hexTobin(ivHex);
        messageBit = sjcl.codec.utf8String.toBits(message);
        prp = new sjcl.cipher.aes(keyBit);
        try {
            sjcl.beware["CBC mode is dangerous because it doesn't protect message integrity."]();
            encrypted = sjcl.mode[this.settings.AES_MODE].encrypt(prp, messageBit, ivBit);
        } catch (_error) {
            e = _error;
            throw new CryptoError(e.message, this.settings);
        }
        encryptedHex = sjcl.codec.hex.fromBits(encrypted);
        encryptedBin = helpers.hexTobin(encryptedHex);
        msg = version + options + encryptionSaltBin + hMacSaltBin + ivBin + encryptedBin;
        hmacHash = helpers.generateHMACSHA256(this.settings.HMAC_KEY, helpers.binToHex(msg));
        encryptedMessage = msg + helpers.hexTobin(hmacHash);
        return helpers.btoa(encryptedMessage);
    };

    RNCryptor.prototype._extractData = function (data) {
        var cipher, cipherLength, cipherPos, dataWithoutHMAC, hmac, hmacPos, hmacSalt, hmacSaltPos, items, iv,
            ivPos, options, optionsPos, salt, saltPos, version, versionPos;
        versionPos = 0;
        optionsPos = this.settings.OPTIONS_LENGTH + versionPos;
        saltPos = optionsPos + versionPos + this.settings.OPTIONS_LENGTH;
        hmacSaltPos = saltPos + this.settings.ENCRYPTION_SALT_LENGTH;
        ivPos = hmacSaltPos + this.settings.HMAC_SALT_LENGTH;
        cipherPos = ivPos + this.settings.IV_LENGTH;
        cipherLength = data.length - (cipherPos + this.settings.PBKDF2_SIZE);
        hmacPos = data.length - this.settings.PBKDF2_SIZE;
        version = data.substr(versionPos, this.settings.VERSION_LENGTH);
        options = data.substr(optionsPos, this.settings.OPTIONS_LENGTH);
        salt = data.substr(saltPos, this.settings.ENCRYPTION_SALT_LENGTH);
        hmacSalt = data.substr(hmacSaltPos, this.settings.HMAC_SALT_LENGTH);
        iv = data.substr(ivPos, this.settings.IV_LENGTH);
        cipher = data.substr(cipherPos, cipherLength);
        hmac = data.substr(hmacPos);
        dataWithoutHMAC = version + options + salt + hmacSalt + iv + cipher;
        items = {
            hmac: helpers.binToHex(hmac),
            encryptionSalt: helpers.binToHex(salt),
            ivHex: helpers.binToHex(iv),
            dataWithoutHMACinHex: helpers.binToHex(dataWithoutHMAC),
            cipher: cipher
        };
        return items;
    };

    /**
     * @param {String} message in base64
     * @return {String} Decoded utf-8 message
     * */
    RNCryptor.prototype.decrypt = function (message) {
        var cipherBit, data, decrypted, e, hmacHash, items, ivBit, keyBit, prp;
        data = helpers.atob(helpers.cleanString(message));
        items = this._extractData(data);
        hmacHash = helpers.generateHMACSHA256(this.settings.HMAC_KEY, items.dataWithoutHMACinHex);
        if (hmacHash !== items.hmac) {
            throw new CryptoError("HMAC " + hmacHash + " mismatch", items);
        }
        keyBit = sjcl.codec.hex.toBits(this.settings.KEY);
        ivBit = sjcl.codec.hex.toBits(items.ivHex);
        cipherBit = sjcl.codec.base64.toBits(helpers.btoa(items.cipher));
        prp = new sjcl.cipher.aes(keyBit);
        try {
            sjcl.beware["CBC mode is dangerous because it doesn't protect message integrity."]();
            decrypted = sjcl.mode[this.settings.AES_MODE].decrypt(prp, cipherBit, ivBit);
        } catch (_error) {
            e = _error;
            throw new CryptoError(e.message);
        }
        return sjcl.codec.utf8String.fromBits(decrypted);
    };

    return RNCryptor;


})(window);