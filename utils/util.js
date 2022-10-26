const crypto = require('crypto');
function encrypt(text) {
    const hash = crypto.createHash('sha256', '12345678abcdefgh').update(text).digest('hex');
    return hash.slice(0, 32);
}
module.exports = { encrypt }
