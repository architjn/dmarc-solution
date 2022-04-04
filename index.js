var parser = require("./bin/parser");
var fetcher = require("./bin/fetcher");
var generator = require("./bin/generator");

var recordParser = async function (dmarcRecord) {
	var result = parser(dmarcRecord);
	if (result.messages && result.messages.length) throw new Error(result.messages);
	return result.tags;
};

var recordFetcher = async function (domainName) {
	let record = await fetcher(domainName);
	let data = await recordParser(record);
	return { record: record, tags: data };
};
  
var recordGenerator = async function (values) {
	return generator(values);
};

exports.parse = recordParser;
exports.fetch = recordFetcher;
exports.generate = recordGenerator;
