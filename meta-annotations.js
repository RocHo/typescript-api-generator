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
    return function (target, propertyKey, index) {
        if (typeof target === 'function') {
            var typeD = getType(target);
            handlers.handleType(typeD);
        }
        else {
            var type = target.constructor;
            var typeD = getType(type);
            var getMethod = function (d, name) {
                return getOrCreate(d.methods, name, function () {
                    return {
                        name: name,
                        params: [],
                        returnType: Reflect.getMetadata("design:returntype", target, propertyKey)
                    };
                });
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
exports.comment = comment;
function router(path, model) {
}
exports.router = router;
function method(m) {
}
exports.method = method;
function post() {
}
exports.post = post;
function get() {
}
exports.get = get;
function query() {
}
exports.query = query;
function body() {
}
exports.body = body;
function getMetadatas() {
    return typesData;
}
exports.getMetadatas = getMetadatas;
//# sourceMappingURL=meta-annotations.js.map