
exports.logObject = function(obj) {
  console.log('- logObject:', require('util').inspect(obj));
}

exports.logObject = function(label, obj) {
  console.log('-', label, require('util').inspect(obj));
}

exports.logRoute = function(request) {
  console.log(request.method, request.url);
}

