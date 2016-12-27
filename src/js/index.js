/**
 * 轮播图
 * timer：2016年12月24日
 * author：qiubl
 */
(function (window,undefined) {

	function carousel (obj){
		this.translateX = 20;
		this.speed = 300;
		this.count = 0;
		this.total = 0;
		this._total_wide = 0;
		this.startX = 0;
		this.startX = 0;
		this.startY = 0;
		this.endX = 0;
		this.endY = 0;
		this.moveX = 0;
		this.moveY = 0;
		this.rangeX = 0;
		this.distance = 0; //当前 translateX 的 值
		this.translate3d = /\.*translateX\((.*)px\)/i;
	};
	carousel.prototype = {
		init: function(e) {

			var self = this;

			var wide = window.screen.width,
				height = document.querySelector(".carousel").offsetHeight,
				left = document.querySelector(".carousel-slide").offsetLeft;
			this._total_wide = wide + left;

			var list = document.getElementsByClassName("carousel-slide");
			this.total = list.length;
			console.log(this.total);
			for (var i = 0; i < list.length; i++) {
				list[i].style["width"] = wide + "px";
			}

			var carousel = document.querySelector(".carousel-content");
			carousel.style["webkitTransform"] = carousel.style["transform"] = "translateX(-20px)"
			carousel.style["width"] = this.total * this._total_wide + "px";

			carousel.addEventListener("touchstart", function(e) {
				self.touchStart(e);
			});
			carousel.addEventListener("touchmove", function(e) {
				self.touchMove(e);
			});
			carousel.addEventListener("touchend", function(e) {
				self.touchEnd(e);
			});


		},
		touchStart: function(e) {
			e.preventDefault();
			this.startX = e.targetTouches[0].pageX;
			this.startY = e.targetTouches[0].pageY;
			var carousel = document.querySelector(".carousel-content");
			// 当前 webkitTransform 的值
			this.distance = this.translate3d.exec(carousel.style["webkitTransform"])[1];
		},
		touchMove: function(e) {
			e.preventDefault();
			this.moveX = e.changedTouches[0].pageX;
			this.moveY = e.changedTouches[0].pageY;
			this.rangeX = this.startX - this.moveX;

			if (this.startY - this.moveY > 30 || this.startY - this.moveY < -30) {
				return;
			}

			var move = (parseFloat(this.distance) - this.rangeX);
			var carousel = document.querySelector(".carousel-content");
			carousel.style["webkitTransform"] = carousel.style["transform"] = "translateX(" + move + "px)";

		},
		touchEnd: function(e) {
			e.preventDefault();
			this.endX = e.changedTouches[0].pageX;
			this.endY = e.changedTouches[0].pageY;
			var carousel = document.querySelector(".carousel-content");
			var direction = this.getDirection(this.startX, this.endX, this.startY, this.endY);

			if (direction == 3) {
				this.touchRight();
			} else if (direction == 4) {
				this.touchLeft();
			} else if (direction == 0) {
				this.animateEnd(carousel,this.distance,this.count);
			}
			console.log(this.count);
		},
		/**
		 * [getAngle description]返回角度
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		getAngle: function(dy, dx) {
			return Math.atan2(dy, dx) * 180 / Math.PI;
		},
		/**
		 * [getDirection description] 获取滑动方向
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		getDirection: function(startX, endX, startY, endY) {
			var dx = endX - startX;
			var dy = endY - startY;

			var result = 0;

			if (startX == endX && startY == endY) {
				result = 5;
				return result;
			}

			if (Math.abs(dx) < 150 && Math.abs(dy) < 150) {
				return result;
			}

			var angle = this.getAngle(dy, dx);

			if (angle >= -45 && angle < 45) {
				result = 4;
			} else if (angle >= 45 && angle < 135) {
				result = 1;
			} else if (angle >= -135 && angle < -45) {
				result = 2;
			} else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
				result = 3;
			}

			return result;
		},
		/**
		 * [touchLeft description] 做滑动
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		touchLeft: function(e) {
			var carousel = document.querySelector(".carousel-content");
			if(this.count<=0){
				this.animateEnd(carousel,-this.translateX,this.count);
				return ;
			}else{
				--this.count;
				var tmp = -this._total_wide * this.count-this.translateX;
				this.animateEnd(carousel,tmp,this.count);
			}
		},
		/**
		 * [touchRight description] 又滑动
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		touchRight: function(e) {
			var tmp = -this._total_wide * this.count-this.translateX;
			var carousel = document.querySelector(".carousel-content");
			if(this.count>=this.total-1){
				this.animateEnd(carousel,tmp,this.count);
				return ;
			}else{
				++this.count;
				tmp = -this._total_wide * this.count-this.translateX;
				this.animateEnd(carousel,tmp,this.count);
			}
		},
		animateEnd:function(elem,move,count){
			console.log(count);
			elem.style["webkitTransitionDuration"] = elem.style["transitionDuration"] = this.speed+"ms";
			elem.style["webkitTransform"] = elem.style["transform"] = "translateX("+move+"px)";
			elem.addEventListener("webkitTransitionEnd",function(){
				console.log("动画执行完毕！");
				elem.style["webkitTransitionDuration"] = elem.style["transitionDuration"] = "0ms";
				var list = document.querySelectorAll(".carousel-pagination-bullet");
				for(var i = 0 ; i < list.length; i++){
					if(list[i].className.indexOf("actived") >= 0){
						list[i].className = "carousel-pagination-bullet";
						list[count].className = "carousel-pagination-bullet actived";
					}
				}
			})
		}
	}
	var me = new carousel();
	me.init();
})(window)
