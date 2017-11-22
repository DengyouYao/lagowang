$(function(){
	var img_src;
	var length;
	var data_id;
	var up_index;//获取修改数据的索引
	$.cookie.json=true;
	var currentPage=1;//获取点击的分页序号
	var user=$.cookie("username");
	dataLoad(currentPage);
	if (user) {
		$(".alert-info").addClass('hidden');
		$(".company_show").removeClass('hidden');
		var p=$(`<a href="#" class="" data-toggle="modal">你好：${user.username}</a>`);
		var p2=$(`<a href="#" class="logout" data-toggle="modal">注销</a>`);
		$(".header_right").children("li").first().html(p);
		$(".header_right").children("li").eq(1).html(p2);
		$(".logout").on('click',function(){
			$.cookie("username",null,{path:"/"});
			location.reload();				
		});
	}
	$.get('/api/selectnum',function(resData){
		if (resData.code) {
			length=resData.msg;				
		}
	}).done(function(){
		pagination(currentPage,Math.ceil(length/10));
		$("#pagination1").delegate("a",'click',function(){
			var index=$(this).attr('data-current');
			currentPage=index;
			dataLoad(currentPage);
		});			
	});
	$('#exampleModal').on('show.bs.modal', function (event) {
		var button = $(event.relatedTarget) 
		var recipient = button.data('whatever') 
		var modal = $(this)
		modal.find('.modal-title').text('New message to ' + recipient)
		modal.find('.modal-body input').val(recipient)
	});
	$('#exampleModa2').on('show.bs.modal', function (event) {
		var button = $(event.relatedTarget) 
		var recipient = button.data('whatever')
		var modal = $(this)
		modal.find('.modal-title').text('New message to ' + recipient)
		modal.find('.modal-body input').val(recipient)
	});

	//实现注册
	$(".regist_btn").on('click',function(event){
		event.preventDefault();
		var username=$("#r_username").val().trim(),
			password=$("#r_password").val().trim(),
			repassword=$("#re_password").val().trim(),
			email=$("#r_email").val().trim();
		var parms={};
		parms.username=username;
		parms.password=password;
		parms.email=email;
		if (!username) {
			alert("请输入用户名");
			return;
		}
		if (!password) {
			alert("请输入密码");
			return;
		}
		if (password!=repassword) {
			alert("两次输入密码不一致");
			return;
		}
		$.post('/api/register',parms,(resData)=>{
			if (resData.code==1) {
				console.log(resData.msg);
				$("#exampleModal2").removeClass("in");
				$(".modal-backdrop").removeClass("in");
			}
		});
	});
	//实现登录
	$(".login_btn").on('click',function(event){
		event.preventDefault();
		var username=$("#l_username").val().trim(),
			password=$("#l_password").val().trim();
		var parms={};
		parms.username=username;
		parms.password=password;
		if (!username || !password) {
			alert("用户名或密码不能为空");
			return;
		}
		$.post('/api/login',parms,(resData)=>{
			if (resData.code==0) {
				alert(resData.msg);
				return;
			}
			if (resData.code==1) {
				alert(resData.msg);
				user=username;
				var p=$(`<a href="#" class="" data-toggle="modal">你好：${username}</a>`);
				var p2=$(`<a href="#" class="logout" data-toggle="modal">注销</a>`);
				$(".header_right").children("li").first().html(p);
				$(".header_right").children("li").eq(1).html(p2);
				$.cookie("username",{username},username,{path:"/"});
				$(".logout").on('click',function(){
					$.cookie("username",null,{path:"/"});
					location.reload();
				});			
			}
		});
	});
	//实现图片上传
	$("#c_logo").on('change',function(event){
		event.preventDefault();
		var type=this.files[0].type;
		if (type=="image/jpeg" || type=="image/png") {
			var form=new FormData();
			form.append('upload',this.files[0]);
			$.ajax({
				url:"/api/upload",
				type:"post",
				dataType:"JSON",
				contentType:false,
				processData:false,
				data:form
			}).done(function(resData){
				img_src=resData.img;
			});
		}
	});
	//添加公司职位信息
	$(".add_btn").on('click',function(){
		var z_name=$("#z_name").val().trim(),
			c_name=$("#c_name").val().trim(),
			exprience=$("#w_exprience").val().trim(),
			type=$("#z_type").val().trim(),
			address=$("#w_address").val().trim(),
			money=$("#z_money").val().trim();
		var parms={};
		parms.logo=img_src;
		parms.z_name=z_name;
		parms.c_name=c_name;
		parms.exprience=exprience;
		parms.type=type;
		parms.address=address;
		parms.money=money;

		if ($(this).text()=="修改") {
			var _id=data_id;
			$.post('/api/update',{_id,parms},(resData)=>{
				if (resData.code) {
					$(".add_btn").text("添加");
					var up_element=$("tbody").find('tr').eq(up_index);
					up_element.children().eq(1).children("img").attr("src",parms.logo);
					up_element.children().eq(2).text(parms.z_name);
					up_element.children().eq(3).text(parms.c_name);
					up_element.children().eq(4).text(parms.exprience);
					up_element.children().eq(5).text(parms.type);
					up_element.children().eq(6).text(parms.address);
					up_element.children().eq(7).text(parms.money);		
				}
			});	
		}else if($(this).text()=="添加"){
			$.post('/api/add',parms,(resData)=>{
				if (resData.code) {
					length++;
					currentPage=Math.ceil(length/10);
					var num=$("tbody").find('.update').length;
					var num1=length%10;
					console.log(num1);
					var html=template("listTemp",{list:[parms]});
					if (num<10) {			
						dataLoad(currentPage);
						$(html).find(".delete").attr('data-id',resData.msg);
						$("tbody").append(html);
					}
					if (num1===1) {
						pagination(currentPage,Math.ceil(length/10));
						dataLoad(currentPage);
						$("#pagination1").delegate("a",'click',function(){
							var index=$(this).attr('data-current');
							currentPage=index;
							dataLoad(currentPage);
						});
					}else {
						pagination(currentPage,Math.ceil(length/10));
						dataLoad(currentPage);
						$("#pagination1").delegate("a",'click',function(){
							var index=$(this).attr('data-current');
							currentPage=index;
							dataLoad(currentPage);
						});
					}				
				}
			});
		}	
	});
	//首页实现
	$(".shouye").on('click',function(){
		$(".alert-info").removeClass('hidden');
		$(".company_show").addClass('hidden');
	});
	//从数据库中加载公司信息
	$(".z_guanli").on('click',function(){
		if (!user) {			
			alert("请先登录！再进行职位管理");
			return;
		}
		$(".alert-info").addClass('hidden');
		$(".company_show").removeClass('hidden');	
	});
	//删除数据
	$("tbody").delegate(".delete",'click',function(){
		var _id=$(this).attr('data-id');
		$.get('/api/delete',{_id},(resData)=>{
			if(resData.code){
				length--;
				console.log(currentPage);
				dataLoad(currentPage);
				$(this).parents("tr").remove();
			}
		}).done(function(){
			var num=$("tbody").find('tr').length;
			if (num<=0) {
				location.reload();
			}
		});
	});
	//修改数据
	$("tbody").delegate(".update",'click',function(){
		data_id=$(this).attr('data-id');
		up_index=$(this).parents("tr").index();
		$(".add_btn").text("修改");
		$("#z_name").val($(this).parents("tr").children().eq(2).text());
		$("#c_name").val($(this).parents("tr").children().eq(3).text());
		$("#w_exprience").val($(this).parents("tr").children().eq(4).text());
		$("#z_type").val($(this).parents("tr").children().eq(5).text());
		$("#w_address").val($(this).parents("tr").children().eq(6).text());
		$("#z_money").val($(this).parents("tr").children().eq(7).text());
		img_src=$(this).parents("tr").children().eq(1).children("img").attr("src");
	});
	//分页实现
	function pagination(currentPage,length){
		$("#pagination1").pagination({
			currentPage: currentPage,
			totalPage: length		
		});		
	}
	//异步加载查询数据
	function dataLoad(currentPage){
		$.get('/api/page',{currentPage},function(resData){
			if (resData.code) {
				$("tbody").html("");
				var html=template("listTemp",{list:resData.msg});
				$("tbody").append(html);
			}
		});
	}		
});