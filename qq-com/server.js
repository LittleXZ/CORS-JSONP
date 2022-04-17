var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if(!port){
    console.log('请指定端口号')
    process.exit(1)
}

var server = http.createServer(function(request, response){
    var parsedUrl = url.parse(request.url, true)
    var pathWithQuery = request.url
    var queryString = ''
    if(pathWithQuery.indexOf('?') >= 0){ queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
    var path = parsedUrl.pathname
    var query = parsedUrl.query
    var method = request.method

    /******** 从这里开始看，上面不要看 ************/

    console.log('有个傻子发请求过来啦！路径（带查询参数）为：' + pathWithQuery)

    if(path === '/index.html'){
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.write(fs.readFileSync(`./index.html`))
        response.end()
    } else if(path === `/main.js`){
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
        response.write(fs.readFileSync(`./main.js`))
        response.end()
    } else if(path === `/data.json`){
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/json;charset=utf-8')
        // CORS实现
        // response.setHeader(`Access-Control-Allow-Origin`, `http://localhost:9000`)   // JSONP 取消CORS
        response.write(fs.readFileSync(`./data.json`))
        response.end()
    } else if(path === `/data.js`){
        if(request.headers[`referer`].indexOf(`http://localhost:9000`) === 0){
            response.statusCode = 200
            response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
            // JSONP实现
            let data = fs.readFileSync(`./data.json`).toString()
            let string1 = "window[`{{xxx}}`]({{data}})"
            let string2 = string1.replace("{{data}}",data).replace(`{{xxx}}`,query.callback)
            response.write(string2)
            response.end()
        }else {
            response.statusCode = 400
            response.end()
        }

    } else {
        response.statusCode = 404
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.write(`你访问的页面不存在`)
        response.end()
    }

    /******** 代码结束，下面不要看 ************/
})
server.listen(port)
console.log('监听 ' + port + ' 成功\n打开 http://localhost:' + port)

