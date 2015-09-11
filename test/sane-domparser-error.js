var test = require('tape'),
    report = require('browserify-tape-spec');

var saneDomParserError = require('../index.js');

test('should pass through a valid document', function (t) {
    var dom = new DOMParser().parseFromString('<xml></xml>', 'text/xml');

    t.equal(saneDomParserError.failOnParseError(dom), dom);
    t.end();
});

test('should throw error on invalid input', function (t) {
    var dom = new DOMParser().parseFromString('<parsererror xmlns="http://www.mozilla.org/newlayout/xml/parsererror.xml"></parsererror>', 'text/xml');

    t.throws(function () {
        saneDomParserError.failOnParseError(dom);
    }, /Parse error/);

    t.end();
});

test('should include error message from Firefox', function (t) {
    var dom = new DOMParser().parseFromString('<parsererror xmlns="http://www.mozilla.org/newlayout/xml/parsererror.xml">XML Parsing Error: prefix not bound to a namespace\n Location: file:////tmp/index.html\n Line Number 1, Column 57:<sourcetext>&lt;html xmlns="http://www.w3.org/1999/xhtml"&gt;&lt;head/&gt;&lt;body&gt;&lt;namespace:customtag&gt;&lt;!-- namespace:customtag--&gt;&lt;/namespace:customtag&gt;&lt;/body&gt;&lt;/html&gt;\n --------------------------------------------------------^</sourcetext></parsererror>', 'text/xml');

    t.throws(function () {
        saneDomParserError.failOnParseError(dom);
    }, /XML Parsing Error: prefix not bound to a namespace/);

    t.end();
});


if (navigator.userAgent.indexOf('PhantomJS') === -1) {
    test.createStream().pipe(report('out'));
}
