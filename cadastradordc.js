const express = require('express');
const app = express();
const porta = 3000
const {  geradorNomeFeminino } = require ('gerador-nome');
const utils = require("./utils")
const fs = require('fs');
let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
var _continue = true;
const req = require('request');
const { exec } = require('child_process');
const { report } = require('process')

const { Console, timeStamp } = require('console')


function request(config) {
    return new Promise((resolve, reject) => {
        req(config, function(err, res) {
            if (err) { reject(err) } else { resolve(res) }
        })
    })
}
function between(min, max) {  
    return Math.floor(
      Math.random() * (max - min) + min
    )
  }
  function remove_last_character(element) {
    return element.substr(0,element.length - 1)
  }
// Get Str 
function getStr(str, start, end) {
    let str1 = str.split(start)[1];
    let str2 = str1.split(end)[0];
    return str2;
}


const execute = async function() {
    var randnumber = between(1, 99999);
    //var randnumber = ('7');
    var nomemail = 'GusttaCDL';
    var jar = req.jar()
    var fingerprint = '782696642591719455.G1ZEIdn7QWEI3CHMkXItl6XT6tc';
    var mail = `aikatmp+${nomemail}${randnumber}@gmail.com`;
    console.log(mail)
    var pageUrl = 'https://discord.com/api/v8/auth/register';
    const get2Cap = async function(pageUrl){
        var key = '2856c0240844b4b98589c4862a90f4b3';
        var gkey = '6Lef5iQTAAAAAKeIvIY-DeexoO3gj7ryl9rLMEnn';  
        const url2Cap = `https://2captcha.com/in.php?key=${key}&method=userrecaptcha&googlekey=${gkey}&pageurl=${pageUrl}&json=1`;
        let resCap1 = await request({
            url: url2Cap,
            method: 'GET'
        })
        console.log(jar)
        const id = JSON.parse(resCap1.body)["request"];
        const verifyCap = `https://2captcha.com/res.php?key=${key}&action=get&id=${id}&json=1`;
        do{
            let responseVerify = await request({
                url: verifyCap,
                method: 'GET', 
            })
            var response = JSON.parse(responseVerify.body)["request"];
            console.log(response)
            await sleep(1500);
        }while(response == "CAPCHA_NOT_READY");
       
        return response; 
      }
    var captchaResponse = await get2Cap(pageUrl);
    var getlinkdc = ((await utils.request({
        url: pageUrl,
        method: "POST",
        body: `{"fingerprint":"${fingerprint}","email":"${mail}","username":"${nomemail}${randnumber}","password":"asd12345@","invite":null,"consent":true,"date_of_birth":"2001-11-24","gift_code_sku_id":null,"captcha_key":"${captchaResponse}"}`,
        headers: {
            'Referer': 'https://discord.com/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
            'Content-Type': 'application/json',
            //'x-super-properties': 'eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzg3LjAuNDI4MC42NiBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiODcuMC40MjgwLjY2Iiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiIiLCJyZWZlcnJpbmdfZG9tYWluIjoiIiwicmVmZXJyZXJfY3VycmVudCI6IiIsInJlZmVycmluZ19kb21haW5fY3VycmVudCI6IiIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjcyMzgyLCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsfQ=='
        }
    })).body)
    console.log(getlinkdc)
    if (!getlinkdc.includes('token')) {
        return { status: false, ...JSON.parse(getlinkdc) }
    }
    var token = getStr(getlinkdc, '{"token": "', '"}');
    var save = `criado: true, token: ${token}, email: ${mail}, status: 'Aguardando confirmação de email'`
    if (!getlinkdc.includes('token')) {
        return console.log('Erro ao criar conta!')
    }  else {
        console.log({ criado: true, token: token, email: mail, status: `Tudo pronto, acessando o E-mail`})
        let code = false;

        const csrf_gmailnator = "37ffa56d1aad9279a1f0394a05b1ddca";
        const name_mail = `${nomemail}${randnumber}`;
        do{
            const getMail = (await request({
                url: 'https://gmailnator.com/mailbox/mailboxquery',
                method: "POST",
                body: `csrf_gmailnator_token=${csrf_gmailnator}&action=LoadMailList&Email_address=aikatmp%2B${name_mail}%40gmail.com`,
                headers: {
                    "Host": "www.gmailnator.com",
                    "user-agent": "insomnia/2020.4.2",
                    "cookie": `csrf_gmailnator_cookie=${csrf_gmailnator};`,
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "origin": "https://gmailnator.com",
                    "accept": "*/*",

                }
            })).body

            code = getMail.match(/#.{16}/g);
        }while(!code || code[0].length !== 17); 
        //while(!code || code.length > 1  || code[0].length !== 17);  
        const [ message_id ] = code;
        console.log('Link encontrado com sucesso!'.green);
        
        const getMailDC = (await request({
            url: 'https://gmailnator.com/mailbox/get_single_message/',
            method: "POST",
            body: `csrf_gmailnator_token=${csrf_gmailnator}&action=get_message&message_id=${message_id.replace('#', '')}&email=aikatmp`,
            headers: {
                "host": "www.gmailnator.com",
                "content-length": "115",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "cookie": `csrf_gmailnator_cookie=${csrf_gmailnator};`,
            }
        })).body

        const email = getMailDC.split('url9624.discordapp.com')
        
        const emailExact = email.find(text => text.includes('Verify Email\\r\\n'));
        if(!emailExact) return console.log({ error: "Message Verify Email not found!", message_id }); 
        const linkToVerifyAccount = `https://url9624.discordapp.com${emailExact.split('\\"')[0]}`;
        
        console.log({linkToVerifyAccount})

        var finallink = linkToVerifyAccount
        //var finallink = (remove_last_character(linkver));
        var jar = utils.request.jar();
        console.log({finallink})
        var verifyTokenFinal = ((await utils.request({
        method: 'GET',
        followAllRedirects: true,
        jar: jar,
        url: finallink
    })).response.request.uri.href)
    var tokenCap = getStr(verifyTokenFinal, 'https://discord.com/verify#token=', ',');
    const getverCap = async function(finallink){
        var key = '2856c0240844b4b98589c4862a90f4b3';
        var gkey = '6Lef5iQTAAAAAKeIvIY-DeexoO3gj7ryl9rLMEnn';
        const url2Cap = `https://2captcha.com/in.php?key=${key}&method=userrecaptcha&googlekey=${gkey}&pageurl=${finallink}&json=1`;
        let resCap1 = await request({
            url: url2Cap,
            method: 'GET'
        })
        const id = JSON.parse(resCap1.body)["request"];
        const verifyCap = `https://2captcha.com/res.php?key=${key}&action=get&id=${id}&json=1`;
        do{
            let responseVerify = await request({
                url: verifyCap,
                method: 'GET', 
            })
            var response = JSON.parse(responseVerify.body)["request"];
            console.log(response)
            await sleep(1500);
        }while(response == "CAPCHA_NOT_READY");
    
        return response;
    }
    
    var captchaResponse2 = await getverCap(finallink);
    var verificar2 = ((await utils.request({
        method: 'POST',
        url: 'https://discord.com/api/v8/auth/verify',
        headers: {
            'authority': 'discord.com',
            'authorization': `${token}`,
            'accept-language': 'en-US',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
            'content-type': 'application/json',
            'accept': '*/*',
            'origin': 'https://discord.com',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'referer': 'https://discord.com/verify',
        },
        body: `{"token":"${tokenCap}","captcha_key":"${captchaResponse2}"}`
    })).body)
    console.log({ criado: true, token: token, email: mail, nomeconta: nomemail, status: `Email Confirmado`})
    fs.appendFile('confirmadas.txt', `Conta Criada - Nome: ${nomemail} - Email: ${mail} - Token: "${token}" - Status: Email Confirmado! #Gustta `+ '\n', () => {})
    let resultado = 'confirmado';
    console.log("CONTA FINALIZADA!");
    return { status: true };
    }
}

async function start(){
    var count = 0;
    while(_continue){
        console.log({ count, message: "Iniciado com sucesso!" });
        let response = await execute();
        if (!response.status) {
            const { retry_after } = response;
            if(retry_after){
                console.log('Chegou aqui', response)
                await sleep((1+response.retry_after)*1000)
                console.log("PASSOU DO RETRY", response);
            }
        }
        console.log('Passou')
        count++;
    }   
};



start();
app.listen(porta, () => {
    console.log(`Palafita Lab's`)
})



