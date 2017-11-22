var express=require('express');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');

var app=express();

//链接数据库
mongoose.Promise=global.Promise;
mongoose.connect("mongodb://127.0.0.1:27017/ydylago",{useMongoClient:true}).then(function(db){
	console.log("数据库链接成功");
});

app.use(express.static("static"));
app.use(express.static("page"));
app.use(express.static("uploadcache"));
//处理post请求的JSON格式
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//导入模型
var User=require('./module/user');
var upload=require('./util/upload');
var Company=require('./module/company');

//注册
app.post('/api/register',function(req,res){

	console.log(req.body);
	var u=new User(req.body)
	u.save(function(err,doc){
		if (err) {
			console.log("错误！");
			return;
		}
		res.json({
			code:1,
			msg:doc
		});
	})
	
});
//登录
app.post('/api/login',function(req,res){
	let{username,password}=req.body
	User.find({username},function(err,doc){
		if (err) {
			console.log("错误");
			return;
		}
		if (doc.length!=1) {
			res.json({
				code:0,
				msg:"用户名不存在"
			});
			return;
		}
		if (doc[0].password!=req.body.password) {
			res.json({
				code:0,
				msg:"密码错误"
			});
			return;
		}
		res.json({
			code:1,
			msg:"登录成功"
		});
	})
})
//处理图片上传
app.post('/api/upload',function(req,res){
	upload.upload(req,res);	
});
//添加职位信息
app.post('/api/add',function(req,res){
	var company=new Company(req.body);
	company.save(function(err,doc){
		if (err) {
			console.log("错误");
			return;
		}
		res.json({
			code:1,
			msg:doc._id
		});
	});
});
//查询公司信息
app.get('/api/page',function(req,res){
	var index=req.query.currentPage;
	Company.find({},function(err,doc){
		if (err) {
			console.log("错误");
			return;
		}
		res.json({
			code:1,
			msg:doc
		});
	}).skip((index-1)*10).limit(10-0);
});
//查询公司信息数量
app.get('/api/selectnum',function(req,res){
	Company.find({},function(err,doc){
		if (err) {
			console.log("错误");
			return;
		}
		res.json({
			code:1,
			msg:doc.length
		});
	});
});
//删除数据
app.get('/api/delete',function(req,res){
	var _id=req.query;
	Company.findOneAndRemove(_id,function(err,doc){
		if (err) {
			console.log("错误");
			return;
		}
		res.json({
			code:1,
			msg:"删除成功"
		});
	});
});
//修改数据
app.post('/api/update',function(req,res){
	var _id=req.body._id;
	Company.findByIdAndUpdate({_id},{$set:req.body.parms},function(err,doc){
		if (err) {
			console.log("错误");
			return;
		}
		res.json({
			code:1,
			msg:"更新成功"
		});
	});
});
app.listen(8080,function(){
	console.log("服务器启动成功");
});