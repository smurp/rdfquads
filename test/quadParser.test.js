var parser = require('quadParser')
var fs = require('fs')
var RdfUri = parser.RdfUri
var RdfObject = parser.RdfObject
var QuadParser = parser.QuadParser


exports.testParseEmpty = function(beforeExit, assert) {
    assert.isNull(parser.parseQuadLine(""))
    assert.isNull(parser.parseQuadLine(null))
    assert.isNull(parser.parseQuadLine("// <http://s> <http://p> <http://o> <http://g> ."))
};

exports.testParseBasicQuad = function(beforeExit, assert) {
    var spog = parser.parseQuadLine("<http://s> <http://p> <http://o> <http://g> .")
    assert.equal("http://s", spog.s)
    assert.equal("http://p", spog.p)
    assert.equal("http://o", spog.o)
    assert.equal("http://g", spog.g)
};

exports.testParseBasicQuadWithBlankSubject = function(beforeExit, assert) {
    var spog = parser.parseQuadLine("<http://s> <http://p> _:bnode1 <http://g> .")
    assert.equal("http://s", spog.s)
    assert.equal("http://p", spog.p)
    assert.equal("_:bnode1", spog.o)
    assert.equal("http://g", spog.g)
};

exports.testParseBasicQuadWithBlankSubject = function(beforeExit, assert) {
    var spog = parser.parseQuadLine("<http://s> <http://p> _:bnode2 <http://g> .")
    assert.equal("http://s", spog.s)
    assert.equal("http://p", spog.p)
    assert.equal("_:bnode2", spog.o)
    assert.equal("http://g", spog.g)
};

exports.testParseBasicQuadWithBlankSubject = function(beforeExit, assert) {
    var spog = parser.parseQuadLine("_:bnode1 <http://p> <http://o> <http://g> .")
    assert.equal("_:bnode1", spog.s)
    assert.equal("http://p", spog.p)
    assert.equal("http://o", spog.o)
    assert.equal("http://g", spog.g)
};

exports.testParseBasicQuadWithLiteral = function(beforeExit, assert) {
    var spog = parser.parseQuadLine('<http://s> <http://p> "foo" <http://g> .')
    assert.equal("http://s", spog.s)
    assert.equal("http://p", spog.p)
    assert.equal('"foo"', spog.o.toString())
    assert.equal("http://g", spog.g)
};

exports.testParseBasicQuadWithLiteralContainingQuotes = function(beforeExit, assert) {
    var spog = parser.parseQuadLine('<http://s> <http://p> "foo\"" <http://g> .')
    assert.equal("http://s", spog.s)
    assert.equal("http://p", spog.p)
    assert.equal('"foo\""', spog.o.toString())
    assert.equal("http://g", spog.g)
};

exports.testVarietyOfQuads= function(beforeExit, assert) {
    // Sample quads from http://sw.deri.org/2008/07/n-quads/
    //<http://example.org/alice/foaf.rdf#me> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> <http://example.org/alice/foaf.rdf> .
    //<http://example.org/alice/foaf.rdf#me> <http://xmlns.com/foaf/0.1/name>                  "Alice"                            <http://example.org/alice/foaf.rdf> .
    //<http://example.org/alice/foaf.rdf#me> <http://xmlns.com/foaf/0.1/knows>                 _:bnode1                           <http://example.org/alice/foaf.rdf> .
    //_:bnode1                               <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> <http://example.org/alice/foaf.rdf> .
    //_:bnode1                               <http://xmlns.com/foaf/0.1/name>                  "Bob"                              <http://example.org/alice/foaf.rdf> .
    //_:bnode1                               <http://xmlns.com/foaf/0.1/homepage>              <http://example.org/bob/>          <http://example.org/alice/foaf.rdf> .
    //_:bnode1                               <http://www.w3. org/2000/01/rdf-schema#seeAlso>   <http://example.org/bob/foaf.rdf>  <http://example.org/alice/foaf.rdf> .
    //
    //<http://example.org/bob/foaf.rdf#me>   <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> <http://example.org/bob/foaf.rdf> .
    //<http://example.org/bob/foaf.rdf#me>   <http://xmlns.com/foaf/0.1/name>                  "Bob"                              <http://example.org/bob/foaf.rdf> .
    //<http://example.org/bob/foaf.rdf#me>   <http://xmlns.com/foaf/0.1/homepage>              <http://example.org/bob/>          <http://example.org/bob/foaf.rdf> .

    
    var spog = parser.parseQuadLine('<http://example.org/alice/foaf.rdf#me> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> <http://example.org/alice/foaf.rdf> .')
    assert.equal("http://example.org/alice/foaf.rdf#me", spog.s)
    assert.equal("http://www.w3.org/1999/02/22-rdf-syntax-ns#type", spog.p)
    assert.equal('http://xmlns.com/foaf/0.1/Person', spog.o)
    assert.equal("http://example.org/alice/foaf.rdf", spog.g)
    
    spog = parser.parseQuadLine('<http://example.org/alice/foaf.rdf#me> <http://xmlns.com/foaf/0.1/name>                  "Alice"                            <http://example.org/alice/foaf.rdf> .')
    assert.equal("http://example.org/alice/foaf.rdf#me", spog.s)
    assert.equal("http://xmlns.com/foaf/0.1/name", spog.p)
    assert.equal('"Alice"', spog.o)
    assert.equal("http://example.org/alice/foaf.rdf", spog.g)
    
    spog = parser.parseQuadLine('<http://example.org/alice/foaf.rdf#me> <http://xmlns.com/foaf/0.1/knows>                 _:bnode1                           <http://example.org/alice/foaf.rdf> .')
    assert.equal("http://example.org/alice/foaf.rdf#me", spog.s)
    assert.equal("http://xmlns.com/foaf/0.1/knows", spog.p)
    assert.equal('_:bnode1', spog.o)
    assert.equal("http://example.org/alice/foaf.rdf", spog.g)
    
    spog = parser.parseQuadLine('_:bnode1                               <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> <http://example.org/alice/foaf.rdf> .')
    assert.equal("_:bnode1", spog.s)
    assert.equal("http://www.w3.org/1999/02/22-rdf-syntax-ns#type", spog.p)
    assert.equal('http://xmlns.com/foaf/0.1/Person', spog.o)
    assert.equal("http://example.org/alice/foaf.rdf", spog.g)
    
    spog = parser.parseQuadLine('_:bnode1                               <http://xmlns.com/foaf/0.1/name>                  "Bob"                              <http://example.org/alice/foaf.rdf> .')
    assert.equal("_:bnode1", spog.s)
    assert.equal("http://xmlns.com/foaf/0.1/name", spog.p)
    assert.equal('"Bob"', spog.o)
    assert.equal("http://example.org/alice/foaf.rdf", spog.g)
    
    spog = parser.parseQuadLine('_:bnode1                               <http://xmlns.com/foaf/0.1/homepage>              <http://example.org/bob/>          <http://example.org/alice/foaf.rdf> .')
    assert.equal("_:bnode1", spog.s)
    assert.equal("http://xmlns.com/foaf/0.1/homepage", spog.p)
    assert.equal('http://example.org/bob/', spog.o)
    assert.equal("http://example.org/alice/foaf.rdf", spog.g)
    
    spog = parser.parseQuadLine('_:bnode1                               <http://www.w3. org/2000/01/rdf-schema#seeAlso>   <http://example.org/bob/foaf.rdf>  <http://example.org/alice/foaf.rdf> .')
    assert.equal("_:bnode1", spog.s)
    assert.equal("http://www.w3. org/2000/01/rdf-schema#seeAlso", spog.p)
    assert.equal('http://example.org/bob/foaf.rdf', spog.o)
    assert.equal("http://example.org/alice/foaf.rdf", spog.g)
    
    spog = parser.parseQuadLine('<http://example.org/bob/foaf.rdf#me>   <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> <http://example.org/bob/foaf.rdf> .')
    assert.equal("http://example.org/bob/foaf.rdf#me", spog.s)
    assert.equal("http://www.w3.org/1999/02/22-rdf-syntax-ns#type", spog.p)
    assert.equal('http://xmlns.com/foaf/0.1/Person', spog.o)
    assert.equal("http://example.org/bob/foaf.rdf", spog.g)
    
    spog = parser.parseQuadLine('<http://example.org/bob/foaf.rdf#me>   <http://xmlns.com/foaf/0.1/name>                  "Bob"                              <http://example.org/bob/foaf.rdf> .')
    assert.equal("http://example.org/bob/foaf.rdf#me", spog.s)
    assert.equal("http://xmlns.com/foaf/0.1/name", spog.p)
    assert.equal('"Bob"', spog.o)
    assert.equal("http://example.org/bob/foaf.rdf", spog.g)
    
    spog = parser.parseQuadLine('<http://example.org/bob/foaf.rdf#me>   <http://xmlns.com/foaf/0.1/homepage>              <http://example.org/bob/>          <http://example.org/bob/foaf.rdf> .')
    assert.equal("http://example.org/bob/foaf.rdf#me", spog.s)
    assert.equal("http://xmlns.com/foaf/0.1/homepage", spog.p)
    assert.equal('http://example.org/bob/', spog.o)
    assert.equal("http://example.org/bob/foaf.rdf", spog.g)
}



exports.testRdfUri = function(beforeExit, assert) {
    assert.equal("http://s", new RdfUri("http://s").toString())
    assert.equal("http://s", new RdfUri("<http://s>").toString())
    assert.equal("http://s", new RdfUri("http://s"))
    assert.equal("http://s", new RdfUri("<http://s>"))
};


exports.testRdfObject = function(beforeExit, assert) {
    var uriObj = new RdfObject("<http://s>")
    assert.equal("http://s", uriObj.toString())
    assert.equal(true, uriObj.isUri())
    assert.equal(false, uriObj.isLiteral())
    
    
    var litObj = new RdfObject('"http://s"')
    assert.equal('"http://s"', litObj.toString())
    assert.equal(false, litObj.isUri())
    assert.equal(true, litObj.isLiteral())
};


exports.testCreation = function(beforeExit, assert) {
    new QuadParser()
};

//exports.testParse = function(beforeExit, assert) {
//    var readStream = fs.createReadStream('./test/data/1.nq').addListener("open", function() { readStream.pause() })
//    var count = 0
//    var parser = new QuadParser(readStream)
//    parser.on('quad', function() {
//        count++
//        beforeExit(function() {
//    } )
//    readStream.resume()
//    beforeExit(function() {
//        assert.equal(0, count)
//    });    
//}

