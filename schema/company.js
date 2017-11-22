var mongoose=require('mongoose');
var CompanySchema=mongoose.Schema({
	logo:String,
	z_name:String,
	c_name:String,
	exprience:String,
	type:String,
	address:String,
	money:String
});

module.exports=CompanySchema;