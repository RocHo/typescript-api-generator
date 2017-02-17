import * as ts from "typescript";
/// <reference path="/Users/rocho/Library/Preferences/WebStorm2016.2/javascript/extLibs/http_github.com_DefinitelyTyped_DefinitelyTyped_raw_master_node_index.d.ts" />
import * as fs from "fs";
import getOrCreateEmitNode = ts.getOrCreateEmitNode;

const types = {};

function getDefault(o : Object , k : string, creator : () => Object){
    return o.hasOwnProperty(k) ? o[k] : (o[k] = creator());
}

function getDecorators(d : ts.Node){
    var dm = {};
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
                                    typeName : a.text,
                                    getType : function(){
                                        for(let tn in types){
                                            if(types[tn].name === a.text){
                                                return types[tn];
                                            }
                                        }
                                    }
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
            getDefault(dm,tag.name,()=>[]);

            /[(,]\s*("(\\\"|[^"])*?"|'(\\\'|[^'])*?'|true|false|\d+(\.\d+)?|[_\A-\Z\a-\z][_\A-\Z\a-\z\d]*)\s*(?=[,)])/g

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
                name : currentType.symbol.getName() === '__type' ? 'inline' : currentType.symbol.getName(),
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
            td.name = td.elementType.name + "[]";
            td.anonymous = td.elementType.anonymous;
        }
        else{
            td.baseTypes = (currentType.getBaseTypes() || []).map(function(bt){
                return getType(checker,bt);
            });
            td.methods = {};
            td.properties = {};

            for(let m of currentType.getProperties()){
                switch(m.valueDeclaration.kind){
                    case ts.SyntaxKind.MethodDeclaration:
                        let s = checker.getSignatureFromDeclaration(m.valueDeclaration);

                        getDefault(td.methods,m.getName(),()=>{
                            let md = {
                                name : m.getName(),
                                comments : ts.displayPartsToString(m.getDocumentationComment()),
                                decorators : getDecorators(m.valueDeclaration),
                                returnType : getType(checker,s.resolvedReturnType),
                                params : s.parameters.map(function(p,i){
                                    return {
                                        name : p.getName(),
                                        index : i,
                                        comments : ts.displayPartsToString(p.getDocumentationComment()),
                                        decorators : getDecorators(p.valueDeclaration),
                                        type : getType(checker,p.valueDeclaration.type)
                                    }
                                })
                            };
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

export function generate(fileNames: string[]): void {

    let program = ts.createProgram([fileNames[0]], {
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
    outputMarkdown(fileNames[1],types);
}


function typeLinks(...types){
    return types ?  types.map((t)=>{
        let names = [];
        names.push(`<span style="white-space: nowrap">`);
        if(t.intrinsicName || t.isArray && t.elementType.intrinsicName || t.anonymous) {
            names.push(`\`${t.intrinsicName || t.name}\``);
        }
        else if(t.isArray){
            names.push(`[\`${t.name}\`](#typeid-${t.elementType.id})`);
        }else {
            names.push(`[\`${t.name}\`](#typeid-${t.id})`);
        }
        names.push(`</span>`)
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

function outputType(output : string[], type){
    if(type.anonymous || type.intrinsicName || type.isArray && type.elementType.intrinsicName) return;

    let v = type;
    output.push(
        `
# <a id="typeid-${v.id}"></a> ${v.name} ${v.baseTypes && v.baseTypes.length ? ' `extends` ' + typeLinks(...v.baseTypes) : ''}
${v.router ? "`" + v.router.path + "`" :''}

${v.comments}

`);
    var typeD = v;
    typeTable(output,v);

    if(v.methods){
        for(let mn in v.methods){
            let m = v.methods[mn];

            output.push(`
## ${m.name} \`${m.decorators.post ? "POST" : "GET"}\`
\`${typeD.decorators.router ? typeD.decorators.router[0][0] : ''}${m.decorators.router ? m.decorators.router[0][0] : ''}\`

${m.comments}
`);
            if(m.decorators.router && m.decorators.router[0].length > 1){
                let routerType = m.decorators.router[0][1].getType();
                output.push('### 路由参数 ' + typeLinks(routerType));
                typeTable(output,routerType);
            }
            m.params.forEach(function(m,i){
                output.push(`### ${m.decorators.query ? 'query' : (m.decorators.router ? '路由参数' : 'body')} ${typeLinks(m.type)}
${m.comments}
`);
                typeTable(output,m.type);
            });

            if(m.returnType){
                output.push('### 返回 ' + typeLinks(m.returnType));
                typeTable(output,m.returnType);
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
generate(process.argv.slice(2));
// generate([__dirname + "/define.ts"],"api2.md");
console.log('done');