"use strict";
require("reflect-metadata");
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
                    type: Reflect.getMetadata("design:type", target, propertyKey)
                }); });
                handlers.handleProp(pd, typeD);
            }
            else if (typeof index === 'number') {
                //method param
                var methodD = getMethod(typeD, propertyKey);
                if (!methodD.params[index]) {
                    methodD.params[index] = {
                        method: methodD,
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
function getMetadatas() {
    return typesData;
}
exports.getMetadatas = getMetadatas;
function outputMarkdown() {
    getMetadatas().forEach(function (v, k) {
        console.log();
        console.log("Type %s", k);
        console.log("Comment %s", v.comment);
        console.log();
        console.log("properties");
        v.props.forEach(function (v, k) {
            console.log('name %s', k);
            console.log('comment %s', v.comment);
            console.log('type %s', v.type);
        });
        console.log();
        console.log("methods");
        v.methods.forEach(function (v, k) {
            console.log("name %s", k);
            console.log('comment %s', v.comment);
            console.log("return type %s", v.returnType);
            v.params.forEach(function (v, i) {
                console.log('index %d', i);
                console.log('comment %s', v.comment);
                console.log('type %s', v.type);
            });
            console.log('');
        });
        console.log();
    });
}
exports.outputMarkdown = outputMarkdown;
//# sourceMappingURL=meta-annotations.js.map