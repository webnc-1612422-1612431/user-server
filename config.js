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
        'host': 'sql12.freemysqlhosting.net',
        'port': '3306',
        'user': 'sql12308370',
        'password': 'xLicY5Js7i',
        'database': 'sql12308370'
    }
}

// these exports are for uploading to heroku
var exports_3 = {
    'client-domain': '',
    'server-domain': '',
    'database': {
        'host': 'sql12.freemysqlhosting.net',
        'port': '3306',
        'user': 'sql12308370',
        'password': 'xLicY5Js7i',
        'database': 'sql12308370'
    }
}

module.exports = exports_1;