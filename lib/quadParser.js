var events = require('events')
var Lazy=require("lazy");

function QuadParser(stream) {
    var self = this
    events.EventEmitter.call(this);
    var lzy = new Lazy(stream)
    .lines
    .forEach(
	function(line) 
	{
            var str = line.toString() + "\n"
            var quad = parseQuadLine(str)
            if (quad != null) {
                self.emit("quad", quad)   
            }
	}
    );
    lzy.join(function() {
        self.emit("end")
    })
}

QuadParser.super_ = events.EventEmitter;
QuadParser.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: QuadParser,
        enumerable: false
    }
});

function Quad(subject,pred,obj,graph) {
    this.s = new RdfUri(subject)
    this.p = new RdfUri(pred)
    this.o = new RdfObject(obj)
    this.g = new RdfUri(graph)
}

var uriRegex = /<([^>]*)>/

function RdfUri(url) {
    self = this
    var match = uriRegex(url)
    if (match) {
        self.raw = match[1]
    } else {
        self.raw = url
    }
}
RdfUri.prototype.toString = function() {
    return this.raw
}

function RdfObject(val) {    
    self = this
    var match = uriRegex(val)
    if (match) {
        self.raw = match[1]
        self.type = 'uri'
    } else {
        self.raw = val
        self.type = 'literal'
    }
}
RdfObject.prototype.toString = function() {
    return this.raw
}
RdfObject.prototype.isUri = function() {
    return this.type == 'uri'
}
RdfObject.prototype.isLiteral = function() {
    return this.type == 'literal'
}

var quadRegex = /\s*(<[^>]*>|_:[A-Za-z][A-Za-z0-9]*)\s*(<[^>]*>)\s*(".*"?|<[^>]*>|_:[A-Za-z][A-Za-z0-9]*)\s*(<[^>]*>).*\s*\.\s*$/
var isComment =/^\s*\/\//

function parseQuadLine(line) {
    if (line == null || line === "" || isComment(line)) {
        return null;
    } else {
        var match = quadRegex(line)
        var s = match[1].trim()
        var p = match[2].trim()
        var o = match[3].trim()
        var g = match[4].trim()
        return new Quad(s,p,o,g)
    }
}

module.exports.QuadParser = QuadParser
module.exports.RdfUri = RdfUri
module.exports.RdfObject = RdfObject
module.exports.parseQuadLine = parseQuadLine

