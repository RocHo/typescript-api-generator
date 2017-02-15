import "reflect-metadata";
import fs = require('fs');

interface TypeDefinition{
    router: {path: String, type: Function};
    comment : string;
    type : Function;
    props : Map<string,PropDefinition>;
    methods : Map<string,MethodDefinition>;
}

interface PropDefinition{
    name : string;
    comment : string;
    type : Function
}

interface MethodDefinition{
    httpMethod: String;
    router: {path: String, type: Function};
    name : string;
    comment : string;
    params : ParamDefinition[]
    returnType : Function;
}

interface ParamDefinition{
    source: String;
    index : number;
    comment : string;
    type : Function;
}

let typesData = new Map<Function,TypeDefinition>();

function getOrCreate<K,V>(map : Map<K,V>,key : K,creator:() => V){
    if(map.has(key)){
        return map.get(key);
    }else{
        let o = creator();
        map.set(key,o);
        return o;
    }
}

function getType(type: Function) : TypeDefinition {
    return getOrCreate(typesData,type,()=>({
        type,
        props : new Map(),
        methods : new Map()
    }));
}

function createMetaHandler(handlers : {
    handleType? : (type : TypeDefinition) => void,
    handleProp? : (prop : PropDefinition, type : TypeDefinition) => void,
    handleMethod? : ( method : MethodDefinition,type : TypeDefinition) => void,
    handleParam? : (param : ParamDefinition, method : MethodDefinition, type : TypeDefinition) => void
} = {
    handleMethod : ()=>{},
    handleType : ()=>{},
    handleProp : ()=>{},
    handleParam : ()=>{}
}) : any{
    return function(target: any, propertyKey: string , index : number){

        if(typeof target === 'function') // it's a type
        {
            let typeD = getType(target);
            handlers.handleType(typeD);
        }else{
            let type = target.constructor;
            let typeD = getType(type);

            let getMethod = function(d,name){
                let method =  getOrCreate(d.methods,name,function(){
                    return {
                        name,
                        params : [],
                        returnType : Reflect.getMetadata("design:returntype", target, propertyKey)
                    }
                });
                method.returnType = Reflect.getMetadata("design:returntype", target, propertyKey);
                return method;
            };

            //it's a member
            if(index === undefined){
                // prop

                var pd = getOrCreate(typeD.props,propertyKey,()=>({
                        name :propertyKey,
                        type : Reflect.getMetadata("design:type", target, propertyKey)
                }));

                handlers.handleProp(pd,typeD);
            }
            else if(typeof index === 'number'){
                //method param
                var methodD = getMethod(typeD,propertyKey);
                if(!methodD.params[index]){
                    methodD.params[index] = {
                        method : methodD,
                        type : Reflect.getMetadata("design:paramtypes", target, propertyKey)[index]
                    };
                }
                handlers.handleParam(methodD.params[index],methodD,typeD);
            }
            else{
                // method
                var methodD = getMethod(typeD,propertyKey);
                handlers.handleMethod(methodD,typeD);
            }
        }

    }
}

export function comment(content? :string) {
    return createMetaHandler({
        handleType : (type)=>{
            type.comment = content;
        },
        handleMethod : (method)=>{
            method.comment = content;
        },
        handleProp : (prop)=>{
            prop.comment = content;
        },
        handleParam : (param) =>{
            param.comment = content;
        }
    });
}
export function router(path : string, model? : Function){
    return createMetaHandler({
        handleType : (type) =>{
            type.router = {
                path,
                type :model
            }
        },
        handleMethod : (method) =>{
            method.router = {
                path,
                type : model
            }
        }
    });
}

export function method(m : string){
        return createMetaHandler({
        handleMethod : (method) => {
            method.httpMethod = m;
        }
    });
}

export function post(){
    return method("POST");
}

export function get(){
    return method("GET");
}

export function query(){
    return createMetaHandler({
        handleParam : (param)=>{
            param.source = "query"
        }
    })
}

export function body(){
    return createMetaHandler({
        handleParam : (param)=>{
            param.source = "body"
        }
    })
}

export function getMetadatas(){
    return typesData;
}

function getTypeName(type : Function){
    if(!type) return 'EMPTY TYPE';
    var r = type.toString().match(/function (\w+)/);
    if(r){
        return r[1];
    }
    else{
        throw new Error(`can not find type name ${type}`);
    }
}

function isSimpleType(type : Function){
    return [Boolean,String,Number,Array].indexOf(type) > -1;
}

function typeLink(type : Function){
    return `<span style="white-space: nowrap">[\`${getTypeName(type)}\`](#${getTypeName(type)})</span>`
}

function typeTable(output : Array<string>,type : Function,prefix : String = '' ,level : number = 0){
    let typeD = typesData.get(type);
    if(typeD && typeD.props && typeD.props.size){
        if(!prefix){
            output.push(`
| 名称 | 类型 | 描述 |
| --- | --- | --- |`);
        }

        typeD.props.forEach(function(v,k){
            if(isSimpleType(v.type) || level > 5){
                output.push(`| \`${prefix + v.name}\` | ${isSimpleType(v.type) ?  `${getTypeName(v.type)}` :typeLink(v.type)} | ${(v.comment || '').replace(/[\n\r]/g,'<br>')} |`);
            }else{
                output.push(`| \`${prefix + v.name}\` | ${typeLink(v.type)} | ${(v.comment || '').replace(/[\n\r]/g,'<br>')} |`);
                typeTable(output,v.type, prefix ? prefix + v.name + '.' : v.name + '.',level + 1);
            }
        });
    }
}

function outputType(output : string[], type : TypeDefinition){
    let v = type;
    output.push(
        `
# <a id="${getTypeName(v.type)}"></a> ${getTypeName(v.type)}
${v.router ? "`" + v.router.path + "`" :''}

${v.comment || ''}

`);
    var typeD = v;
    typeTable(output,v.type);

    if(v.methods && v.methods.size){
        v.methods.forEach(function(v,k){
            output.push(`
## ${v.name} \`${v.httpMethod || "GET"}\`
\`${typeD.router ? (typeD.router.path || '') : ''}${v.router ? v.router.path : ''}\`

${v.comment}
`);
            if(v.router && v.router.type){
                output.push('### router');
                typeTable(output,v.router.type);
            }
            v.params.forEach(function(v,i){
                output.push(`### ${v.source}
${v.comment || ''}
`);
                typeTable(output,v.type);
            });

            if(v.returnType){
                output.push('### 返回');
                typeTable(output,v.returnType);
            }
        });
    }
}

export function outputMarkdown(path){
    var output : string[] = [];
    //output service first
    typesData.forEach(function(v,k){
        if(v.router) outputType(output,v);
    });
    typesData.forEach(function(v,k){
        if(!v.router) outputType(output,v);
    });

    fs.writeFileSync(path,output.join('\r\n'));
}