var XmlWriter = require('../lib/simple-xml-writer.js').XmlWriter;

var data = new XmlWriter(function(el) {
    el('root', function(el, at) {
        at('xmlns:c', 'http://schemas.xmlsoap.org/wsdl/');
        el('node', function(el, at, text, cdata) {
            cdata("this has <brackets> & funny stuff;");
        });
    });
});

console.log(data.toString());