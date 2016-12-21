
const fs = require('fs');
const path = require('path');

const fileExist = fs.existsSync(path.resolve(__dirname, 'messages.json'));

if (fileExist) {
    module.exports = require('./messages.json');
} else {
    module.exports = require('./banter.json');
}
