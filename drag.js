/**
 * created by zhudan 2017/11/01
 * [Drag 拖拽对象v1.0]
 * @param {[type]} head   [头部]
 * @param {[type]} target [目标元素]
 */
function Drag(head, target) {
    this.head = head;
    this.target = target;
    this.currentX = 0;
    this.currentY = 0;
    this.isDrag = false;
    this.top = 0;
    this.left = 0;
}
/**
 * [addEventListener 事件绑定]
 * @param {[type]} el      [事件源]
 * @param {[type]} type    [事件类型]
 * @param {[type]} handler [事件处理函数]
 */
Drag.prototype.addEventListener = function(el, type, handler) {
    if (el.addEventListener) {
        el.addEventListener(type, handler, false);
    } else if (el.attachEvent) {
        el.attachEvent("on" + type, handler);
    } else {
        el["on" + type] = handler;
    }
}
/**
 * [removeEventListener 事件移除]
 * @param  {[type]} el      事件源]
 * @param  {[type]} type    事件类型]
 * @param  {[type]} handler [绑定的事件处理函数]
 * @return {[type]}         [description]
 */
Drag.prototype.removeEventListener = function(el, type, handler) {
    if (el.removeEventListener) {
        el.removeEventListener(type, handler, false);
    } else if (el.detachEvent) {
        el.detachEvent("on" + type, handler);
    } else {
        el["on" + type] = null;
    }
}
/*
 * 获取元素样式
 */
Drag.prototype.getCss = function(el, style) {
    return window.getComputedStyle ? window.getComputedStyle(el, null)[style] : el.currentStyle[style];
}

/**
 * [drag 拖拽效果]
 * @param  {Function} callback [获取弹出框实时移动的坐标]
 * @return {[type]}            [description]
 */
Drag.prototype.drag = function(callback) {
    var _this = this,
        clientW = document.documentElement.clientWidth || document.body.clientWidth,
        clientH = document.documentElement.clientHeight || document.body.clientHeight,
        domW = dom.offsetWidth,
        domH = dom.offsetHeight;
    function move(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        var e = e || window.event;
        if (_this.isDrag) {
            var x = e.clientX,
                y = e.clientY,
                deltaX = x - _this.currentX,
                deltaY = y - _this.currentY,
                endX = parseFloat(_this.left) + deltaX,
                endY = parseFloat(_this.top) + deltaY;
            if (endX <= 0) {
                endX = 0;
            } else if (endX >= clientW - domW) {
                endX = clientW - domW;
            }
            if (endY <= 0) {
                endY = 0;
            } else if (endY >= clientH - domH) {
                endY = clientH - domH;
            }
            _this.target.style.left = endX + "px";
            _this.target.style.top = endY + "px";
            if (typeof callback == "function") {
                callback(endX, endY);
            }
            return false;
        }
    }
     if (this.getCss(this.target, "left") !== "auto") {
        this.left = this.getCss(this.target, "left");
    }
    if (this.getCss(this.target, "top") !== "auto") {
        this.top = this.getCss(this.target, "top");
    }
    this.addEventListener(this.head, "mousedown", function(e) {
        _this.isDrag = true;
        _this.currentX = e.clientX;
        _this.currentY = e.clientY;
        _this.addEventListener(document, "mousemove", move, false);
    }, false);

    this.addEventListener(document, "mouseup", function() {
        _this.isDrag = false;
        _this.removeEventListener(document, "mousemove", move, false);
        if (_this.getCss(_this.target, "left") !== "auto") {
            _this.left = _this.getCss(_this.target, "left");
        }
        if (_this.getCss(_this.target, "top") !== "auto") {
            _this.top = _this.getCss(_this.target, "top");
        }
    }, false);

    this.addEventListener(window, "resize", function() {
        clientW = document.documentElement.clientWidth || document.body.clientWidth;
        clientH = document.documentElement.clientHeight || document.body.clientHeight;
    }, false);
}