/*
 * popMobile.js
 * 移动端弹出层插件
 * 采用bootstrap风格
 * by Hao Zhenjia 2016-01-06
 */

!(function($) {
    'use strict';
    // 弹出层核心功能函数
    var Popup = function(element, options) {
        this.options = options
        this.isShown = null;
        this.$backdrop = null;
        this.$box = null;
        this.$element = $(element);        
    }

    Popup.DEFAULTS = {
        backdrop: true, //点击遮罩层关闭弹窗  
        show: true, //是否立即打开
        type: "top", //弹窗定位类型，可选"top","middle","bottom"
        animate : true
    }

    Popup.prototype = {
        toggle: function() {
            return this.isShown ? this.close() : this.open(_relatedTarget)
        },
        open: function(_relatedTarget) {
            var that = this;
            if (this.isShown) return;
            this.isShown = true;
            this.backdrop();
            //this.options.animate && !this.$element.hasClass('fade') && this.$element.addClass("fade");
            this.$box.show();            
            this.$element.show();
            //this.options.animate && this.$element.addClass("in");
            this.setPos();
            this.resize();
            this.$element.find("[data-miss='popup']").on("click.dismiss.pm.popup", function(event) {
                event.stopPropagation();
                that.close();
            });
        },
        close: function() {
            if (!this.isShown) return;
            this.isShown = false;
            this.backdrop();
//          this.options.animate && this.$element.removeClass("in");
            this.$element.hide();            
            this.$box.hide();
            this.$element.off("click.dismiss.pm.popup");
        },
        backdrop: function() {
            var that = this;
            this.$box = this.$box || this.$element.parent("._dialog_div_wrapper" ).length ?
                this.$element.parent("._dialog_div_wrapper") : this.$element.wrap('<div class="_dialog_div_wrapper"></div>').parent("._dialog_div_wrapper");
            this.$backdrop = this.$backdrop && this.$backdrop.length > 0 ?
                this.$backdrop : $('<div class="_dialog_div_mask" />').insertAfter(this.$box);
            if (this.isShown) {
                this.$backdrop.show();
                if (this.options.backdrop) {
                    this.$backdrop.on("click.backdrop.pm.popup", function() {
                        that.close();
                    });
                }
            } else {
                this.$backdrop.hide();
                if (this.options.backdrop) {
                    this.$backdrop.off("click.backdrop.pm.popup");
                }
            }
        },
        setPos: function() {
            switch (this.options.type) {
                case "middle":
                    var height = this.$element.height();
                    var offtop = $(window).height() > height ? Math.floor(+($(window).height() - height) / 4) : 0;
                    this.$box.css({
                        "top": offtop + "px"
                    });
                    break;
                case "bottom":
                    this.$box.removeClass("top").addClass("bottom");
                    break;
                default:
                    this.$box.removeClass("bottom").addClass("top");
                    break;
            }

        },
        resize: function() {
            var that = this;
            if (this.isShown) {
                $(window).on('resize.pm.popup', function() {
                    that.setPos();
                })
            } else {
                $(window).off('resize.pm.popup')
            }
        },
        loadHtml : function(){
            if (!this.options.remote) return;
            var result,
                element = this.$element.selector;
            $.ajax({
                url: this.options.remote,
                async: false,
                success: function(html) {
                    result = this.$element = $(html).filter(element).appendTo("body");
                }
            });
            return result; 
        }
    }
    
    var old = $.fn.popup;

    $.fn.popup = function(option, _relatedTarget) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('pm.popup')
            var options = $.extend({}, Popup.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data){
                data = new Popup(this, options);
                if(!data.$element.length){
                    data.$element = data.loadHtml();
                }
                $this.data('pm.popup', data);
            } 
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.open(_relatedTarget)
        })
    }
    $.fn.popup.Constructor = Popup

    $.fn.popup.noConflict = function() {
        $.fn.popup = old
        return this
    }
    
    var Dialog = window.Dialog = function(element,config,option){             
        var popup = $(element).data('pm.popup');
        if(!popup){
            popup = new Popup(element, $.extend(Popup.DEFAULTS, config));
            popup.$element = popup.loadHtml(element);
            popup.$element.data('pm.popup',popup);
        }
        popup[option]();
    };   

        $(document).on('click.pm.popup.data-api', '[data-toggle="popup"]', function(e) {
            var $this = $(this)
            var href = $this.attr('href')
            var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
            var option = $target.data('pm.popup') ? 'toggle' : $.extend({
                remote: !/#/.test(href) && href
            }, $target.data(), $this.data())
      
            if ($this.is('a')) e.preventDefault()
      
            $target.popup(option, this);
            //Plugin.call($target, option, this)
        })
})(jQuery);