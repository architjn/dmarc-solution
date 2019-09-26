# dmarc-solution
> One stop solution for all DMARC Problems. This package includes fetching of dmarc record, parsing the provided/fetched record, validation of DMARC record, generating a new DMARC record

# Install
	npm install --save dmarc-solution
  
# Usage
### DMARC Generator
```javascript
const dmarc = require('dmarc-solution');

// Generator
var generateInputs = {
  v: 'DMARC1', // only required tag
  p: 'quarantine', //must be one of: none, quarantine, reject
  rua: ['dmarc@example.com'], //array of emails for aggregate reports
  ruf: ['dmarc@example.com'], //array of emails for forensic reports
  fo: ['0', '1', 'd'], //array of selected options from: 0, 1, d, s
  pct: 75, //integer value from 0 to 100
  rf: 'afrf', //must be one or more of these string values: afrf, iodef
  ri: 1, //must be an unsigned integer
  sp: 'none', //must be one of: none, quarantine, reject
  aspf: 'r', //must be one of "r" or "s"
  adkim: 's', //must be one of "r" or "s"
}

dmarc.generate(generateInputs)
.then(record => {
  console.log(record); //v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com; ruf=mailto:dmarc@example.com; fo=0:1:d; pct=75; rf=afrf; ri=1; sp=none; aspf=r; adkim=s
})
.catch(err => {
  console.log(err);
});
```

### DMARC Fetcher
```javascript
const dmarc = require('dmarc-solution');

// Fetcher from DNS
dmarc.fetch('github.com')
.then(record => {
  console.log(record);
})
.catch(err => {
  console.log(err);
});
```

### DMARC Parser
```javascript
const dmarc = require('dmarc-solution');

// DMARC Record parser
dmarc.parse('v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com;')
.then(record => {
  console.log(record); //{"v":{"description":"The v tag is required and represents the protocol version. An example is v=DMARC1","value":"DMARC1"},"p":{"description":"The required p tag demonstrates the policy for domain...","value":"quarantine"},"rua":{"description":"This optional tag is designed for reporting URI(s) for aggregate data...","value":"mailto:dmarc@example.com"}}
})
.catch(err => {
  console.log(err);
});
```
