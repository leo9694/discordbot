const moment = require('moment')
const Discord = require("discord.js"); //baixar a lib discord.js
const client = new Discord.Client(); 
const config = require("./config.json"); 

const low = require('lowdb') //banco de dados
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('banco.json')
const db = low(adapter)
const status_comandos=['ff','def','agi','ind','totf','pu','int','anal','totm','cab','caf','cam','cei','test','qtrf','qtrm']
const ficha_comandos=['descricao','quirk','personalidade','historia','aparencia']
const bot_attr=['nome','rank','aparencia','descricao','permissoes']
const bot_skill=['comando','nome','descricao','cd','aparencia','categoria','alcance','dano','efeitos','anula','fraquezas']
//est
client.on("ready", () => {
console.log('Olá Mundo')
})

client.on("guildCreate", () => {
db.set("status", []).write()
})


client.on("message", async message => {   
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    if(!message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);  
  const comando = args.shift().toLowerCase();
  args.shift;
  const resposta = args.join(' ')
  const adm = '834960983797399623' 







function verificar_comando(comando){
   if(comando.indexOf("-") !== -1){   
      var com = new Object     
      var comando_acao = comando.split("-");   
       com.comando=comando_acao[0]
       com.acao=comando_acao[1]   
       valor = db.get("comandos").find({comando: com.comando}).value()
       bots = db.get("fichas_bots").find({comando: com.comando}).value()
      if (valor==undefined && bots==undefined){         
         return false
      }else{
         return true
      }   
   }else{
      valor = db.get("comandos").find({comando: comando}).value()
      bots=db.get("fichas_bots").find({comando: comando}).value()
      console.log(valor)
      if (valor==undefined && bots==undefined){          
         return false
      }else{
         return true
      }
   }
}
function verificar_comando_composto(comando){
   if(comando.indexOf("-") !== -1){   
      var com = new Object     
      var comando_acao = comando.split("-");   
       com.comando=comando_acao[0]
       com.acao=comando_acao[1]
       com.acao2=comando_acao[2] 
       return com      
   }else{      
      return false      
   }
}
function bot(comando){
   bot = db.get("fichas_bots").find({comando: comando}).value()
   if(bot!=undefined){
      return bot
   }

}
function retornar_skill(bot, skill){
   skills=db.get("skills").find({bot_comando: bot,comando: skill}).value() 
   if(skills!=undefined){      
      return skills   
   }
   
}
function retorna_hp(hp_minimo,hp_maximo){
   console.log(hp_minimo)
   let randon = parseInt(Math.random() * (hp_maximo - hp_minimo) + hp_minimo)   
    return randon
}
function total(ff,def,ind,mec){
   return ff+def+ind+mec
}
function compararHora(hora1, hora2)
{
    hora1 = hora1.split(":");
    hora2 = hora2.split(":");

    var d = new Date();
    var data1 = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hora1[0], hora1[1]);
    var data2 = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hora2[0], hora2[1]);

    return data1 > data2;
};
function cds(skill){
   let hora =  moment().format('hh:mm')
   cd = db.get("cd").find({comando: skill.comando, user: message.author.id}).value()
   if(cd!=undefined){      
      if(compararHora(hora,cd.tempo_final)==true){
         cd.tempo_final=moment(hora, 'hh:mm').add(parseInt(skill.cd), 'minutes').format('hh:mm')
         db.get("cd").find({comando: skill.comando, user: message.author.id}).assign(cd).write()
         return true
      } else{
         return `Disponivel depois das ${cd.tempo_final}h`
      }    
   }else{
      cd =new Object
      cd.user=message.author.id
      cd.comando=skill.comando
      cd.tempo_final=moment(hora, 'hh:mm').add(parseInt(skill.cd), 'minutes').format('hh:mm')
      db.get("cd").push(cd).write() 
      return true 
   }

}
function view_bot(bot){
   let msn=''   
   msn+= '```ini\n'
   msn+=`[${bot.nome}] HP: ${retorna_hp(parseInt(bot.hp_minimo),parseInt(bot.hp_maximo))}          \n\n`   
   msn+=`➤ Força: [${bot.status.ff}]\n`
   msn+=`➤ Defesa: [${bot.status.def}]\n`
   msn+=`➤ Agilidade: [${bot.status.agi}]\n`
   msn+=`➤ Mecânica: [${bot.status.mec}]\n` 
   msn+="-------------------\n"
   msn+=`➤ Total:[${total(parseInt(bot.status.ff),parseInt(bot.status.def),parseInt(bot.status.agi),parseInt(bot.status.mec))}]`
   msn+="```\n"
   msn+=`GIF ILUSTRATIVO\n`
   msn+="-------------------\n"
   msn+=`${bot.aparencia}`
   return msn
}

function view_skill(skill){
   let msn=''   
   msn+=`------------- **${skill.nome}** -------------         \n`
   msn+=`**➤Descrição:** ${skill.descricao}\n`
   msn+=`**➤Categoria:** ${skill.alcance}\n`
   msn+=`**➤Dano:** ${skill.dano}\n`
   msn+=`**➤Efeitos** ${skill.efeito}\n`
   msn+=`**➤Anula:** ${skill.anula}\n`
   msn+=`**➤Fraquezas:** ${skill.fraquezas}\n`
   msn+=`**➤CoolDown:** ${skill.cd} minutos\n`
   msn+=`*Imagem Ilustrativa*\n`
   msn+=`${skill.aparencia}`
   msn+="\n"
   return msn
}

if (verificar_comando(comando)==true){  
   if (verificar_comando_composto(comando)==false){       
      if(comando=='cadastrarbot'){
         if(!args[0])return message.channel.send('Vc esqueceu de colocar o comando do seu bot!')
         bot = new Object
         bot.nome=''
         bot.permissoes=[adm]
         bot.comando = resposta
         bot.rank=''
         bot.aparencia=''
         bot.descricao=''
         bot.hp_minimo=0
         bot.hp_maximo=0
         bot.status = new Object
             bot.status.def=0
             bot.status.ff=0
             bot.status.agi=0
             bot.status.mec=0
         skill = new Object
             skill.bot_comando=bot.comando
             skill.comando=''
             skill.nome=''
             skill.descricao=''
             skill.cd=''
             skill.aparencia=''
             skill.categoria=''
             skill.alcance=''             
             skill.efeito=''
             skill.anula=''             
             skill.dano=[]   
             skill.fraquezas=''      
         db.get("fichas_bots").push(bot).write()  
         db.get("skills").push(skill).write() 
         return message.channel.send(`Bot com o comando "!${bot.comando}" criado!`)

      }else if(comando=='log'){
         return message.channel.send(message.author.id)
      
      }else if(comando=='deletarbot'){
         if(!args[0])return message.channel.send('Vc esqueceu de colocar o comando do seu bot!')
         db.get("fichas_bots").remove({comando: resposta}).write()
         db.get("comandos").remove({comando: resposta}).write()
         return message.channel.send(`Bot com comando "!${resposta}" deletado!`)
      }else if(comando=='comandos'){
         let msn='``'
         valor =  db.get("comandos").value()         
         valor.forEach(v=>{
            msn+=`!${v.comando}\n`
         })
         msn+='``'
         return message.channel.send(msn)

      }else if(comando==bot(comando).comando){
         //View bot
         bot=db.get("fichas_bots").find({comando: comando}).value()         
         if(!args[0]){            
            return message.channel.send(view_bot(bot))
         }else if(resposta==retornar_skill(comando, resposta).comando){ 
            skill = retornar_skill(comando, resposta)  
            if (cds(skill)==true){
              return message.channel.send(view_skill(skill))
            }else{
               return message.channel.send('Habilidade em CoolDown! '+ cds(skill)) 
            }
            
         }                   
         
      }else if(comando=='comoregistrarbot'){

      }
   
   }
   if (verificar_comando_composto(comando)!=true){
      com=verificar_comando_composto(comando)
      console.log(com)
      bot=bot(com.comando)
      skil=retornar_skill(com.comando,com.acao)     
      bot_attr.forEach(s=>{
         if(com.acao==s){         
            bot[`${s}`] = resposta;
            db.get("fichas_bots").find({comando: com.comando}).assign(bot).write()
            return message.channel.send(`Bot ${bot.nome} teve ${s} atualizado!`)
         }      
      })
      if(com.acao=='status'){
         var status = resposta.split("-")
         bot.status.ff= status[0]
         bot.status.def= status[1]
         bot.status.agi= status[2]
         bot.status.mec= status[3]
         db.get("fichas_bots").find({comando: com.comando}).assign(bot).write()
         return message.channel.send(`Bot ${bot.nome} teve seus status atualizados`)
      } 
      if(com.acao=='hp'){
         var hp = resposta.split("-")
         bot.hp_minimo= hp[0]
         bot.hp_maximo= hp[1]        
         db.get("fichas_bots").find({comando: com.comando}).assign(bot).write()
         return message.channel.send(`Bot ${bot.nome} teve seu hp atualizados`)
      }
      if(com.acao=='criarskill'){ 
         skill = new Object
            skill.bot_comando=bot.comando
            skill.comando=resposta           
             skill.nome=''
             skill.descricao=''
             skill.cd=''
             skill.aparencia=''
             skill.categoria=''
             skill.alcance=''             
             skill.efeito=''
             skill.anula=''             
             skill.dano=[]   
             skill.fraquezas=''
            db.get("skills").push(skill).write()
            return message.channel.send(`Bot ${bot.nome} teve skill com comando "!${skill.comando}" criado!`) 
      } 
      if(com.acao==retornar_skill(com.comando,com.acao).comando){
         bot_skill.forEach(s=>{
            if(com.acao2==s){         
               skil[`${s}`] = resposta;
               db.get("skills").find({bot_comando: bot.comando,comando:skil.comando}).assign(skil).write()
               return message.channel.send(`Bot ${bot.nome}  teve atributo ${s} da skill atualizado!`)
            }      
         })
         if(com.acao2=='dano'){
            var attr = resposta.split("/")
            skil.status=attr 
            db.get("skills").find({bot_comando: bot.comando,comando:skil.comando}).assign(skil).write() 
            return message.channel.send(`Bot ${bot.nome} variação de dano da skill atualizado!`)

         }         
      }    
     
        
   }  
}else{
   let m=''
   m+=`Meu jovem esse comando não existe...`
   return message.channel.send(m)
}



//    //comandos random
// function buscar_comando(comando){
//    valor = db.get("comandos").find({comando: comando}).value()
//    if (valor==undefined) return ''
//    return valor
// }
// function verificar_permissao(cargos_comando){
//    const member = message.guild.member(message)
//    cargos_membro = member._roles
//    result=0  
//   if(Array.isArray(cargos_comando)){
//       cargos_membro.forEach(cargo_membro => {
//          cargos_comando.forEach(cargo_comando => {
//             console.log(cargo_membro.toString(),'+++', cargo_comando.toString())
//             if(cargo_membro.toString()==cargo_comando.toString()){      
//                result= 1
//             }
//          })
         
//       }); 
//    }else{
//       cargos_membro.forEach(cargo_membro => {         
//             console.log(cargo_membro,'+++', cargos_comando)
//             if(cargo_membro==cargos_comando){      
//                result= 1
//             }        
         
//       });
//    }
   
//    return result
// }
// function contador(elementos){
//    let i=0
//    if (elementos==undefined) return i=1 
//    elementos.forEach(elem =>{
//       i=i+1
//    })
//    return i
// }















// //show comando
// valor=buscar_comando(comando) 
// if(valor!=undefined){  
//    if(comando==valor["comando"]){
//       if (verificar_permissao(valor["permissoes"])==0) return message.channel.send('Permissao negada')
//             let men=''
//             men+=`${valor["descricao"]}`
//             message.channel.send(men)
//    }
// }
// //show ficha_npc
// let ficha = db.get("ficha_npc").find({comando: comando}).value()
// if(ficha!=undefined){  
//    if(comando==ficha["comando"]){  
//       if (verificar_permissao(ficha["permissoes"])==0) return message.channel.send('Permissao negada')    
//             let men=''
//             men+=`${ficha["aparencia"]}\n`
//             men+="```"
//             men+=`${ficha["descricao"]}\n`
//             men+=`${ficha["attr"]}`
//             men+="```"
            
            
//             message.channel.send(men)
//    }
// }
// //show status
// let statu = db.get("status").find({comando: comando}).value()
// if(statu!=undefined){  
//    if(comando==statu["comando"]){  
//       if (verificar_permissao(statu["permissoes"])==0) return message.channel.send('Permissao negada')     
//       let texto=''       
//          texto+= '```ini\n'
//          texto+=`┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`
//          texto+=`┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈Atributos Físicos┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`
//          texto+=`┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`
//          texto+=`➤ Força (ff): [${statu.ff}]\n`
//          texto+=`➤ Defesa (def): [${statu.def}]\n`
//          texto+=`➤ Agilidade (agi): [${statu.agi}]\n`
//          texto+=`➤ Individualidade (ind): [${statu.ind}]\n`
//          texto+=`➤ Total Físico (totf): [${statu.totf}]\n`         
//          texto+=`┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`
//          texto+=`┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈Atributos Mentais┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`
//          texto+=`┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`
//          texto+=`➤ Plus Ultra (pu): [${statu.pu}]\n`
//          texto+=`➤ Inteligência (int): [${statu.int}]\n`
//          texto+=`➤ Análise (anal): [${statu.anal}]\n`
//          texto+=`➤ Total Mental (totm): [${statu.totm}]\n`
//          texto+=`┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`
//          texto+=`┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈Atributos marciais┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`
//          texto+=`┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`
//          texto+=`➤ Combate com Arma Branca (cab): [${statu.cab}]\n`
//          texto+=`➤ Combate com Arma de Fogo (caf): [${statu.caf}]\n`
//          texto+=`➤ Combate com Artes Marciais (cam): [${statu.cam}]\n`
//          texto+=`➤ Combate Especialista em Individualidade (cei): [${statu.cei}]\n`
//          texto+=`➤ Proficiência em Testes (test): [${statu.test}]\n`
//          texto+=`┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`
//          texto+=`┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈Treinos┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`
//          texto+=`┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`
//          texto+=`➤ Quantidade de treinos físicos realizados (qtrf): [${statu.qtrf}]\n`
//          texto+=`➤ Quantidade de treinos mentais realizados (qtrm): [${statu.qtrm}]\n`

//          texto+= '```\n'     
//       message.channel.send(texto)   
            
//    }
// }


// //ediçoes nos comandos em geral

//  if(comando.indexOf("-") !== -1){   
//     let permissoes
//    var comando_acao = comando.split("-");
//    console.log(resposta)
//    let comandos=comando_acao[0]
//    let acao=comando_acao[1]

//    //comandos edição
//    let com = db.get("comandos").find({comando: comandos}).value()
//    if(com!=undefined){     
//          if(!args[0])return message.channel.send('Você esqeceu do argumento ')
//          if (verificar_permissao(adm)==0) return message.channel.send('Permissao negada')
//          let novonome = resposta
//          switch(acao){
//             case "addpermissao":
//                permissoes=com["permissoes"]
//                permissoes.push(novonome)
//                db.get("comandos").find({comando: comandos}).assign({permissoes: permissoes}).write()
//                message.channel.send('Permissão adicionada')  
//             break;
//             case 'descricao':
//                db.get("comandos").find({comando: comandos}).assign({descricao: novonome}).write()
//                message.channel.send('Descrição adicionada') 
//             break;  
//             case('rmvpermissao'):
//                permissoes=com["permissoes"]
//                permissoes.push(novonome)
//                db.get("comandos").find({comando: comandos}).assign({nome: permissoes}).write()
//                message.channel.send('Permissão adicionada')   
//             break;    
//             default:
//                message.channel.send('Atributo invalido')  
            
//          }              
//    }
//    // ficha_npc edição   
//    let ficha = db.get("ficha_npc").find({comando: comandos}).value()
//    if (ficha!= undefined){        
//       let novonome = resposta
//       switch(acao){
//          case 'add_permissao':
//             if (verificar_permissao(ficha["permissoes"])==0) return message.channel.send('Permissao negada')
//             permissoes=ficha["permissoes"]
//                permissoes.push(novonome)
//                db.get("comandos").find({comando: comandos}).assign({permissoes: permissoes}).write()
//                message.channel.send('Permissão adicionada') 
//          break;
//          case 'add_descricao':
//             if (verificar_permissao(ficha["permissoes"])==0) return message.channel.send('Permissao negada')
//             db.get("ficha_npc").find({comando: comandos}).assign({descricao: resposta}).write()
//             message.channel.send('Descrição adicionada') 
//          break;
//          case 'add_atributo':
//             if (verificar_permissao(ficha["permissoes"])==0) return message.channel.send('Permissao negada')
//             db.get("ficha_npc").find({comando: comandos}).assign({attr: resposta}).write()
//             message.channel.send('Atributo adicionado') 
//          break;
//          case 'add_aparencia':
//             if (verificar_permissao(ficha["permissoes"])==0) return message.channel.send('Permissao negada')
//             db.get("ficha_npc").find({comando: comandos}).assign({aparencia: resposta}).write()
//             message.channel.send('Aparencia adicionado') 
//          break;
//          case 'add_funcao':
//             if (verificar_permissao(ficha["permissoes"])==0) return message.channel.send('Permissao negada')
//             db.get("ficha_npc").find({comando: comandos}).assign({funcao: resposta}).write()
//             message.channel.send('Função adicionado') 
//          break;
//          case 'add_historia':
//             if (verificar_permissao(ficha["permissoes"])==0) return message.channel.send('Permissao negada')
//             db.get("ficha_npc").find({comando: comandos}).assign({historia: resposta}).write()
//             message.channel.send('Historia adicionado') 
//          break;
//          case 'add_quirk':
//             if (verificar_permissao(ficha["permissoes"])==0) return message.channel.send('Permissao negada')
//             db.get("ficha_npc").find({comando: comandos}).assign({quirk: resposta}).write()
//             message.channel.send('Quirk adicionado') 
//          break;
//          case 'descricao':            
//             let men='' 
//             men+=`${ficha["aparencia"]}\n`  
//             men+="```"         
//             men+=`${ficha["descricao"]}\n`            
//             men+=`➤ Função: ${ficha["funcao"]}\n`
//             men+=`➤ História: ${ficha["historia"]}\n`
//             men+=`➤ Quirk: ${ficha["quirk"]}`
//             men+="```\n"            
//             message.channel.send(men)
//          break;        
//       }

//    }
//    let status = db.get("status").find({comando: comandos}).value()
//    if (status!= undefined){        
//       let novonome = resposta      
//       status_comandos.forEach(s=>{
//          if(acao==s){
//             //add status
//             if (verificar_permissao(status["permissoes"])==0) return message.channel.send('Permissao negada')           
//             status[`${s}`] = resposta;
//             db.get("status").find({comando: comandos}).assign(status).write()
//             message.channel.send(`${s} atualizado!`)
//          }        
//       })
//       if(acao=='permissoes'){
//          if (verificar_permissao(status["permissoes"])==0) return message.channel.send('Permissao negada')               
//          permissoes=status["permissoes"]
//          permissoes.push(novonome)
//          db.get("status").find({comando: comandos}).assign({permissoes: permissoes}).write()
//          db.get("ficha_player").find({comando: comandos}).assign({permissoes: permissoes}).write()         
//          message.channel.send('Permissão adicionada') 
//       }
//       if(acao=='rmv'){
//          if (verificar_permissao(adm)==0) return message.channel.send('Permissao negada')
//          db.get("status").remove({comando: comandos}).write()
//          db.get("ficha_player").remove({comando: comandos}).write()
//          message.channel.send(`ficha ${comandos} removida!`) 

//       }     
//    }  
   
//    let fixa = db.get("ficha_player").find({comando: comandos}).value()
//    if (fixa!= undefined){        
//       let novonome = resposta
//       ficha_comandos.forEach(s=>{
//          if(acao==s){
//             //add ficha_player
//             if (verificar_permissao(fixa["permissoes"])==0) return message.channel.send('Permissao negada')           
//             fixa[`${s}`] = resposta;
//             db.get("ficha_player").find({comando: comandos}).assign(fixa).write()
//             message.channel.send(`${s} atualizado!`)
//          }        
//       })
//       if(acao=='ficha'){
//          if (verificar_permissao(fixa["permissoes"])==0) return message.channel.send('Permissao negada')     
//          let texto='```\n'   
//          texto+=`Ficha de personagem\n`  
//          texto+=`${fixa["descricao"]}\n`                
//          texto+='```' 
//          texto+=`${fixa["aparencia"]}`        
//          message.channel.send(texto)   
//       }
//    } 


//  }

 


 






//   if(comando === "editar"){
//     if(!args[0])return message.channel.send('Você esqeceu do argumento ')
//     let [novonome] = args
//     db.get(message.guild.id).find({id: message.author.id}).assign({nick: novonome}).write()
//     message.channel.send('Perfil editado com sucesso!')
//  }
//   if(comando === "apagar"){
//     db.get(message.guild.id).remove({id: message.author.id}).write()
//   }
//   if(comando === "perfil"){
//     db.get(message.guild.id).remove({id: message.author.id}).write()
//   }

//   //criar skill
//  if(comando === "criarskill"){
//    if(!args[0])return message.channel.send('Você esqeceu do argumento ')
//    let [novonome] = args
//    db.get("skill").push({
//       id: message.author.id,
//       comando: novonome,
//       comandoPlus: `${novonome}+`,
//       skill:"",
//       nome:"",
//       descricao:""
      
//     }).write()     
//     message.channel.send(`Comando '${novonome}' criado!`)        
//  }


//  if(comando.indexOf("+") !== -1){
//    var comando_acao = comando.split("+");
//    console.log(resposta)
//    let comandos=comando_acao[0]
//    let acao=comando_acao[1]
//    let com = db.get("skill").find({comando: comandos}).value()
//    if(com!=undefined){      
//       if(comandos===com["comando"]){ 
//          if(!args[0])return message.channel.send('Você esqeceu do argumento ')
//          let novonome = resposta
//          switch(acao){
//             case "nome":
//                db.get("skill").find({comando: comandos}).assign({nome: novonome}).write()
//                message.channel.send('Nome criada')  
//             break;
//             case "descricao":
//                db.get("skill").find({comando: comandos}).assign({descricao: novonome}).write()
//                message.channel.send('Descrição criada')  
//             break
//             default:
//                message.channel.send('Atributo invalido')  
//          }
         
         
        
        
          
//       }else{
//          message.channel.send(`Comando`) 
//       } 
//    }
//  }else{
//    let com = db.get("skill").find({comando: comando}).value()
//    if(com!=undefined){
//       if(comando===`${com["comando"]}`){
//          let msn=''
//          msn+=`ㅤㅤㅤㅤㅤㅤㅤㅤㅤ           **${com["nome"]}**\n`
//          msn+=`➤**Descrição:** ${com["descricao"]} \n`
//          msn+=`ㅤㅤㅤㅤㅤ ㅤㅤ⎧ᥨ䨻䨻䨻䨻᥊「 Efeitos 」᥊䨻䨻䨻䨻⎞⎰`

//         message.channel.send(msn)   
//       }
//    }
//  }

});

client.login(config.token)