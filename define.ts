import { router, method , post, get, query, body } from './meta-annotations';

/**
 * 电话短信服务
 */
@router("api/service/calling")
class CallingService{
    /**
     * 发送短信息请求
     *
     * 定义方法的注释，可以写多行，但是截止到结尾，或第一个jsdoc的tag之前
     * 此注释必须写在方法的decorators之前，否则将无法获取到
     *
     * @router('/sendSms/:name') 这是另一种定义decorator的方式，但现在还未完成支持
     *
     * 这里的注释不会被采集到
     *
     * @param req 短信内容请求定义
     * 参数注释也可以写多行，截止到下一个jsdoc的tag之前
     *
     * @returns {null} 关于返回值的注释
     *
     */
    @router('/sendSms/:name',UserModel)
    sendSms(/**
             * 请求参数的内联注释，会合并到前面param的注释里
             *
             * 支持内联匿名类，可以包含任意层级参数
             */
        @body req : {
        /**
         * 发送的目标用户
         *
         * 支持定义数组类型
         */
        toUser : string[],
        /**
         * 短信内容
         *
         * 支持另外引用外部命名类型
         */
        content : SmsContent,
    }) : SendSmsResult {return null;};
}

/**
 * 类型的定义可以不按照顺序来
 */
class SmsContent{
    content : string
}
/**
 * 可以通过extends关键字进行继承
 */
class SendSmsResult extends BaseResult{
    index : number;
    /**
     * 内联类型也可以支持数组类型，请注意最后的[]
     */
    detailInfomations : {
        title : string,
        content : string,
        user : UserModel
    }[]
}
/**
 * 通用请求结果
 */
class BaseResult{
    /**
     * 返回结果
     * 0 成功
     * -1 失败
     */
    resultCode : number;
    errorMessage : string;
}
class UserModel{
    /**
     * 用户名称
     */
    name : string
}