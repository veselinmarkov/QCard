// load the things we need
//var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
let users = [];

module.exports = {
    generateHash: generateHash,
    validPassword: validPassword,
    findOne: findOne,
    save, save
}

function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

function validPassword(password, user) {
    return bcrypt.compareSync(password, user.password);
};

function findOne(id, cbfunc) {
    const result = users.find(record => id ===record.id);
    //console.log("Found in Array:"+JSON.stringify(result));
    cbfunc(null, result);
}

//record = {id: email, password:password}
function save(record, cbfunc) {
    if (record) {
        users.push(record);
        //console.log("Added to Array:"+JSON.stringify(record));
        cbfunc(null);
    } else
        cbfunc({error: "record is empty"});
}

// create the model for users and expose it to our app
//module.exports = ArrayModel;
