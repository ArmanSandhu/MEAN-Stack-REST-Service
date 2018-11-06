/*
    In order for Admin Site and Client Site to work on your localhost, CORS must be enabled.
*/ 
function corsPermission(){
    this.permission = function (req, res, next){
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Access-Control-Allow-Methods', 'GET');
        next();
    }
}

module.exports = new corsPermission();