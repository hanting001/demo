var province_url = "http://trade.jd.com/dynamic/consignee/getProvinces.action";
var city_url = "http://trade.jd.com/dynamic/consignee/getCitys.action?consigneeParam.provinceId=";
var county_url = "http://trade.jd.com/dynamic/consignee/getCountys.action?consigneeParam.cityId=";
var town_url = "http://trade.jd.com/dynamic/consignee/getTowns.action?consigneeParam.countyId=";
var http = require('http');
var Iconv = require('iconv').Iconv;
var BufferHelper = require('bufferhelper');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
var db = mongoose.connection.db;

function getData(options, cb) {
    var data = {};
    var req = http.request(options, function(response) {
        var bufferHelper = new BufferHelper();
        response.on('data', function(chunk) {
            bufferHelper.concat(chunk);
        });
        response.on('end', function() {
            var iconv = new Iconv('GBK', 'utf-8');
            var resultBuffer = iconv.convert(bufferHelper.toBuffer());

            var result = resultBuffer.toString();
            var $ = cheerio.load(result);
            $("select option").each(function() {
                //console.log("value:%s-text:%s",$(this).val(), $(this).text().replace('*', ''));
                if ($(this).val()) {
                    data[$(this).val()] = $(this).text().replace('*', '');
                }
            });
            cb(data);
        });
    });
    // write data to request body
    req.end();
}

module.exports = function(app) {
    app.get('/address/provinces', function(req, res, next) {
        console.log('in');
        // var options = {
        //     host: '10.1.1.104',
        //     port: 8080,
        //     path: 'http://trade.jd.com/dynamic/consignee/getProvinces.action',
        //     method: 'get',
        //     headers: {
        //         Host: "trade.jd.com",
        //         Accept: 'text/html',
        //         'Content-Type': 'text/plain;charset=GBK'
        //     }
        // };
        db.collection('provinces', function(err, collection) {
            collection.find({}, {
                _id: 0
            }).toArray(function(err, provinces) {
                if (provinces.length > 0) {
                    console.log('find in db');
                    res.json({
                        message: 'ok',
                        provinces: provinces
                    });
                } else {
                    console.log('from web');
                    var options = {
                        host: 'trade.jd.com',
                        path: '/dynamic/consignee/getProvinces.action',
                        method: 'get',
                        headers: {
                            Host: "trade.jd.com"
                        }
                    };
                    var out = {};
                    var returnData = [];
                    getData(options, function(data) {
                        out = data;
                        db.collection('provinces', function(err, collection) {
                            for (var o in out) {
                                var v = {};
                                v[o] = out[o];
                                collection.insert(v, function() {});
                                var r = {};
                                r[o] = out[o];
                                returnData.push(r);
                            }
                            res.json({
                                message: 'ok',
                                provinces: returnData
                            });
                        });
                    });
                }
            });
        });

        // var req = http.request(options, function(response) {
        //     var bufferHelper = new BufferHelper();
        //     response.on('data', function(chunk) {
        //         bufferHelper.concat(chunk);
        //     });
        //     response.on('end', function() {
        //         var iconv = new Iconv('GBK', 'utf-8');
        //         var resultBuffer = iconv.convert(bufferHelper.toBuffer());

        //         var result = resultBuffer.toString();
        //         var $ = cheerio.load(result);
        //         $("select option").each(function() {
        //             //console.log("value:%s-text:%s",$(this).val(), $(this).text().replace('*', ''));
        //             if ($(this).val()) {
        //                 data[$(this).val()] = $(this).text().replace('*', '');
        //             }
        //         });
        //         console.log(data);
        //         var path = '/dynamic/consignee/getCitys.action?consigneeParam.provinceId=';
        //         var 
        //         for (var o in data) {
        //             var options = {
        //                 host: 'trade.jd.com',
        //                 path: path + o,
        //                 method: 'get',
        //                 headers: {
        //                     Host: "trade.jd.com"
        //                 }
        //             };

        //         }
        //         res.json({
        //             message: 'ok'
        //         });
        //     });
        // });
        // // write data to request body
        // req.end();
    });
}