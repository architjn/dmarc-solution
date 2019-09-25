var parser = require('./bin/parser');
var fetcher = require('./bin/fetcher');
var generator = require('./bin/generator');

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

var recordGenerator = function (values) {
    return new Promise((resolve, reject) => {
        try {
            resolve(generator(values))
        } catch (err) {
            reject(err.message)
        }
    })
}

exports.parse = recordParser;
exports.fetch = recordFetcher;
exports.generate = recordGenerator;