const Crypto = require('crypto');

module.exports = {
    hashPassword: (pass) => {
        return Crypto.createHmac("sha256", 'eshop123').update(pass).digest('hex');
    }
}