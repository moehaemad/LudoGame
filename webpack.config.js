const path = require('path');

module.exports = {
    entry: './js/app.js',
    output:{
        path: path.resolve(__dirname, 'js'),
        filename: 'ludo_bundle.js'
    }
}