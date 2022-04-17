document.getElementById(`getData1`).onclick = ()=>{
    const request = new XMLHttpRequest()
    request.open(`GET`,`http://localhost:8888/data.json`)
    request.onreadystatechange = () => {
        if (request.readyState === 4 && request.status >= 200 && request.status < 300){
            console.log(request.response)
        }
    }
    request.send()
}
// JSONP 实现
let random = Math.random()   // 以一个随机数当全局变量来防止重复变量 甚至可以在random前面加自定义字符串来增加长度
window[random] = (data)=>{
    console.log(data)
}
let script = document.createElement(`script`)
script.src = `http://localhost:8888/data.js?callback=${random}`  //request.headers[`referer`].query.callback 能获得${random} 因为random会被当做参数传过去
document.body.appendChild(script)
script.onload = ()=>{
    script.remove()   // 执行完就可以删掉script 数据仍旧保留
}


document.getElementById(`getData2`).onclick = ()=>{
    console.log(window[random])
}