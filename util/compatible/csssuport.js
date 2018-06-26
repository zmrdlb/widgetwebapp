/**
 * @fileoverview css支持情况判断。主要用于浏览器兼容
 * @version 1.0 | 2015-08-31 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return
 * @example
 * requirejs(['libcompatible/csssuport'],function($csssuport){
 * 	 $csssuport.fixed;
 * });
 * */
define(function(){
	var _div = document.createElement('div');
	return {
		//是否支持position:fixed定位
		fixed: !('undefined' == typeof(document.body.style.maxHeight) || (document.compatMode !== "CSS1Compat" && /msie/.test(navigator.userAgent.toLowerCase()))),
		//是否支持transition
		transition: !(_div.style.transition == undefined),
		//是否支持transform
		transform: !(_div.style.transform == undefined)
	};
});
