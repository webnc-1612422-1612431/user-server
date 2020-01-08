// these exports are for localhost and database mysql local
var exports_1 = {
    'client-domain': '//localhost:5000/',
    'server-domain': '//localhost:5001/',
    'database': {
        'host': 'localhost',
        'port': '3306',
        'user': 'root',
        'password': 'admin',
        'database': 'uberfortutor'
    }
}

// these exports are for localhost and database remote
var exports_2 = {
    'client-domain': '//localhost:5000/',
    'server-domain': '//localhost:5001/',
    'database': {
        'host': 'remotemysql.com',
        'port': '3306',
        'user': 'K7n15LVrFb',
        'password': 'URsvbRQ06D',
        'database': 'K7n15LVrFb'
    }
}

// these exports are for uploading to heroku
var exports_3 = {
    'client-domain': 'http://userclient-422-431.herokuapp.com/',
    'server-domain': 'http://userserver-422-431.herokuapp.com/',
    'database': {
        'host': 'remotemysql.com',
        'port': '3306',
        'user': 'K7n15LVrFb',
        'password': 'URsvbRQ06D',
        'database': 'K7n15LVrFb'
    }
}

module.exports = exports_3;