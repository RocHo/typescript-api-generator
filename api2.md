
# <a id="typeid-41"></a> CallingService 


电话短信服务



## sendSms `GET`
`api/service/calling/sendSms/:name`

发送短信息请求

定义方法的注释，可以写多行，但是截止到结尾，或第一个jsdoc的tag之前
此注释必须写在方法的decorators之前，否则将无法获取到

### 路由参数 <span style="white-space: nowrap">[`UserModel`](#typeid-51)</span>

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `name` | <span style="white-space: nowrap">`string`</span> | 用户名称 |
### body <span style="white-space: nowrap">`inline`</span>
短信内容请求定义
参数注释也可以写多行，截止到下一个jsdoc的tag之前
请求参数的内联注释，会合并到前面param的注释里

支持内联匿名类，可以包含任意层级参数


| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `toUser` | <span style="white-space: nowrap">`string[]`</span> | 发送的目标用户<br><br>支持定义数组类型 |
| `content` | <span style="white-space: nowrap">[`SmsContent`](#typeid-55)</span> | 短信内容<br><br>支持另外引用外部命名类型 |
### 返回 <span style="white-space: nowrap">[`SendSmsResult`](#typeid-43)</span>

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `index` | <span style="white-space: nowrap">`number`</span> |  |
| `detailInfomations` | `inline[]` | 内联类型也可以支持数组类型，请注意最后的[] |
| `detailInfomations.title?` | <span style="white-space: nowrap">`string`</span> | 可以支持可选属性 |
| `detailInfomations.content` | <span style="white-space: nowrap">`string`</span> |  |
| `detailInfomations.user` | <span style="white-space: nowrap">[`UserModel`](#typeid-51)</span> |  |
| `resultCode` | <span style="white-space: nowrap">`number`</span> | 返回结果<br>0 成功<br>-1 失败 |
| `errorMessage` | <span style="white-space: nowrap">`string`</span> |  |

## getUserPhoneNumber `GET`
`api/service/calling/getUserPhoneNumber`

获取用户电话号码

### 路由参数 <span style="white-space: nowrap">`inline`</span>
使用@router标记参数，可以内联定义类型，在方法上使用@router是无法定义内联类型的


| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `name` | <span style="white-space: nowrap">`string`</span> |  |
### 返回 <span style="white-space: nowrap">`string`</span>

---


# <a id="typeid-43"></a> SendSmsResult  `extends` <span style="white-space: nowrap">[`BaseResult`](#typeid-46)</span>


可以通过extends关键字进行继承



| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `index` | <span style="white-space: nowrap">`number`</span> |  |
| `detailInfomations` | `inline[]` | 内联类型也可以支持数组类型，请注意最后的[] |
| `detailInfomations.title?` | <span style="white-space: nowrap">`string`</span> | 可以支持可选属性 |
| `detailInfomations.content` | <span style="white-space: nowrap">`string`</span> |  |
| `detailInfomations.user` | <span style="white-space: nowrap">[`UserModel`](#typeid-51)</span> |  |
| `resultCode` | <span style="white-space: nowrap">`number`</span> | 返回结果<br>0 成功<br>-1 失败 |
| `errorMessage` | <span style="white-space: nowrap">`string`</span> |  |

---


# <a id="typeid-46"></a> BaseResult 


通用请求结果



| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `resultCode` | <span style="white-space: nowrap">`number`</span> | 返回结果<br>0 成功<br>-1 失败 |
| `errorMessage` | <span style="white-space: nowrap">`string`</span> |  |

---


# <a id="typeid-51"></a> UserModel 






| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `name` | <span style="white-space: nowrap">`string`</span> | 用户名称 |

---


# <a id="typeid-55"></a> SmsContent 


类型的定义可以不按照顺序来



| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `content` | <span style="white-space: nowrap">`string`</span> |  |

---
