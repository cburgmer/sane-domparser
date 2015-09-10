var test = require('tape'),
    report = require('browserify-tape-spec');

var saneDomParser = require('../index.js');

var backupDOMParser = window.DOMParser;
var mockDOMParser = function (returnValue) {
    window.DOMParser = function () {
        return {
            parseFromString: function () {
                return returnValue;
            }
        };
    };
};
var restoreDOMParser = function () {
    window.DOMParser = backupDOMParser;
};

test('should parse valid XML successfully', function (t) {
    var doc = saneDomParser.parseFromString('<xml></xml>', 'application/xml');
    t.equal(doc.documentElement.tagName, 'xml');
    t.end();
});

test('should throw error on invalid input', function (t) {
    var errorDOM = new DOMParser().parseFromString('<parsererror xmlns="http://www.mozilla.org/newlayout/xml/parsererror.xml"></parsererror>', 'text/xml');
    mockDOMParser(errorDOM);

    t.throws(function () {
        saneDomParser.parseFromString('<xml', 'text/xml');
    }, /Parse error/);

    restoreDOMParser();
    t.end();
});

test('should include error message from Firefox', function (t) {
    var errorDOM = new DOMParser().parseFromString('<parsererror xmlns="http://www.mozilla.org/newlayout/xml/parsererror.xml">XML Parsing Error: prefix not bound to a namespace\n Location: file:////tmp/index.html\n Line Number 1, Column 57:<sourcetext>&lt;html xmlns="http://www.w3.org/1999/xhtml"&gt;&lt;head/&gt;&lt;body&gt;&lt;namespace:customtag&gt;&lt;!-- namespace:customtag--&gt;&lt;/namespace:customtag&gt;&lt;/body&gt;&lt;/html&gt;\n --------------------------------------------------------^</sourcetext></parsererror>', 'text/xml');
    mockDOMParser(errorDOM);

    t.throws(function () {
        saneDomParser.parseFromString('some invalid XML', 'text/xml');
    }, /XML Parsing Error: prefix not bound to a namespace/);

    restoreDOMParser();
    t.end();
});


if (navigator.userAgent.indexOf('PhantomJS') === -1) {
    test.createStream().pipe(report('out'));
}
