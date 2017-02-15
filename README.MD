# TypeScript API定义规范

## 使用前准备

整个api程序基于TypeScript代码，和实验性的decorator api。需要先安装typescript和reflect-metadata

```bash
npm install -g typescript
```
在项目中需要安装实验的Reflect库

```bash
npm install reflect-metadata
```

## API定义代码文件

引入相关类库

```javascript
import "reflect-metadata";
import { comment, method ,array , router, query, body , post, get , outputMarkdown } from './meta-annotations';

//此处放API定义，或者import其他文件
//import './otherApi';
```

输出Markdown文档的代码

```javascript
outputMarkdown("api.md");
```

执行TypeScript代码生成文件

```bash
tsc --target ES5 --experimentalDecorators --emitDecoratorMetadata YOUR-API-FILE.ts
```

使用node执行tsc转换后的js文件

```bash
node YOUR-API-FILE.js
```

## 标注解释

### `@comment( content : string)`

每个元数据的定义都**必须**做此标注，否则无法生成元数据。

用于标注元数据增加解释性内容。可以在class、property、method和parameter上标注。可以使用 ` (1按键左边的按键)写入多行内容。

```javascript
@comment(`公共地址服务
提供寄送地址查询服务
`)
class AddressService{
    @comment(`查询更准确的地址`)
    findAddress(@comment query: FindAddressQuery) : AddressDetailInfos { return null;};
}
```
---
### `@array( type : Function)`

由于TypeScript的限制，如果定义数组类型，**必须**添加此标注。传入数组元素的类型。

```javascript
@array(AddressDetailInfo)
detailAddresses : AddressDetailInfo[];
```

---
### `router( path : string , model? : Function)`

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
###`method( m : string) post() get()`

用于标注当前方法所代表的API使用的http method。定义在方法上。`post()`和`get()`是`method('POST')`的快捷方法。

```javascript
@post()
updateCity(cityInfo : CityInfo) {};
```
---

### `query() body()`

标注方法的参数是从querystring来的，还是body内的。

```javascript
findAddress(@query() query: FindAddressQuery) : AddressDetailInfos { return null;};

@post()
updateCity(@body() cityInfo : CityInfo) {};
```


## 注意事项和限制
- 因为所有标注都是工厂方法，所以标注**必须**使用`()`定义，即使没有参数，如`@comment()`。
- TypeScript语法要求严格，所以在有返回值的方法中`{ return null; }`，在没有返回值的方法中可留空，但要有花括号`{ }`
- 标注无法定义在嵌套类型中，如果子属性是对象定义，请重新开一个模型，让所有属性平铺。

请修改以下错误示例

```javascript
class ParentModel{
    otherProp : string,
    subProp : {
        @comment('此处定义comment将会报语法错误。')
        subModelProp : string
    }
}
```

为

```javascript
class SubModel
{
   @comment('移动至新的class定义')
   subModelProp : string
}

class ParentModel{
    otherProp : string,
    subProp : SubModel
}
```

- 由于TypeScript标注类库限制，属性或方法的类型引用**必须**在之前定义，否则**相关的类型引用是**`undefined`，不会有输出。

如上方示例，`SubModel`如果放在`ParentModel`之后，则`ParentModel`的`subProp`的元数据type会是undefined。

