/**
 * jquery表单验证插件，使用bootstrap tooltip显示提示信息
 * Created by lixizhong on 2016/11/16.
 *
 * 使用方法：
 * $('form').watch(): 即时验证
 * $('form').validate(): 手动验证
 * $('input').validateInput(): 验证指定控件
 *
 * 支持的验证类型：
 * .required：必填验证
 * .number：数字
 * .int：整数
 * .mobile：手机号码
 * .fn-validate：自定义验证方法, 需要设置validate-fn='方法名', 验证方法支持1个参数，参数值为控件jquery对象, 返回值类型:{result:true, message:''}
 */

(function( $ ) {
    //实时验证表单输入（自动）
    $.fn.watch = function(){
        this.find('.required, .number, .int, .mobile, .fn-validate').on('change keyup', function () {
            doValidate($(this));
        })
    }

    //验证指定输入控件
    $.fn.validateInput = function(){
        return doValidate(this);
    }

    //验证表单
    $.fn.validate = function() {
        var inputs = this.find(".required, .number, .int, .mobile, .fn-validate");
        var result = true;
        inputs.each(function(){
            if( ! doValidate($(this))){
                result = false;
                return;
            }
        });
        return result;
    }

    //显示错误信息
    function showValidateMsg(node, msg){
        var validateStatus = node.data('validate-tip');
        if(validateStatus == 'show'){
            node.next('.tooltip').find('.tooltip-inner').text(msg);
        }else {
            node.tooltip({
                title: msg,
                trigger: 'manual',
            }).tooltip('show');
        }

        node.data('validate-tip', 'show')
    }

    //验证
    function doValidate(input){
        var value = $.trim(input.val());

        var isRequired = input.hasClass('required');

        if(isRequired && value == ""){
            showValidateMsg(input, "不能为空");
            return false;
        }

        var isNumber = input.hasClass('number');

        if(isNumber && value && isNaN(value)){
            showValidateMsg(input, "请输入一个有效数字");
            return false;
        }

        var isInt = input.hasClass('int');

        if(isInt && value && value != parseInt(value)){
            showValidateMsg(input, "请输入一个整数");
            return false;
        }

        var isMobile = input.hasClass('mobile');

        if(isMobile && ! checkMobile(value)){
            showValidateMsg(input, "请输入一个手机号码");
            return false;
        }

        var isFnValidate = input.hasClass('fn-validate');

        if(isFnValidate) {
            var fn = input.attr("validate-fn");
            var result = eval(fn + '(input)');
            if( ! result.result){
                showValidateMsg(input, result.message);
                return false;
            }
        }

        if(input.data('validate-tip') == 'show'){
            input.tooltip('destroy');
            input.data('validate-tip', 'hide');
        }

        return true;
    }

    //验证手机号码
    function checkMobile(mobile){

        if(mobile == null || $.trim(mobile) == "" || mobile.length != 11){
            return false;
        }

        var ch = mobile.charAt(0);

        if(ch != '1'){
            return false;
        }

        for(var i=1; i<11; i++){
            var ch = mobile.charAt(i);
            if(ch > '9' || ch < '0'){
                return false;
            }
        }

        return true;
    }
})(jQuery);