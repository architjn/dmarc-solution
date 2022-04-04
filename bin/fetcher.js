var dns = require("dns").promises;

var fetch = async function (domainName) {
	let records = await dns.resolveTxt("_dmarc." + domainName).catch(console.error);
	if (!records) {
		if (err.message && typeof err.message == "string" && err.message.startsWith("queryTxt ENOTFOUND"))
			throw new Error("DMARC Record not available");
		throw new Error(err.message);
	}
	var record = null;
	for (var i = 0; i < records.length; i++) {
		for (var j = 0; j < records[i].length; j++) {
			if (records[i][j].startsWith("v=DMARC")) {
				record = records[i][j];
				break;
			}
		}
		if (record && records[i].length > 0) record = records[i].join("");
		if (record != null) break;
	}
	if (record == null) return reject(new Error("DMARC Record not available"));
	return record;
};
module.exports = fetch;
