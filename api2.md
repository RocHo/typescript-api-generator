
# <a id='typeid-41'></a> <a name='typeid-41'></a> CallingService 


电话短信服务



## sendSms `GET`
`api/service/calling/sendSms/:name`

发送短信息请求

定义方法的注释，可以写多行，但是截止到结尾，或第一个jsdoc的tag之前
此注释必须写在方法的decorators之前，否则将无法获取到


这里的注释不会被采集到

### 路由参数 [`UserModel`](#typeid-55)

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `name` | `string` | 用户名称 |
```javascript
{
	name : string,
}
```
### body `{ inline }`
短信内容请求定义
参数注释也可以写多行，截止到下一个jsdoc的tag之前
请求参数的内联注释，会合并到前面param的注释里

支持内联匿名类，可以包含任意层级参数


| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `toUser` | `string[]` | 发送的目标用户<br><br>支持定义数组类型 |
| `content` | [`SmsContent`](#typeid-47) | 短信内容<br><br>支持另外引用外部命名类型 |
```javascript
{
	toUser : string[],
	content : /*SmsContent*/ {
		content : string,
	},
}
```
### 返回 [`SendSmsResult`](#typeid-43)

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `index` | `number` |  |
| `detailInfomations` | `{ inline }[]` | 内联类型也可以支持数组类型，请注意最后的[]<br><br>内联定义decorator，此处无法检查语法，请保证语法正确。 |
| `detailInfomations.title?` | `string` | 可以支持可选属性 |
| `detailInfomations.content` | `string` | 发送短信的内容 |
| `detailInfomations.user` | [`UserModel`](#typeid-55) |  |
| `detailInfomations.index` | `number` | 从req的param获取mock用的参数 |
| `resultCode` | `number` | 返回结果<br>0 成功<br>-1 失败 |
| `errorMessage` | `string` |  |
```javascript
{
	index : number,
	detailInfomations : [{
		title : string,
		content : string,
		user : /*UserModel*/ {
			name : string,
		},
		index : number,
	}],
	resultCode : number,
	errorMessage : string,
}
```

## getUserPhoneNumber `GET`
`api/service/calling/getUserPhoneNumber`

获取用户电话号码

### 路由参数 `{ inline }`
使用@router标记参数，可以内联定义类型，在方法上使用@router是无法定义内联类型的


| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `name` | `string` |  |
```javascript
{
	name : string,
}
```
### 返回 `string`

---


# <a id='typeid-43'></a> <a name='typeid-43'></a> SendSmsResult  `extends` [`BaseResult`](#typeid-50)


可以通过extends关键字进行继承



| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `index` | `number` |  |
| `detailInfomations` | `{ inline }[]` | 内联类型也可以支持数组类型，请注意最后的[]<br><br>内联定义decorator，此处无法检查语法，请保证语法正确。 |
| `detailInfomations.title?` | `string` | 可以支持可选属性 |
| `detailInfomations.content` | `string` | 发送短信的内容 |
| `detailInfomations.user` | [`UserModel`](#typeid-55) |  |
| `detailInfomations.index` | `number` | 从req的param获取mock用的参数 |
| `resultCode` | `number` | 返回结果<br>0 成功<br>-1 失败 |
| `errorMessage` | `string` |  |
```javascript
{
	index : number,
	detailInfomations : [{
		title : string,
		content : string,
		user : /*UserModel*/ {
			name : string,
		},
		index : number,
	}],
	resultCode : number,
	errorMessage : string,
}
```

---


# <a id='typeid-47'></a> <a name='typeid-47'></a> SmsContent 


类型的定义可以不按照顺序来



| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `content` | `string` |  |
```javascript
{
	content : string,
}
```

---


# <a id='typeid-50'></a> <a name='typeid-50'></a> BaseResult 


通用请求结果



| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `resultCode` | `number` | 返回结果<br>0 成功<br>-1 失败 |
| `errorMessage` | `string` |  |
```javascript
{
	resultCode : number,
	errorMessage : string,
}
```

---


# <a id='typeid-55'></a> <a name='typeid-55'></a> UserModel 






| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `name` | `string` | 用户名称 |
```javascript
{
	name : string,
}
```

---
