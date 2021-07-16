// load the things we need
var bcrypt   = require('bcrypt-nodejs');
//let users = [];

module.exports = function (usersDB) {
return {
    generateHash: generateHash,
    validPassword: validPassword,
    findOne: findOne,
    save, save
    }
}

function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

function validPassword(password, user) {
    return bcrypt.compareSync(password, user.password);
};

function findOne(id, cbfunc) {
    const result = usersDB.get(id).then((data) => cbfunc(null, data)
    ).catch((err) => cbfunc(err, null))
    //console.log("Found in Array:"+JSON.stringify(result));    
}

//record = {id: email, password:password, firstName, lastName}
function save(record, cbfunc) {
    usersDB.insert(record).then(() => cbfunc(null)
    ).catch((err) => cbfunc(err, null));
}

// create the model for users and expose it to our app
//module.exports = ArrayModel;
