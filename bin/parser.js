"use strict";
var validators = require("./validator");

function parse(policy) {
	// Steps
	// 1. Split policy string on semicolons into term pairs
	// 2. Process and validate each term pair

	let terms = policy
		.split(/;/)
		.map((t) => t.trim()) // Trim surrounding whitespace
		.filter((x) => x !== ""); // Ignore empty tags

	let rules = terms.map((x) => x.split(/[=]/).map((p) => p.trim()));

	let retval = {
		tags: {},
		messages: [],
	};

	// Make sure `v` is the first tag
	if (!/^v$/i.test(rules[0][0])) {
		retval.messages.push(`First tag in a DMARC policy must be 'v', but found: '${rules[0][0]}'`);
		return retval;
	}

	for (let rule of rules) {
		let term = rule[0];
		let value = rule[1];

		let found = false;

		for (let validatorTerm of Object.keys(validators)) {
			let settings = validators[validatorTerm];

			// Term matches validaor
			debugger;
			let termRegex = new RegExp(`^${validatorTerm}$`, "i");
			if (termRegex.test(term)) {
				found = true;

				let tag = {
					// tag: term,
					description: settings.description,
				};

				if (settings.validate) {
					try {
						settings.validate.call(settings, term, value);
						tag.value = value;
						retval.tags[term] = tag;
					} catch (err) {
						retval.messages.push(err.message);
					}
				}

				break;
			}
		}

		if (!found) {
			retval.messages.push(`Unknown tag '${term}'`);
		}
	}

	// Remove "messages"
	if (retval.messages.length === 0) {
		delete retval.messages;
	}

	return retval;
}

module.exports = parse;
