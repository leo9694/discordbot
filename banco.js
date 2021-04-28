const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('bancos.json')
const db = low(adapter)

//criar
//criar
db.set('servidor', []).write()

//postar
db.get('servidor2').push({
    id: "1",
    nick: "pedro",
    avatar: "link.com/avatar.png"
}).write()
// //editar
// db.get('servidor1').find({id: "1"}).assign({nick: "paulo novo"}).write()

// //buscar
// let valor = db.get('servidor1').find({id: "1111111"}).value()

// //apagar
// // db.get('servidor1').remove({id: "1111111"})
