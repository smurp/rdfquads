A very simple parser for NQuads as specified by http://sw.deri.org/2008/07/n-quads/

Installation
============

To use this library, simply add a npm dependency or 

	npm install rdfquads

Example
=======

```javascript
var QuadParser = require("rdfquads").QuadParser
// Build a parser around a stream
var parser = new QuadParser(stream)
// A quad event is emitted every time a valid quad is parsed
parser.on('quad', function(quad) {
    if (subject == String(quad.s)) {
	...
    }
})
// An end event is emitted once the stream has been exhausted
parser.on('end', function(quad) {
    res.end()
})
```
