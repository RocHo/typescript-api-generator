# TypeScript API定义规范

此文档描述使用AST技术重构的生成器，使用decorators技术的生成器请参考文档`README.old.md`

## 使用前准备

整个api程序基于TypeScript代码，和实验性的decorator api。需要先安装typescript。

```bash
npm install -g typescript
```

解析注释中的decorator需要依赖jquery的javascript解析器esprima，需要安装。

```bash
npm install esprima
```

并且把typescript编译器连接到当前项目

```bash
npm link typescript
```

## 生成API文件

新建一个API定义文件，`my-apis.ts`，并引入相关

```javascript
import { router, method , post, get, query, body , mocker } from './api-annotations';

//此处放API定义，或者import其他文件
//import './otherApi';
```

执行TypeScript编译器，转换TypeScript API文档到js文档。

```bash
tsc --target ES5 --experimentalDecorators --emitDecoratorMetadata my-apis.ts
```

通过node执行js完成API输出。一个参数是定义的API文件，第二个参数是输出的markdown位置，第三个参数是Mock数据服务的代码，第四个参数是类型定义元数据文件。几个参数都是可选的。

```bash
node typescript-api-generator.js my-api.js my-api.md my-api-mock.js my-api-meta.json
```


## 编写定义API文件

具体示例请参考`define.ts`

书写方式已经全部在下方的注释里：

```javascript
import { router, method , post, get, query, body , mocker } from './api-annotations';

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

    /**
     * 获取用户电话号码
     *
     * @returns {null}
     */
    @router("/getUserPhoneNumber")
    @get
    @mocker("$rm.text(13)")
    getUserPhoneNumber(
        /**
         * 使用@router标记参数，可以内联定义类型，在方法上使用@router是无法定义内联类型的
         */
        @router user : {
        name : string
    }) : string { return null; }
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
     *
     * 内联定义decorator，此处无法检查语法，请保证语法正确。
     * @range(3,10)
     */
    detailInfomations : {
        /**
         * 可以支持可选属性
         */
        title? : string,

        /**
         * 发送短信的内容
         *
         *
         * @router('/sendSms/:name', UserModel,123,456)
         *
         * 这是另一种定义decorator的方式，用于支持无法直接在源代码中定义decorator的内联类型属性等地方。
         * 定义的方法是新起一行，以at符号和标注名为开头，紧接着()，括号后面不能有任何其他字符
         *
         * 括号内可以定义参数，支持字符串、数字、和类名引用，因为是解析，所以不会有任何语法提示，请定义前仔细检查。
         *
         * 在注释里请不要写at符号，否则会被解析成decorator。
         *
         * 在第一个decorator之后的注释，都不会被采集到，所以这里写的东西都不会显示在文档中，所以请把decorator写在所有注释后面。
         *
         */
        content : string,
        user : UserModel,
        /**
         * 从req的param获取mock用的参数
         * @mocker('$rm.index(req.body.paging.index)')
         */
        index : number
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
    @mocker("$rm.weightedChoose(1,-1,3,0)")
    resultCode : number;
    @mocker("\"error\"")
    errorMessage : string;
}
class UserModel{
    /**
     * 用户名称
     */
    @mocker("$rm.text($rm.range(3,5))")
    name : string
}
```

## 标记解释
### `@router( path : string , model? : Type)`

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

`@router`也可以定义在参数上，这样可以支持内联类型定义
```javascript
class AddressService{
    @router('/get-city/:id')
    getCity(@router req : {
      id : number
    }) : CityInfo {return null;};
}
```

---
### `@post @get @method( m : string) `

用于标注当前方法所代表的API使用的http method。定义在方法上。`post`和`get`是`method('POST')`和`method('GET')`的快捷方法。如果不指定默认是`GET`请求。

```javascript
@post
updateCity(cityInfo : CityInfo) {};
```
---

### `@query @body @router`

标注方法的参数是从querystring来的，还是body内的，还是路由中定义的。

```javascript
findAddress(@query query: FindAddressQuery) : AddressDetailInfos { return null;};

@post
updateCity(@body cityInfo : CityInfo) {};
```

---

### `@mocker(mockcode : string)`

用于为Mock数据生成提供自定义的代码。代码是字符串，如果觉得编写javascript不方便，可以使用多行字符串。

具体的代码语法请参考：https://github.com/RocHo/randomock.js

默认的randommock名称是`$rm`，可以访问请求`req`和`res`以根据请求参数来生成数据，比如paging。

```javascript
// 权重返回，四分之一的几率返回-1，四分之三的几率返回0
@mocker("$rm.weightedChoose(1,-1,3,0)")
resultCode : number;
// 直接返回固定值
@mocker("\"error\"")
errorMessage : string;

//内联类型无法直接定义decorator，可以写在注释里
/**
 * 从req的param获取mock用的参数，来生成index值
 * @mocker('$rm.index(req.body.paging.index)')
 */
index : number
```

---
### `@range(min : number = 0,[max : number = 10])`

为数组类型的属性设置生成的随机元素数量，可指定最小值或最大值，或者指定0到最大值，默认是0到10个。

```javascript
/**
 * 内联定义decorator，此处无法检查语法，请保证语法正确。
 * 随机生成3到10个detailInfomation的子元素
 * @range(3,10)
 */
detailInfomations : {
}
```

## 注意事项和限制
- 引用类型名称一定要正确，否则会找不到类型。
- 所有注释内不要使用@，否则会跟decorator、`@param`、`@return`等发生冲突。
- 所有标注现已不强制使用`()`，如果有参数，必须使用。
- TypeScript语法要求严格，所以在有返回值的方法中`{ return null; }`，在没有返回值的方法中可留空，但要有花括号`{ }`
- 由于TypeScript限制，decorators只能定义在class、method、根property和paramter上，不能定义在内联和嵌套类型的属性上，所以如果需要在属性上添加decorator，可以写在注释里面。具体写法请参考上面文档。

## Mock服务文件使用方法

针对于每一个有router的类，会生成类似如下代码的文件：

```javascript
let $rm = require('./randomock');
module.exports = function (app) {
    app.get('api/service/calling/sendSms/:name', function (req, res) {
        res.send($rm(
            {
                "index": $rm.range(1000000),
                "detailInfomations": $rm.repeat($rm.range(3, 10), {
                    "title": $rm.text($rm.range(5, 15)),
                    "content": $rm.text($rm.range(5, 15)),
                    "user": {"name": $rm.text($rm.range(3, 5)),},
                    "index": $rm.index(req.body.paging.index),
                }),
                "resultCode": $rm.weightedChoose(1, -1, 3, 0),
                "errorMessage": "error",
            }
        ));
    });
    app.get('api/service/calling/getUserPhoneNumber', function (req, res) {
        res.send($rm(
            $rm.text(13)
        ));
    });
};
```

先引用randomock、express项目，在主程序中直接require进去当做router或子app执行即可。
