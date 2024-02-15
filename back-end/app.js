require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

app.use(express.static('public'));
// Define the data for the "About Us" page
const aboutUsData = {
  title: "About Us",
  content: [
    "I'm Rongjian (Jay) Wang, a Junior student at New York University, where I'm diving deep into the world of Computer and Data Science. Originally from Beijing, China, I've found a second home amidst the heart of Manhattan, a cosmopolitan and innovative hub of creativity, diversity, and academic excellence.",
    "My interests span a wide spectrum, from the adrenaline rush of sports to the rich narratives of history and the rhythmic expressions of music, among others. These diverse hobbies serve as my sanctuary, offering both a creative outlet and a mental reset. They underscore the principle that learning transcends the confines of classrooms, infusing every aspect of our lives.",
    "As I journey through my academic and personal development, I am keen on leveraging technology to craft innovative solutions that resonate in this AI-driven epoch. My current endeavor is to absorb knowledge, evolve, and establish meaningful connections with individuals who share a similar passion and drive."
  ],
  imageUrl: "http://localhost:5002/myp.jpg"
};

// Add a new route for the "About Us" page
app.get('/about', (req, res) => {
  res.json(aboutUsData);
});


// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
