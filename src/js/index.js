/**
 * 轮播图
 * timer：2016年12月24日
 * author：qiubl
 */
(function (window,undefined) {

	function carousel (){};
	/**
	 * 变量
	 */
	// var wide,
	// 	height,
	// 	totalLength, 
	// 	totalNumber;
	
	carousel.prototype = {

		startX:0,
		startY:0,
		endX:0,
		endY:0,
		moveX:0,
		moveY:0,

		translate3d: /\.*translate3d\((.*)px,(.*)px,(.*)px\)/i,

		matrix: /\.*matrix\((.*),(.*),(.*),(.*),(.*),(.*)\)/i,

		init:function(e){
			var self = this;
			
			var wide = window.screen.width,
				height = document.querySelector(".carousel").offsetHeight,
				left = document.querySelector(".carousel-slide").offsetLeft,
				_total_wide = wide + left;
				console.log(_total_wide)
				console.log(wide)
				console.log(left)

			var list = document.getElementsByClassName("carousel-slide");

			for(var i = 0; i< list.length ; i++){
				list[i].style.width = wide + "px";
			}

			document.querySelector(".carousel-content").style.width = list.length *  _total_wide + "px";

		},
		touchStart:function(e){
			e.preventDefault();
			self.startX = e.targetTouches[0].pageX;
			self.startY = e.targetTouches[0].pageY;
			// 当前 left 的值
			if($("#special-div").css("-webkit-transform").indexOf('translate3d') >=0){
			    self.distance =  translate3d.exec($("#special-div").css("-webkit-transform"))[1].trim();
			}
			if($("#special-div").css("-webkit-transform").indexOf('matrix') >=0){
			    self.distance =  matrix.exec($("#special-div").css("-webkit-transform"))[5].trim();
			}
		},
		touchMove:function(e){
			e.preventDefault();
			self.moveX = e.changedTouches[0].pageX;
			self.moveY = e.changedTouches[0].pageY;
			self.rangeX = self.startX-self.moveX;
			var tmp = Math.ceil(self.distance-self.rangeX);

			$("#special-div").css({
				'transition-duration':'0ms',
				'transform': "translate3d("+tmp+"px, 0px, 0px)",
				'-webkit-transition-duration':'0ms',
				'-webkit-transform':"translate3d("+tmp+"px, 0px, 0px)"
			});
		},
		touchEnd:function(e){
			e.preventDefault();
	       self.endX = e.changedTouches[0].pageX;
	       self.endY = e.changedTouches[0].pageY;

	       var direction = getDirection(self.startX,self.endX,self.startY,self.endY);

	       if(direction == 3) {
	           self.touchRight();
	       }else if ( direction == 4){
	           self.touchLeft();
	       }else if (direction == 0){
	           $("#special-div").css({
	               'transition-duration':'300ms',
	               'transform': "translate3d(-"+self.count*self.w+"px, 0px, 0px)",
	               '-webkit-transition-duration':'300ms',
	               '-webkit-transform':"translate3d(-"+self.count*self.w+"px, 0px, 0px)"
	           });
	           // $$("#special-div").stop().animate({"left":'-'+self.count*self.w+"px"},300)
	       }else if (direction == 5){
	           self.$route.router.go($(this).find('dl').eq(self.count).data("href"));
	       }
		},
		/**
		 * [getAngle description]返回角度
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		getAngle:function(dy,dx){
 			return Math.atan2(dy,dx)*180/Math.PI;
		},
		/**
		 * [getDirection description] 获取滑动方向
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		getDirection:function(startX,endX,startY,endY){
			var dx = endX - startX;
			var dy = endY - startY;

			var result = 0;

			if(startX == endX && startY == endY){
			    result = 5;
			    return result;
			}

			if( Math.abs(dx) < 150 && Math.abs(dy) < 150 ){
			    return result;
			}

			var angle = getAngle(dy,dx);

			if (angle >= -45 && angle < 45) {
			    result = 4;
			} else if (angle >= 45 && angle < 135) {
			    result = 1;
			} else if (angle >= -135 && angle < -45) {
			    result = 2;
			}
			else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
			    result = 3;
			}

			return result;
		},
		/**
		 * [touchLeft description] 做滑动
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		touchLeft:function(e){
			var self = this;
			--self.count;
			$("#special-div").css({
			    'transition-duration':'300ms',
			    'transform': "translate3d(-"+self.count*self.w+"px, 0px, 0px)",
			    '-webkit-transition-duration':'300ms',
			    '-webkit-transform':"translate3d(-"+self.count*self.w+"px, 0px, 0px)"
			});
			
			if(self.count<=0){
			    // $$("#special-div").animate({"transform":"-"+ self.count*self.w+"px","-webkit-transform":"-"+ self.count*self.w+"px"},0);
			    setTimeout(function(){
			        if(!$$("#special-div").is(":animated")){
			            self.count=2;
			            $("#special-div").css({
			                'transition-duration':'0ms',
			                'transform': "translate3d(-"+self.count*self.w+"px, 0px, 0px)",
			                '-webkit-transition-duration':'0ms',
			                '-webkit-transform':"translate3d(-"+self.count*self.w+"px, 0px, 0px)"
			            });
			        }
			    },300)
			   
			}
		},
		/**
		 * [touchRight description] 又滑动
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		touchRight:function(e){
			var self = this;
			++self.count;
			$("#special-div").css({
			    'transition-duration':'300ms',
			    'transform': "translate3d(-"+self.count*self.w+"px, 0px, 0px)",
			    '-webkit-transition-duration':'300ms',
			    '-webkit-transform':"translate3d(-"+self.count*self.w+"px, 0px, 0px)"
			});
			if(self.count >= 4){
			   
			    setTimeout(function(){
			        if(!$$("#special-div").is(":animated")){
			            self.count=2;
			            $("#special-div").css({
			                'transition-duration':'0ms',
			                'transform': "translate3d(-"+self.count*self.w+"px, 0px, 0px)",
			                '-webkit-transition-duration':'0ms',
			                '-webkit-transform':"translate3d(-"+self.count*self.w+"px, 0px, 0px)"
			            });
			        }
			    },300)
			}
		}
	}
	new carousel().init();
})(window)
