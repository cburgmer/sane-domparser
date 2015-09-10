var isParseError = function (parsedDocument) {
    // http://stackoverflow.com/questions/11563554/how-do-i-detect-xml-parsing-errors-when-using-javascripts-domparser-in-a-cross
    var p = new DOMParser(),
        errorneousParse = p.parseFromString('<', 'text/xml'),
        parsererrorNS = errorneousParse.getElementsByTagName("parsererror")[0].namespaceURI;

    if (parsererrorNS === 'http://www.w3.org/1999/xhtml') {
        // In PhantomJS the parseerror element doesn't seem to have a special namespace, so we are just guessing here :(
        return parsedDocument.getElementsByTagName("parsererror").length > 0;
    }

    return parsedDocument.getElementsByTagNameNS(parsererrorNS, 'parsererror').length > 0;
};

var failOnParseError = function (doc) {
    if (doc === null || isParseError(doc)) {
        throw {
            message: "Invalid source"
        };
    }
};

exports.parseFromString = function (content, mimeType) {
    var p = new DOMParser(),
        doc = p.parseFromString(content, mimeType);

    failOnParseError(doc);

    return doc;
};
