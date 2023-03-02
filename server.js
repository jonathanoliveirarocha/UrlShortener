const express = require("express")
const mongoose = require("mongoose")
const ShortUrl = require('./models/ShortUrl')
const app = express()


//Connect to database
mongoose.connect('<MongoDB_URI>', {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(()=>{
    console.log('Connected to database successfully!')
}).catch((err)=>{
    console.log('There was an error connecting to the database!')
})

//Configuring express
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))

//Routes
app.get('/', async (req, res)=>{
    const shortUrls = await ShortUrl.find()
    const context = {shortUrls: shortUrls}
    res.render('index', context)
})

app.post('/shortUrls', async (req, res)=>{
    await ShortUrl.create({full: req.body.fullUrl})
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if(shortUrl == null){return res.sendStatus(404)}
    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})

//Set server port 
const port = process.env.PORT || 5000
app.listen(port, ()=>{
    console.log(`Server is running http://localhost:${port}`)
})