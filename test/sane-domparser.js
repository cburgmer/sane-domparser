var test = require('tape'),
    report = require('browserify-tape-spec');

var saneDomParser = require('../index.js');

test('should parse valid XML successfully', function (t) {
    var doc = saneDomParser.parseFromString('<xml></xml>', 'application/xml');
    t.equal(doc.documentElement.tagName, 'xml');
    t.end();
});

test('should throw error on invalid input', function (t) {
    t.throws(function () {
        saneDomParser.parseFromString('<xml', 'text/xml');
    }, {message: 'Invalid source'});

    t.end();
});

if (navigator.userAgent.indexOf('PhantomJS') === -1) {
    test.createStream().pipe(report('out'));
}
