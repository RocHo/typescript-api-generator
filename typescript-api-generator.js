"use strict";
var ts = require("typescript");
/// <reference path="/Users/rocho/Library/Preferences/WebStorm2016.2/javascript/extLibs/http_github.com_DefinitelyTyped_DefinitelyTyped_raw_master_node_index.d.ts" />
var fs = require("fs");
var types = {};
function getDefault(o, k, creator) {
    return o.hasOwnProperty(k) ? o[k] : (o[k] = creator());
}
function getDecorators(d) {
    var dm = {};
    if (d && d.decorators) {
        d.decorators.forEach(function (d) {
            if (d.expression.kind === ts.SyntaxKind.CallExpression) {
                var call = d.expression;
                if (call.expression.kind === ts.SyntaxKind.Identifier) {
                    var name_1 = call.expression.text;
                    var args = call.arguments.map(function (a) {
                        switch (a.kind) {
                            case ts.SyntaxKind.StringLiteral:
                                return a.text;
                            case ts.SyntaxKind.NumericLiteral:
                                return a.text.search(/\./g) > -1 ? Number.parseFloat(a.text) : Number.parseInt(a.text);
                            case ts.SyntaxKind.NullKeyword:
                                return null;
                            case ts.SyntaxKind.Identifier:
                                return {
                                    typeName: a.text,
                                    getType: function () {
                                        for (var tn in types) {
                                            if (types[tn].name === a.text) {
                                                return types[tn];
                                            }
                                        }
                                    }
                                };
                        }
                    });
                    getDefault(dm, name_1, function () { return []; }).push(args);
                }
            }
            else if (d.expression.kind === ts.SyntaxKind.Identifier) {
                getDefault(dm, d.expression.text, function () { return []; });
            }
            else {
                throw new Error('decorator error');
            }
        });
    }
    return dm;
}
function getType(checker, t) {
    if (!t)
        return null;
    var currentType = t.getConstructSignatures ? t : checker.getTypeAtLocation(t);
    // if(currentType.symbol) currentType = checker.getDeclaredTypeOfSymbol(currentType.symbol);
    var td = getDefault(types, currentType.id, function () {
        if (currentType.intrinsicName) {
            return {
                id: currentType.id,
                name: currentType.name || currentType.intrinsicName,
                intrinsicName: currentType.intrinsicName
            };
        }
        else {
            return {
                id: currentType.id,
                name: currentType.symbol.getName() === '__type' ? 'inline' : currentType.symbol.getName(),
                anonymous: currentType.symbol.getName() === '__type',
                comments: ts.displayPartsToString(currentType.symbol.getDocumentationComment())
            };
        }
    });
    if (td.intrinsicName)
        return td;
    if (!td._inited) {
        td._inited = true;
        td.decorators = getDecorators(currentType.symbol.valueDeclaration);
        td.isArray = currentType.symbol.getName() === 'Array';
        if (td.isArray) {
            td.elementType = getType(checker, currentType.typeArguments[0]);
            td.name = td.elementType.name + "[]";
            td.anonymous = td.elementType.anonymous;
        }
        else {
            td.baseTypes = (currentType.getBaseTypes() || []).map(function (bt) {
                return getType(checker, bt);
            });
            td.methods = {};
            td.properties = {};
            var _loop_1 = function(m) {
                switch (m.valueDeclaration.kind) {
                    case ts.SyntaxKind.MethodDeclaration:
                        var s_1 = checker.getSignatureFromDeclaration(m.valueDeclaration);
                        getDefault(td.methods, m.getName(), function () {
                            var md = {
                                name: m.getName(),
                                comments: ts.displayPartsToString(m.getDocumentationComment()),
                                decorators: getDecorators(m.valueDeclaration),
                                returnType: getType(checker, s_1.resolvedReturnType),
                                params: s_1.parameters.map(function (p, i) {
                                    return {
                                        name: p.getName(),
                                        index: i,
                                        comments: ts.displayPartsToString(p.getDocumentationComment()),
                                        decorators: getDecorators(p.valueDeclaration),
                                        type: getType(checker, p.valueDeclaration.type)
                                    };
                                })
                            };
                            return md;
                        });
                        break;
                    case ts.SyntaxKind.PropertyDeclaration:
                    case ts.SyntaxKind.PropertySignature:
                        var p_1 = m.valueDeclaration;
                        getDefault(td.properties, m.getName(), function () {
                            return {
                                name: m.getName(),
                                comments: ts.displayPartsToString(m.getDocumentationComment()),
                                decorators: getDecorators(p_1),
                                type: getType(checker, p_1.type)
                            };
                        });
                        break;
                }
            };
            for (var _i = 0, _a = currentType.getProperties(); _i < _a.length; _i++) {
                var m = _a[_i];
                _loop_1(m);
            }
        }
    }
    return td;
}
function generate(fileNames) {
    var program = ts.createProgram([fileNames[0]], {
        target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS
    });
    var checker = program.getTypeChecker();
    function isNodeExported(node) {
        return (node.flags & ts.NodeFlags.Export) !== 0 || (node.parent && node.parent.kind === ts.SyntaxKind.SourceFile);
    }
    for (var _i = 0, _a = program.getSourceFiles(); _i < _a.length; _i++) {
        var sourceFile = _a[_i];
        ts.forEachChild(sourceFile, function (node) {
            if (!isNodeExported(node)) {
                return;
            }
            if (node.kind === ts.SyntaxKind.ClassDeclaration) {
                getType(checker, node);
            }
            // else if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
            //     ts.forEachChild(node, visit);
            // }
        });
    }
    console.log(JSON.stringify(types, null, 4));
    outputMarkdown(fileNames[1], types);
}
exports.generate = generate;
function typeLinks() {
    var types = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        types[_i - 0] = arguments[_i];
    }
    return types ? types.map(function (t) {
        var names = [];
        names.push("<span style=\"white-space: nowrap\">");
        if (t.intrinsicName || t.isArray && t.elementType.intrinsicName || t.anonymous) {
            names.push("`" + (t.intrinsicName || t.name) + "`");
        }
        else if (t.isArray) {
            names.push("[`" + t.name + "`](#typeid-" + t.elementType.id + ")");
        }
        else {
            names.push("[`" + t.name + "`](#typeid-" + t.id + ")");
        }
        names.push("</span>");
        return names.join('');
    }).join(' ') : '';
}
function typeTable(output, type, prefix) {
    if (prefix === void 0) { prefix = ''; }
    var header = false;
    for (var pn in type.properties) {
        var p = type.properties[pn];
        if (!prefix && !header) {
            header = true;
            output.push("\n| \u540D\u79F0 | \u7C7B\u578B | \u63CF\u8FF0 |\n| --- | --- | --- |");
        }
        output.push("| `" + (prefix + p.name) + "` | " + (p.type.anonymous ? "`" + p.type.name + "`" : typeLinks(p.type)) + " | " + (p.comments).replace(/[\n\r]/g, '<br>') + " |");
        if (p.type.anonymous) {
            typeTable(output, p.type.isArray ? p.type.elementType : p.type, (prefix || '') + p.name + '.');
        }
    }
}
function outputType(output, type) {
    if (type.anonymous || type.intrinsicName || type.isArray && type.elementType.intrinsicName)
        return;
    var v = type;
    output.push("\n# <a id=\"typeid-" + v.id + "\"></a> " + v.name + " " + (v.baseTypes && v.baseTypes.length ? ' `extends` ' + typeLinks.apply(void 0, v.baseTypes) : '') + "\n" + (v.router ? "`" + v.router.path + "`" : '') + "\n\n" + v.comments + "\n\n");
    var typeD = v;
    typeTable(output, v);
    if (v.methods) {
        for (var mn in v.methods) {
            var m = v.methods[mn];
            output.push("\n## " + m.name + " `" + (m.decorators.post ? "POST" : "GET") + "`\n`" + (typeD.decorators.router ? typeD.decorators.router[0][0] : '') + (m.decorators.router ? m.decorators.router[0][0] : '') + "`\n\n" + m.comments + "\n");
            if (m.decorators.router && m.decorators.router[0].length > 1) {
                var routerType = m.decorators.router[0][1].getType();
                output.push('### 路由参数 ' + typeLinks(routerType));
                typeTable(output, routerType);
            }
            m.params.forEach(function (m, i) {
                output.push("### " + (m.decorators.query ? 'query' : 'body') + " " + typeLinks(m.type) + "\n" + m.comments + "\n");
                typeTable(output, m.type);
            });
            if (m.returnType) {
                output.push('### 返回 ' + typeLinks(m.returnType));
                typeTable(output, m.returnType);
            }
        }
    }
    output.push('\r\n---\r\n');
}
function outputMarkdown(path, types) {
    var output = [];
    for (var p in types) {
        outputType(output, types[p]);
    }
    fs.writeFileSync(path, output.join('\r\n'));
}
exports.outputMarkdown = outputMarkdown;
generate(process.argv.slice(2));
// generate([__dirname + "/define.ts"],"api2.md");
console.log('done');
//# sourceMappingURL=typescript-api-generator.js.map