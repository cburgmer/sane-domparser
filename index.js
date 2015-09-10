var getParseError = function (parsedDocument) {
    // http://stackoverflow.com/questions/11563554/how-do-i-detect-xml-parsing-errors-when-using-javascripts-domparser-in-a-cross
    var p = new DOMParser(),
        errorneousParse = p.parseFromString('<', 'text/xml'),
        parsererrorNS = errorneousParse.getElementsByTagName("parsererror")[0].namespaceURI,
        parseerrorMatches;

    if (parsererrorNS === 'http://www.w3.org/1999/xhtml') {
        // In PhantomJS the parseerror element doesn't seem to have a special namespace, so we are just guessing here :(
        parseerrorMatches = parsedDocument.getElementsByTagName("parsererror");
    } else {
        parseerrorMatches = parsedDocument.getElementsByTagNameNS(parsererrorNS, 'parsererror');
    }

    if (parseerrorMatches.length > 0) {
        return parseerrorMatches[0].textContent;
    }

    return undefined;
};

var extractParseError = function (content) {
    var match = /(.+)\n/.exec(content);

    if (match) {
        return match[1];
    }
    return undefined;
};

var failOnParseError = function (doc) {
    var errorMessage;

    if (doc === null) {
        throw new Error('Parse error');
    }

    var parseError = getParseError(doc);
    if (parseError !== undefined) {
        errorMessage = extractParseError(parseError) || 'Parse error';
        throw new Error(errorMessage);
    }
};

exports.parseFromString = function (content, mimeType) {
    var p = new DOMParser(),
        doc = p.parseFromString(content, mimeType);

    failOnParseError(doc);

    return doc;
};
