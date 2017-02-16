import "reflect-metadata";
import { comment,array, method , router ,extend,query, body , post, get , outputMarkdown } from './meta-annotations';

@comment()
class FindAddressQuery{
    @comment('用户输入的模糊地址信息')
    address : string;
}

@comment('单条精确的地址信息')
class AddressDetailInfo{
    @comment('精确地址')
    address : string;
}

@comment()
class AddressDetailInfos{
    @comment(`精确地址
    模糊查询返回的精确地址选项，提供给前台下拉可选项
`)
    @array(AddressDetailInfo)
    detailAddresses : AddressDetailInfo[];
}

@comment()
class GetCityRouter{
    @comment('城市名称')
    id : number;
}

@comment('更详细的信息')
class CityMoreDetailInfo{
    @comment('x')
    x : number;
    @comment('y')
    y : number;
}

@comment('城市详细信息')
class CityDetailInfo{
    @comment('经度')
    la : number;
    @comment('维度')
    lu : number;

    @comment('城市更详细的信息')
    @array(CityMoreDetailInfo)
    cityMoreDetailInfo : CityMoreDetailInfo[];
}

@comment('城市信息')
@extend(CityDetailInfo)
class CityInfo{
    @comment('城市id')
    id : number;
    @comment('城市名称')
    name : string;

    @comment('城市详细信息')
    detail : CityDetailInfo;
}

@comment('更新城市参数')
class UpdateCityRouter{
    @comment('城市id')
    id : number;
}


@router("api/service/address")
@comment(`公共地址服务
提供寄送地址查询服务
`)
class AddressService{
    @comment(`查询更准确的地址`)
    @router('/findAddress')
    @method('GET')
    findAddress(@query()
                    query: FindAddressQuery) : AddressDetailInfos { return null;};

    @router('/get-city/:id',GetCityRouter)
    @comment('查询城市信息')
    @get()
    getCity() : CityInfo {return null;};

    @comment('更新城市')
    @router('/update-city/:id',UpdateCityRouter)
    @post()
    updateCity(@body()
                   cityInfo : CityInfo) {};
}



outputMarkdown("api.md");