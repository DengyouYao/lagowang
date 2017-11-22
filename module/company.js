var mongoose=require('mongoose');

var companySchema=require('../schema/company');
var Company=mongoose.model('companys',companySchema);
module.exports=Company;