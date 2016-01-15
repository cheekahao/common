/*
* 网站开发常用jQuery插件, by Hao Zhenjia
* moblie端，可以使用类似Bootstrap的声明式使用
*/

(function($){
    $.fn.extend({    
    //表单校验相关插件，校验失败提示信息
    checkErrorTips:function(tips){
    	var _this=this;
        var tips = tips || _this.attr("errormsg");
        if(tips){
            if(_this.siblings("p.valid_form_wrong").length > 0){
                _this.siblings("p.valid_form_wrong").text(tips);
            }else{
                _this.after("<p class='valid_form_wrong'>"+ tips + "</p>");
            }
        }
        return this;
    },
    removeErrorTips:function(){
    	var _this=this;
    	if(_this.siblings("p.valid_form_wrong").length > 0){
    		_this.siblings("p.valid_form_wrong").remove();
    	}
    	return this;
    },
    //验证码倒计时函数    
		waiting:function(t,callback){
			if($.isFunction(t)){
				callback = t;
				t = undefined;
			}
            var t= t || 60;
            var _this=this;
            var oldvalue=_this.val();
            _this.get(0).oldvalue=oldvalue;
            waitingLoop();
            return this;
            function waitingLoop(){
                if(t >0){
                    _this.attr("disabled","disabled");
                    _this.val(t+"秒");
                    t--;
                    _this.get(0).waitingTimer=setTimeout(waitingLoop,1000);
                }else{
                    _this.val(oldvalue);
                    _this.removeAttr("disabled");
                    if($.isFunction(callback)){
                    	callback();
                    }
                }
            }
        },
        stopWaiting:function() {
        	if (this.get(0).waitingTimer) {
        		clearTimeout(this.get(0).waitingTimer);
    			this.val(this.get(0).oldvalue);
    			this.removeAttr("disabled").removeClass("_input_disabled");
        	}
		},
		//input自动产生下拉列表,模拟input的autoComplete功能
		dropDown: function(listData){
			if(!listData) return;
			var me=this;
			var offsetTop = me.offset().top;
			var offsetLeft = me.offset().left;
			var dropDownTop = offsetTop + me.outerHeight();
			var dropDownWidth = me.outerWidth();
			var html='<div class="input_drop_down"><ul>';
			for(i=0;i<listData.length;i++){
			    html+='<li>'+listData[i]+'</li>';
			}
			html+='</ul></div>';
			me.attr("autocomplete","off");
			$('body').append(html);
			me.click(function(event){
				$('.input_drop_down').css({'top':dropDownTop,'left':offsetLeft,'width':dropDownWidth}).show();
				event.stopPropagation();
			});
			
			$(document).click(function(){
				if($('.input_drop_down').is(":visible")){
					$('.input_drop_down').hide();
				}
			});		
			$('.input_drop_down li').click(function(event){
                me.val(this.innerText);
                $('.input_drop_down').hide();
                event.stopPropagation();
            });
		},
		/*
	     * 倒计时插件，by haozj
	     * 需要传入一个截止日期，格式为yyyy,mth,dd,hh,mm,ss
	     * mth为月份，例如二月即为2
	     * 目前能且只能返回天时分秒
	     */
	    countDown:function(){	    	
	        var _this=this;	        
	        if(arguments.length == 2 && arguments[0] instanceof Date && arguments[1] instanceof Date){
	        	var nowDate = arguments[0] < arguments[1] ? arguments[0] : arguments[1];
	        	var endDate = arguments[0] < arguments[1] ? arguments[1] : arguments[0];
	        }else if(arguments.length == 3 || arguments.length == 6){
	        	arguments[1]-=1;
	        	var nowDate = new Date();
	        	var endDate = new Date(arguments);
	        }else{
	        	throw new Error("arguments length error");
	        }      
	        var tillNowSecs = (endDate - nowDate) / 1000;
	        (function(){
	        if(tillNowSecs > 0){
	            tillNowSecs = (endDate - new Date()) / 1000;
	            var dd = parseInt(tillNowSecs / 60 / 60 / 24, 10);//计算剩余的天数  
	            var hh = parseInt(tillNowSecs / 60 / 60 % 24, 10);//计算剩余的小时数  
	            var mm = parseInt(tillNowSecs / 60 % 60, 10);//计算剩余的分钟数  
	            var ss = parseInt(tillNowSecs % 60, 10);//计算剩余的秒数 ;
	            _this.html("<span>"+checkTime(dd) + "</span>天<span>" + checkTime(hh) + "</span>时<span>" + checkTime(mm) + "</span>分<span>" + checkTime(ss) + "</span>秒");           
	            setTimeout(arguments.callee,1000)
	        }else{
	            _this.text( "00天00时00分00秒");
	        }
	        })();
	        //数字小于10时前面加0
	        function checkTime(i){            
	            return i < 10?"0"+i:i;          
	        }
	    },
        //tab页切换插件，目前不支持touch事件
	    tabs: function(config, callback) {
	    	if ($.isFunction(config)){
	    		callback = config,
	    		config = null;
	    	}         
			var _this   = this.data("role") == "tabParent" ? this.children() : this,
				options = {
							tabEvent : "click",
							initNum : 0,
							tabcontent : null
							};
			options = $.extend(options,config,this.data()); 
			if(!options.tabcontent){
				throw new Error("tabContent of tabs is undefined");
			}       
			var	$tabContent = $(options.tabcontent);
            function showTab(idx) {
                _this.eq(idx).addClass("current").siblings().removeClass("current");
                $tabContent.eq(idx).show().siblings(options.tabcontent).hide();
            }

            _this.bind(options.tabEvent + ".tabs", function() {
                showTab($(this).index());
            });

            showTab(options.initNum);

            //添加touch事件
//            if(_this.parent() == $tabContent.parent()){
//            	
//            }

            if ($.isFunction(callback)) {
                callback();
            }
            return this;
        },
	    checkbox: function(config) {
            var _this = this;
            var option = {
                checkedClass: "_label_single_checked", //美化checkbox容器的选中class
                disabledClassNeed: false, //是否需要另外规定input禁用样式，M版不需要
                disabledClass: "input_disabled", //input禁用时的样式
                form : this.parents("form").length > 0 ? this.parents("form") : $(document)  //当前表单，如果没有时，默认为document
            }
            option = $.extend(option, config);
            var $newCar = $("[name=newCarFlag]", this).length > 0 ? $("[name=newCarFlag]", this) : $("#newCarFlag", this);

            _this.each(function() {
                updateCheckboxStatus(this);
                if ($newCar.length > 0) {
                    updateNewCar($newCar);
                }
            });

            _this.click(function() {
                changeCheckboxStatus(this);
                if ($newCar.length > 0) {
                    updateNewCar($newCar);
                }
                return false;
            });

            function updateCheckboxStatus(obj) {
                var $checkbox = $(obj).children("input:checkbox");
                if (!!$checkbox.is(":checked")) {
                    $(obj).addClass(option.checkedClass);
                } else {
                    $(obj).removeClass(option.checkedClass);
                }
            }

            function changeCheckboxStatus(obj) {
                var $checkbox = $(obj).children("input:checkbox");
                if ($(obj).hasClass(option.checkedClass)) {
                    $(obj).removeClass(option.checkedClass);
                    $checkbox.prop("checked", false)
                } else {
                    $(obj).addClass(option.checkedClass);
                    $checkbox.prop("checked", true);
                }                
            }

            function updateNewCar($checkbox) {
                var $cardId = $("[name=licenseNo]", option.form);
                var v = $cardId.val();                
                if (!!$checkbox.is(":checked")){
                    $cardId.val(v + "*").attr("disabled", true);
                    if(option.disabledClassNeed){
                       $cardId.addClass(option.disabledClass);
                    }
                } else {
                    $cardId.val(!!v?v.replace(/\*/g, ""):"").removeAttr("disabled");
                    if(option.disabledClassNeed){
                       $cardId.removeClass(option.disabledClass);
                    }
                }
            }
        },
        menu : function(config){
        	var that = this,
        	options = {
        		submenu : this.attr("href")
        	};
        	options = $.extend({},options, config,this.data());
        	var $submenu = $(options.submenu);
        	this.click(function(){
						$submenu.slideToggle();
						return false;
			});
			var hideMenu=function() {
				$submenu.hide();
			}
			$(window).bind("scroll.menu",hideMenu);
        },
        slideAd : function(config){
        	var that = this,
        		options = {
        			delay : 3000,  //载入推迟时间
        			speed : 1500  //动画速度
        		};
        	var show = function(){
		    	  			that.slideDown(options.speed);  
		      			},
		      	hide = function(){
		    	  			that.slideUp(options.speed);  
		      			};

			setTimeout(show(),options.delay);

			//对触发关闭浮动广告的元素，添加关闭事件
			that.find('[data-dismiss = "slideAd"]').bind("click.slideAd",hide);

			$(window).bind("scroll.slideAd",hide);
        }
});
// 插件初始化部分，采用bootstrap风格
$(function(){
	$("[data-toggle='menu']").length && $("[data-toggle='menu']").menu(); //下拉菜单menu初始化
	$("[data-role='tabParent']").length && $("[data-role='tabParent']").tabs() ||
	$("[data-toggle='tab']").length && $("[data-toggle='tab']").tabs();  //tab页签初始化，支持tab页签本身和tab页签的父元素
	$("[data-toggle='slideAd']").length && $("[data-toggle='slideAd']").slideAd();  //浮动广告插件初始化
});
