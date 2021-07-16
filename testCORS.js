var Cloudant = require('@cloudant/cloudant');
const dotenv = require('dotenv');
dotenv.config();

var url = process.env.cloudant_url;
var username = process.env.cloudant_username;
var password = process.env.cloudant_password;
var cloudant = Cloudant({ url:url, username:username, password:password });
cloudant.get_cors().then((data) => {
    console.log(data);
}).catch((err) => {
    console.log(err);
});