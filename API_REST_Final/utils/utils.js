// utils.js
const crypto = require('crypto');

const cifrarSHA256 = (dato) => {
    return crypto.createHash('sha256').update(dato).digest('hex');
};

module.exports = { cifrarSHA256 };
