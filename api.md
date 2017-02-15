
# <a id="AddressService"></a> AddressService
`api/service/address`

公共地址服务
提供寄送地址查询服务




## findAddress `GET`
`api/service/address/findAddress`

查询更准确的地址

### query



| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `address` | <span style="white-space: nowrap">[`String`](#String)</span> | 用户输入的模糊地址信息 |
### 返回

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `detailAddresses` | <span style="white-space: nowrap">[`Array`](#Array)</span> | 精确地址<br>    模糊查询返回的精确地址选项，提供给前台下拉可选项<br> |

## getCity `GET`
`api/service/address/get-city/:id`

查询城市信息

### router

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `id` | <span style="white-space: nowrap">[`Number`](#Number)</span> | 城市名称 |
### 返回

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `id` | <span style="white-space: nowrap">[`Number`](#Number)</span> | 城市id |
| `name` | <span style="white-space: nowrap">[`String`](#String)</span> | 城市名称 |

## updateCity `POST`
`api/service/address/update-city/:id`

更新城市

### router

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `id` | <span style="white-space: nowrap">[`Number`](#Number)</span> | 城市id |
### body



| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `id` | <span style="white-space: nowrap">[`Number`](#Number)</span> | 城市id |
| `name` | <span style="white-space: nowrap">[`String`](#String)</span> | 城市名称 |