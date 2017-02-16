
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
| `address` | `String` | 用户输入的模糊地址信息 |
### 返回

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `detailAddresses` | <span style="white-space: nowrap">[`Array<AddressDetailInfo>`](#AddressDetailInfo)</span> | 精确地址<br>    模糊查询返回的精确地址选项，提供给前台下拉可选项<br> |
| `detailAddresses.address` | `String` | 精确地址 |

## getCity `GET`
`api/service/address/get-city/:id`

查询城市信息

### router

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `id` | `Number` | 城市名称 |
### 返回

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `id` | `Number` | 城市id |
| `name` | `String` | 城市名称 |
| `detail` | <span style="white-space: nowrap">[`CityDetailInfo`](#CityDetailInfo)</span> | 城市详细信息 |
| `detail.la` | `Number` | 经度 |
| `detail.lu` | `Number` | 维度 |
| `detail.cityMoreDetailInfo` | <span style="white-space: nowrap">[`Array<CityMoreDetailInfo>`](#CityMoreDetailInfo)</span> | 城市更详细的信息 |
| `detail.cityMoreDetailInfo.x` | `Number` | x |
| `detail.cityMoreDetailInfo.y` | `Number` | y |

## updateCity `POST`
`api/service/address/update-city/:id`

更新城市

### router

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `id` | `Number` | 城市id |
### body



| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `id` | `Number` | 城市id |
| `name` | `String` | 城市名称 |
| `detail` | <span style="white-space: nowrap">[`CityDetailInfo`](#CityDetailInfo)</span> | 城市详细信息 |
| `detail.la` | `Number` | 经度 |
| `detail.lu` | `Number` | 维度 |
| `detail.cityMoreDetailInfo` | <span style="white-space: nowrap">[`Array<CityMoreDetailInfo>`](#CityMoreDetailInfo)</span> | 城市更详细的信息 |
| `detail.cityMoreDetailInfo.x` | `Number` | x |
| `detail.cityMoreDetailInfo.y` | `Number` | y |

# <a id="FindAddressQuery"></a> FindAddressQuery 






| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `address` | `String` | 用户输入的模糊地址信息 |

# <a id="AddressDetailInfo"></a> AddressDetailInfo 


单条精确的地址信息



| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `address` | `String` | 精确地址 |

# <a id="AddressDetailInfos"></a> AddressDetailInfos 






| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `detailAddresses` | <span style="white-space: nowrap">[`Array<AddressDetailInfo>`](#AddressDetailInfo)</span> | 精确地址<br>    模糊查询返回的精确地址选项，提供给前台下拉可选项<br> |
| `detailAddresses.address` | `String` | 精确地址 |

# <a id="GetCityRouter"></a> GetCityRouter 






| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `id` | `Number` | 城市名称 |

# <a id="CityMoreDetailInfo"></a> CityMoreDetailInfo 


更详细的信息



| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `x` | `Number` | x |
| `y` | `Number` | y |

# <a id="CityDetailInfo"></a> CityDetailInfo 


城市详细信息



| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `la` | `Number` | 经度 |
| `lu` | `Number` | 维度 |
| `cityMoreDetailInfo` | <span style="white-space: nowrap">[`Array<CityMoreDetailInfo>`](#CityMoreDetailInfo)</span> | 城市更详细的信息 |
| `cityMoreDetailInfo.x` | `Number` | x |
| `cityMoreDetailInfo.y` | `Number` | y |

# <a id="CityInfo"></a> CityInfo  `@extend` <span style="white-space: nowrap">[`CityDetailInfo`](#CityDetailInfo)</span>


城市信息



| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `id` | `Number` | 城市id |
| `name` | `String` | 城市名称 |
| `detail` | <span style="white-space: nowrap">[`CityDetailInfo`](#CityDetailInfo)</span> | 城市详细信息 |
| `detail.la` | `Number` | 经度 |
| `detail.lu` | `Number` | 维度 |
| `detail.cityMoreDetailInfo` | <span style="white-space: nowrap">[`Array<CityMoreDetailInfo>`](#CityMoreDetailInfo)</span> | 城市更详细的信息 |
| `detail.cityMoreDetailInfo.x` | `Number` | x |
| `detail.cityMoreDetailInfo.y` | `Number` | y |

# <a id="UpdateCityRouter"></a> UpdateCityRouter 


更新城市参数



| 名称 | 类型 | 描述 |
| --- | --- | --- |
| `id` | `Number` | 城市id |