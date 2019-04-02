var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
var mongodbURI = 'mongodb://naman:naman123@ds141358.mlab.com:41358/naman'
mongoose.connect(mongodbURI, () => console.log('DB Connected'))

module.exports = {mongoose};
