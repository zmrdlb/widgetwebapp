/**
 * Copyright (c) 2015 - 2016, Sina Inc. All rights reseved.
 * @fileoverview
 *   懒加载监听lazyload类
 * @author mingrui| mingrui@staff.sina.com.cn
 * @version 1.0 | 2016-07-28
 * @example
 *  var loading = false;
 *  var lazyload = new Lazyload({
 * 		container: $(window),
 *      //首次filter必须返回true
        filter: function(){return !loading;}
        call: function(isfirst){

            //请求接口
            loading = true;

            //接口返回
             if(isfirst){
                  //说明是组件初始化首次触发
             }

             var more = 1|0; //接口返回是否还有更多数据

             if(more == 1){
                  loading = false;
                  lazyload.check();
             }else{
                 lazyload.destroy();
             }
        }
 *  });
 *
 *  重要说明：由于框架是单页应用。所以在onHide的时候要调用this.lazyload.destroy()来销毁。如：
 *          this.on('onShow',function(){
 *              this.lazyload = ***
 *          });
            this.on('onHide', function () {
                this.lazyload.destroy();
            });
 */
define(function(){
  /**
   * 懒加载监听lazyload类
   * @param {Object} opt
     * {
     *   container {zepto dom} 表示监听该container的scroll，来绑定lazyload。默认是$(window)
     *   offset {Number} 偏移量 >0，选填项，默认50。
     *      offset > 0 当container底部距离container可视区域底部<=offest，就触发call
     *   call {Function} 回调，选填项。
     *   filter {Function} 过滤条件，选填项。
     *     如果filter返回true,则达到lazyload的条件时时会触发call回调，否则不触发。默认一直返回true。
     *     如果filter不是function类型，则使用默认方式返回true。
     *     初始化的时候，filter返回必须为true
     *   firstcheck {Boolean} true 组件初始化时，是否执行check方法。如果设置为false,则首次加载数据得用户调用fire()方法
     * }
   */
  function Lazyload(opt){
      //参数检测
      $.extend(this,{
          container: $(window),
          offset: 50,
          filter: function(){return true;},
          call: function(){},
          firstcheck: true
      },opt || {});

      if(this.container.size() == 0){
          throw new Error('lazyload传入的container节点无效');
      }

      if(this.container.get(0) == window){
          this.iswindow = true;
      }else{
          this.iswindow = false;
      }
      this.checkscroll = false; //是否是check检测引发的滚动
      this.isfirst = true; //是否是首次触发call
      if(this.firstcheck){
          this.check();
      }
      this.listenScroll();
  }

  /**
   * 组件初始化的时候、每次执行了call的时候，都要调用此方法检测container是否已经铺满数据。如果没有铺满，且filter()返回true，则执行call方法。
   * 这个方法为了解决：
   *    1. Lazyload创建时自动执行call请求数据
   *    2. 极限情况解决：如果第一次调用call，加载了2条数据，此时还没铺满container，则无法触发container的scroll事件，则无法执行lazyload
   */
  Lazyload.prototype.check = function(){
      if(!this.filter()){
          return;
      }
      var curtop = this.getScrollTop();
      if(curtop > 0){
          return;
      }else{
          this.checkscroll = true;
          this.setScrollTop(1);
          setTimeout($.proxy(function(){
              if(this.getScrollTop() == 0){
                  this.fire();
              }else{
                  this.setScrollTop(0);
              }
              this.checkscroll = false;
          },this),200);
      }
  };
  /**
   * 获取scrollTop
   */
  Lazyload.prototype.getScrollTop = function(){
      if(this.iswindow){
          return Math.max(document.documentElement.scrollTop,document.body.scrollTop);
      }else{
          return this.container.get(0).scrollTop;
      }
  };
  /**
   * 设置scrollTop
   */
  Lazyload.prototype.setScrollTop = function(top){
      if(this.iswindow){
          document.documentElement.scrollTop = top;
          document.body.scrollTop = top;
      }else{
         this.container.get(0).scrollTop = top;
      }
  };
  /**
   * 获取scrollHeight
   */
  Lazyload.prototype.getScrollHeight = function(){
      if(this.iswindow){
          return Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
      }else{
          return this.container.get(0).scrollHeight;
      }
  };
  /**
   * 触发执行call
   */
  Lazyload.prototype.fire = function(){
      if(this.filter()){
          this.call(this.isfirst);
          this.isfirst = false;
      }
  };
  /**
   * 监听scroll
   */
  Lazyload.prototype.listenScroll = function(){
      var timer = null, _this = this;
      function stop(){
           timer && clearTimeout(timer);
      }
      this.container.on('scroll.lazyload',function(e){
          if(_this.checkscroll){
              return;
          }
          stop();
          timer = setTimeout(function(){
              var canlazy = _this.container.height()+_this.container.scrollTop()+_this.offset >= _this.getScrollHeight();
              if(canlazy){
                  _this.fire();
              }
          }, 300);
      });
  };
  /**
   * 销毁
   */
  Lazyload.prototype.destroy = function(){
      this.container.off('scroll.lazyload');
  };
  return Lazyload;
});
