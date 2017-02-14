import "reflect-metadata";
interface TypeDefinition{
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
    name : string;
    comment : string;
    params : ParamDefinition[]
    returnType : Function;
}

interface ParamDefinition{
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
                return getOrCreate(d.methods,name,function(){
                    return {
                        name,
                        params : [],
                        returnType : Reflect.getMetadata("design:returntype", target, propertyKey)
                    }
                })
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
    });
    // return function(target: any, propertyKey: string , index : number){
    //     if(typeof target === 'function') // it's a type
    //     {
    //         let typeD = getType(target);
    //         typeD.comment = content;
    //     }else{
    //         let type = target.constructor;
    //         let typeD = getType(type);
    //
    //         let getMethod = function(d,name){
    //             return getOrCreate(d.methods,name,function(){
    //                 return {
    //                     params : []
    //                 }
    //             })
    //         };
    //
    //         //it's a member
    //         if(index === undefined){
    //             // prop
    //             typeD.props.set(propertyKey,{
    //                 comment : content,
    //                 type : Reflect.getMetadata("design:type", target, propertyKey)
    //             });
    //         }
    //         else if(typeof index === 'number'){
    //             //method param
    //             var methodD = getMethod(typeD,propertyKey);
    //             methodD.params[index] = {
    //                 comment : content,
    //                 type : Reflect.getMetadata("design:paramtypes", target, propertyKey)[index]
    //             };
    //         }
    //         else{
    //             // method
    //             var methodD = getMethod(typeD,propertyKey);
    //             methodD.comment = content;
    //             methodD.returnType = Reflect.getMetadata("design:returntype", target, propertyKey)
    //         }
    //     }
    // };
}

export function router(path : string, model? : Function){

}

export function method(m : string){

}

export function post(){

}

export function get(){

}

export function query(){

}

export function body(){

}

export function getMetadatas(){
    return typesData;
}