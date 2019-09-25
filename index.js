var parser = require('./bin/parser');
var fetcher = require('./bin/fetcher');

var recordParser = function (dmarcRecord) {
    return new Promise((resolve, reject) => {
        var result = parser(dmarcRecord);
        if (result.messages && result.messages.length) return reject(result.messages);
        resolve(result.tags);
    });
}

var recordFetcher = function (domainName) {
    return new Promise((resolve, reject) => {
        return fetcher(domainName)
            .then(record => {
                return recordParser(record).then(r => [r, record]);
            })
            .then(([data, record]) => {
                resolve({ record: record, tags: data });
            })
            .catch(err => {
                reject(err);
            })
    })
}

exports.parse = recordParser;
exports.fetch = recordFetcher;