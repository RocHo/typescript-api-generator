# TypeScript API定义规范

此文档描述使用AST技术重构的生成器，使用decorators技术的生成器请参考文档`README.old.md`

## 使用前准备

整个api程序基于TypeScript代码，和实验性的decorator api。需要先安装typescript和reflect-metadata

```bash
npm install -g typescript
```

并且把typescript编译器连接到当前项目

```bash
npm link typescript
```

在项目中需要安装实验的Reflect库

```bash
npm install reflect-metadata
```

## 生成API文件

新建一个API定义文件，`my-apis.ts`，并引入相关

```javascript
import { router, method , post, get, query, body } from './meta-annotations';

//此处放API定义，或者import其他文件
//import './otherApi';
```

执行TypeScript编译器，转换TypeScript API文档到js文档。

```bash
tsc --target ES5 --experimentalDecorators --emitDecoratorMetadata my-apis.ts
```

通过node执行js完成API输出。一个参数是定义的API文件，第二个参数是输出的markdown位置。

```bash
node typescript-api-generator.js my-apis.js api2.md
```


## 编写定义API文件

具体示例请参考`define.ts`

书写方式已经全部在下方的注释里：

```javascript
/**
 * 电话短信服务
 */
@router("api/service/calling")
class CallingService{
    /**
     * 发送短信息请求
     *
     * 定义方法的注释，可以写多行，但是截止到结尾，或第一个jsdoc的tag之前
     * 此注释必须写在方法的decorators之前，否则将无法获取到
     *
     * @router('/sendSms/:name') 这是另一种定义decorator的方式，但现在还未完成支持
     *
     * 这里的注释不会被采集到
     *
     * @param req 短信内容请求定义
     * 参数注释也可以写多行，截止到下一个jsdoc的tag之前
     *
     * @returns {null} 关于返回值的注释
     *
     */
    @router('/sendSms/:name',UserModel)
    sendSms(/**
             * 请求参数的内联注释，会合并到前面param的注释里
             *
             * 支持内联匿名类，可以包含任意层级参数
             */
        @body req : {
        /**
         * 发送的目标用户
         *
         * 支持定义数组类型
         */
        toUser : string[],
        /**
         * 短信内容
         *
         * 支持另外引用外部命名类型
         */
        content : SmsContent,
    }) : SendSmsResult {return null;};
}

/**
 * 类型的定义可以不按照顺序来
 */
class SmsContent{
    content : string
}
/**
 * 可以通过extends关键字进行继承
 */
class SendSmsResult extends BaseResult{
    index : number;
    /**
     * 内联类型也可以支持数组类型，请注意最后的[]
     */
    detailInfomations : {
        title : string,
        content : string,
        user : UserModel
    }[]
}
/**
 * 通用请求结果
 */
class BaseResult{
    /**
     * 返回结果
     * 0 成功
     * -1 失败
     */
    resultCode : number;
    errorMessage : string;
}
class UserModel{
    /**
     * 用户名称
     */
    name : string
}
```

## 标记解释


### ~~`@comment( content : string)`~~
此标注废除，已被文档注释替换

---
### ~~`@array( type : Function)`~~
此标注废除，直接在类型后方添加`[]`即可

---
### ~~`@extend( type : Function)`~~
此标记废除，直接使用TypeScript `extends`语法

---
### `router( path : string , model? : Type)`

定义当前服务和方法API的路由地址。在class和method上定义。`model`参数可选，用于定义带有参数的路由模型。如果同时在class和method上定义router，会合并显示。

```javascript
@router("api/service/address")
class AddressService{
    @router('/get-city/:id',GetCityRouter)
    getCity() : CityInfo {return null;};
}

class GetCityRouter{
    id : number;
}
```
---
###`post get method( m : string) `

用于标注当前方法所代表的API使用的http method。定义在方法上。`post`和`get`是`method('POST')`和`method('GET')`的快捷方法。如果不指定默认是`GET`请求。

```javascript
@post
updateCity(cityInfo : CityInfo) {};
```
---

### `query body`

标注方法的参数是从querystring来的，还是body内的。

```javascript
findAddress(@query query: FindAddressQuery) : AddressDetailInfos { return null;};

@post
updateCity(@body cityInfo : CityInfo) {};
```


## 注意事项和限制
- 所有标注现已不强制使用`()`，如果有参数，必须使用。
- TypeScript语法要求严格，所以在有返回值的方法中`{ return null; }`，在没有返回值的方法中可留空，但要有花括号`{ }`
- 现已支持内联嵌套类型。
- 现已可以无序定义。
- **还未开发完成** 由于decorators不能定义在内联和嵌套类型的属性上，所以如果需要在属性上添加decorator，可以写在注释里面。


