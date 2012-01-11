var XmlWriter = require('../lib/simple-xml-writer.js').XmlWriter;

var data = new XmlWriter(function (el) {
    el('root', function (el, at) {
        at('xmlns:c', 'http://schemas.xmlsoap.org/wsdl/');
        el('node', function (el, at) {
            at('name', 'foo');
            at('null_attr');
            at('empty_attr', '');

            el('value', 'foo');
            el('null_node');
            el('empty_node', '');
            el('encode', 'тест ß');
            el('c:value', 'text', function (el) {
                el('encoding', 'tags:  <br />', function (el, at, text) {
                    at('quotes', '""');
                    el('dd', function (el, at, text) {
                        text('foo')
                        text('bar')
                    })
                });
            });
        });
    });
}, { addDeclaration:true });

console.log(data.toString());