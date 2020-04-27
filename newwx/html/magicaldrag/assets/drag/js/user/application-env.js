/*环境变量 所有变化的东西 统一放在此处*/
function ApplicationEnv(){
    this.env = {
        serverPath:"/lowcode-web/",//服务端前缀
        key:{
            //允许的域名
            domain:"localhost",
            //发放的加密串 请咨询www.magicalcoder.com
            secret:"397ea79d46836d42452bb968beab5ea0ec1df8f287d4acdda73d2f6cbc1e71357a1323619b06556194254246b17d60554f2293e847b813d992662cfbe4219a9bf5d97aad4ff3f77401ef4ad70356f1db3880d7418e8814dc179725a1f6539dacb166b0ac929093380eeb33439a2596d4ac54c2ccb10e0c596e4caaff64ea3350",
        }
    }
}
ApplicationEnv.prototype.getEnv = function () {
    return this.env;
}
var APPLICATION_ENV = new ApplicationEnv();
