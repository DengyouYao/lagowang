var mongoose=require('mongoose');
var userSchema=require('../schema/user');

var User=mongoose.model('users',userSchema);

module.exports=User;