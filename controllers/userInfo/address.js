var province_url = "http://trade.jd.com/dynamic/consignee/getProvinces.action";
var city_url = "http://trade.jd.com/dynamic/consignee/getCitys.action?consigneeParam.provinceId=";
var county_url = "http://trade.jd.com/dynamic/consignee/getCountys.action?consigneeParam.cityId=";
var town_url = "http://trade.jd.com/dynamic/consignee/getTowns.action?consigneeParam.countyId=";
var http = require('http');

module.exports = function(app) {
    app.get('/address/provinces', function(req, res, next) {
        console.log('in');
        var options = {
            host: '10.1.1.104',
            port: 8080,
            path: 'http://trade.jd.com/dynamic/consignee/getProvinces.action',
            method: 'get',
            headers: {
                Host: "trade.jd.com",
                Accept: 'text/html',
                'Content-Type':'text/plain;charset=GBK'
            }
        };
        var result = '';
        var req = http.request(options, function(response) {
            //console.log('STATUS: ' + res.statusCode);
            //console.log('HEADERS: ' + JSON.stringify(res.headers));
            //response.setEncoding('GBK');
            response.on('data', function(chunk) {
                result = result + chunk;
            });
            response.on('end', function() {
                console.log(result);
                res.json(result);
            });
        });
        // write data to request body
        req.end();
    });
}