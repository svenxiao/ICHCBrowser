layui.use(['layer', 'element','laypage'], function(){
  var element = layui.element(); //导航的hover效果、二级菜单等功能，需要依赖element模块
  
  //监听导航点击
  element.on('nav(demo)', function(elem){
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

function getAddressInfo(param){
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
	    var url = 'http://127.0.0.1:8080/ICHCBrowser/block/searchByAddress'; 
	    debugger; 
		$.getJSON(url, {"address":param}, function(data){  
			layer.closeAll('loading');
			if (data&&data.status==0) {
				debugger;
	 			var results = data.result;
	 				var htmlStr='<fieldset class="layui-elem-field" style="width: 95%;margin: 10px 10px 10px 2.5%;">'+
					  '<legend>地址</legend>'+
					  '<div class="layui-field-box" style="width: 45%;float: left;">'+
					    '<br>'+
					    '&nbsp; '+results.address+
					    '<hr>'+
					  '</div>'+
					  '<div class="layui-field-box" style="    width: 45%;float: left;">'+
					  '<br>'+
					  '最后一次交易时间：'+(results.lasttime>=0?fomartTime(results.lasttime):"无")+' '+
					    '<hr>'+
					    '总收款：'+results.receivedamount+' ICHC'+
					    '<hr>'+
					    '交易次数: '+results.txcount+
					    '<hr>'+
					    '余额: 暂不提供查询(可追溯交易记录自行预估)'+
					    '<hr>'+
					  '</div>'+
					'</fieldset>';

					$("#blockinfo").html(htmlStr);
					var txlst = results.addresstxlst;
					var str = new Array();  
					for (var i = 0; i < txlst.length; i++) {
						str[i]=txlst[i];
					}
					// var param={"txidLst":txlst};
					if (str.length>0) {getBlockTransactionList(str);}
			}else{
				layer.msg(data.message);
				// window.history.back();
			}
	    }); 
    }
    catch (ex) {
    	layer.closeAll('loading');
        layer.msg('系统异常，稍后重试');
    }
}

function getBlockTransactionList(param){
	debugger;
	//loading层
	layer.load(1, {
		ade: [0.1,'#fff'] //0.1透明度的白色背景
	});
	try {
        $.ajaxSetup({
            error: function (x, e) {
            	layer.closeAll('loading');
				debugger;
                layer.msg('系统异常，稍后重试');
                window.location.href="404.htm"
                return false;
            }
        });
	    var url = 'http://127.0.0.1:8080/ICHCBrowser/block/getBlockTransactionList'; 
	    debugger; 
		$.post(url, {'txidLst':param}, function(data){  
			layer.closeAll('loading');
			if (data&&data.status==0) {
				debugger;
	 			var results = data.resultList;
	 				var htmlStr1='<fieldset class="layui-elem-field" style="width: 95%;margin: 30px 10px 30px 2.5%;">'+
					  '<legend>交易</legend>';
					  for (var i = 0; i < results.length; i++) {
					  	htmlStr1+='<table class="layui-table" lay-skin="nob" style="width: 98%;margin: 5px 5px 5px 1%;">'+
							      '<colgroup><col ><col ></colgroup>'+
							      '<thead><tr>'+
							      '<th><a href="blockinfo.html?hash='+results[i].txid+'" style="color: #1E9FFF;">'+results[i].txid+'</a></th>'+
							      '<th style="float: right;">'+fomartTime(results[i].time)+'</th></tr></thead>'+
					  			  '<tbody>'+
					  			  '<tr>';
					  	var htmlStr2='<td>';
					  	var vinLst=results[i].vin;
					  	var voutArr=results[i].vout;
					  	// var vinoutval=0;
					  	var voutval=0;
					  	for (var j  = 0; j < vinLst.length; j++) {
					  		var vinout=vinLst[j].voutLst;
					  		if(vinout){
					  			for (var k = 0; k < vinout.length; k++) {
						  			// vinoutval+=vinout[k].value;
						  			var addresseslst=vinout[k].addresses;
						  			if(addresseslst){
						  				for (var h = 0; h < addresseslst.length; h++) {
						  				htmlStr2+='<a href="addressinfo.html?address='+addresseslst[h]+'" style="color: #1E9FFF;">'+addresseslst[h]+'</a><br>';
						  				}
						  			}
					  								  			
					  			}
					  		}else{
					  			htmlStr2+='挖矿交易<br>';
					  		}
					  		
					  	}
					  	htmlStr2+='</td><td style="float: right;">';
					  	for (var s  = 0; s < voutArr.length; s++) {
					  		voutval+=voutArr[s].value;
					  		var outaddrlst=voutArr[s].addresses;
					  		if(outaddrlst){
					  			for (var h = 0; h < outaddrlst.length; h++) {
					  			htmlStr2+='<a href="addressinfo.html?address='+outaddrlst[h]+'" style="color: #1E9FFF;">'+outaddrlst[h]+'</a>       '+voutArr[s].value+' ICHC <br>'
					  			}
					  		}else{
					  			htmlStr2+='  —————————— <br>';
					  		}
					  		
					  	}
					  	htmlStr2+='</td></tr>';
						htmlStr1+=htmlStr2;
        			htmlStr1+='<tr><td></td><td style="float: right;">'+voutval+' ICHC</td></tr></tbody></table>';

					  }

					var htmls = $("#blockinfo").html();
					htmls+=htmlStr1;
					$("#blockinfo").html(htmls);

	 			
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


function GetRequest() { 
	var url = location.search;
	var theRequest = new Object(); 
	if (url.indexOf("?") != -1) { 
	var str = url.substr(1); 
	strs = str.split("&"); 
	for(var i = 0; i < strs.length; i ++) { 
	theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]); 
	} 
	} 
	return theRequest; 
} 

$(document).ready(function(){
	var params = GetRequest();
	var address = params.address;
	if (!address) {window.history.back();}
	getAddressInfo(address);
});

$("#topClick").click(function(){
	document.body.scrollTop = document.documentElement.scrollTop = 0;
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
};

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

});
