const moment = require('moment')
const Discord = require("discord.js"); //baixar a lib discord.js
const client = new Discord.Client(); 
const config = require("./config.json"); 
const low = require('lowdb') //banco de dados
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('banco.json')
const db = low(adapter)
const status_comandos=['ff','def','agi','ind','totf','pu','int','anal','totm','cab','caf','cam','cei','test','qtrf','qtrm','nivel','mec']
const ficha_comandos=['descricao','quirk','personalidade','historia','aparencia']
const bot_attr=['nome','rank','aparencia','descricao','quirk','nomeheroi','genero','aniversario','idade','altura','peso','explicacaoquirk','personalidade']
const bot_skill=['comando','nome','descricao','cd','aparencia','categoria','alcance','efeito','anula','fraquezas']
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
  const adm = ['834960983797399623','853736404567719958']




function verificar_permissao(cargos_comando){
   const member = message.guild.member(message)
   cargos_membro = member._roles
   result=0  
  if(Array.isArray(cargos_comando)){
      cargos_membro.forEach(cargo_membro => {
         cargos_comando.forEach(cargo_comando => {            
            if(cargo_membro.toString()==cargo_comando.toString()){      
               result= 1
            }
         })
         
      }); 
   }else{
      cargos_membro.forEach(cargo_membro => {           
            if(cargo_membro==cargos_comando){      
               result= 1
            }        
         
      });
   }
   
   return result
}

  function registrar(funcao, resposta,permissoes){
   bot = new Object
   bot.nome=''
   bot.funcao=funcao
   bot.permissoes=adm.concat(permissoes)
   bot.comando = resposta
   bot.rank=''
   bot.aparencia=''
   bot.descricao=''
   bot.quirk=''
   bot.hp_minimo=0
   bot.hp_maximo=0
   bot.status = new Object
       bot.status.def=0
       bot.status.ff=0
       bot.status.agi=0
       bot.status.mec=0 
       bot.status.ind=0
       bot.status.pu=0
       bot.status.int=0
       bot.status.anal=0
       bot.status.cab=0
       bot.status.caf=0
       bot.status.cam=0
       bot.status.cei=0  
   if(funcao=='ficha') bot.aprovacao=0
   return bot
}


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
function calculo_string(calculo,bot){
   calculo=calculo.toLowerCase().replace(/[,]/g,'.');
   status_comandos.forEach(s=>{      
      calculo=calculo.split(s).join(bot.status[`${s}`]);             
    })
    console.log(calculo)
    return calculo
}
function retorna_hp(hp_minimo,hp_maximo){   
   let randon = parseInt(Math.random() * (hp_maximo - hp_minimo) + hp_minimo)   
    return randon
}
function retorna_randon(n){
   let randon = parseInt(Math.random() * (n - 0) + 0)   
    return randon

}

function array_random(array){
   return array[Math.floor(Math.random() * array.length)]
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
   
   cd = db.get("cd").find({comando: skill.comando,bot_comando:skill.bot_comando , user: message.author.id}).value()
   let c=(parseInt(skill.cd))*60*1000
   console.log(message.author)
   if(cd!=undefined){      
      if(compararHora(hora,cd.tempo_final)==true){
         cd.tempo_final=moment(hora, 'hh:mm').add(parseInt(skill.cd)-1, 'minutes').format('hh:mm')
         db.get("cd").find({comando: skill.comando, bot_comando: skill.bot_comando , user: message.author.id}).assign(cd).write()
         setTimeout(() => {            
            db.get("cd").remove({comando: skill.comando, bot_comando: skill.bot_comando , user: message.author.id}).write()
            message.reply(`Skill ":${skill.bot_comando} ${skill.comando}" habilitada`)
          }, c);
         return true
      } else{
         return false
      }    
   }else{
      cd =new Object
      cd.user=message.author.id
      cd.bot_comando=skill.bot_comando
      cd.comando=skill.comando
      cd.tempo_final=moment(hora, 'hh:mm').add(parseInt(skill.cd)-1, 'minutes').format('hh:mm')
      db.get("cd").push(cd).write() 
      setTimeout(() => {
         db.get("cd").remove({comando: skill.comando, bot_comando: skill.bot_comando , user: message.author.id}).write()   
         message.reply(`Skill "%${skill.bot_comando} ${skill.comando}" habilitada`)
       }, c);
      return true 
   }

}function retorna_hp(hp_minimo,hp_maximo){   
   let randon = parseInt(Math.random() * (hp_maximo - hp_minimo) + hp_minimo)   
    return randon
}
function total(ff,def,ind,mec){
   return ff+def+ind+mec
}
function tutorial(variavel,comando,atributo){
   let texto=''
   if(variavel==''){

   }
}
function view_status_npc(npc){
   let msn=''   
   msn+= '```ini\n'
   msn+=`⪻Atributos Físicos⪼ [${npc.nome}] \n`   
   msn+="-------------------\n" 
   msn+=`➤ NIVEL: [${npc.status.nivel}]\n`
   msn+=`➤ HP: [${parseInt(npc.status.nivel)*1000+parseInt(npc.status.def)*8}]\n`
   msn+="-------------------\n" 
   msn+=`➤ Força (ff): [${npc.status.ff}]\n`
   msn+=`➤ Defesa (def): [${npc.status.def}]\n`
   msn+=`➤ Agilidade (agi): [${npc.status.agi}]\n`
   msn+=`➤ Individualidade (ind): [${npc.status.ind}]\n`
   msn+=`➤ Total Físico (totf):[${parseInt(npc.status.ff)+parseInt(npc.status.def)+parseInt(npc.status.agi)+parseInt(npc.status.ind)}]\n`
   msn+='⪻Atributos Mentais⪼\n'
   msn+=`➤ Plus Ultra (pu): [${npc.status.pu}]\n`
   msn+=`➤ Inteligência (int) [${npc.status.int}]\n`
   msn+=`➤ Análise (anal): [${npc.status.anal}]\n`    
   msn+=`➤ Total Mental (totm): [${parseInt(npc.status.pu)+parseInt(npc.status.int)+parseInt(npc.status.anal)}]\n`
   msn+='⪻Atributos Mentais⪼\n'
   msn+=`➤ Combate com Arma Branca (cab): [${npc.status.cab}]\n`
   msn+=`➤ Combate a Distancia (caf): [${npc.status.caf}]\n`
   msn+=`➤ Combate com Artes Marciais (cam): [${npc.status.cam}]\n`
   msn+=`➤ Combate Especialista em Individualidade (cei): [${npc.status.cei}]\n`
   msn+=`➤ Proficiência em Testes (test): [${npc.status.test}]\n`
   msn+="```\n"  
   return msn
}
function view_status_ficha(npc){
   let msn=''   
   msn+= '```ini\n'
   msn+=`⪻Atributos Físicos⪼ [${npc.nome}] ${(npc.status.aprovacao==1)?'[Aprovado]':'Pendente'}\n`   
   msn+="-------------------\n" 
   msn+=`➤ NIVEL (nivel): [${npc.status.nivel}]\n`
   msn+=`➤ HP base: [${parseInt(npc.status.nivel*1000+parseInt(npc.status.def)*8)}]\n`
   msn+=`➤ HP atual: [${calcular_hp(npc)}]\n`
   msn+="-------------------\n" 
   msn+=`➤ Força (ff): [${npc.status.ff}]\n`
   msn+=`➤ Defesa (def): [${npc.status.def}]\n`
   msn+=`➤ Agilidade (agi): [${npc.status.agi}]\n`
   msn+=`➤ Individualidade (ind): [${npc.status.ind}]\n`
   msn+=`➤ Total Físico:[${parseInt(npc.status.ff)+parseInt(npc.status.def)+parseInt(npc.status.agi)+parseInt(npc.status.ind)}]\n`
   msn+='⪻Atributos Mentais⪼\n'
   msn+=`➤ Plus Ultra (pu): [${npc.status.pu}]\n`
   msn+=`➤ Inteligência (int) [${npc.status.int}]\n`
   msn+=`➤ Análise (anal): [${npc.status.anal}]\n`    
   msn+=`➤ Total Mental: [${parseInt(npc.status.pu)+parseInt(npc.status.int)+parseInt(npc.status.anal)}]\n`
   msn+='⪻Atributos Marciais⪼\n'
   msn+=`➤ Combate com Arma Branca (cab): [${npc.status.cab}]\n`
   msn+=`➤ Combate a Distancia (caf): [${npc.status.caf}]\n`
   msn+=`➤ Combate com Artes Marciais (cam): [${npc.status.cam}]\n`
   msn+=`➤ Combate Especialista em Individualidade (cei): [${npc.status.cei}]\n`
   msn+=`➤ Proficiência em Testes (test): [${(npc.status.test==undefined) ? `0`:npc.status.test}]\n`
   msn+='⪻Treinos⪼\n'
   msn+=`➤ Quantidade de treinos físicos realizados (qtrf): [${(npc.status.qtrf==undefined) ? `0`:npc.status.qtrf}]\n`
   msn+=`➤ Quantidade de treinos mentais realizados (qtrm): [${(npc.status.qtrm==undefined) ? `0`:npc.status.qtrm}]\n`
   msn+="```\n"  
   return msn
}
function view_status_ficha_antiga(npc){
   let total_f_novo=parseInt(npc.status.ff)+parseInt(npc.status.def)+parseInt(npc.status.agi)+parseInt(npc.status.ind)
   let total_m_novo=parseInt(npc.status.pu)+parseInt(npc.status.int)+parseInt(npc.status.anal)
   let total_mc_novo=parseInt(npc.status.cab)+parseInt(npc.status.caf)+parseInt(npc.status.cam)+parseInt(npc.status.cei)
   status_antigo=JSON.parse(npc.status_apv)
   let total_f=parseInt(status_antigo.ff)+parseInt(status_antigo.def)+parseInt(status_antigo.agi)+parseInt(status_antigo.ind)
   let total_m=parseInt(status_antigo.pu)+parseInt(status_antigo.int)+parseInt(status_antigo.anal)
   let total_mc=parseInt(status_antigo.cab)+parseInt(status_antigo.caf)+parseInt(status_antigo.cam)+parseInt(status_antigo.cei)
   let msn=''
   msn+= '```CSS\n'
   msn+=`⪻Atributos Físicos⪼ [${npc.nome}]  \n`
   msn+="-------------------\n"
   msn+="      ANTIGO\n"
   msn+="-------------------\n"
   msn+=`➤ Força (ff): [${status_antigo.ff}]\n`
   msn+=`➤ Defesa (def): [${status_antigo.def}]\n`
   msn+=`➤ Agilidade (agi): [${status_antigo.agi}]\n`
   msn+=`➤ Individualidade (ind): [${status_antigo.ind}]\n`
   msn+=`➤ Total Físico: [${total_f}]\n`
   msn+='⪻Atributos Mentais⪼\n'
   msn+=`➤ Plus Ultra (pu): [${status_antigo.pu}]\n`
   msn+=`➤ Inteligência (int) [${status_antigo.int}]\n`
   msn+=`➤ Análise (anal): [${status_antigo.anal}]\n`
   msn+=`➤ Total Mental: [${parseInt(status_antigo.pu)+parseInt(status_antigo.int)+parseInt(status_antigo.anal)}]\n`
   msn+='⪻Atributos Marciais⪼\n'
   msn+=`➤ Combate com Arma Branca (cab): [${status_antigo.cab}]\n`
   msn+=`➤ Combate a Distancia (caf): [${status_antigo.caf}]\n`
   msn+=`➤ Combate com Artes Marciais (cam): [${status_antigo.cam}]\n`
   msn+=`➤ Combate Especialista em Individualidade (cei): [${status_antigo.cei}]\n`
   msn+=`➤ Proficiência em Testes (test): [${(status_antigo.test==undefined) ? `0`:status_antigo.test}]\n`
   msn+='⪻Treinos⪼\n'
   msn+=`➤ Quantidade de treinos físicos realizados (qtrf): [${(status_antigo.qtrf==undefined) ? `0`:status_antigo.qtrf}]\n`
   msn+=`➤ Quantidade de treinos mentais realizados (qtrm): [${(status_antigo.qtrm==undefined) ? `0`:status_antigo.qtrm}]\n\n`
   msn+=`➤ Pontos fisicos distribuidos: [${total_f_novo-total_f}]\n`
   msn+=`➤ Pontos mentais distribuidos: [${total_m_novo-total_m}]\n`
   msn+=`➤ Pontos marciais distribuidos: [${total_mc_novo-total_mc}]\n`
   msn+="```\n"  
   return msn
}
function view_npc(npc){
   let msn=''   
   msn+= '```ini\n'
   msn+=`
   [⫘⫘⫘⫘⫘⫘⫘⫘]
   Ficha de NPC 
   [⫘⫘⫘⫘⫘⫘⫘⫘]\n\n`
   msn+=`➤ Nome: `
   msn+=(bot.nome==undefined || bot.nome=='') ? `(%${bot.comando}-nome Nome)\n` : `${bot.nome}\n`
   msn+='➤ Titulo: '    
   msn+=(bot.nomeheroi==undefined || bot.nomeheroi=='') ? `(%${bot.comando}-nomeheroi Seu nome de Heroi)\n` : `${bot.nomeheroi}\n`
   msn+='➤ Idade: '   
   msn+=(bot.idade==undefined || bot.idade=='') ? `(%${bot.comando}-idade Idade)\n` : `${bot.idade}\n`
   msn+='➤ Gênero: '  
   msn+=(bot.genero==undefined || bot.genero=='') ? `(%${bot.comando}-genero Genero)\n` : `${bot.genero}\n`
   msn+=`⫘⫘⫘⫘⫘⫘⫘⫘\n`
   msn+='➤ Individualidade: '   
   msn+=(bot.quirk==undefined || bot.quirk=='') ? `(%${bot.comando}-quirk Nome da sua quirk)\n` : `${bot.quirk}\n`
   msn+='➤ Explicação sobre a individualidade: ' 
   msn+=(bot.explicacaoquirk==undefined || bot.explicacaoquirk=='') ? `(%${bot.comando}-explicacaoquirk A explicação sobre sua quirk)\n` : `${bot.explicacaoquirk}\n`  
   msn+="```\n" 
   msn+=(bot.aparencia==undefined || bot.aparencia=='') ? `Add Aparencia (%${bot.comando}-aparencia link_da_imagem)\n` : ``

   return msn
}
function view_ficha(bot){
   let msn=''   
   msn+= '```ini\n'
   msn+=`
   ⫘⫘⫘⫘⫘⫘⫘⫘
   Ficha de personagem - ${(bot.aprovacao==0) ? 'Pendente ⨂':'[Aprovado ⨀]'}
   ⫘⫘⫘⫘⫘⫘⫘⫘\n\n`
   msn+=`➤ Nome: `
   msn+=(bot.nome==undefined || bot.nome=='') ? `(%${bot.comando}-nome Nome)\n` : `${bot.nome}\n`
   msn+='➤ Nome de Herói: '    
   msn+=(bot.nomeheroi==undefined || bot.nomeheroi=='') ? `(%${bot.comando}-nomeheroi Seu nome de Heroi)\n` : `${bot.nomeheroi}\n`
   msn+='➤ Idade: '   
   msn+=(bot.idade==undefined || bot.idade=='') ? `(%${bot.comando}-idade Idade)\n` : `${bot.idade}\n`
   msn+='➤ Gênero: '   
   msn+=(bot.genero==undefined || bot.genero=='') ? `(%${bot.comando}-genero Genero)\n` : `${bot.genero}\n`
   msn+='➤ Aniversário: '   
   msn+=(bot.aniversario==undefined || bot.aniversario=='') ? `(%${bot.comando}-aniversario Data de aniversario)\n` : `${bot.aniversario}\n`
   msn+='➤ Peso: '  
   msn+=(bot.peso==undefined || bot.peso=='') ? `(%${bot.comando}-peso Peso em kg)\n` : `${bot.peso}\n`
   msn+='➤ Altura: ' 
   msn+=(bot.altura==undefined || bot.altura=='') ? `(%${bot.comando}-altura Sua altura)\n` : `${bot.altura}\n`
   msn+=`⫘⫘⫘⫘⫘⫘⫘⫘\n`
   msn+='➤ Individualidade: '   
   msn+=(bot.quirk==undefined || bot.quirk=='') ? `(%${bot.comando}-quirk Nome da sua quirk)\n` : `${bot.quirk}\n`
   msn+='➤ Explicação sobre a individualidade: ' 
   msn+=(bot.explicacaoquirk==undefined || bot.explicacaoquirk=='') ? `(%${bot.comando}-explicacaoquirk A explicação sobre sua quirk)\n` : `${bot.explicacaoquirk}\n`
   msn+=`⫘⫘⫘⫘⫘⫘⫘⫘\n`
   msn+='➤ Personalidade: ' 
   msn+=(bot.personalidade==undefined || bot.personalidade=='') ? `(%${bot.comando}-personalidade Os detalhes da sua personalidade)\n` : `${bot.personalidade}\n`
   msn+="```\n"  
   msn+=(bot.aparencia==undefined || bot.aparencia=='') ? `Add Aparencia (%${bot.comando}-aparencia link_da_imagem)\n` : ``
   return msn
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
   return msn
}


function view_skill(skill){
   let msn=''    
   msn+=`${skill.aparencia}\n`
   msn+='```ini\n'   
   msn+=`${skill.descricao}\n` 
   msn+=`[➤CoolDown:] ${skill.cd} minutos\n`
   msn+=`*Imagem Ilustrativa*\n`
   msn+='```'  
   msn+="\n"
   return msn
} function view_skill_ficha(skill){
   let msn=''
   if(skill.aparencia!='') msn+=`${skill.aparencia}\n`
   msn+= '```ini\n'   
   msn+=(skill.descricao==undefined || skill.descricao=='') ? `***Add a skill de acordo com o modelo de descrição, para isso use o comando*** \n%${skill.bot_comando}-${skill.comando}-descricao\n` : `${skill.descricao}\n`
   msn+=(skill.cd==undefined || skill.cd=='0'||skill.cd=='' ) ? `***Add o tempo de recarga da habilidade*** \n%${skill.bot_comando}-${skill.comando}-cd\n` : `[CoolDown:] ${skill.cd}\n`
   msn+=(skill.aparencia==undefined || skill.aparencia=='') ? `***Add uma Imagem para a skill*** \n%${skill.bot_comando}-${skill.comando}-aparencia\n` : ``
   msn+="```\n"
   msn+=''  
   msn+="\n"
   return msn
} 
function retorna_aparencia(skill){
   if(skill.aparencia=='') return 'https://cdn.discordapp.com/attachments/839476218947567686/852911578386661416/TVKYR0CL3RE1w8xvnvDD52BWz_55dcCUA4j6e2jLBSnmuC-uddHtolQACjUMZInQc5GhvQLsdpmYL7FGVJxIz6mTGtckb0Cg2iyI.png'
   return skill.aparencia
}
function verificar_existencia_comando(comando){
   let valor
   valor = db.get("comandos").find({comando: comando}).value()        
   valor = db.get("fichas_bots").find({comando: comando}).value()      
   console.log(valor)  
   if (valor!=undefined) return true
   return false
}
function criar_estilo(comando,bot_comando,descricao,aparencia,cd,classe){
   skill = new Object
   skill.bot_comando=bot_comando 
   skill.comando=comando 
   skill.descricao=descricao
   skill.aparencia=aparencia
   skill.cd=45
   skill.classe=classe
   db.get("skills").push(skill).write() 
}
function add_estilo(estilo,bot_comando){
   if(estilo=='cam-15'){
criar_estilo('cam-1',bot_comando,` ⪻ CAM 1 | DEFESA CRUZADA ⪼

[Rank] |• ➤ E
[Descrição] |• ➤ Cruza os seus braços na sua frente, fazendo uma defesa implacável
[Categoria] |• ➤ Defesa
[Alcance] ∘ |• ➤ Corpo a corpo
[Dano/Defesa] |• ➤ (RES+FF) *3
[Efeitos 2º] |• ➤ NP
[Anula] |• ➤ Ataque Básico
[Fraquezas] |• ➤ NP
[Efeito colateral] |• ➤ NP`,
      'https://cdn.discordapp.com/attachments/839476218947567686/849024140258181150/ColdRemarkableAstrangiacoral-max-1mb.gif',
      '60',
      'cam')
   
criar_estilo('cam-2',bot_comando,`⪻ CAM 2 | ARTE WUSHU ⪼

[Rank] |• ➤ E
[Descrição] |• ➤ Entra em estado de concentração durante a batalha, a partir do terceiro turno tem sua resistência aumentada até o final do combate. 
[Categoria] |• ➤ Suporte/Auto-buff
[Alcance] ∘ |• ➤ Corpo a corpo
[Dano/Defesa] |• ➤ Multiplca a RES, por 2
[Efeitos 2º] |• ➤ NP
[Anula] |• ➤ NP
[Fraquezas] |• ➤ NP
[Efeito colateral] |• ➤ NP`,
'https://cdn.discordapp.com/attachments/839476218947567686/849022078455513107/cefc5fe4e540d43a8a2a08c39091a7f0ba583aa9_hq.gif',
'60',
'cam')
criar_estilo('cam-3',bot_comando,`⪻ CAM 3 | SMAASH ⪼

[Rank] |• ➤ E
[Descrição] |• ➤ Avança em direção ao inimigo, acertando um soco preciso nele. 
[Categoria] |• ➤ Ataque
[Alcance] ∘ |• ➤ Corpo a corpo
[Dano/Defesa] |• ➤ (FF+RES)*3
[Efeitos 2º] |• ➤ NP
[Anula] |• ➤ Defesa e Esquiva Básica
[Fraquezas] |• ➤ NP
[Efeito colateral] |• ➤ NP`,
'https://cdn.discordapp.com/attachments/839476218947567686/849028058710016040/Boku_no_Hero_Academia_-_Episode_72_-_Fat_Gum_Punches_Hard.gif',
'60',
'cam')
}
if(estilo=='cad-15'){
criar_estilo('cad-1',bot_comando,`⪻ CAD 1 | ÁNALISE ⪼

[Rank] |• ➤ E
[Descrição] |• ➤ Ganha o direito de atacar primeiro, ignorando o sistema de status e fortificando seus golpes
[Categoria] |• ➤ Suporte / Autobuff
[Alcance] ∘ |• ➤ A distância
[Dano/Defesa] |• ➤ + (ANAL) nos próximos três golpes
[Efeitos 2º] |• ➤ NP
[Anula] |• ➤ NP
[Fraquezas] |• ➤ NP
[Efeito colateral] |• ➤ NP`,
'https://cdn.discordapp.com/attachments/839476218947567686/849703992459395142/CAD-01.gif',
'60',
'cam')
criar_estilo('cad-2',bot_comando,`⪻ CAD 2 | CONCENTRATION ⪼

[Rank] |• ➤ E
[Descrição] |• ➤ Adiciona mais poder a ataques a distância
[Categoria] |• ➤ Suporte / Auto-buff
[Alcance] ∘ |• ➤ A Distância 
[Dano/Defesa] |• ➤ + (*2) nos três próximos ataques básicos
[Efeitos 2º] |• ➤ NP
[Anula] |• ➤ NP
[Fraquezas] |• ➤ NP
[Efeito colateral] |• ➤ NP`,
'https://cdn.discordapp.com/attachments/839476218947567686/849706184227291188/CAD-02.gif',
'10',
'cam')
criar_estilo('cad-3',bot_comando,`⪻ CAD 3 | HIT&RUN ⪼

[Rank] |• ➤ E
[Descrição] |• ➤ Tradicional Bater e Correr. Aumenta a precisão de um ataque e logo em seguida corre pra longe
[Categoria] |• ➤ Ataque
[Alcance] ∘ |• ➤ A Distância 
[Dano/Defesa] |• ➤ + AGI*2 em 1 ATQ BÁsico
[Efeitos 2º] |• ➤ -30% De dano do Oponente no próximo ataque dele
[Anula] |• ➤ Defesa e Esquiva Básica
[Fraquezas] |• ➤ NP
[Efeito colateral] |• ➤ NP`,
'https://cdn.discordapp.com/attachments/839476218947567686/849721874262392842/CAD-3.gif',
'10',
'cam')
}
if(estilo=='cab-15'){
criar_estilo('cab-1',bot_comando,`⪻ CAB 1 | RIPOSTEIO ⪼

[Rank] |• ➤ E
[Descrição] |• ➤ Entra na frente de uma ataque inimigo o aparando, apenas se tiver mais agilidade que o inimigo.
[Categoria] |• ➤ Defesa
[Alcance] ∘ |• ➤ Corpo a Corpo
[Dano/Defesa] |• ➤ Condição - Ter mais agilidade que o inimigo
[Efeitos 2º] |• ➤ NP
[Anula] |• ➤ ATQ Básicos
[Fraquezas] |• ➤ NP
[Efeito colateral] |• ➤ NP`,
'https://cdn.discordapp.com/attachments/839476218947567686/849281634238595112/CAB-1.gif',
'10',
'cam')
criar_estilo('cab-2',bot_comando,`⪻ CAB 2 | COUNTER ⪼

[Rank] |• ➤ E
[Descrição] |• ➤ Caso possua mais agilidade que o inimigo, consegue uma defesa/esquiva dando um contra-ataque. Não gastando o turno de ataque
[Categoria] |• ➤ Contra - Ataque
[Alcance] ∘ |• ➤ Corpo a Corpo
[Dano/Defesa] |• ➤ AGI + FF *2
[Efeitos 2º] |• ➤ NP
[Anula] |• ➤ Defesas e Esquivas Simples
[Fraquezas] |• ➤ NP
[Efeito colateral] |• ➤ NP`,
'https://cdn.discordapp.com/attachments/839476218947567686/849377093598314536/CAB-2.gif',
'10',
'cam')
criar_estilo('cab-3',bot_comando,`⪻ CAB 3 | CORTE SIMPLES ⪼

[Rank] |• ➤ E
[Descrição] |• ➤ Ataque simples, feito com uma arma branca
[Categoria] |• ➤ Ataque
[Alcance] ∘ |• ➤ Corpo a Corpo
[Dano/Defesa] |• ➤ AGI*3
[Efeitos 2º] |• ➤ Sangramento 1
[Anula] |• ➤ Defesas Básicas
[Fraquezas] |• ➤ NP
[Efeito colateral] |• ➤ NP`,
'https://cdn.discordapp.com/attachments/839476218947567686/840230241393049661/download.gif',
'10',
'cam')
}
}

function addSoco(comando){
   skill = new Object
             skill.bot_comando=comando
             skill.comando='soco'
             skill.nome='Soco'
             skill.descricao='O Robô vai em sua direção lhe atacando com um soco direto'
             skill.cd='5'
             skill.aparencia='https://media.discordapp.net/attachments/839476218947567686/841279965533962250/4121247_orig.gif'
             skill.categoria='Ataque Normal '
             skill.alcance='Curta'             
             skill.efeito=''
             skill.anula='Defender'             
             skill.status=['FF*2','FF','FF+AGI']   
             skill.fraquezas=''         
         db.get("skills").push(skill).write() 
}
function addChute(comando){
   skill = new Object
             skill.bot_comando=comando
             skill.comando='chute'
             skill.nome='Chute '
             skill.descricao='O Robô vai em sua direção lhe atacando com um grande chute'
             skill.cd='5'
             skill.aparencia='https://media.discordapp.net/attachments/839476218947567686/841279970264612864/17vsgoku.jpg.gif'
             skill.categoria='Ataque Normal '
             skill.alcance='Curta'             
             skill.efeito=''
             skill.anula='Defender'             
             skill.status=['(FF+AGI)*2','FF*2','FF+AGI']   
             skill.fraquezas=''         
         db.get("skills").push(skill).write() 
}
function addEsquiva(comando){
   skill = new Object
             skill.bot_comando=comando
             skill.comando='desviar'
             skill.nome='Previsão '
             skill.descricao='O Robô consegue prever seus movimentos, esquivando deles'
             skill.cd='5'
             skill.aparencia='https://media.discordapp.net/attachments/839476218947567686/841387248402038784/1522181682_giphy_1.gif'
             skill.categoria='Defesa'
             skill.alcance='Curta'             
             skill.efeito=''
             skill.anula=''             
             skill.status=['(AGI+FF)*2','AGI*2','FF+AGI']   
             skill.fraquezas=''         
         db.get("skills").push(skill).write() 
}
function addDefesa(comando){
   skill = new Object
             skill.bot_comando=comando
             skill.comando='defender'
             skill.nome='Barreira '
             skill.descricao='O Robô cria uma barreira defendendo o golpe.'
             skill.cd='5'
             skill.aparencia='https://media.discordapp.net/attachments/839476218947567686/841328950038626324/533749abc4f5e47f86616dbc414424ed.gif'
             skill.categoria='Defesa'
             skill.alcance='Curta'             
             skill.efeito=''
             skill.anula=''             
             skill.status=['(DEF+FF)*2','DEF*2','DEF+FF']   
             skill.fraquezas=''         
         db.get("skills").push(skill).write() 
}
function addSocoFicha(comando){
   skill = new Object
             skill.bot_comando=comando
             skill.comando='soco'
             skill.nome='Soco'
             skill.descricao='Um poderoso soco, na direção do adversário'
             skill.cd='5'
             skill.aparencia='https://cdn.discordapp.com/attachments/839476218947567686/846386015387254844/b56e5d5c129fe711b9625b955c74fc044d03f5d1_00.gif'
             skill.categoria='Ataque'
             skill.alcance='Corpo a corpo'             
             skill.efeito=''
             skill.anula='Defender'             
             skill.status=['FF*2','FF+AGI','(FF+AGI)*2']   
             skill.fraquezas='Por ser extremamente simples, pode ser evitado'         
         db.get("skills").push(skill).write() 
}
function addChuteFicha(comando){
   skill = new Object
             skill.bot_comando=comando
             skill.comando='chute'
             skill.nome='Chute '
             skill.descricao='Um poderoso chute, na direção do adversário'
             skill.cd='5'
             skill.aparencia='https://media.discordapp.net/attachments/839476218947567686/846392923758526514/e0b8c6e59f362a941efc1837b3e589137628f9f0r1-480-260_hq.gif'
             skill.categoria='Ataque'
             skill.alcance='Curta'             
             skill.efeito='Por se tratar de uma técnica extremamente simples, ela não possue efeitos colaterais'
             skill.anula=''             
             skill.status=['(FF+AGI)*2','FF*2','FF+AGI']   
             skill.fraquezas='Por ser extremamente simples, pode ser evitado'         
         db.get("skills").push(skill).write() 
}
function addEsquivaFicha(comando){
   skill = new Object
             skill.bot_comando=comando
             skill.comando='desviar'
             skill.nome='Desviar '
             skill.descricao='Um desvio veloz'
             skill.cd='5'
             skill.aparencia='https://cdn.discordapp.com/attachments/839476218947567686/846396599961387088/WhimsicalMediocreAfricanfisheagle-size_restricted.gif'
             skill.categoria='Defesa'
             skill.alcance='Corpo a corpo'             
             skill.efeito=''
             skill.anula=''             
             skill.status=['(AGI+FF)*2','AGI*2','FF+AGI']   
             skill.fraquezas=''         
         db.get("skills").push(skill).write() 
}
function addDefesaFicha(comando){
   skill = new Object
             skill.bot_comando=comando
             skill.comando='defender'
             skill.nome='Defender '
             skill.descricao='Uma defesa poderosa'
             skill.cd='5'
             skill.aparencia='https://cdn.discordapp.com/attachments/836610893412171837/859794650025295892/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f.gif'
             skill.categoria='Defesa'
             skill.alcance='Curta'             
             skill.efeito=''
             skill.anula=''             
             skill.status=['(DEF+FF)*2','DEF*2','DEF+FF']   
             skill.fraquezas=''         
         db.get("skills").push(skill).write() 
}
function calcular_hp(bot){
   let hp=parseInt(bot.status.nivel)*1000+parseInt(bot.status.def)*8   
   let hp_atual=parseInt((bot.status.hp_atual==undefined)? 0: bot.status.hp_atual)  
   console.log(hp_atual)
   if(hp==hp_atual || hp_atual==0){
      return hp
   }else{
      return hp_atual
   }
   
}
function descansar(bot){
   let tempo=20*60000
   let hp=parseInt(bot.status.nivel)*1000+parseInt(bot.status.def)*8  
   let hp_atual=parseInt((bot.status.hp_atual==undefined)? hp: bot.status.hp_atual)    
      if(hp<hp_atual){
         bot.status.hp_atual=hp
         bot.status.descansando=1
         db.get("fichas_bots").find({comando: comando}).assign({status: bot.status}).write()
         return `Descansado! \nHP: ${bot.status.hp_atual}`
      }else if(hp==hp_atual){ 
         bot.status.descansando=1
         db.get("fichas_bots").find({comando: comando}).assign({status: bot.status}).write()       
         return `Descansado! \nHP: ${bot.status.hp_atual}`
      }else if(hp>hp_atual){
         hp_atual=hp_atual+parseInt(bot.status.def)*5
         if(hp_atual>hp || hp_atual==hp){
            bot.status.hp_atual=hp
            bot.status.descansando=1
            db.get("fichas_bots").find({comando: comando}).assign({status: bot.status}).write()
            return `Descansado! \nHP: ${bot.status.hp_atual}`
         }else{
            bot.status.hp_atual=hp_atual
            bot.status.descansando=0
            db.get("fichas_bots").find({comando: comando}).assign({status: bot.status}).write()
            setTimeout(() => {           
               descansar(bot)
            }, tempo);            
            return `Descansando! \nHP: ${bot.status.hp_atual}`
         }  
         
      }   
   
}

try{
if (verificar_comando(comando)==true){  
   if (verificar_comando_composto(comando)==false){       
      if(comando=='cadastrarbot'){
         if (verificar_permissao(adm)==0) return message.channel.send('Permissao negada')
         if(!args[0])return message.channel.send('Vc esqueceu de colocar o comando do seu bot!')         
         if(verificar_existencia_comando(resposta)==true) return message.channel.send('Ja existe um um cadastro com o comando %'+ resposta)
         db.get("fichas_bots").push(registrar('robo', resposta, adm) ).write()
         // addSoco(resposta)   
         // addChute(resposta)
         // addEsquiva(resposta)  
         // addDefesa(resposta)    
         let msn=''
         msn+=`Bot com o comando "***%${resposta}***" criado!\n`
         return message.channel.send(msn)

      }else if(comando=='cadastrarnpc'){
         if (verificar_permissao(adm)==0) return message.channel.send('Permissao negada')
         if(!args[0])return message.channel.send('Vc esqueceu de colocar o comando do seu NPC!')         
         if(verificar_existencia_comando(resposta)==true) return message.channel.send('Ja existe um um cadastro com o comando %'+ resposta)
         // addSocoFicha(resposta)
         // addChuteFicha(resposta)
         // addDefesaFicha(resposta)
         // addEsquivaFicha(resposta)
         db.get("fichas_bots").push(registrar('npc', resposta,adm) ).write()            
         let msn=''
         msn+=`NPC com o comando "***%${resposta}***" criado!\n`
         return message.channel.send(msn)
      }else if(comando=='comocadastrarficha'){
         let msn=''
         msn+='```'
         msn+='Primeiramente peça para um adm criar seu comando!\n'
         msn+='Ele ira rodar o seguinte comando para criar seu comando de ficha\n'
         msn+=`%cadastrarFicha nome_da_ficha/id_do_cargo_da_ficha\n`        
         msn+=`Agora de o comando para vizualizar sua ficha\n`
         msn+=`%nome_da_ficha\n`
         msn+=`Sua ficha esta em branco, então a customize\n`
         msn+='```'         
         return message.channel.send(msn)
      
      }else if(comando=='cadastrarficha'){
         // if (verificar_permissao(adm)==0) return message.channel.send('Permissao negada')         
         if(!args[0])return message.channel.send('Vc esqueceu de colocar o comando do seu NPC!')
         console.log(resposta.split('/').length-1)
         let teste=resposta.split('/').length-1
         if(teste == 0) return message.channel.send('Formato de comando errado, digite ``%cadastrarficha nome_ficha/id_do_cargo``')
         var res = resposta.split("/")               
         if(verificar_existencia_comando(res[0])==true) return message.channel.send('Ja existe um um cadastro com o comando %'+ res[0])
         if(res[1]=='') return message.channel.send('Informe o Id do cargo')        
         // addSocoFicha(res[0])
         // addChuteFicha(res[0])
         // addDefesaFicha(res[0])
         // addEsquivaFicha(res[0])
         db.get("fichas_bots").push(registrar('ficha', res[0],res[1])).write()            

         let msn=''
         msn+=`NPC com o comando "***%${res[0]}***" criado!\n`
         return message.channel.send(msn)
      }else if(comando=='log'){
         console.log(message.author)                
         return message.channel.send(`<@${message.author.id}>`)
      
      }else if(comando=='xingamento'){     
         let v=['coco','bobão', 'panaca','bobalhão', 'filho da mãe','bastardo','bundão','desgramado']              
         return message.channel.send(`↬ ${resposta} ↫  \n*O <@${message.author.id}> te falou q vc é um grande ${array_random(v)}!!!* `)
      
      }else if(comando=='calcinha'){
         message.delete();               
         return message.channel.send(`↬ ${resposta} ↫  \n ***Queria te lembrar que***`, {
            files: [
                "https://cdn.discordapp.com/attachments/839476218947567686/852948058958462976/DmSxUzHX4AERbxq.png"
            ]
        });
      
      }else if(comando=='x1lixo'){ 
         let imagens=[
            'https://cdn.discordapp.com/attachments/839476218947567686/852925556391804988/Shoyu.gif',
            'https://cdn.discordapp.com/attachments/839476218947567686/852925778379145276/Shoyu4.gif',
            'https://cdn.discordapp.com/attachments/839476218947567686/852925781511766036/Shoyu3.gif',
            'https://cdn.discordapp.com/attachments/839476218947567686/852925783096819722/Shoyu2.gif'
         ] 
         message.delete();         
         return message.channel.send(`↬ ${resposta} ↫  \n\n*O <@${message.author.id}> te considera menos que um saco de lixo, vai deixar barato? Vem X1 Vacilão!!!* \n\n **X1 LIXO**`, {
            files: [
                `${array_random(imagens)}`
            ]
        });
      
      }else if(comando=='listarbots'){
         let msn='```'
         valor =  db.get("fichas_bots").value()  
         msn+='     Comandos  \n'       
         valor.forEach(v=>{
            if(v.funcao=='robo') msn+=`%${v.comando}\n`           
         })
         msn+='```'
         return message.channel.send(msn)
      }
      else if(comando=='listarnpcs'){
         let msn='```'
         valor =  db.get("fichas_bots").value()  
         msn+='     Comandos  \n'       
         valor.forEach(v=>{
            if(v.funcao=='npc') msn+=`%${v.comando}\n`           
         })
         msn+='```'
         return message.channel.send(msn)
      }
      else if(comando=='ajustarskills'){
         let msn=''   
         msn+= '```ini\n'
         valor =  db.get("fichas_bots").value().sort()          
         msn+='     Comandos  \n'       
         valor.forEach(v=>{
            db.get("skills").remove({bot_comando: v.comando, comando: 'soco'}).write()
            db.get("skills").remove({bot_comando: v.comando, comando: 'chute'}).write()
            db.get("skills").remove({bot_comando: v.comando, comando: 'defender'}).write()
            db.get("skills").remove({bot_comando: v.comando, comando: 'desviar'}).write()
            // addSocoFicha(v.comando)
            // addChuteFicha(v.comando)
            // addDefesaFicha(v.comando)
            // addEsquivaFicha(v.comando)
            if(v.funcao=='ficha'){ 
               msn+=`%${v.comando} - Ataque basico corrigido!!\n` 

            }         
         })
         msn+='```\n'
         return message.channel.send(msn)
      }else if(comando=='ajustarestilo'){
         let msn=''   
         msn+= '```ini\n'
         valor = db.get("skills").value().sort()         
         msn+='     Comandos  \n'       
         valor.forEach(v=>{                       
            if(v.classe=='cam'){ 
               msn+=`%${v.bot_comando} ${v.comando} - CD 45  \n` 
               db.get("skills").find({bot_comando: v.bot_comando, comando: v.comando}).assign({cd: '45'}).write()

            }         
         })
         msn+='```\n'
         return message.channel.send(msn)
      }
      else if(comando=='listarfichas'){
         let msn=''   
         msn+= '```ini\n'
         valor =  db.get("fichas_bots").value().sort() 
         console.log(valor[2])
         valor= valor.sort( )     
         msn+='     Comandos  \n'       
         valor.forEach(v=>{
            if(v.funcao=='ficha'){ 
               msn+=`%${v.comando} - ${(v.aprovacao==0) ? 'Pendente ⨂':'[Aprovado ⨀]'}\n` 

            }         
         })
         msn+='```\n'
         return message.channel.send(msn)
      }
      else if(comando=='descansados'){
         let msn=''   
         msn+= '```ini\n'
         valor =  db.get("fichas_bots").value().sort() 
         console.log(valor[2])
         valor= valor.sort( )     
         msn+='     Descansados  \n'       
         valor.forEach(v=>{
            if(v.funcao=='ficha'){ 
               msn+=`%${v.comando} - ${(v.status.descansando==0) ? 'Descansando':'Descansado'}\n` 

            }         
         })
         msn+='```\n'
         return message.channel.send(msn)
      }
      else if(comando=='statusfichas'){
         let msn=''   
         msn+= '```ini\n'
         valor =  db.get("fichas_bots").value().sort() 
         console.log(valor[2])
         valor= valor.sort( )     
         msn+='     [Fichas status aprovação]   \n\n'       
         valor.forEach(v=>{
            if(v.funcao=='ficha'){ 
               msn+=`${v.comando} - ${(v.status.aprovacao==1) ? '[Aprovado]':'Pendente'}\n` 

            }         
         })
         msn+='```\n'
         return message.channel.send(msn)
      }
      else if(comando=='comoregistrarbot'){
         let msn=''
         msn+='---------------------**`TUTORIAL`**---------------------\n'
         msn+=`Primeiro vamos criar o comando do bot, o comando sera o codigo q vc vai usar para poder invocar seu robo. Ex de comando: 'botf'\n`
         msn+=`"**%cadastrarbot botf**" comando para criar robos`
         msn+=`Agora com o comando do seu robo criado vc deve adicionar as informações do seu robo. Siga as instruçoes e comandos abaixos vamos usar o exemplo citado acima de comando '%botf' mas lembra que sera o comando que vc colocou em seu robo!\n`
         msn+=`"**%botf-nome Bot F**" com esse comando vc adiciona o nome ao seu robo\n`
         msn+=`"**%botf-rank F**"  adiciona o rank\n`
         msn+=`"**%botf-descricao Robo de treinamento**" adiciona uma descrição\n`
         msn+=`"**%botf-aparencia link.imangem**" adiciona uma aparencia ao seu robo\n`
         msn+=`"**%botf-status 2000/1500/4000/2000**" adiciona FF/DEF/AGI/MEC exatamente nessa ordem \n`
         msn+=`"**%botf-hp 7000/8000**" adiciona HpMinimo/HpMaximo exatamente nessa ordem \n`
         msn+='Pronto seu robo está criado, agora de o comando "%nome_do_seu_robo" para visializar ele\n'
         return message.channel.send(msn)

      }else if(comando=='deletarbot'){
         if (verificar_permissao(adm)==0) return message.channel.send('Permissao negada')
         if(!args[0])return message.channel.send('Vc esqueceu de colocar o comando do seu bot!')
         db.get("fichas_bots").remove({comando: resposta}).write()
         db.get("comandos").remove({comando: resposta}).write()
         db.get("skills").remove({bot_comando: resposta}).write()
         db.get("cd").remove({bot_comando: resposta}).write()
         return message.channel.send(`Bot com comando "%${resposta}" deletado!`)
      }else if(comando=='comandos'){
         let msn='``'
         valor =  db.get("comandos").value()      
         valor.forEach(v=>{
            msn+=`%${v.comando}\n`
         })
         msn+='``'
         return message.channel.send(msn)

      }else if(comando==bot(comando).comando){
         //View bot
         bot=db.get("fichas_bots").find({comando: comando}).value()     
         if (verificar_permissao(bot.permissoes)==0) return message.channel.send('Permissao negada')    
         if(!args[0]){ 
            if(bot.funcao=='robo'){                           
               return message.channel.send(view_bot(bot), {
                  files: [
                     `${retorna_aparencia(bot)}`
                  ]
               })
            }else if(bot.funcao=='npc'){
               return message.channel.send(view_npc(bot), {
                  files: [
                     `${retorna_aparencia(bot)}`
                  ]
               })
            }else if(bot.funcao=='ficha'){
               return message.channel.send(view_ficha(bot), {
                  files: [
                     `${retorna_aparencia(bot)}`
                  ]
               })
            }
         }else if(resposta=='status'){
            if(bot.funcao=='ficha') return message.channel.send(view_status_ficha(bot))         
            return message.channel.send(view_status_npc(bot))

         }else if(resposta=='statusa'){
            return message.channel.send(view_status_ficha_antiga(bot))     
            
         }else if(resposta=='statusapv'){               
            bot.status.aprovacao=1
            bot.status_apv=JSON.stringify(bot.status)   
            // console.log(JSON.parse(sts.status)) 
            
            db.get("fichas_bots").find({comando: comando}).assign(bot).write()
            return message.channel.send(`Bot ${bot.nome} status Aprovado`)

         }else if(resposta=='ff' || resposta=='agi' || resposta=='ind' || resposta=='def'|| resposta=='int'|| 
         resposta=='anal'|| resposta=='nivel'|| resposta=='pu' ){                  
            let msn='```ini\n'            
            sts=bot.status[`${resposta}`]
            msn+=`${resposta.toUpperCase()} [${sts}]`    
            msn+='```' 
            return message.channel.send(msn)

         }else if(resposta=='skills'){
            skill=db.get("skills").value()            
            let msn='```'            
            skill.forEach(s=>{              
               if (s.bot_comando==comando) msn+=`%${comando} ${s.comando}\n`
            })           
            msn+='```' 
            return message.channel.send(msn)

         }else if(resposta.indexOf("hp") !== -1){           
            let msn=''           
            if(resposta=='hp'){
               msn+= '```ini\n'
               msn+=`HP [${calcular_hp(bot)}]`
               msn+='```'
               return message.channel.send(msn)
            }
            if(resposta.indexOf("%") !== -1){
               if(resposta.indexOf("+") !== -1) var dano = resposta.split("+")
               if(resposta.indexOf("-") !== -1) var dano = resposta.split("-")
               let porcento=parseInt(dano[1].split("%"))
               let hp= calcular_hp(bot)
               console.log(hp)
               console.log(porcento)
               if(resposta.indexOf("+") !== -1) bot.status.hp_atual=parseInt(hp+((porcento/100)*hp))
               if(resposta.indexOf("-") !== -1) bot.status.hp_atual=parseInt(hp-((porcento/100)*hp))
               console.log(bot.status.hp_atual)
               db.get("fichas_bots").find({comando: comando}).assign({status: bot.status}).write()
               msn+= '```ini\n'
               msn+=`HP [${ bot.status.hp_atual}]`
               msn+='```'
               return message.channel.send(msn)
            }
            if(resposta.indexOf("-") !== -1){
               var dano = resposta.split("-")   
               bot.status.hp_atual=calcular_hp(bot)-dano[1]
               db.get("fichas_bots").find({comando: comando}).assign({status: bot.status}).write()
               msn+= '```ini\n'
               msn+=`HP [${ bot.status.hp_atual}]`
               msn+='```'
               return message.channel.send(msn)
            }
            if(resposta.indexOf("+") !== -1){
               var dano = resposta.split("+")              
               bot.status.hp_atual=calcular_hp(bot)+ parseInt(dano[1])
               console.log(bot.status.hp_atual) 
               db.get("fichas_bots").find({comando: comando}).assign({status: bot.status}).write()
               msn+= '```ini\n'
               msn+=`HP [${ bot.status.hp_atual}]`
               msn+='```'
               return message.channel.send(msn)
            }            
            return message.channel.send('Comando de HP invalido')                 

         }
         // else if(resposta.indexOf("*") !== -1 && resposta.indexOf("%") == -1){  
         //    let dano
         //    let msn='```ini\n' 
         //    var atr = resposta.split("*") 
         //    if(resposta.indexOf("+") !== -1){
         //       sts=atr[0].split("+")
         //       dano=parseInt(bot.status[`${sts[0]}`])+parseInt(bot.status[`${sts[1]}`])               
         //    }else{            
         //       dano= parseInt(bot.status[`${atr[0]}`])
         //    }
         //    msn+=`Dano/Defesa [${dano*parseInt(atr[1])}]`
         //    msn+='```' 
         //    return message.channel.send(msn)
         // }
         //else if(resposta.indexOf("%") !== -1){  
         //    let msn='```ini\n' 
         //    if(resposta.indexOf("+") !== -1) var co = resposta.split("+")
         //    if(resposta.indexOf("-") !== -1) var co = resposta.split("-")
         //    console.log(co)             
         //    let buff=[]
         //    let m=[1,1]
         //    let dano=0
         //    let da=0
         //    co.forEach(myFunction)
         //    function myFunction(atr, index) {
                                                 
         //          if (co[index].indexOf("%") !== -1){
         //          buff=atr.split("%")
         //          if (buff[1].indexOf("*") !== -1){
         //              m=buff[1].split('*')
         //              buff[1]=m[0]
         //          } 
         //             dano=parseInt(dano+(parseInt(bot.status[`${buff[1].replace(/ /g, "")}`])*(parseInt(buff[0])/100)))     
         //          }
         //          if(Number.isNaN(parseInt(co[0]))){
         //             co[0]=parseInt(bot.status[`${co[0]}`])
         //             if (co[1].indexOf("%") == -1) co[0]=co[0]+parseInt(bot.status[`${co[1]}`])
         //             console.log(co[0])
         //          }
                            
         //    } 
            
         //    if(resposta.indexOf("-") !== -1)dano=parseInt(co[0])-(dano*m[1])
         //    if(resposta.indexOf("+") !== -1)dano=parseInt(co[0])+(dano*m[1])
                
         //    msn+=`Dano/Defesa [${parseInt(dano)}]`
         //    msn+='```' 
         //    return message.channel.send(msn)

         // }
         else if(resposta.indexOf("+") !== -1 || resposta.indexOf("*") !== -1||resposta.indexOf("%") !== -1||resposta.indexOf("/") !== -1){         
            calculo=calculo_string(resposta,bot)
            let msn='```ini\n'
            msn+=`Calculo ${calculo}\n`          
            msn+=`Dano/Defesa [${parseInt(eval(calculo))}]`
            msn+='```' 
            return message.channel.send(msn)

         }else if(resposta=='descansar'){
            if(bot.status.descansando==0) return message.channel.send('Você já está descansando!')                    
            return message.channel.send(descansar(bot))

         }else if(resposta=='descansar'){
            if(bot.status.descansando==0) return message.channel.send('Você já está descansando!')                    
            return message.channel.send(descansar(bot))

         }else if(resposta=='arrumardescansar'){                              
            return message.channel.send(descansar(bot))
         }
         else if(resposta==retornar_skill(comando, resposta).comando){           
            skill = retornar_skill(comando, resposta) 

            if (cds(skill)==true){
               if(skill.comando=='soco'||skill.comando=='chute'||skill.comando=='defender'||skill.comando=='desviar'){
                   return message.channel.send(view_skill(skill))
               }
               return message.channel.send(view_skill_ficha(skill))
           
            }else{
               return message.channel.send('Habilidade em CoolDown! ')
            }            
         }                   
         
      }
      return 0
   }
   if (verificar_comando_composto(comando)!=true){
      com=verificar_comando_composto(comando)      
      bot=bot(com.comando)
      if (verificar_permissao(bot.permissoes)==0) return message.channel.send('Permissao negada')  
      skil=retornar_skill(com.comando,com.acao)  
      if(bot.funcao=='ficha' || bot.funcao=='npc'){   
         status_comandos.forEach(s=>{
            if(com.acao==s){         
               bot.status[`${s}`] = resposta;
               bot.status.aprovacao=0
               if(com.acao=='nivel'){
                  if(bot.status.descansando==1)descansar(bot)  
               }         
               db.get("fichas_bots").find({comando: com.comando}).assign({status: bot.status}).write()
               return message.channel.send(`${bot.nome} teve ${s} atualizado!`)
               return 0
            }      
         })
      }
      bot_attr.forEach(s=>{
         if(com.acao==s){         
            bot[`${s}`] = resposta;
            db.get("fichas_bots").find({comando: com.comando}).assign(bot).write()
            return message.channel.send(`Bot ${bot.nome} teve ${s} atualizado!`)
         }      
      })
      if(com.acao=='permissoes'){
         bot.permissoes.push(resposta)
         db.get("fichas_bots").find({comando: com.comando}).assign(bot).write()
         return message.channel.send(`Bot ${bot.nome} teve permissão adicionada!`)
      }else if(com.acao=='status'){
         var status = resposta.split("/")
         if(bot.funcao=='robo'){
            bot.status.ff= status[0]
            bot.status.def= status[1]
            bot.status.agi= status[2]
            bot.status.mec= status[3]
            db.get("fichas_bots").find({comando: com.comando}).assign(bot).write()
            return message.channel.send(`Bot ${bot.nome} teve seus status atualizados`)
         }else if(bot.funcao=='npc'){
            bot.status.ff= status[0]
            bot.status.def= status[1]
            bot.status.agi= status[2]
            bot.status.ind= status[3]
            bot.status.pu= status[4]
            bot.status.int= status[5]
            bot.status.anal= status[6]
            bot.status.cab= status[7]
            bot.status.caf= status[8]
            bot.status.cam= status[9]
            bot.status.cei= status[10]
            bot.status.test= status[11]
            db.get("fichas_bots").find({comando: com.comando}).assign(bot).write()
            return message.channel.send(`NPC ${bot.nome} teve seus status atualizados`)
         }
      } 
      if(com.acao=='aprovacao'){
         bot.aprovacao=resposta
         db.get("fichas_bots").find({comando: com.comando}).assign(bot).write()
         return message.channel.send(`${bot.nome} agora está ${(bot.aprovacao=='0')? 'Pendente' : 'Aprovado'}`)
      }
      if(com.acao=='estilo'){ 
         let val=0
         let estilo=['cam-15','cab-15','cad-15']
         estilo.forEach(s=>{
            if(resposta==s){
               add_estilo(resposta,com.comando) 
               return message.channel.send(`${bot.nome} teve skills ${resposta} criadas`)
               val=1
            }               
         })  
         if(val==0 )return message.channel.send('Estilo inexistente!')  
         return 0             
      }
      if(com.acao=='deletarestilo'){  
         db.get("cd").remove({bot_comando: bot.comando, comando:resposta}).write()       
         db.get("skills").remove({bot_comando: bot.comando,comando:resposta}).write()
         return message.channel.send(`${bot.nome} teve skills ${resposta} deletada!`)         
      }
      if(com.acao=='hp'){
         var hp = resposta.split("/")
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
             skill.status=[]   
             skill.fraquezas=''
            db.get("skills").push(skill).write()
            return message.channel.send(`Bot ${bot.nome} teve skill com comando "%${bot.comando} ${skill.comando}" criado!`) 
      } 
      if(retornar_skill(com.comando,com.acao)!=undefined){     
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
            if(com.acao2=='deletarskill'){          
               db.get("skills").remove({bot_comando: bot.comando,comando:skil.comando}).write()
               return message.channel.send(`Bot ${bot.nome} teve skill com comando "${skil.comando}" Deletada!`) 
            }          
         }
      }    
     
      return 0      
   } 
  return 0 
}else{
   let m=''
   m+=`Meu jovem esse comando não existe...`
   return message.channel.send(m)
}
}catch(error){
   // console.log(error)
   console.log('Algum erro')
}

});

client.login(config.token)
