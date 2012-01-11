/**
 * Tiny and simple XML writer util for NodeJS
 * Pavel Minchenkov
 * source: https://github.com/minchenkov/simle-xml-writer
 */

var Encoder = require('node-html-encoder').Encoder;

function XmlWriter(callback, options) {
    options = options || {};

    var encoder = new Encoder(options.encoderType || 'numerical');

    var data = '';

    function write(str) {
        if (options.write)
            options.write(str);
        else
            data += str;
    }

    var level = 0;

    function el() {
        var name = arguments[0];
        var cb = typeof arguments[arguments.length - 1] == 'function' ? arguments[arguments.length - 1] : null;
        var value = typeof arguments[1] != 'function' ? arguments[1] : null;
        var hasNodes = false;
        var startClosed = false;

        if (value == null && !cb)
            return;

        var hasVal = !!value;


        function checkStartClosed() {
            if (startClosed)
                return;

            startClosed = true;
            write('>');
        }

        function addBrake() {
            write('\r\n');
        }

        function escapeString(str) {
            var s;
            if (typeof(str) == 'string')
                s = encoder.htmlEncode(str);
            s = encoder.htmlEncode(str.toString());

            return s.trim();
        }

        function addIndent() {
            for (var z = 0; z < level; z++)
                write('  ');
        }

        function newAttr(name, value) {
            if (hasNodes)
                throw new Error('Element ' + name + ' already closed');
            if (value == null)
                return;
            write(' ' + name + '="');
            write(escapeString(value));
            write('"');
        }

        function newEl() {
            hasNodes = true;
            checkStartClosed();
            level ++;
            el.apply(this, arguments);
            level --;
        }

        function cData(value){
            checkStartClosed();
            level++;
            if (hasNodes) {
                addBrake();
                addIndent(level);
            }
            write("<![CDATA[");
            write(value);
            write("]]>");
            level --;
            hasVal = true;
        }

        function newVal(value) {
            checkStartClosed();
            level ++;
            if (hasNodes) {
                addBrake();
                addIndent(level);
            }
            write(escapeString(value));
            level --;
            hasVal = true;
        }

        if (level != 0) {
            addBrake();
            addIndent();
        }

        write('<' + name);

        if (cb)
            cb(newEl, newAttr, newVal, cData);

        if (!!value) {
            newVal(value);
        }

        if (!hasNodes && !hasVal)
            write('/>');
        else {
            if (hasNodes) {
                addBrake();
                addIndent();
            }

            write('</' + name + '>');
        }
    }

    if (options.addDeclaration)
        write(options.declaration || '<?xml version="1.0" encoding="UTF-8"?>\r\n');

    callback(el);

    this.data = data;
}

XmlWriter.prototype.toString = function() {
    return this.data;
};

exports.XmlWriter = XmlWriter;
