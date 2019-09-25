'use strict';

const validator = require('email-validator');

const validators = {
    v: {
        required: true,
        // termPattern: /^v$/,
        description: 'The v tag is required and represents the protocol version. An example is v=DMARC1',
        validate(term, value) {
            if (value !== 'DMARC1') {
                throw new Error(`Invalid DMARC version: '${value}'`);
            }
        }
    },
    fo: {
        // termPattern: /^fo$/,
        description: 'The FO tag pertains to how forensic reports are created and presented to DMARC users.',
        validate(term, value) {
            if (!/^([01ds])$/i.test(value)) {
                throw new Error(`Invalid value for '${term}': '${value}', must be one of: 0, 1, d, s`);
            }
        }
    },
    p: {
        description: 'The required p tag demonstrates the policy for domain (or requested handling policy). It directs the receiver to report, quarantine, or reject emails that fail authentication checks. Policy options are: 1) None 2) Quarantine or 3) Reject.',
        validate(term, value) {
            if (!/^(none|quarantine|reject)$/i.test(value)) {
                throw new Error(`Invalid value for '${term}': '${value}', must be one of: none, quarantine, reject`);
            }
        }
    },
    pct: {
        description: `This DMARC tag specifies the percentage of email messages subjected to filtering. For example, pct=25 means a quarter of your company’s emails will be filtered by the recipient.`,
        validate(term, value) {
            if (!/^\d+$/.test(value)) {
                throw new Error(`Invalid value for '${term}': ${value}, must be a positive integer`);
            }
            else if (parseInt(value, 10) > 100 || parseInt(value, 10) < 0) {
                throw new Error(`Invalid value for '${term}': ${value}, must be an integer between 0 and 100`);
            }
        }
    },
    rf: {
        description: `Format to be used for message-specific failure reports (colon-separated plain-text list of values)`,
        validate(term, value) {
            // The RFC says the values are colon-separated but a lot of examples/docs around the net show commas... so we'll do both
            let values = value.split(/,|:/).map(x => x.trim());

            for (let val of values) {
                if (!/^(afrf|iodef)$/i.test(val)) {
                    throw new Error(`Invalid value for '${term}': '${value}', must be one or more of these values: afrf, iodef. Multiple values must be separated by a comma or colon`);
                }
            }
        }
    },
    ri: {
        description: 'The ri tag corresponds to the aggregate reporting interval and provides DMARC feedback for the outlined criteria.',
        validate(term, value) {
            if (!/^\d+$/.test(value)) {
                throw new Error(`Invalid value for '${term}': ${value}, must be an unsigned integer`);
            }
        }
    },
    rua: {
        description: 'This optional tag is designed for reporting URI(s) for aggregate data. An rua example is rua=mailto:CUSTOMER@for.example.com.',
        validate(term, value) {
            let values = value.split(/,/).map(x => x.trim());

            for (let val of values) {
                let matches = val.match(/^mailto:(.+)$/i);
                if (!matches) {
                    throw new Error(`Invalid value for '${term}': ${value}, must be a list of DMARC URIs such as 'mailto:some.email@somedomain.com'`);
                }
                let email = matches[1];
                if (!validator.validate(email)) {
                    throw new Error(`Invalid email address in '${term}': '${email}'`);
                }
            }
        }
    },
    ruf: {
        description: 'Like the rua tag, the ruf designation is an optional tag. It directs addresses to which message-specific forensic information is to be reported (i.e., comma-separated plain-text list of URIs). An ruf example is ruf=mailto:CUSTOMER@for.example.com.',
        validate(term, value) {
            let values = value.split(/,/).map(x => x.trim());

            for (let val of values) {
                let matches = val.match(/^mailto:(.+)$/i);
                if (!matches) {
                    throw new Error(`Invalid value for '${term}': ${value}, must be a list of DMARC URIs such as 'mailto:some.email@somedomain.com'`);
                }
                let email = matches[1];
                if (!validator.validate(email)) {
                    throw new Error(`Invalid email address in '${term}': '${email}'`);
                }
            }
        }
    },
    sp: {
        description: 'Requested Mail Receiver policy for all subdomains. Can be "none", "quarantine", or "reject".',
        validate(term, value) {
            if (!/^(none|quarantine|reject)$/i.test(value)) {
                throw new Error(`Invalid value for '${term}': '${value}', must be one of: none, quarantine, reject`);
            }
        }
    },
    aspf: {
        description: 'The aspf tag represents alignment mode for SPF. An optional tag, aspf=r is a common example of its configuration.',
        validate(term, value) {
            if (!/^(s|r)$/i.test(value)) {
                throw new Error(`Invalid value for '${term}': '${value}', must be one of "r" or "s"`);
            }
        }
    },
    adkim: {
        description: 'Similar to aspf, the optional adkim tag is the alignment mode for the DKIM protocol. A sample tag is adkim=r.',
        validate(term, value) {
            if (!/^(s|r)$/i.test(value)) {
                throw new Error(`Invalid value for '${term}': '${value}', must be one of "r" or "s"`);
            }
        }
    }
};

function parse(policy) {
    // Steps
    // 1. Split policy string on semicolons into term pairs
    // 2. Process and validate each term pair

    let terms = policy.split(/;/)
        .map(t => t.trim()) // Trim surrounding whitespace
        .filter(x => x !== ''); // Ignore empty tags

    let rules = terms.map(
        x => x.split(/[=]/)
            .map(p => p.trim())
    );

    let retval = {
        tags: {},
        messages: []
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
            let termRegex = new RegExp(`^${validatorTerm}$`, 'i');
            if (termRegex.test(term)) {
                found = true;

                let tag = {
                    // tag: term,
                    description: settings.description
                };

                if (settings.validate) {
                    try {
                        settings.validate.call(settings, term, value);
                        tag.value = value;
                        retval.tags[term] = tag;
                    }
                    catch (err) {
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