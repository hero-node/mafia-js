(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Hero"] = factory();
	else
		root["Hero"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Pants module.
	 * @module hero-js/API
	 */

	 /**
	  * Solves equations of the form a * x = b
	  * @description
	  ```
	  * import { Component, Boot } from 'hero-js';
	  *
	  * var defaultUIViews = {
	  *   version:0,
	  *   backgroundColor:'ffffff',
	  *   nav:{
	  *     title:'Home Page',
	  *     navigationBarHiddenH5:true,
	  *   },
	  *   views:
	  *   [
	  *     {
	  *       'class':'HeroWebView',
	  *       name:'webview',
	  *       frame:{w:'1x',h:'1x'}
	  *     },
	  *   ]
	  * }
	  * &#64Component({
	  *   view: defaultUIViews
	  * })
	  * export class DecoratePage {
	  *   &#64Boot
	  *   boot(){
	  *     console.log('Bootstrap Successfully!')
	  *   }
	  * }
	  ```
	  */

	var API = window.API = {};
	var _outObjects = '';
	var _currentPage = null;

	window.ui = {};
	window.ui2Data = {};

	var _deviceType = 'PC';

	function _mergeAttributes(o1, o2) {
	    var index;
	    var keys = Object.keys(o2);

	    for (index = 0; index < keys.length; index++) {
	        o1[keys[index]] = o2[keys[index]];
	    }
	    return o1;
	}

	function view2Data(observeUI) {
	    var i;

	    if (observeUI instanceof Array) {
	        for (i = 0; i < observeUI.length; i++) {
	            view2Data(observeUI[i]);
	        }
	    } else if (observeUI.subViews) {
	        view2Data(observeUI.subViews);
	    }
	    if (observeUI.name) {
	        window.ui2Data['_' + observeUI.name] = '';
	        window.ui2Data.__defineSetter__(observeUI.name, function (v) {
	            window.ui2Data['_' + observeUI.name] = v;
	            var data = { name: observeUI.name };

	            if (typeof v == 'string') {
	                data.text = v;
	            } else {
	                _mergeAttributes(data, v);
	                Object.keys(v).forEach(function (key) {
	                    data[key] = v[key];
	                });
	            }
	            API.out({ datas: data });
	        });
	        window.ui2Data.__defineGetter__(observeUI.name, function () {
	            return window.ui2Data['_' + observeUI.name];
	        });

	    }
	}


	/**
	 * JS代码往组件发送视图更新数据
	 * @param {Object} data - 需要更新的视图数据
	 */
	function sendMessage(data) {
	    var iframe;

	    if (_deviceType === 'IOS') {
	        _outObjects = data;
	        iframe = document.createElement('iframe');
	        iframe.setAttribute('src', 'hero://ready');

	        document.documentElement.appendChild(iframe);
	        iframe.parentNode.removeChild(iframe);
	        iframe = null;

	    } else if (_deviceType === 'IOS8') {
	        window.webkit.messageHandlers.native.postMessage(data);
	    } else if (_deviceType === 'ANDROID') {
	        if (typeof data === 'object') {
	            data = JSON.stringify(data);
	        }
	        window.native.on(data);
	    } else {
	        window.API.page.on(data);
	    }
	}


	function loop() {}

	function outObjects() {
	    var messages = '';

	    if (_outObjects) {
	        if (typeof _outObjects === 'string') {
	            messages = _outObjects;
	        } else {
	            messages = JSON.stringify(_outObjects);
	        }
	        _outObjects = '';
	    }

	    return messages;
	}

	// eslint-disable-next-line
	function __executeExpression(expression, data, page) {
	    // eslint-disable-next-line
	    return (function (expression, __data, __page, window, API) {
	        // eslint-disable-next-line
	        var value = eval('expression');
	        // eslint-disable-next-line
	        value = eval(value);
	        return value;
	    })(expression, data, page, null, null);
	}

	function onMessage(data) {
	    if (typeof (data) === 'string') {
	        data = JSON.parse(data);
	    }

	    if (data.name && data.value) {
	        window.ui2Data['_' + data.name] = data.value;
	    }
	    API.__beforeMessage.call(_currentPage, data);
	    Object.keys(API.__messageList).forEach(function (expressions) {
	        var matchCondition = __executeExpression(expressions, data, _currentPage);

	        if (matchCondition) {
	            API.__messageList[expressions].forEach(function (callback) {
	                callback.call(_currentPage, data);
	            });
	        }
	    });
	    API.__afterMessage.call(_currentPage, data);
	}
	/**
	 * 定义JS代码在执行消息回调方法之前需要执行的方法，参数同@Message
	 */
	function BeforeMessage(target, name, descriptor) {
	    API.__beforeMessage = target[name];
	    // Only one callback method
	    descriptor.writable = false;
	    return descriptor;
	}
	/**
	 * 定义JS代码在执行消息回调方法成功后需要执行的方法，参数同@Message
	 */
	function AfterMessage(target, name, descriptor) {
	    API.__afterMessage = target[name];
	    // Only one callback method
	    descriptor.writable = false;
	    return descriptor;
	}

	function definePublicFreezeProp(obj, name, value) {
	    Object.defineProperty(obj, name, {
	        enumerable: true,
	        configurable: false,
	        writable: false,
	        value: value
	    });
	}
	function defineProp(obj, name, value, isEnumerable) {
	    Object.defineProperty(obj, name, {
	        enumerable: !!isEnumerable,
	        configurable: false,
	        writable: true,
	        value: value
	    });
	}
	function defineReadOnlyProp(obj, name, value) {
	    Object.defineProperty(obj, name, {
	        enumerable: false,
	        configurable: false,
	        writable: false,
	        value: value
	    });
	}


	function resetUI(ui) {
	    window.ui = ui;
	}
	var emptyObject = {};

	/**
	 * 定义当前页面为一个组件，所指定的类将会被自动创建一个实例
	 * @param {object} config - 可以传入view参数，指定当前页面初始化时的界面数据
	 *
	 */
	function Component(config) {
	    return function (Target) {
	        if (!config) {
	            config = emptyObject;
	        }
	        if (config.view) {
	            defineProp(Target, '__defaultViews', config.view);
	            resetUI(config.view);
	        }
	        _currentPage = new Target();
	        if (typeof config === 'object') {
	            defineReadOnlyProp(API, '__heroConfig', config);
	        } else {
	            console.warn('Invalid Parameters: Parameters in @Component should be Object');
	        }
	    };
	}

	/**
	 * 定义当前页面在渲染之前的回调
	 */
	function ViewWillAppear(target, name, descriptor) {
	    API.__viewWillAppear = target[name];
	    // Only one callback method
	    descriptor.writable = false;
	    return descriptor;
	}

	/**
	 * 定义当前页面在离开之前的回调
	 */
	function ViewWillDisappear(target, name, descriptor) {
	    API.__viewWillDisppear = target[name];
	    // Only one callback method
	    descriptor.writable = false;
	    return descriptor;
	}

	/**
	 * 定义当前页面启动时的回调方法
	 */
	function Boot(target, name, descriptor) {
	    API.__boot = target[name];
	    // Only one boot callback method
	    descriptor.writable = false;
	    return descriptor;
	}

	/**
	 * 定义Native原生组件往JS代码发送消息时的回调方法，方法中的第一个参数为具体的消息内容
	 * 如@Message('__data && __data.type="myMessage"')
	 * @param {string} expressions - JS表达式，当该表达式执行结果为true时，会进入该回调，否则不进入该回调。
	 *  表达式中可以使用__data来引用该消息内容
	 */
	function Message(expressions) {
	    if (!API.__messageList[expressions]) {
	        API.__messageList[expressions] = [];
	    }
	    return function (target, name, descriptor) {
	        API.__messageList[expressions].push(target[name]);
	        return descriptor;
	    };
	}

	function getUI() {
	    return window.ui;
	}

	/**
	 *
	 * @return {object} 返回当前页面中的每个元素及组件的状态数据
	 */
	function getState() {
	    return window.ui2Data;
	}
	/**
	 * 设置当前页面中的元素及组件的状态
	 * @return {object} 对象中的key对应元素组件，value为更新后的值
	 */
	function setState(status) {
	    if (!status) {
	        return;
	    }
	    if (typeof status !== 'object') {
	        return;
	    }
	    Object.keys(status).forEach(function (key) {
	        window.ui2Data[key] = status[key];
	    });
	}


	function bootstrap() {

	    if (window.ui !== 'blank') {
	        sendMessage({ ui: window.ui });
	    }

	    if (window.ui && window.ui.views) {
	        view2Data(window.ui.views);
	    }

	    // var isRunInApp = (_deviceType === 'IOS' || _deviceType === 'ANDROID');

	    // setTimeout(function () {
	    API.__boot.call(_currentPage);
	    // }, isRunInApp ? 0 : 500);
	}

	function __viewWillDisppearCallback() {
	    API.__viewWillDisppear.call(_currentPage);
	}
	function __viewWillAppearCallback() {
	    API.__viewWillDisppear.call(_currentPage);
	}

	defineProp(API, '__heroConfig', {});
	defineProp(API, '__boot', loop);
	defineProp(API, '__viewWillDisppear', loop);
	defineProp(API, '__viewWillAppear', loop);

	definePublicFreezeProp(API, '__viewWillDisppearCallback', __viewWillDisppearCallback);
	definePublicFreezeProp(API, '__viewWillAppearCallback', __viewWillAppearCallback);

	defineProp(API, '__beforeMessage', loop);
	defineProp(API, '__afterMessage', loop);

	defineReadOnlyProp(API, '__messageList', {});

	definePublicFreezeProp(API, 'boot', bootstrap);
	// definePublicFreezeProp(API, 'bootstrap', bootstrap);
	definePublicFreezeProp(API, 'getState', getState);
	definePublicFreezeProp(API, 'getUI', getUI);
	definePublicFreezeProp(API, 'in', onMessage);
	definePublicFreezeProp(API, 'out', sendMessage);
	definePublicFreezeProp(API, 'outObjects', outObjects);
	definePublicFreezeProp(API, 'resetUI', resetUI);
	definePublicFreezeProp(API, 'setState', setState);
	definePublicFreezeProp(API, 'updateView', view2Data);


	(function getDeviceType() {
	    var ua = navigator.userAgent.toLowerCase();

	    if (ua.indexOf('hero-ios') !== -1) {
	        _deviceType = 'IOS';
	    } else if (ua.indexOf('hero-android') !== -1) {
	        _deviceType = 'ANDROID';
	    } else if (ua.indexOf('micromessenger') !== -1) {
	        _deviceType = 'WECHAT';
	    }
	})();

	module.exports = {
	    Component: Component,
	    Boot: Boot,
	    Message: Message,
	    ViewWillAppear: ViewWillAppear,
	    ViewWillDisappear: ViewWillDisappear,
	    BeforeMessage: BeforeMessage,
	    AfterMessage: AfterMessage,
	    Hero: API
	};


/***/ }
/******/ ])
});
;