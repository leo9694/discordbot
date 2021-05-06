const Discord = require("discord.js"); //baixar a lib discord.js
const client = new Discord.Client(); 
const config = require("./config.json"); 

const low = require('lowdb') //banco de dados
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('banco.json')
const db = low(adapter)

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
  
//STATUS
  if(comando === "status") {
    valor = db.get("status").find({id: message.author.id}).value()
    console.log(valor)
    if(valor === undefined){
        db.get("status").push({
            id: message.author.id,
            nick: message.author.username,      
            avatar: message.author.displayAvatarURL,
            forca: '',
            defesa: '',
            agilidade: '',
            individualidade: '',
            total_fisico: '', 
          }).write()   
          message.channel.send(`status criado`)        
    }else{
        let msn=""
        msn+="----------------------------------------\n"
        msn+="- - - - - - Atributos Físicos - - - - - -\n"
        msn+=`➤ Força [FF]: **{${valor["forca"]}}**\n➤ Defesa [DEF]: **{${valor["defesa"]}}**\n`
        msn+=`➤ Agilidade [AGI]: **{${valor["agilidade"]}}**\n➤ Individualidade [IND]: **{${valor["individualidade"]}}**\n`
        msn+="-----------------------------------------\n"
        msn+=`➤ Total Físico [TOTF]: **{${valor["total_fisico"]}}**\n`
        msn+="-----------------------------------------\n"
        msn+="- - - - - - Atributos Mentais - - - - - - \n "
        msn+="----------------------------------------\n"        
        msn+=""
        message.channel.send(msn)        
    }     
   }  
//comandos add status
    switch(comando){
      case "ff":
         db.get("status").find({id: message.author.id}).assign({forca: args}).write()
         message.channel.send('FF atualizado!')  
      break;
      case "def":
         db.get("status").find({id: message.author.id}).assign({defesa: args}).write()
         message.channel.send('DEf atualizado!')  
      break;
      case "agi":
         db.get("status").find({id: message.author.id}).assign({agilidade: args}).write()
         message.channel.send('AGI atualizado!')  
      break;  
      case "ind":
         db.get("status").find({id: message.author.id}).assign({individualidade: args}).write()
         message.channel.send('IND atualizado!')  
      break;
      case "totf":
         db.get("status").find({id: message.author.id}).assign({total_fisico: args}).write()
         message.channel.send('totf atualizado!')  
      break;
      
      
      // case "":
      //    db.get("").find({id: message.author.id}).assign({: args}).write()
      //    message.channel.send(' atualizado!')  
      // break;             
   }  



   //comandos random
function buscar_comando(comando){
   valor = db.get("comandos").find({comando: comando}).value()
   if (valor==undefined) return ''
   return valor
}
function verificar_permissao(cargos_comando){
   const member = message.guild.member(message)
   cargos_membro = member._roles
   result=0  
  if(Array.isArray(cargos_comando)){
      cargos_membro.forEach(cargo_membro => {
         cargos_comando.forEach(cargo_comando => {
            console.log(cargo_membro.toString(),'+++', cargo_comando.toString())
            if(cargo_membro.toString()==cargo_comando.toString()){      
               result= 1
            }
         })
         
      }); 
   }else{
      cargos_membro.forEach(cargo_membro => {         
            console.log(cargo_membro,'+++', cargos_comando)
            if(cargo_membro==cargos_comando){      
               result= 1
            }        
         
      });
   }
   
   return result
}
function contador(elementos){
   let i=0
   if (elementos==undefined) return i=1 
   elementos.forEach(elem =>{
      i=i+1
   })
   return i
}

switch (comando){     
      case "comando":         
      if (resposta=='') return message.channel.send('Digite o nome do comando!')
      if (verificar_permissao(adm)==0) return message.channel.send('Permissao negada')
      valor =  db.get("comandos").value()
      let permissoes=[adm]
      db.get("comandos").push({
         id: contador(valor),
         comando: resposta,      
         permissoes: permissoes,
         descricao: ''       
       }).write()          
       return  message.channel.send('adicionado')        
      break; 

      case 'comandos':
         let msn='``'
         valor =  db.get("comandos").value()         
         valor.forEach(v=>{
            msn+=`/${v["comando"]}\n`
         })
         msn+='``'
         return message.channel.send(msn)
      break

      case 'ficha_npc':
         if (resposta=='') return message.channel.send('Digite o nome do comando!')         
         if (verificar_permissao(adm)==0) return message.channel.send('Permissao negada')
         valor =  db.get("ficha_npc").value()         
         db.get("ficha_npc").push({
            id: contador(valor),
            comando: resposta,      
            permissoes: [adm],
            descricao: '' ,
            attr:'',
            funcao: '',
            status: '',
            historia: '',
            aparencia: '',
            quirk: ''      
          }).write()          
          return  message.channel.send('Npc adicionado') 
      break;
      case 'fichas_npc':
         let m='``'
         valor =  db.get("ficha_npc").value()         
         valor.forEach(v=>{
            m+=`/${v["comando"]}-descricao\n`
         })
         m+='``'
         return message.channel.send(m)
      break

          

}
//show comando
valor=buscar_comando(comando) 
if(valor!=undefined){  
   if(comando==valor["comando"]){
      if (verificar_permissao(valor["permissoes"])==0) return message.channel.send('Permissao negada')
            let men=''
            men+=`${valor["descricao"]}`
            message.channel.send(men)
   }
}
//show ficha_npc
let ficha = db.get("ficha_npc").find({comando: comando}).value()
if(ficha!=undefined){  
   if(comando==ficha["comando"]){  
      if (verificar_permissao(ficha["permissoes"])==0) return message.channel.send('Permissao negada')    
            let men=''
            men+=`${ficha["aparencia"]}\n`
            men+="```"
            men+=`${ficha["descricao"]}\n`
            men+=`${ficha["attr"]}`
            men+="```"
            
            
            message.channel.send(men)
   }
}
//ediçoes nos comandos em geral

 if(comando.indexOf("-") !== -1){   
    let permissoes
   var comando_acao = comando.split("-");
   console.log(resposta)
   let comandos=comando_acao[0]
   let acao=comando_acao[1]

   //comandos edição
   let com = db.get("comandos").find({comando: comandos}).value()
   if(com!=undefined){     
         if(!args[0])return message.channel.send('Você esqeceu do argumento ')
         if (verificar_permissao(adm)==0) return message.channel.send('Permissao negada')
         let novonome = resposta
         switch(acao){
            case "addpermissao":
               permissoes=com["permissoes"]
               permissoes.push(novonome)
               db.get("comandos").find({comando: comandos}).assign({permissoes: permissoes}).write()
               message.channel.send('Permissão adicionada')  
            break;
            case 'descricao':
               db.get("comandos").find({comando: comandos}).assign({descricao: novonome}).write()
               message.channel.send('Descrição adicionada') 
            break;  
            case('rmvpermissao'):
               permissoes=com["permissoes"]
               permissoes.push(novonome)
               db.get("comandos").find({comando: comandos}).assign({nome: permissoes}).write()
               message.channel.send('Permissão adicionada')   
            break;    
            default:
               message.channel.send('Atributo invalido')  
            
         }              
   }
   // ficha edição   
   let ficha = db.get("ficha_npc").find({comando: comandos}).value()
   if (ficha!= undefined){        
      let novonome = resposta
      switch(acao){
         case 'permissao':
            if (verificar_permissao(ficha["permissoes"])==0) return message.channel.send('Permissao negada')
            permissoes=ficha["permissoes"]
               permissoes.push(novonome)
               db.get("comandos").find({comando: comandos}).assign({permissoes: permissoes}).write()
               message.channel.send('Permissão adicionada') 
         break;
         case 'add_descricao':
            if (verificar_permissao(ficha["permissoes"])==0) return message.channel.send('Permissao negada')
            db.get("ficha_npc").find({comando: comandos}).assign({descricao: resposta}).write()
            message.channel.send('Descrição adicionada') 
         break;
         case 'add_atributo':
            if (verificar_permissao(ficha["permissoes"])==0) return message.channel.send('Permissao negada')
            db.get("ficha_npc").find({comando: comandos}).assign({attr: resposta}).write()
            message.channel.send('Atributo adicionado') 
         break;
         case 'add_aparencia':
            if (verificar_permissao(ficha["permissoes"])==0) return message.channel.send('Permissao negada')
            db.get("ficha_npc").find({comando: comandos}).assign({aparencia: resposta}).write()
            message.channel.send('Aparencia adicionado') 
         break;
         case 'add_funcao':
            if (verificar_permissao(ficha["permissoes"])==0) return message.channel.send('Permissao negada')
            db.get("ficha_npc").find({comando: comandos}).assign({funcao: resposta}).write()
            message.channel.send('Função adicionado') 
         break;
         case 'add_historia':
            if (verificar_permissao(ficha["permissoes"])==0) return message.channel.send('Permissao negada')
            db.get("ficha_npc").find({comando: comandos}).assign({historia: resposta}).write()
            message.channel.send('Historia adicionado') 
         break;
         case 'add_quirk':
            if (verificar_permissao(ficha["permissoes"])==0) return message.channel.send('Permissao negada')
            db.get("ficha_npc").find({comando: comandos}).assign({quirk: resposta}).write()
            message.channel.send('Quirk adicionado') 
         break;
         case 'descricao':            
            let men='' 
            men+=`${ficha["aparencia"]}\n`  
            men+="```"         
            men+=`${ficha["descricao"]}\n`            
            men+=`➤ Função: ${ficha["funcao"]}\n`
            men+=`➤ História: ${ficha["historia"]}\n`
            men+=`➤ Quirk: ${ficha["quirk"]}`
            men+="```\n"            
            message.channel.send(men)
         break;
        
      }

   }
 }

 

//Criar ficha
 



  if(comando === "editar"){
    if(!args[0])return message.channel.send('Você esqeceu do argumento ')
    let [novonome] = args
    db.get(message.guild.id).find({id: message.author.id}).assign({nick: novonome}).write()
    message.channel.send('Perfil editado com sucesso!')
 }
  if(comando === "apagar"){
    db.get(message.guild.id).remove({id: message.author.id}).write()
  }
  if(comando === "perfil"){
    db.get(message.guild.id).remove({id: message.author.id}).write()
  }


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