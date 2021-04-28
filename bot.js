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
        // ➤ Agilidade [AGI]: 
        // ➤ Individualidade [IND]
        // ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
        // ➤ Total Físico [TOTF]: 
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
        // db.get(message.guild.id).push({
        //     id: message.author.id,
        //     nick: message.author.username,      
        //     avatar: message.author.displayAvatarURL,
        //     status: ''
        //   }).write()   
        //   message.channel.send(`status criado`)
    }
    if(comando === "ff"){
        if(!args[0])return message.channel.send('Você esqeceu do argumento ')
        let [novonome] = args
        db.get("status").find({id: message.author.id}).assign({forca: novonome}).write()
        message.channel.send('Atualizado!!')
     }
     if(comando === "def"){
        if(!args[0])return message.channel.send('Você esqeceu do argumento ')
        let [novonome] = args
        db.get("status").find({id: message.author.id}).assign({defesa: novonome}).write()
        message.channel.send('Atualizado!!')
     }
     if(comando === "agi"){
        if(!args[0])return message.channel.send('Você esqeceu do argumento ')
        let [novonome] = args
        db.get("status").find({id: message.author.id}).assign({agilidade: novonome}).write()
        message.channel.send('Atualizado!!')
     }
     if(comando === "ind"){
        if(!args[0])return message.channel.send('Você esqeceu do argumento ')
        let [novonome] = args
        db.get("status").find({id: message.author.id}).assign({individualidade: novonome}).write()
        message.channel.send('Atualizado!!')
     }
     if(comando === "totf"){
        if(!args[0])return message.channel.send('Você esqeceu do argumento ')
        let [novonome] = args
        db.get("status").find({id: message.author.id}).assign({total_fisico: novonome}).write()
        message.channel.send('Atualizado!!')
     }
    
    if(comando === "editar"){
        if(!args[0])return message.channel.send('Você esqeceu do argumento ')
        let [novonome] = args
        db.get(message.guild.id).find({id: message.author.id}).assign({nick: novonome}).write()
        message.channel.send('Perfil editado com sucesso!')
     }
    if(comando === "editar"){
        if(!args[0])return message.channel.send('Você esqeceu do argumento ')
        let [novonome] = args
        db.get(message.guild.id).find({id: message.author.id}).assign({nick: novonome}).write()
        message.channel.send('Perfil editado com sucesso!')
     }
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


  //criar skill
 if(comando === "criarskill"){
   if(!args[0])return message.channel.send('Você esqeceu do argumento ')
   let [novonome] = args
   db.get("skill").push({
      id: message.author.id,
      comando: novonome,
      comandoPlus: `${novonome}+`,
      skill:"",
      nome:"",
      descricao:""
      
    }).write()     
    message.channel.send(`Comando '${novonome}' criado!`)        
 }


 if(comando.indexOf("+") !== -1){
   var comando_acao = comando.split("+");
   console.log(resposta)
   let comandos=comando_acao[0]
   let acao=comando_acao[1]
   let com = db.get("skill").find({comando: comandos}).value()
   if(com!=undefined){      
      if(comandos===com["comando"]){ 
         if(!args[0])return message.channel.send('Você esqeceu do argumento ')
         let novonome = resposta
         switch(acao){
            case "nome":
               db.get("skill").find({comando: comandos}).assign({nome: novonome}).write()
               message.channel.send('Nome criada')  
            break;
            case "descricao":
               db.get("skill").find({comando: comandos}).assign({descricao: novonome}).write()
               message.channel.send('Descrição criada')  
            break
            default:
               message.channel.send('Atributo invalido')  
         }
         
         
        
        
          
      }else{
         message.channel.send(`Comando`) 
      } 
   }
 }else{
   let com = db.get("skill").find({comando: comando}).value()
   if(com!=undefined){
      if(comando===`${com["comando"]}`){
         let msn=''
         msn+=`ㅤㅤㅤㅤㅤㅤㅤㅤㅤ           **${com["nome"]}**\n`
         msn+=`➤**Descrição:** ${com["descricao"]} \n`
         msn+=`ㅤㅤㅤㅤㅤ ㅤㅤ⎧ᥨ䨻䨻䨻䨻᥊「 Efeitos 」᥊䨻䨻䨻䨻⎞⎰`

        message.channel.send(msn)   
      }
   }
 }

});
client.login(config.token)