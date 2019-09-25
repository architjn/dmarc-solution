var parser = require('./parser');

exports.parser = function (dmarcRecord) {
    return new Promise((resolve, reject) => {
        var result = parser(dmarcRecord);
        if (result.messages.length) reject(messages);
        else resolve(result.tags);
    });
}