const Crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports = {
    hashPassword: (pass) => {
        return Crypto.createHmac("sha256", 'eshop123').update(pass).digest('hex');
    },
    createToken: (payload) => jwt.sign(payload, 'shopping', {expiresIn: '1h'}),
    readToken: (req, res, next) =>  {
        // console.log("token", req.token)
        jwt.verify(req.token, 'shopping', (err, decode) => {
            if (err) {
                return res.status(401).send({success: false, message: 'Unauthorized ❌'})
            }
            // console.log('Translate token :', decode);
            req.dataToken = decode;
            next();
        })
    }
}