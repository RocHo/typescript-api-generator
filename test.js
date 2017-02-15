"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
require("reflect-metadata");
var meta_annotations_1 = require('./meta-annotations');
var FindAddressQuery = (function () {
    function FindAddressQuery() {
    }
    __decorate([
        meta_annotations_1.comment('用户输入的模糊地址信息'), 
        __metadata('design:type', String)
    ], FindAddressQuery.prototype, "address", void 0);
    FindAddressQuery = __decorate([
        meta_annotations_1.comment(), 
        __metadata('design:paramtypes', [])
    ], FindAddressQuery);
    return FindAddressQuery;
}());
var AddressDetailInfo = (function () {
    function AddressDetailInfo() {
    }
    __decorate([
        meta_annotations_1.comment('精确地址'), 
        __metadata('design:type', String)
    ], AddressDetailInfo.prototype, "address", void 0);
    AddressDetailInfo = __decorate([
        meta_annotations_1.comment('单条精确的地址信息'), 
        __metadata('design:paramtypes', [])
    ], AddressDetailInfo);
    return AddressDetailInfo;
}());
var AddressDetailInfos = (function () {
    function AddressDetailInfos() {
    }
    __decorate([
        meta_annotations_1.comment("\u7CBE\u786E\u5730\u5740\n    \u6A21\u7CCA\u67E5\u8BE2\u8FD4\u56DE\u7684\u7CBE\u786E\u5730\u5740\u9009\u9879\uFF0C\u63D0\u4F9B\u7ED9\u524D\u53F0\u4E0B\u62C9\u53EF\u9009\u9879\n"),
        Reflect.metadata('design:elementtype', AddressDetailInfo), 
        __metadata('design:type', Array)
    ], AddressDetailInfos.prototype, "detailAddresses", void 0);
    AddressDetailInfos = __decorate([
        meta_annotations_1.comment(), 
        __metadata('design:paramtypes', [])
    ], AddressDetailInfos);
    return AddressDetailInfos;
}());
var GetCityRouter = (function () {
    function GetCityRouter() {
    }
    __decorate([
        meta_annotations_1.comment('城市名称'), 
        __metadata('design:type', Number)
    ], GetCityRouter.prototype, "id", void 0);
    GetCityRouter = __decorate([
        meta_annotations_1.comment(), 
        __metadata('design:paramtypes', [])
    ], GetCityRouter);
    return GetCityRouter;
}());
var CityMoreDetailInfo = (function () {
    function CityMoreDetailInfo() {
    }
    __decorate([
        meta_annotations_1.comment('x'), 
        __metadata('design:type', Number)
    ], CityMoreDetailInfo.prototype, "x", void 0);
    __decorate([
        meta_annotations_1.comment('y'), 
        __metadata('design:type', Number)
    ], CityMoreDetailInfo.prototype, "y", void 0);
    CityMoreDetailInfo = __decorate([
        meta_annotations_1.comment('更详细的信息'), 
        __metadata('design:paramtypes', [])
    ], CityMoreDetailInfo);
    return CityMoreDetailInfo;
}());
var CityDetailInfo = (function () {
    function CityDetailInfo() {
    }
    __decorate([
        meta_annotations_1.comment('经度'), 
        __metadata('design:type', Number)
    ], CityDetailInfo.prototype, "la", void 0);
    __decorate([
        meta_annotations_1.comment('维度'), 
        __metadata('design:type', Number)
    ], CityDetailInfo.prototype, "lu", void 0);
    __decorate([
        meta_annotations_1.comment('城市更详细的信息'), 
        __metadata('design:type', CityMoreDetailInfo)
    ], CityDetailInfo.prototype, "cityMoreDetailInfo", void 0);
    CityDetailInfo = __decorate([
        meta_annotations_1.comment('城市详细信息'), 
        __metadata('design:paramtypes', [])
    ], CityDetailInfo);
    return CityDetailInfo;
}());
var CityInfo = (function () {
    function CityInfo() {
    }
    __decorate([
        meta_annotations_1.comment('城市id'), 
        __metadata('design:type', Number)
    ], CityInfo.prototype, "id", void 0);
    __decorate([
        meta_annotations_1.comment('城市名称'), 
        __metadata('design:type', String)
    ], CityInfo.prototype, "name", void 0);
    __decorate([
        meta_annotations_1.comment('城市详细信息'), 
        __metadata('design:type', CityDetailInfo)
    ], CityInfo.prototype, "detail", void 0);
    CityInfo = __decorate([
        meta_annotations_1.comment('城市信息'), 
        __metadata('design:paramtypes', [])
    ], CityInfo);
    return CityInfo;
}());
var UpdateCityRouter = (function () {
    function UpdateCityRouter() {
    }
    __decorate([
        meta_annotations_1.comment('城市id'), 
        __metadata('design:type', Number)
    ], UpdateCityRouter.prototype, "id", void 0);
    UpdateCityRouter = __decorate([
        meta_annotations_1.comment('更新城市参数'), 
        __metadata('design:paramtypes', [])
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
        __param(0, meta_annotations_1.query()), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [FindAddressQuery]), 
        __metadata('design:returntype', AddressDetailInfos)
    ], AddressService.prototype, "findAddress", null);
    __decorate([
        meta_annotations_1.router('/get-city/:id', GetCityRouter),
        meta_annotations_1.comment('查询城市信息'),
        meta_annotations_1.get(), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', CityInfo)
    ], AddressService.prototype, "getCity", null);
    __decorate([
        meta_annotations_1.comment('更新城市'),
        meta_annotations_1.router('/update-city/:id', UpdateCityRouter),
        meta_annotations_1.post(),
        __param(0, meta_annotations_1.body()), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [CityInfo]), 
        __metadata('design:returntype', void 0)
    ], AddressService.prototype, "updateCity", null);
    AddressService = __decorate([
        meta_annotations_1.router("api/service/address"),
        meta_annotations_1.comment("\u516C\u5171\u5730\u5740\u670D\u52A1\n\u63D0\u4F9B\u5BC4\u9001\u5730\u5740\u67E5\u8BE2\u670D\u52A1\n"), 
        __metadata('design:paramtypes', [])
    ], AddressService);
    return AddressService;
}());
meta_annotations_1.outputMarkdown("api.md");
//# sourceMappingURL=test.js.map