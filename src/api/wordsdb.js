import axios from "axios";

export function getWord(id) {
  return axios.get('word/' +String(id));
}

export function getInfo() {
    return axios.get('info/');
}

export function saveRecord(record) {
    return axios.post('card/', record);
}

export function signUp(firstname, lastname, user, pass) {
    const record =  {
        firstName: firstname,
        lastName: lastname,
        user: user,
        password:pass
    };
    //console.log("Invoked wordsdb.signUp, record:" +JSON.stringify(record));
    return axios.post('signup/', record);
}

export function login(user, pass) {
    const record =  {
        user: user,
        password:pass
    };
    //console.log("Invoked wordsdb.login, record:" +JSON.stringify(record));
    return axios.post('login/', record);
}

export function signOut() {
    return axios.get('logout/');
}

export function getAllforUser(user) {
    const res = axios.get('cards/'+ String(user), {params: {order: "asc"}});
    return res.then(res => {
        //console.log(JSON.stringify(res));
        return res.data.map( doc => {
            let timeIndex = doc._id.indexOf('&') +1;
            let time = doc._id.substr(timeIndex);
            return {...doc, _id: time}
        })
    })
}

export function getLast5forUser(user) {
    const res = axios.get('cards/'+ String(user), {params:{limit: 5, order: "desc"}});
    return res.then(res => {
        //console.log(JSON.stringify(res));
        return res.data.map( doc => {
            let timeIndex = doc._id.indexOf('&') +1;
            let time = doc._id.substr(timeIndex);
            return {...doc, _id: new Date(time).toLocaleString()}
        })
    })
}