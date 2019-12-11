// these exports are for localhost and database mysql local
var exports_1 = {
    'client-domain': '//localhost:3001/',
    'server-domain': '//localhost:3000/',
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
    'client-domain': '//localhost:3001/',
    'server-domain': '//localhost:3000/',
    'database': {
        'host': 'sql10.freemysqlhosting.net',
        'port': '3306',
        'user': 'sql10314363',
        'password': 'alEh71xttJ',
        'database': 'sql10314363'
    }
}

// these exports are for uploading to heroku
var exports_3 = {
    'client-domain': 'https://userclient-422-431.herokuapp.com/',
    'server-domain': 'https://userserver-422-431.herokuapp.com/',
    'database': {
        'host': 'sql10.freemysqlhosting.net',
        'port': '3306',
        'user': 'sql10314363',
        'password': 'alEh71xttJ',
        'database': 'sql10314363'
    }
}

module.exports = exports_3;