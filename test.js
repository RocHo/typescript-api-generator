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
var meta_annotations_1 = require("./meta-annotations");
var AddressService = (function () {
    function AddressService() {
    }
    AddressService.prototype.findAddress = function (query) { return null; };
    ;
    AddressService.prototype.getCity = function () { return null; };
    ;
    AddressService.prototype.updateCity = function (cityInfo) { };
    ;
    return AddressService;
}());
__decorate([
    meta_annotations_1.comment("\u67E5\u8BE2\u66F4\u51C6\u786E\u7684\u5730\u5740"),
    meta_annotations_1.router('/findAddress'),
    meta_annotations_1.method('GET'),
    __param(0, meta_annotations_1.query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FindAddressQuery]),
    __metadata("design:returntype", AddressDetailInfos)
], AddressService.prototype, "findAddress", null);
__decorate([
    meta_annotations_1.router('/get-city/:id', GetCityRouter),
    meta_annotations_1.comment('查询城市信息'),
    meta_annotations_1.get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", CityInfo)
], AddressService.prototype, "getCity", null);
__decorate([
    meta_annotations_1.comment('更新城市'),
    meta_annotations_1.router('/update-city/:id', UpdateCityRouter),
    meta_annotations_1.post(),
    __param(0, meta_annotations_1.body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CityInfo]),
    __metadata("design:returntype", void 0)
], AddressService.prototype, "updateCity", null);
AddressService = __decorate([
    meta_annotations_1.router("api/service/address"),
    meta_annotations_1.comment("\u516C\u5171\u5730\u5740\u670D\u52A1\n\u63D0\u4F9B\u5BC4\u9001\u5730\u5740\u67E5\u8BE2\u670D\u52A1\n")
], AddressService);
var FindAddressQuery = (function () {
    function FindAddressQuery() {
    }
    return FindAddressQuery;
}());
__decorate([
    meta_annotations_1.comment('用户输入的模糊地址信息'),
    __metadata("design:type", String)
], FindAddressQuery.prototype, "address", void 0);
FindAddressQuery = __decorate([
    meta_annotations_1.comment()
], FindAddressQuery);
var AddressDetailInfos = (function () {
    function AddressDetailInfos() {
    }
    return AddressDetailInfos;
}());
__decorate([
    meta_annotations_1.comment("\u7CBE\u786E\u5730\u5740\n    \u6A21\u7CCA\u67E5\u8BE2\u8FD4\u56DE\u7684\u7CBE\u786E\u5730\u5740\u9009\u9879\uFF0C\u63D0\u4F9B\u7ED9\u524D\u53F0\u4E0B\u62C9\u53EF\u9009\u9879\n"),
    __metadata("design:type", Array)
], AddressDetailInfos.prototype, "detailAddresses", void 0);
AddressDetailInfos = __decorate([
    meta_annotations_1.comment()
], AddressDetailInfos);
var AddressDetailInfo = (function () {
    function AddressDetailInfo() {
    }
    return AddressDetailInfo;
}());
__decorate([
    meta_annotations_1.comment('精确地址'),
    __metadata("design:type", String)
], AddressDetailInfo.prototype, "address", void 0);
AddressDetailInfo = __decorate([
    meta_annotations_1.comment('单条精确的地址信息')
], AddressDetailInfo);
var GetCityRouter = (function () {
    function GetCityRouter() {
    }
    return GetCityRouter;
}());
__decorate([
    meta_annotations_1.comment('城市名称'),
    __metadata("design:type", Number)
], GetCityRouter.prototype, "id", void 0);
GetCityRouter = __decorate([
    meta_annotations_1.comment()
], GetCityRouter);
var CityInfo = (function () {
    function CityInfo() {
    }
    return CityInfo;
}());
__decorate([
    meta_annotations_1.comment('城市id'),
    __metadata("design:type", Number)
], CityInfo.prototype, "id", void 0);
__decorate([
    meta_annotations_1.comment('城市名称'),
    __metadata("design:type", String)
], CityInfo.prototype, "name", void 0);
CityInfo = __decorate([
    meta_annotations_1.comment('城市信息')
], CityInfo);
var UpdateCityRouter = (function () {
    function UpdateCityRouter() {
    }
    return UpdateCityRouter;
}());
__decorate([
    meta_annotations_1.comment('城市id'),
    __metadata("design:type", Number)
], UpdateCityRouter.prototype, "id", void 0);
UpdateCityRouter = __decorate([
    meta_annotations_1.comment('更新城市参数')
], UpdateCityRouter);
getMetadatas().forEach(function (v, k) {
    console.log();
    console.log("Type %s", k);
    console.log("Comment %s", v.comment);
    console.log();
    console.log("properties");
    v.props.forEach(function (v, k) {
        console.log('name %s', k);
        console.log('comment %s', v.comment);
        console.log('type %s', v.type);
    });
    console.log();
    console.log("methods");
    v.methods.forEach(function (v, k) {
        console.log("name %s", k);
        console.log('comment %s', v.comment);
        console.log("return type %s", v.returnType);
        v.params.forEach(function (v) {
            console.log('comment %s', v.comment);
            console.log('type %s', v.type);
        });
    });
    console.log();
});
//# sourceMappingURL=test.js.map