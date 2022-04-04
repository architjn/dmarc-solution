var validators = require("./validator");

var generate = function (values) {
	var record = [];
	if (values.v == undefined) {
		throw new Error("DMARC Version is required tag");
	}
	validators.v.validate.call(validators.v, "v", values.v);
	record.push("v=" + values.v);
	for (var i = 0; i < Object.keys(values).length; i++) {
		var term = Object.keys(values)[i];
		if (term === "v") continue;
		if (validators[term]) {
			let settings = validators[term];
			var value = null;
			if (settings.generate) {
				value = settings.generate(values[term]);
			} else value = values[term];
			settings.validate.call(settings, term, value);
			record.push(term + "=" + value);
		}
	}
	return record.join("; ");
};

module.exports = generate;
