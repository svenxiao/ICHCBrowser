layui.use(['layer', 'element','laypage'], function(){
  var element = layui.element(); //导航的hover效果、二级菜单等功能，需要依赖element模块
  
  //监听导航点击
  element.on('nav(demo)', function(elem){
  	debugger;
    if (elem.text().trim()=="官方网站") {
    	window.location.href="https://www.feiyicoin.com";
    }else if (elem.text().trim()=="区块列表") {
    	debugger;
    	window.location.href="blocklist.html";
    }
  });

function fomartTime(tm) {    
	var newDate = new Date();
	newDate.setTime(tm * 1000);
	return newDate.format('yyyy-MM-dd hh:mm:ss');
};     
Date.prototype.format = function(format) {
       var date = {
              "M+": this.getMonth() + 1,
              "d+": this.getDate(),
              "h+": this.getHours(),
              "m+": this.getMinutes(),
              "s+": this.getSeconds(),
              "q+": Math.floor((this.getMonth() + 3) / 3),
              "S+": this.getMilliseconds()
       };
       if (/(y+)/i.test(format)) {
              format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
       }
       for (var k in date) {
              if (new RegExp("(" + k + ")").test(format)) {
                     format = format.replace(RegExp.$1, RegExp.$1.length == 1
                            ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
              }
       }
       return format;
};
function getBlockList(_pageIndex){
	//loading层
	layer.load(1, {
		ade: [0.1,'#fff'] //0.1透明度的白色背景
	});
	try {
        $.ajaxSetup({
            error: function (x, e) {
            	layer.closeAll('loading');

                layer.msg('系统异常，稍后重试');
                window.location.href="404.htm"
                return false;
            }
        });
	    var url = 'http://127.0.0.1:8080/ICHCBrowser/block/getblockList';  
		$.getJSON(url, {"pageIndex":_pageIndex}, function(data){  
			layer.closeAll('loading');
			if (data&&data.status==0) {
				$("#blockList").html("");
				var results = data.resultList;
	      		var htmStr='<table class="layui-table" lay-skin="nob" lay-even="" style="width: 90%;margin: 20px 10px 10px 5%;"><colgroup><col width="150"><col width="200"><col width="100"><col width="500"><col width="100"></colgroup><thead>'+
	    		'<tr><th>高度</th><th>时间</th><th>交易数</th><th>哈希值</th><th>大小（kB）</th></tr></thead><tbody>';
	         	for (var i = 0;  i < results.length; i++) {
	            	var resultItem=results[i];
	              htmStr+='<tr><td>'+resultItem.height+'</td><td>'+fomartTime(resultItem.time)+
	              '</td><td>'+resultItem.tx.length+'</td><td><a href="blockinfo.html?hash='+resultItem.hash+'" style="color: #1E9FFF;">'+resultItem.hash+
	              '</a></td><td>'+resultItem.size+'</td></tr>';
	            }
	            htmStr+= '</tbody></table>';
	 			$("#blockList").html(htmStr);
	 			layui.laypage({
			      cont: 'page1', //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
			      pages: data.pageCount, //通过后台拿到的总页数
			      curr: function(){ //通过url获取当前页，也可以同上（pages）方式获取
				    var page = location.search.match(/page=(\d+)/);
				    return page ? page[1] : 1;
				  }(), //当前页
			      jump: function(obj, first){ //触发分页后的回调
			      	if(!first){ //一定要加此判断，否则初始时会无限刷新
			        	location.href = '?page='+obj.curr;
			      	}
			      }
			    });
	 			
			}else{
				layer.msg(data.message);
			}
	    }); 
    }
    catch (ex) {
    	layer.closeAll('loading');
        layer.msg('系统异常，稍后重试');
    }
	
};

$(document).ready(function(){
	var page1 = location.search.match(/page=(\d+)/);
    var page = page1 ? page1[1] : 1;
	getBlockList(page);
});

$("#topClick").click(function(){
	document.body.scrollTop = document.documentElement.scrollTop = 0;
});

$("#search").click(function(){
	var value = $("#iuputValue").val();
	var strLst ="123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
	var r = /^\+?[1-9][0-9]*$/;
	if (r.test(value)) {
		if(value.length<10){
			getBlockByNum(value);
		}else{
			layer.msg("您输入的高度值太大！");
		}		
	}else{
		if (value.length == 34 || value.length == 64) {
			if (value.length == 34 ) {
				window.location.href='addressinfo.html?address='+value;
			}else{
				window.location.href='blockinfo.html?hash='+value;
			}
		}else{
			layer.msg("您输入的值不准确！");
		}
	}
});

function getBlockByNum(param){
//loading层
	layer.load(1, {
		ade: [0.1,'#fff'] //0.1透明度的白色背景
	});
	try {
        $.ajaxSetup({
            error: function (x, e) {
            	layer.closeAll('loading');

                layer.msg('系统异常，稍后重试');
                window.location.href="404.htm"
                return false;
            }
        });
	    var url = 'http://127.0.0.1:8080/ICHCBrowser/block/getBlockByHeight'; 
	    debugger; 
		$.getJSON(url, {"height":param}, function(data){  
			layer.closeAll('loading');
			if (data&&data.status==0) {
				debugger;
	 			var results = data.result;
	 			var hash = results.hash;
	 			window.location.href='blockinfo.html?hash='+hash;
			}else{
				layer.msg(data.message);
			}
	    }); 
    }
    catch (ex) {
    	layer.closeAll('loading');
        layer.msg('系统异常，稍后重试');
    }
}

});
