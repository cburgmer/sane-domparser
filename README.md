# sane-domparser
Provides a more sane DOMParser implementation in that it reports parse errors as meaningful exceptions. As such it is not standards compliant.

## Why?

DOMParser currently does not throw an exception, but instead returns an [error document](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser#Error_handling).

## Develop

    $ npm run-script watchify
    $ xdg-open test/test.html

or just

    $ npm test
