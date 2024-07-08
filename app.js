const express = require('express')
const app = express()
const port = process.env.PORT || 8000
const cors = require('cors')
// const connectToMongo = require('./db')
// connectToMongo()
// const fileupload = require("express-fileupload");
// app.use(fileupload({
//     useTempFiles: true
// }));

app.use(express.json())
app.use(cors({ origin: true }))


    app.use('/api/rankchecker',require('./routes/rankchecker'))
// app.use('/api/sendmessage', require('./routes/twilio'))
// app.use('/api/sendemail', require('./routes/email'))
// app.use('/api/auth', require('./routes/auth'))
// app.use('/api/getdata', require('./routes/home'))
// app.use('/api/sendImg', require('./routes/cloudinary'))
// app.use('/api/products', require('./routes/products'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})