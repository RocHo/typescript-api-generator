"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var api_annotations_1 = require('./api-annotations');
/**
 * 电话短信服务
 */
var CallingService = (function () {
    function CallingService() {
    }
    /**
     * 发送短信息请求
     *
     * 定义方法的注释，可以写多行，但是截止到结尾，或第一个jsdoc的tag之前
     * 此注释必须写在方法的decorators之前，否则将无法获取到
     *
     *
     * 这里的注释不会被采集到
     *
     * @param req 短信内容请求定义
     * 参数注释也可以写多行，截止到下一个jsdoc的tag之前
     *
     * @returns {null} 关于返回值的注释
     *
     */
    CallingService.prototype.sendSms = function (/**
                 * 请求参数的内联注释，会合并到前面param的注释里
                 *
                 * 支持内联匿名类，可以包含任意层级参数
                 */ req) { return null; };
    ;
    /**
     * 获取用户电话号码
     *
     * @returns {null}
     */
    CallingService.prototype.getUserPhoneNumber = function (
        /**
         * 使用@router标记参数，可以内联定义类型，在方法上使用@router是无法定义内联类型的
         */
        user) { return null; };
    __decorate([
        api_annotations_1.router('/sendSms/:name', UserModel),
        /**
                 * 请求参数的内联注释，会合并到前面param的注释里
                 *
                 * 支持内联匿名类，可以包含任意层级参数
                 */ __param(0, api_annotations_1.body), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', SendSmsResult)
    ], CallingService.prototype, "sendSms", null);
    __decorate([
        api_annotations_1.router("/getUserPhoneNumber"),
        api_annotations_1.get,
        api_annotations_1.mocker("$rm.text(13)"),
        __param(0, api_annotations_1.router), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', String)
    ], CallingService.prototype, "getUserPhoneNumber", null);
    CallingService = __decorate([
        api_annotations_1.router("api/service/calling"), 
        __metadata('design:paramtypes', [])
    ], CallingService);
    return CallingService;
}());
/**
 * 类型的定义可以不按照顺序来
 */
var SmsContent = (function () {
    function SmsContent() {
    }
    return SmsContent;
}());
/**
 * 可以通过extends关键字进行继承
 */
var SendSmsResult = (function (_super) {
    __extends(SendSmsResult, _super);
    function SendSmsResult() {
        _super.apply(this, arguments);
    }
    return SendSmsResult;
}(BaseResult));
/**
 * 通用请求结果
 */
var BaseResult = (function () {
    function BaseResult() {
    }
    __decorate([
        api_annotations_1.mocker("$rm.weightedChoose(1,-1,3,0)"), 
        __metadata('design:type', Number)
    ], BaseResult.prototype, "resultCode", void 0);
    __decorate([
        api_annotations_1.mocker("\"error\""), 
        __metadata('design:type', String)
    ], BaseResult.prototype, "errorMessage", void 0);
    return BaseResult;
}());
var UserModel = (function () {
    function UserModel() {
    }
    __decorate([
        api_annotations_1.mocker("$rm.text($rm.range(3,5))"), 
        __metadata('design:type', String)
    ], UserModel.prototype, "name", void 0);
    return UserModel;
}());
//# sourceMappingURL=define.js.map