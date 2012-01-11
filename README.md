# simple-xml-writer

Tiny and simple XML writer util for NodeJS

## Install
    npm install simple-xml-writer

## Examples

    var XmlWriter = require('simple-xml-writer').XmlWriter;

    var data = new XmlWriter(function(el) {
        el('root', function(el, at) {
            at('xmlns:c', 'http://schemas.xmlsoap.org/wsdl/');
            el('node', function(el, at) {
                at('name', 'foo');
                at('null_attr');
                at('empty_attr', '');

                el('value', 'foo');
                el('null_node');
                el('empty_node', '');
                el('encode', 'тест ß');
                el('c:value', 'text', function(el) {
                    el('encoding', 'tags:  <br />', function(el, at, text) {
                        at('quotes', '""');
                        el('dd', function(el, at, text) {
                            text('foo')
                            text('bar')
                        })
                    });
                });
            });
        });
    }, { addDeclaration: true });

    console.log(data.toString());

Output:

    <?xml version="1.0" encoding="UTF-8"?>
    <root xmlns:c="http://schemas.xmlsoap.org/wsdl/">
      <node name="foo" empty_attr="">
        <value>foo</value>
        <empty_node/>
        <encode>&#1090;&#1077;&#1089;&#1090; &#223;</encode>
        <c:value>
          <encoding quotes="&#34;&#34;">
            <dd>foobar</dd>
            tags:  &#60;br /&#62;
          </encoding>
          text
        </c:value>
      </node>
    </root>
