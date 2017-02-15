import "reflect-metadata";
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
                        // type : Reflect.getMetadata("design:paramtypes", target, propertyKey)[index]
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

export function outputMarkdown(){
    getMetadatas().forEach(function(v,k){
        console.log();
        console.log("Type %s",k);
        console.log("Comment %s",v.comment);
        console.log();

        console.log("properties");
        v.props.forEach(function(v,k){
            console.log('name %s',k);
            console.log('comment %s',v.comment);
            console.log('type %s',v.type);
        });
        console.log();

        console.log("methods");
        v.methods.forEach(function(v,k){
            console.log("name %s",k);
            console.log('comment %s',v.comment);
            console.log("return type %s",v.returnType);
            v.params.forEach(function(v,i){
                console.log('index %d',i);
                console.log('comment %s',v.comment);
                console.log('type %s',v.type);
            });
            console.log('');
        });

        console.log();
    });
}