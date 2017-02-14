# TypeScript API定义规范

## 使用前准备

整个api程序基于TypeScript代码，和实验性的decorator api。需要先安装typescript和reflect-metadata

```
npm install -g typescript
```
在项目中需要安装实验的Reflect库

```
npm install reflect-metadata
```

API定义代码需要引入相关类库

```javascript
import "reflect-metadata";
///我们自定义的标注、收集元数据的库
import { comment, router,query, method, body , post, get } from './meta-annotations';
```

## 标注解释

### `@comment( content : string)`

**每个元数据的定义都必须**做此标注，否则无法生成元数据。

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
###`method( m : string) post() get()`

用于标注当前方法所代表的API使用的http method。定义在方法上。`post()`和`get()`是`method('POST')`的快捷方法。

```javascript
@post()
updateCity(cityInfo : CityInfo) {};
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

### `query() body()`

标注方法的参数是从querystring来的，还是body内的。

```javascript
findAddress(@query() query: FindAddressQuery) : AddressDetailInfos { return null;};

@post()
updateCity(@body() cityInfo : CityInfo) {};
```


## 标注注意和限制
- 因为所有标注都是工厂方法，所以标注必须使用`()`定义，即使没有参数。
- TypeScript语法要求严格，所以在有返回值的方法中`{ return null; }`，在没有返回值的方法中可留空，但要有花括号`{ }`
- 标注无法定义在嵌套类型中，如果子属性是对象定义，请重新开一个模型，让所有属性平铺。

请修改以下错误示例

```javascript
class ParentModel{
    subProp : {
        @comment('此处定义comment将会报语法错误。')
        subModelProp : string
    }
}
```

为

```javascript
class ParentModel{
    subProp : SubModel
}

class SubModel
{
   @comment('移动至新的class定义')
   subModelProp : string
}
```

## API定义示例

```javascript
import "reflect-metadata";
import { comment, router,query, method, body , post, get } from './meta-annotations';

@router("api/service/address")
@comment(`公共地址服务
提供寄送地址查询服务
`)
class AddressService{
    @comment(`查询更准确的地址`)
    @router('/findAddress')
    @method('GET')
    findAddress(@query() query: FindAddressQuery) : AddressDetailInfos { return null;};

    @router('/get-city/:id',GetCityRouter)
    @comment('查询城市信息')
    @get()
    getCity() : CityInfo {return null;};

    @comment('更新城市')
    @router('/update-city/:id',UpdateCityRouter)
    @post()
    updateCity(@body() cityInfo : CityInfo) {};
}

@comment()
class FindAddressQuery{
    @comment('用户输入的模糊地址信息')
    address : string;
}
@comment()
class AddressDetailInfos{
    @comment(`精确地址
    模糊查询返回的精确地址选项，提供给前台下拉可选项
`)
    detailAddresses : AddressDetailInfo[];
}

@comment('单条精确的地址信息')
class AddressDetailInfo{
    @comment('精确地址')
    address : string;
}

@comment()
class GetCityRouter{
    @comment('城市名称')
    id : number;
}

@comment('城市信息')
class CityInfo{
    @comment('城市id')
    id : number;
    @comment('城市名称')
    name : string;
}

@comment('更新城市参数')
class UpdateCityRouter{
    @comment('城市id')
    id : number;
}
```

