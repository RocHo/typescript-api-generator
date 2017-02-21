import { router, method , post, get, query, body , mocker } from './api-annotations';

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

    /**
     * 获取用户电话号码
     *
     * @returns {null}
     */
    @router("/getUserPhoneNumber")
    @get
    @mocker("$rm.text(13)")
    getUserPhoneNumber(
        /**
         * 使用@router标记参数，可以内联定义类型，在方法上使用@router是无法定义内联类型的
         */
        @router user : {
        name : string
    }) : string { return null; }
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
     *
     * 内联定义decorator，此处无法检查语法，请保证语法正确。
     * @range(3,10)
     */
    detailInfomations : {
        /**
         * 可以支持可选属性
         */
        title? : string,

        /**
         * 发送短信的内容
         *
         *
         * @router('/sendSms/:name', UserModel,123,456)
         *
         * 这是另一种定义decorator的方式，用于支持无法直接在源代码中定义decorator的内联类型属性等地方。
         * 定义的方法是新起一行，以at符号和标注名为开头，紧接着()，括号后面不能有任何其他字符
         *
         * 括号内可以定义参数，支持字符串、数字、和类名引用，因为是解析，所以不会有任何语法提示，请定义前仔细检查。
         *
         * 在注释里请不要写at符号，否则会被解析成decorator。
         *
         * 在第一个decorator之后的注释，都不会被采集到，所以这里写的东西都不会显示在文档中，所以请把decorator写在所有注释后面。
         *
         */
        content : string,
        user : UserModel,
        /**
         * 从req的param获取mock用的参数
         * @mocker('$rm.index(req.body.paging.index)')
         */
        index : number
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
    @mocker("$rm.weightedChoose(1,-1,3,0)")
    resultCode : number;
    @mocker("\"error\"")
    errorMessage : string;
}
class UserModel{
    /**
     * 用户名称
     */
    @mocker("$rm.text($rm.range(3,5))")
    name : string
}