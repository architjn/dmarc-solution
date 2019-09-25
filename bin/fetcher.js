var dns = require('dns');

var fetch = function (domainName) {
	return new Promise((resolve, reject) => {
		dns.resolveTxt('_dmarc.' + domainName, (err, records) => {
			if (err) {
				if (err.message && typeof err.message == 'string' && err.message.startsWith('queryTxt ENOTFOUND'))
					return reject(new Error('DMARC Record not available'));
				return reject(err.message);
			}
			var record = null;
			for (var i = 0; i < records.length; i++) {
				for (var j = 0; j < records[i].length; j++) {
					if (records[i][j].startsWith('v=DMARC')) {
						record = records[i][j];
						break;
					}
				}
				if (record != null)
					break;
			}
			if (record == null) return reject(new Error('DMARC Record not available'));
			return resolve(record);
		});
	})
}
module.exports = fetch;