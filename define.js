"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var meta_annotations_1 = require('./meta-annotations');
/**
 * 调用服务注释
 */
var CallingService = (function () {
    function CallingService() {
    }
    CallingService.prototype.callFunc = function (query) { return null; };
    ;
    __decorate([
        meta_annotations_1.get()
    ], CallingService.prototype, "callFunc");
    CallingService = __decorate([
        meta_annotations_1.router("api/service/")
    ], CallingService);
    return CallingService;
}());
var FindAddressQuery = (function () {
    function FindAddressQuery() {
    }
    __decorate([
        meta_annotations_1.comment('用户输入的模糊地址信息')
    ], FindAddressQuery.prototype, "address");
    FindAddressQuery = __decorate([
        meta_annotations_1.comment()
    ], FindAddressQuery);
    return FindAddressQuery;
}());
var AddressDetailInfo = (function () {
    function AddressDetailInfo() {
    }
    __decorate([
        meta_annotations_1.comment('精确地址')
    ], AddressDetailInfo.prototype, "address");
    AddressDetailInfo = __decorate([
        meta_annotations_1.comment('单条精确的地址信息')
    ], AddressDetailInfo);
    return AddressDetailInfo;
}());
var AddressDetailInfos = (function () {
    function AddressDetailInfos() {
    }
    __decorate([
        meta_annotations_1.comment("\u7CBE\u786E\u5730\u5740\n    \u6A21\u7CCA\u67E5\u8BE2\u8FD4\u56DE\u7684\u7CBE\u786E\u5730\u5740\u9009\u9879\uFF0C\u63D0\u4F9B\u7ED9\u524D\u53F0\u4E0B\u62C9\u53EF\u9009\u9879\n"),
        meta_annotations_1.array(AddressDetailInfo)
    ], AddressDetailInfos.prototype, "detailAddresses");
    AddressDetailInfos = __decorate([
        meta_annotations_1.comment()
    ], AddressDetailInfos);
    return AddressDetailInfos;
}());
var GetCityRouter = (function () {
    function GetCityRouter() {
    }
    __decorate([
        meta_annotations_1.comment('城市名称')
    ], GetCityRouter.prototype, "id");
    GetCityRouter = __decorate([
        meta_annotations_1.comment()
    ], GetCityRouter);
    return GetCityRouter;
}());
var CityMoreDetailInfo = (function () {
    function CityMoreDetailInfo() {
    }
    __decorate([
        meta_annotations_1.comment('x')
    ], CityMoreDetailInfo.prototype, "x");
    __decorate([
        meta_annotations_1.comment('y')
    ], CityMoreDetailInfo.prototype, "y");
    CityMoreDetailInfo = __decorate([
        meta_annotations_1.comment('更详细的信息')
    ], CityMoreDetailInfo);
    return CityMoreDetailInfo;
}());
var CityDetailInfo = (function () {
    function CityDetailInfo() {
    }
    __decorate([
        meta_annotations_1.comment('经度')
    ], CityDetailInfo.prototype, "la");
    __decorate([
        meta_annotations_1.comment('维度')
    ], CityDetailInfo.prototype, "lu");
    __decorate([
        meta_annotations_1.comment('城市更详细的信息'),
        meta_annotations_1.array(CityMoreDetailInfo)
    ], CityDetailInfo.prototype, "cityMoreDetailInfo");
    CityDetailInfo = __decorate([
        meta_annotations_1.comment('城市详细信息')
    ], CityDetailInfo);
    return CityDetailInfo;
}());
var CityInfo = (function () {
    function CityInfo() {
    }
    __decorate([
        meta_annotations_1.comment('城市id')
    ], CityInfo.prototype, "id");
    __decorate([
        meta_annotations_1.comment('城市名称')
    ], CityInfo.prototype, "name");
    __decorate([
        meta_annotations_1.comment('城市详细信息')
    ], CityInfo.prototype, "detail");
    CityInfo = __decorate([
        meta_annotations_1.comment('城市信息')
    ], CityInfo);
    return CityInfo;
}());
var UpdateCityRouter = (function () {
    function UpdateCityRouter() {
    }
    __decorate([
        meta_annotations_1.comment('城市id')
    ], UpdateCityRouter.prototype, "id");
    UpdateCityRouter = __decorate([
        meta_annotations_1.comment('更新城市参数')
    ], UpdateCityRouter);
    return UpdateCityRouter;
}());
var AddressService = (function () {
    function AddressService() {
    }
    AddressService.prototype.findAddress = function (query) { return null; };
    ;
    AddressService.prototype.getCity = function () { return null; };
    ;
    AddressService.prototype.updateCity = function (cityInfo) { };
    ;
    __decorate([
        meta_annotations_1.comment("\u67E5\u8BE2\u66F4\u51C6\u786E\u7684\u5730\u5740"),
        meta_annotations_1.router('/findAddress'),
        meta_annotations_1.method('GET'),
        __param(0, meta_annotations_1.query())
    ], AddressService.prototype, "findAddress");
    __decorate([
        meta_annotations_1.router('/get-city/:id', GetCityRouter),
        meta_annotations_1.comment('查询城市信息'),
        meta_annotations_1.get()
    ], AddressService.prototype, "getCity");
    __decorate([
        meta_annotations_1.comment('更新城市'),
        meta_annotations_1.router('/update-city/:id', UpdateCityRouter),
        meta_annotations_1.post(),
        __param(0, meta_annotations_1.body())
    ], AddressService.prototype, "updateCity");
    AddressService = __decorate([
        meta_annotations_1.router("api/service/address"),
        meta_annotations_1.comment("\u516C\u5171\u5730\u5740\u670D\u52A1\n\u63D0\u4F9B\u5BC4\u9001\u5730\u5740\u67E5\u8BE2\u670D\u52A1\n")
    ], AddressService);
    return AddressService;
}());
//# sourceMappingURL=define.js.map