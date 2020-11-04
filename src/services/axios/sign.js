import md5 from 'js-md5';
/**
 * 生成签名
 */
function createSign(method, servicePath, apiSecret, paramStrings, postbody) {
    let str = method + servicePath;
    paramStrings = paramStrings.sort();
    str = str + paramStrings.join("");
    postbody&&(str = str +JSON.stringify(postbody));
    str = str + apiSecret;
    str.toString();
    let urlEncodeStr = encodeURIComponent(str);
    return md5(urlEncodeStr);
}
/* 数据签名 */
export default  function SignFactory(url,body, method, appInfo,param,control) {
    url =control&&control.push?url:'/rest' + url;
    // TODO: 测试key，需要确认生产和测试的，然后在kmc-hostUrls文件里替换
    // TODO: 判断生产还是测试，使用相应的key

    let authorData = {
        apikey: appInfo.apikey,
        ts: new Date().getTime(),
    };
    let allData = Object.assign({},param, authorData);
    let paramStrings = [];
    for (let i in allData) {

        if (allData[i] === undefined || allData[i] === null) {
            allData[i] = '';
        }
        // if (allData[i] !== undefined && allData[i] !== null && allData[i] !== '') {
        paramStrings.push(i.toString() + '=' + allData[i].toString());
        // }
    }
    authorData["sign"]=createSign(method.toUpperCase(), url, appInfo.apisecret, paramStrings, control&&control.push?body:null);
    return authorData; 
}

