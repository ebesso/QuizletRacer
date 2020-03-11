const fs = require('fs');

const filename = 'data.json';



function load_file() {
    var rawData = fs.readFileSync(filename);
    var data = JSON.parse(rawData);

    return data;
}

function save_file(data) {

    fs.writeFile(filename, JSON.stringify(data), function (err, result) {
        
    });

}

exports.createFile = function () {

    if (fs.existsSync(filename) == false) {
        var data = {
            'created_rooms': 0,
            'users_joined': 0,
            'messages': []
        };

        save_file(data);
    }
}

exports.roomCreated = function () {

    var data = load_file();

    data['created_rooms']++;

    save_file(data);
};

exports.userJoined = function () {

    var data = load_file();

    data['users_joined']++;

    save_file(data);
};

exports.messageSent = function (message) {

    var data = load_file();

    data['messages'].push(message);

    save_file(data);
}

