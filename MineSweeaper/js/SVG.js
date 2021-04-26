SVG = {
    _NS : 'http://www.w3.org/2000/svg',
    _regexp : {
        istext : /text|tspan|tref/i,
        translate : /translate\(([-\d\.]+),?\s*([-\d\.]*?)\)/i,
        rotate : /rotate\(([\d\.]+),?.*?\)/i,
        scale : /scale\(([\d\.]+),?.*?\)/i
    },

/// create svg element by name with agruments
/// element's method:
/// create - create any svg element
/// append - append child
/// attr - set, get any attributes
/// text - set a text
    create : function(name, attributes) {
        var element = document.createElementNS(SVG._NS, name);
        element.create = SVG.create;
        element.append = SVG._append;
        element.attr = SVG._attr;
        element.translate = SVG._translate;
        element.scale = SVG._scale;
/// text elements have attribute rotate
        if (SVG._regexp.istext.test(name) == false) {
            element.rotate = SVG._rotate;
        }
        element.setTransform = function(value) {
            this.attr('transform', value);
        };
        element.text = SVG._text;
        if (typeof(attributes) == 'object') {
            element.attr(attributes);
        }
        return element;
    },
    _append : function(child, attributes) {
        if (typeof child == 'string') {
            var new_child = this.create(child, attributes);
            this.append(new_child);
            return new_child;
        } else {
            this.appendChild(child);
        }
    },
    _text : function(text) {
        text = '' + text + '';
        text = new DOMParser().parseFromString(text, 'application/xhtml+xml').childNodes[0].childNodes[0];
        this.append(text);
    },
    _attr : function(attribute, value) {
        if (typeof attribute == 'object') {
            for (key in attribute) {
                this.setAttribute(key, attribute[key]);
            }
        } else if (typeof(attribute) == 'string') {
            if (typeof value != 'undefined') {
                this.setAttribute(attribute, value);
            } else {
                return this.getAttribute(attribute);
            }
        };
    },

    _translate : function(x, y) {
        var operation = SVG._regexp.translate;
        var transform = null;
        var cx = 0;
        var cy = 0;
        var current_transform = this.attr('transform');
        if (current_transform != null) {
            var values = operation.exec(current_transform);
            if (values != null) {
                cx = (values[1] != '') ? parseFloat(values[1]) : 0;
                cy = (values[2] != '') ? parseFloat(values[2]) : 0;
            }
        }
        if (typeof(x) == 'number') {
            if (typeof(y) != 'number') { y = 0;}
            transform = 'translate('+x+','+y+')';
            if (current_transform != null) {
                if (operation.test(current_transform)) {
                    transform = current_transform.replace(operation, transform);
                } else {
                    transform = current_transform + ' ' + transform;
                }
            }
            this.attr('transform', transform);
        }
        return { 'x': cx, 'y': cy }
    },

    _scale : function(scale) {
        var operation = SVG._regexp.scale;
        var transform = null;
        var cscale = 1;
        var current_transform = this.attr('transform');
        if (current_transform != null) {
            var values = operation.exec(current_transform);
            if (values != null) {
                cscale = (values[1] != '') ? parseFloat(values[1]) : 1;
            }
        }
        if (typeof(scale) == 'number') {
            transform = 'scale('+scale+')';
            if (current_transform != null) {
                if (operation.test(current_transform)) {
                    transform = current_transform.replace(operation, transform);
                } else {
                    transform = current_transform + ' ' + transform;
                }
            }
            this.attr('transform', transform);
        }
        return { 'scale': cscale }
    },

    _rotate : function(angle) {
        var operation = SVG._regexp.rotate;
        var transform = null;
        var cangle = 0;
        var current_transform = this.attr('transform');
        if (current_transform != null) {
            var values = operation.exec(current_transform);
            if (values != null) {
                cangle = (values[1] != '') ? parseFloat(values[1]) : 0;
            }
        }
        if (typeof(angle) == 'number') {
            transform = 'rotate('+angle+')';
            if (current_transform != null) {
                if (operation.test(current_transform)) {
                    transform = current_transform.replace(operation, transform);
                } else {
                    transform = current_transform + ' ' + transform;
                }
            }
            this.attr('transform', transform);
        }
        return { 'angle': cangle }
    }

}