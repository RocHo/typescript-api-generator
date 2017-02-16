"use strict";
require("reflect-metadata");
var fs = require('fs');
var typesData = new Map();
function getOrCreate(map, key, creator) {
    if (map.has(key)) {
        return map.get(key);
    }
    else {
        var o = creator();
        map.set(key, o);
        return o;
    }
}
function getType(type) {
    return getOrCreate(typesData, type, function () { return ({
        type: type,
        props: new Map(),
        methods: new Map()
    }); });
}
function createMetaHandler(handlers) {
    if (handlers === void 0) { handlers = {
        handleMethod: function () { },
        handleType: function () { },
        handleProp: function () { },
        handleParam: function () { }
    }; }
    return function (target, propertyKey, index) {
        if (typeof target === 'function') {
            var typeD = getType(target);
            typeD.baseType = Reflect.getMetadata("design:basetype", target, propertyKey);
            handlers.handleType(typeD);
        }
        else {
            var type = target.constructor;
            var typeD = getType(type);
            var getMethod = function (d, name) {
                var method = getOrCreate(d.methods, name, function () {
                    return {
                        name: name,
                        params: [],
                        returnType: Reflect.getMetadata("design:returntype", target, propertyKey)
                    };
                });
                method.returnType = Reflect.getMetadata("design:returntype", target, propertyKey);
                return method;
            };
            //it's a member
            if (index === undefined) {
                // prop
                var pd = getOrCreate(typeD.props, propertyKey, function () { return ({
                    name: propertyKey,
                    type: Reflect.getMetadata("design:type", target, propertyKey),
                    elementType: Reflect.getMetadata("design:elementtype", target, propertyKey)
                }); });
                handlers.handleProp(pd, typeD);
            }
            else if (typeof index === 'number') {
                //method param
                var methodD = getMethod(typeD, propertyKey);
                if (!methodD.params[index]) {
                    methodD.params[index] = {
                        method: methodD,
                        type: Reflect.getMetadata("design:paramtypes", target, propertyKey)[index]
                    };
                }
                handlers.handleParam(methodD.params[index], methodD, typeD);
            }
            else {
                // method
                var methodD = getMethod(typeD, propertyKey);
                handlers.handleMethod(methodD, typeD);
            }
        }
    };
}
function comment(content) {
    return createMetaHandler({
        handleType: function (type) {
            type.comment = content;
        },
        handleMethod: function (method) {
            method.comment = content;
        },
        handleProp: function (prop) {
            prop.comment = content;
        },
        handleParam: function (param) {
            param.comment = content;
        }
    });
}
exports.comment = comment;
function router(path, model) {
    return createMetaHandler({
        handleType: function (type) {
            type.router = {
                path: path,
                type: model
            };
        },
        handleMethod: function (method) {
            method.router = {
                path: path,
                type: model
            };
        }
    });
}
exports.router = router;
function method(m) {
    return createMetaHandler({
        handleMethod: function (method) {
            method.httpMethod = m;
        }
    });
}
exports.method = method;
function post() {
    return method("POST");
}
exports.post = post;
function get() {
    return method("GET");
}
exports.get = get;
function query() {
    return createMetaHandler({
        handleParam: function (param) {
            param.source = "query";
        }
    });
}
exports.query = query;
function body() {
    return createMetaHandler({
        handleParam: function (param) {
            param.source = "body";
        }
    });
}
exports.body = body;
function array(type) {
    return Reflect.metadata("design:elementtype", type);
}
exports.array = array;
function extend(type) {
    return Reflect.metadata("design:basetype", type);
}
exports.extend = extend;
function getMetadatas() {
    return typesData;
}
exports.getMetadatas = getMetadatas;
function getTypeName(type, et) {
    if (!type)
        return 'EMPTY TYPE';
    var r = (et || type).toString().match(/function (\w+)/);
    if (r) {
        return et && type === Array ? "Array<" + r[1] + ">" : r[1];
    }
    else {
        throw new Error("can not find type name " + type);
    }
}
function isSimpleType(type) {
    return [Boolean, String, Number].indexOf(type) > -1;
}
function typeLink(type, et) {
    var tn = getTypeName(type, et);
    return "<span style=\"white-space: nowrap\">[`" + tn + "`](#" + getTypeName(et || type) + ")</span>";
}
function typeTable(output, type, prefix, level) {
    if (prefix === void 0) { prefix = ''; }
    if (level === void 0) { level = 0; }
    var typeD = typesData.get(type);
    if (typeD && typeD.props && typeD.props.size) {
        if (!prefix) {
            output.push("\n| \u540D\u79F0 | \u7C7B\u578B | \u63CF\u8FF0 |\n| --- | --- | --- |");
        }
        typeD.props.forEach(function (v, k) {
            if (isSimpleType(v.type) || level > 5) {
                output.push("| `" + (prefix + v.name) + "` | `" + getTypeName(v.type) + "` | " + (v.comment || '').replace(/[\n\r]/g, '<br>') + " |");
            }
            else {
                output.push("| `" + (prefix + v.name) + "` | " + typeLink(v.type, v.elementType) + " | " + (v.comment || '').replace(/[\n\r]/g, '<br>') + " |");
                typeTable(output, v.elementType || v.type, prefix ? prefix + v.name + '.' : v.name + '.', level + 1);
            }
        });
    }
}
function outputType(output, type) {
    var v = type;
    output.push("\n# <a id=\"" + getTypeName(v.type) + "\"></a> " + getTypeName(v.type) + " " + (v.baseType ? ' `@extend` ' + typeLink(v.baseType) : '') + "\n" + (v.router ? "`" + v.router.path + "`" : '') + "\n\n" + (v.comment || '') + "\n\n");
    var typeD = v;
    typeTable(output, v.type);
    if (v.methods && v.methods.size) {
        v.methods.forEach(function (v, k) {
            output.push("\n## " + v.name + " `" + (v.httpMethod || "GET") + "`\n`" + (typeD.router ? (typeD.router.path || '') : '') + (v.router ? v.router.path : '') + "`\n\n" + v.comment + "\n");
            if (v.router && v.router.type) {
                output.push('### router');
                typeTable(output, v.router.type);
            }
            v.params.forEach(function (v, i) {
                output.push("### " + v.source + "\n" + (v.comment || '') + "\n");
                typeTable(output, v.type);
            });
            if (v.returnType) {
                output.push('### 返回');
                typeTable(output, v.returnType);
            }
        });
    }
}
function outputMarkdown(path) {
    var output = [];
    //output service first
    typesData.forEach(function (v, k) {
        if (v.router)
            outputType(output, v);
    });
    typesData.forEach(function (v, k) {
        if (!v.router)
            outputType(output, v);
    });
    fs.writeFileSync(path, output.join('\r\n'));
}
exports.outputMarkdown = outputMarkdown;
//# sourceMappingURL=meta-annotations.js.map