"use strict";
var ts = require('typescript');
/// <reference path='/Users/rocho/Library/Preferences/WebStorm2016.2/javascript/extLibs/http_github.com_DefinitelyTyped_DefinitelyTyped_raw_master_node_index.d.ts' />
var fs = require('fs');
var esprima = require('esprima');
var types = {};
function getDefault(o, k, creator) {
    return o.hasOwnProperty(k) ? o[k] : (o[k] = creator());
}
function findType(name) {
    for (var tn in types) {
        if (types[tn].name === name) {
            return types[tn];
        }
    }
}
function getDecorators(d) {
    var dm = {};
    if (d && d.decorators) {
        d.decorators.forEach(function (d) {
            if (d.expression.kind === ts.SyntaxKind.CallExpression) {
                var call = d.expression;
                if (call.expression.kind === ts.SyntaxKind.Identifier) {
                    var name_1 = call.expression.text;
                    var args_1 = call.arguments.map(function (a) {
                        switch (a.kind) {
                            case ts.SyntaxKind.StringLiteral:
                                return a.text;
                            case ts.SyntaxKind.NumericLiteral:
                                return a.text.search(/\./g) > -1 ? Number.parseFloat(a.text) : Number.parseInt(a.text);
                            case ts.SyntaxKind.NullKeyword:
                                return null;
                            case ts.SyntaxKind.Identifier:
                                return {
                                    typeName: a.text
                                };
                        }
                    });
                    getDefault(dm, name_1, function () { return []; }).push(args_1);
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
    if (d && d.symbol) {
        (d.symbol.getJsDocTags() || []).forEach(function (tag) {
            var a = getDefault(dm, tag.name, function () { return []; });
            var r = esprima.parse(tag.name + tag.text.split(/[\r\n]/)[0], { sourceType: 'script' });
            var e = r.body && r.body[0].expression;
            if (e.type === 'CallExpression') {
                a.push((e.arguments || []).map(function (arg) {
                    return arg.type === 'Literal' ? arg.value : {
                        typeName: arg.name
                    };
                }));
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
                name: currentType.symbol.getName() === '__type' ? '{ inline }' : currentType.symbol.getName(),
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
            td.name = td.elementType.name + '[]';
            td.anonymous = td.elementType.anonymous;
        }
        else {
            var types_1 = currentType.getBaseTypes();
            if (types_1 && types_1.length) {
                td.baseTypes = (types_1 || []).map(function (bt) {
                    return getType(checker, bt);
                });
            }
            else {
                var h = currentType.symbol.valueDeclaration && currentType.symbol.valueDeclaration.heritageClauses;
                if (h && h[0].types) {
                    td.baseTypes = h[0].types.map(function (n) { return findType(n.expression.text); });
                }
            }
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
                            var returnType = s_1.resolvedReturnType;
                            if (returnType.intrinsicName === 'unknown') {
                                // can not find returnType
                                md.returnType = findType(s_1.declaration.type.typeName.text);
                            }
                            else {
                                md.returnType = getType(checker, s_1.resolvedReturnType);
                            }
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
                                type: getType(checker, p_1.type),
                                optional: !!p_1.questionToken
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
function typeLinks() {
    var ts = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        ts[_i - 0] = arguments[_i];
    }
    return ts ? ts.map(function (t) {
        var names = [];
        //names.push(`<span style='white-space: nowrap'>`);
        if (t.intrinsicName || t.isArray && t.elementType.intrinsicName || t.anonymous) {
            names.push("`" + (t.intrinsicName || t.name) + "`");
        }
        else if (t.isArray) {
            names.push("[`" + t.name + "`](#typeid-" + t.elementType.id + ")");
        }
        else {
            names.push("[`" + t.name + "`](#typeid-" + t.id + ")");
        }
        //names.push(`</span>`)
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
        output.push("| `" + (prefix + p.name + (p.optional ? '?' : '')) + "` | " + (p.type.anonymous ? "`" + p.type.name + "`" : typeLinks(p.type)) + " | " + (p.comments).replace(/[\n\r]/g, '<br>') + " |");
        if (p.type.anonymous) {
            typeTable(output, p.type.isArray ? p.type.elementType : p.type, (prefix || '') + p.name + '.');
        }
    }
}
function repeat(c, t) {
    var r = '';
    for (var i = 0; i < c; i++) {
        r += t;
    }
    return r;
}
function outputTypeJson(output, type, level) {
    if (level === void 0) { level = 0; }
    if (level === 0) {
        var hasKeys = false;
        for (var pn in type.properties) {
            hasKeys = true;
            break;
        }
        if (!hasKeys)
            return;
        output.push("```javascript\n{");
    }
    for (var pn in type.properties) {
        var p = type.properties[pn];
        var line = repeat(level + 1, '\t');
        line += p.name + " : ";
        if (p.type.intrinsicName || p.type.isArray && p.type.elementType.intrinsicName) {
            line += p.type.name;
            output.push(line + ',');
        }
        else {
            if (!p.type.anonymous) {
                line += "/*" + p.type.name + "*/ ";
            }
            output.push(line + (p.type.isArray ? '[' : '') + '{');
            outputTypeJson(output, p.type.isArray ? p.type.elementType : p.type, level + 1);
            output.push(repeat(level + 1, '\t') + '}' + (p.type.isArray ? ']' : '') + ',');
        }
    }
    if (level === 0) {
        output.push("}\n```");
    }
}
function outputType(output, type) {
    if (type.anonymous || type.intrinsicName || type.isArray)
        return;
    var v = type;
    output.push("\n# <a id='typeid-" + v.id + "'></a> " + v.name + " " + (v.baseTypes && v.baseTypes.length ? ' `extends` ' + typeLinks.apply(void 0, v.baseTypes) : '') + "\n" + (v.router ? '`' + v.router.path + '`' : '') + "\n\n" + v.comments + "\n\n");
    var typeD = v;
    typeTable(output, v);
    outputTypeJson(output, v);
    if (v.methods) {
        for (var mn in v.methods) {
            var m = v.methods[mn];
            var httpMethod = m.decorators.method && m.decorators.method.length ? m.decorators.method[0][0].toUpperCase() : (m.decorators.post ? 'POST' : 'GET');
            output.push("\n## " + m.name + " `" + httpMethod + "`\n`" + (typeD.decorators.router ? typeD.decorators.router[0][0] : '') + (m.decorators.router ? m.decorators.router[0][0] : '') + "`\n\n" + m.comments + "\n");
            if (m.decorators.router && m.decorators.router[0].length > 1) {
                var routerType = findType(m.decorators.router[0][1].typeName);
                output.push('### 路由参数 ' + typeLinks(routerType));
                typeTable(output, routerType);
                outputTypeJson(output, routerType);
            }
            m.params.forEach(function (m, i) {
                output.push("### " + (m.decorators.query ? 'query' : (m.decorators.router ? '路由参数' : 'body')) + " " + typeLinks(m.type) + "\n" + m.comments + "\n");
                typeTable(output, m.type);
                outputTypeJson(output, m.type);
            });
            if (m.returnType) {
                output.push('### 返回 ' + typeLinks(m.returnType));
                typeTable(output, m.returnType);
                outputTypeJson(output, m.returnType);
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
function outputMock(path, types) {
    var o = [];
    o.push("let $rm = require('./randomock');\nmodule.exports = function(app){\n    \n");
    for (var p in types) {
        var type = types[p];
        var routers = type.decorators && type.decorators.router;
        if (routers && routers.length) {
            var basePath = routers[0][0];
            for (var p_2 in type.methods) {
                var m = type.methods[p_2];
                var mRouters = m.decorators.router;
                var methodPath = mRouters && mRouters.length ? mRouters[0][0] : m.name;
                o.push("app.get('" + (basePath + methodPath) + "',function(req,res){ res.send($rm(");
                var line = [];
                mockType(line, m.name, m.decorators, m.returnType);
                o.push(line.join(''));
                o.push(")); });");
            }
        }
    }
    o.push("    };");
    fs.writeFileSync(path, o.join('\r\n'));
}
function mockType(o, name, decorators, type) {
    if (decorators.mocker && decorators.mocker.length) {
        o.push(decorators.mocker[0][0]);
        return;
    }
    if (type.isArray) {
        var range = decorators.range && decorators.range[0];
        o.push(" $rm.repeat($rm.range(" + (range && range[0] ? range[0] : 10) + (range && range[1] ? ',' + range[1] : '') + "),");
        mockType(o, name, decorators, type.elementType);
        o.push(")");
    }
    else {
        if (type.intrinsicName) {
            // simple type
            var mos = mockers.concat(innerMockers);
            for (var p in mos) {
                var m = mos[p];
                if (m.test(name, decorators, type)) {
                    o.push(m.mock(name, decorators, type));
                    return;
                }
            }
            o.push('null');
        }
        else {
            o.push('{');
            for (var pn in type.properties) {
                var p = type.properties[pn];
                o.push("\"" + p.name + "\" :");
                mockType(o, pn, p.decorators, p.type);
                o.push(',');
            }
            o.push('}');
        }
    }
}
var innerMockers = [];
var mockers = [];
var matchers = {
    matchName: function (mockers, matcher, mocker) {
        mockers.push({
            test: function (name) {
                return name.search(matcher) > -1;
            },
            mock: mocker
        });
    },
    matchType: function (mockers, matcher, mocker) {
        mockers.push({
            test: function (name, decorators, type) {
                return type.name.search(matcher) > -1;
            },
            mock: mocker
        });
    },
    matcher: function (mockers, matcher, mocker) {
        mockers.push({
            test: matcher,
            mock: mocker
        });
    }
};
matchers.matchType(innerMockers, /^string$/g, function () { return "$rm.text($rm.range(5,15))"; });
matchers.matchType(innerMockers, /^number$/g, function () { return "$rm.range(1000000)"; });
matchers.matchType(innerMockers, /^boolean$/g, function () { return "$rm.choose(true,false)"; });
function generate(tsFile, markdownFile, mockFile, metaFile) {
    types = {};
    var program = ts.createProgram([tsFile], {
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
    if (markdownFile) {
        outputMarkdown(markdownFile, types);
    }
    if (mockFile) {
        outputMock(mockFile, types);
    }
    if (metaFile) {
        fs.writeFileSync(metaFile, JSON.stringify(types, null, "\t"));
    }
}
exports.generate = generate;
var args = process.argv.slice(2);
if (args && args.length) {
    generate(args[0], args[1], args[2], args[3]);
}
//# sourceMappingURL=typescript-api-generator.js.map