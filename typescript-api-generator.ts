import * as ts from 'typescript';
/// <reference path='/Users/rocho/Library/Preferences/WebStorm2016.2/javascript/extLibs/http_github.com_DefinitelyTyped_DefinitelyTyped_raw_master_node_index.d.ts' />
import * as fs from 'fs';
import * as path from 'path';
import * as esprima from 'esprima';

let types = {};

function getDefault(o : Object , k : string, creator : () => Object){
    return o.hasOwnProperty(k) ? o[k] : (o[k] = creator());
}

function findType(name : string){
    for(let tn in types){
        if(types[tn].name === name){
            return types[tn];
        }
    }
}

function getDecorators(d : ts.Node){
    let dm = {};
    if(d && d.decorators){
        d.decorators.forEach(function(d){
            if(d.expression.kind === ts.SyntaxKind.CallExpression){
                let call = d.expression;
                if(call.expression.kind === ts.SyntaxKind.Identifier){
                    let name = call.expression.text;

                    let args = call.arguments.map(function(a){
                        switch(a.kind){
                            case ts.SyntaxKind.StringLiteral:
                                return a.text;
                            case ts.SyntaxKind.NumericLiteral:
                                return a.text.search(/\./g) > -1 ? Number.parseFloat(a.text) : Number.parseInt(a.text);
                            case ts.SyntaxKind.NullKeyword:
                                return null;
                            case ts.SyntaxKind.Identifier :
                                return {
                                    typeName : a.text
                                }
                        }
                    });

                    getDefault(dm,name,()=>[]).push(args);
                }
            }else if(d.expression.kind === ts.SyntaxKind.Identifier){
                getDefault(dm,d.expression.text,()=>[]);
            }else{
                throw new Error('decorator error');
            }
        });
    }
    if(d && d.symbol){
        (d.symbol.getJsDocTags() || []).forEach(function(tag){
            let a = getDefault(dm,tag.name,()=>[]);

            let r = esprima.parse(tag.name + tag.text.split(/[\r\n]/)[0],{sourceType : 'script'});
            let e = r.body && r.body[0].expression;
            if(e.type === 'CallExpression'){
                a.push((e.arguments || []).map(function(arg){
                    return arg.type === 'Literal' ? arg.value : {
                        typeName : arg.name
                    }
                }))
            }
        });
    }
    return dm;
}

function getType(checker, t : Node){
    if(!t) return null;
    let currentType = t.getConstructSignatures ? t : checker.getTypeAtLocation(t);

    // if(currentType.symbol) currentType = checker.getDeclaredTypeOfSymbol(currentType.symbol);

    let td = getDefault(types,currentType.id,() => {
        if(currentType.intrinsicName){
            return {
                id : currentType.id,
                name : currentType.name || currentType.intrinsicName,
                intrinsicName : currentType.intrinsicName
            }
        }
        else{
            return {
                id : currentType.id,
                name : currentType.symbol.getName() === '__type' ? '{ inline }' : currentType.symbol.getName(),
                anonymous : currentType.symbol.getName() === '__type',
                comments : ts.displayPartsToString(currentType.symbol.getDocumentationComment())
            };
        }
    });
    if(td.intrinsicName) return td;

    if(!td._inited){
        td._inited = true;

        td.decorators = getDecorators(currentType.symbol.valueDeclaration);
        td.isArray = currentType.symbol.getName() === 'Array';

        if(td.isArray){
            td.elementType = getType(checker,currentType.typeArguments[0]);
            td.name = td.elementType.name + '[]';
            td.anonymous = td.elementType.anonymous;
        } else{
            let types = currentType.getBaseTypes();
            if(types && types.length){
                td.baseTypes = (types || []).map(function(bt){
                    return getType(checker, bt);
                });
            }
            else{
                let h = currentType.symbol.valueDeclaration && currentType.symbol.valueDeclaration.heritageClauses;
                if(h && h[0].types){
                    td.baseTypes = h[0].types.map(n => findType(n.expression.text));
                }
            }
            td.methods = {};
            td.properties = {};

            for(let m of currentType.getProperties()){
                switch(m.valueDeclaration.kind){
                    case ts.SyntaxKind.MethodDeclaration:
                        let s = checker.getSignatureFromDeclaration(m.valueDeclaration);

                        getDefault(td.methods, m.getName(), () => {
                            let md = {
                                name : m.getName(),
                                comments : ts.displayPartsToString(m.getDocumentationComment()),
                                decorators : getDecorators(m.valueDeclaration),
                                params : s.parameters.map(function(p, i){
                                    return {
                                        name : p.getName(),
                                        index : i,
                                        comments : ts.displayPartsToString(p.getDocumentationComment()),
                                        decorators : getDecorators(p.valueDeclaration),
                                        type : getType(checker, p.valueDeclaration.type)
                                    };
                                })
                            };

                            let returnType = s.resolvedReturnType;
                            if(returnType.intrinsicName === 'unknown'){
                                // can not find returnType
                                md.returnType = findType(s.declaration.type.typeName.text);
                            }else{
                                md.returnType = getType(checker, s.resolvedReturnType);
                            }
                            return md;
                        });
                        break;
                    case ts.SyntaxKind.PropertyDeclaration:
                    case ts.SyntaxKind.PropertySignature:
                        let p = m.valueDeclaration;
                        getDefault(td.properties,m.getName(),()=>{
                            return {
                                name : m.getName(),
                                comments : ts.displayPartsToString(m.getDocumentationComment()),
                                decorators : getDecorators(p),
                                type : getType(checker,p.type),
                                optional : !!p.questionToken
                            }
                        });
                        break;
                }
            }
        }
    }

    return td;
}




function typeLinks(...ts){
    return ts ?  ts.map((t)=>{
        let names = [];
        //names.push(`<span style='white-space: nowrap'>`);
        if(t.intrinsicName || t.isArray && t.elementType.intrinsicName || t.anonymous) {
            names.push(`\`${t.intrinsicName || t.name}\``);
        }
        else if(t.isArray){
            names.push(`[\`${t.name}\`](#typeid-${t.elementType.id})`);
        }else {
            names.push(`[\`${t.name}\`](#typeid-${t.id})`);
        }
        //names.push(`</span>`)
        return names.join('');
    }).join(' ') : '';
}


function typeTable(output : string[],type,prefix : String = ''){
    let header = false;
    for(let pn in type.properties){
        let p = type.properties[pn];
        if(!prefix && !header){
            header = true;
            output.push(`
| 名称 | 类型 | 描述 |
| --- | --- | --- |`);
        }


        output.push(`| \`${prefix + p.name + (p.optional ? '?' : '')}\` | ${ p.type.anonymous ? `\`${p.type.name}\`` :typeLinks(p.type)} | ${(p.comments).replace(/[\n\r]/g,'<br>')} |`);

        if(p.type.anonymous){
            typeTable(output,p.type.isArray ? p.type.elementType : p.type, (prefix || '')  + p.name + '.');
        }
    }
}

function repeat(c,t){
    let r = '';
    for (var i = 0; i < c; i++) {
        r += t;
    }
    return r;
}

function outputTypeJson(output: string[],type, level : number = 0){


    if(level === 0){
        let hasKeys = false;

        for(let pn in type.properties){
            hasKeys = true;
            break;
        }
        if(!hasKeys) return;

        output.push(`\`\`\`javascript
{`);
    }
    for(let pn in type.properties){
        let p = type.properties[pn];
        let line = repeat(level + 1,'\t');
        line += `${p.name} : `;
        if(p.type.intrinsicName || p.type.isArray && p.type.elementType.intrinsicName){
            line += p.type.name;
            output.push(line + ',');
        }else{
            if(!p.type.anonymous)
            {
                line += `/*${p.type.name}*/ `;
            }
            output.push(line + (p.type.isArray ? '[' : '') + '{');
            outputTypeJson(output,p.type.isArray ? p.type.elementType : p.type,level + 1);
            output.push(repeat(level + 1,'\t') + '}' + (p.type.isArray ? ']' : '')+ ',');
        }
    }

    if(level === 0){
        output.push(`}
\`\`\``);
    }
}

function outputType(output : string[], type){
    if(type.anonymous || type.intrinsicName || type.isArray) return;

    let v = type;
    output.push(
        `
# <a id='typeid-${v.id}'></a> <a name='typeid-${v.id}'></a> ${v.name} ${v.baseTypes && v.baseTypes.length ? ' `extends` ' + typeLinks(...v.baseTypes) : ''}
${v.router ? '`' + v.router.path + '`' :''}

${v.comments}

`);
    var typeD = v;
    typeTable(output,v);
    outputTypeJson(output,v);

    if(v.methods){
        for(let mn in v.methods){
            let m = v.methods[mn];
            let httpMethod = m.decorators.method && m.decorators.method.length ? m.decorators.method[0][0].toUpperCase() : (m.decorators.post ? 'POST' : 'GET');

            output.push(`
## ${m.name} \`${httpMethod}\`
\`${typeD.decorators.router ? typeD.decorators.router[0][0] : ''}${m.decorators.router ? m.decorators.router[0][0] : ''}\`

${m.comments}
`);
            if(m.decorators.router && m.decorators.router[0].length > 1){
                let routerType = findType(m.decorators.router[0][1].typeName);
                output.push('### 路由参数 ' + typeLinks(routerType));
                typeTable(output,routerType);
                outputTypeJson(output,routerType);
            }
            m.params.forEach(function(m,i){
                output.push(`### ${m.decorators.query ? 'query' : (m.decorators.router ? '路由参数' : 'body')} ${typeLinks(m.type)}
${m.comments}
`);
                typeTable(output,m.type);
                outputTypeJson(output,m.type);
            });

            if(m.returnType){
                output.push('### 返回 ' + typeLinks(m.returnType));
                typeTable(output,m.returnType);
                outputTypeJson(output,m.returnType);
            }
        }
    }

    output.push('\r\n---\r\n');
}

export function outputMarkdown(path:string,types : Object){
    var output : string[] = [];
    for(let p in types){
        outputType(output,types[p]);
    }
    fs.writeFileSync(path,output.join('\r\n'));
}






function outputMock(path:string,types:Object){
    let o : string[] = [];

    o.push(`let $rm = require('./randomock');
module.exports = function(app){
    
`);

    for(let p in types){
        let type = types[p];

        let routers = type.decorators && type.decorators.router;

        if(routers && routers.length){
            let basePath = routers[0][0];

            for(let p in type.methods){
                let m = type.methods[p];

                let mRouters = m.decorators.router;

                let methodPath = mRouters && mRouters.length ? mRouters[0][0] : m.name;

                o.push(`app.get('${basePath + methodPath}',function(req,res){ res.send($rm(`);

                let line = [];
                mockType(line,m.name,m.decorators,m.returnType);

                o.push(line.join(''));
                o.push(`)); });`);
            }


        }
    }

    o.push(`    };`);
    fs.writeFileSync(path,o.join('\r\n'));
}

function mockType(o : string[], name :string, decorators, type){

    if(decorators.mocker && decorators.mocker.length){
        o.push(decorators.mocker[0][0]);
        return;
    }

    if(type.isArray){
        let range = decorators.range && decorators.range[0];

        o.push(` $rm.repeat($rm.range(${ range && range[0] ? range[0] : 10 }${ range && range[1] ? ',' + range[1] : '' }),`);

        mockType(o,name,decorators,type.elementType);

        o.push(`)`);
    }else{

        if(type.intrinsicName){
            // simple type
            let mos = mockers.concat(innerMockers);

            for(let p in mos){
                let m = mos[p];
                if(m.test(name,decorators,type)){
                    o.push(m.mock(name,decorators,type));
                    return;
                }
            }
            o.push('null');
        }
        else{
            o.push('{');
            for(let pn in type.properties){
                let p = type.properties[pn];
                o.push(`"${p.name}" :`);
                mockType(o,pn,p.decorators,p.type);
                o.push(',');
            }
            o.push('}');
        }
    }
}

let innerMockers = [];
let mockers = [];

let matchers = {
    matchName : function(mockers,matcher,mocker){
        mockers.push({
            test : function(name){
                return name.search(matcher) > -1;
            },
            mock : mocker
        });
    },
    matchType : function(mockers,matcher,mocker){
        mockers.push({
            test : function(name,decorators,type){
                return type.name.search(matcher) > -1;
            },
            mock : mocker
        });
    },
    matcher : function(mockers,matcher,mocker){
        mockers.push({
            test : matcher,
            mock : mocker
        });
    }
};

matchers.matchType(innerMockers,/^string$/g,()=> `$rm.text($rm.range(5,15))`);
matchers.matchType(innerMockers,/^number$/g,()=> `$rm.range(1000000)`);
matchers.matchType(innerMockers,/^boolean$/g,()=> `$rm.choose(true,false)`);

export function generate(tsFile,markdownFile,mockFile,metaFile): void {
    types = {};
    
    let program = ts.createProgram([tsFile], {
        target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS
    });
    let checker = program.getTypeChecker();

    function isNodeExported(node: ts.Node): boolean {
        return (node.flags & ts.NodeFlags.Export) !== 0 || (node.parent && node.parent.kind === ts.SyntaxKind.SourceFile);
    }

    for (const sourceFile of program.getSourceFiles()) {
        ts.forEachChild(sourceFile, function (node: ts.Node) {
            if (!isNodeExported(node)) {
                return;
            }

            if (node.kind === ts.SyntaxKind.ClassDeclaration) {
                getType(checker,node);
            }
            // else if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
            //     ts.forEachChild(node, visit);
            // }
        });
    }
    console.log(JSON.stringify(types,null,4));

    if(markdownFile){
        outputMarkdown(markdownFile,types);
    }
    if(mockFile)
    {
        outputMock(mockFile,types);
    }
    if(metaFile){
        fs.writeFileSync(metaFile,JSON.stringify(types,null,"\t"));
    }
}

let args = process.argv.slice(2);
if(args && args.length)
{
    generate(args[0],args[1],args[2],args[3]);
}