const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://sandeeproutdeveloper:${password}@cluster0.q04ob.mongodb.net/testNoteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
  const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
  })

  const Note = mongoose.model('Note', noteSchema)

  const note = new Note({
    content: 'CSS is fun',
    important: false,
  })

  note.save().then(() => {
    console.log('note saved!')
    mongoose.connection.close()
  })

  // Note.find({}).then((result) => {
  //   result.forEach((note) => {
  //     console.log(note)
  //   })
  //   mongoose.connection.close()
  // })
})
