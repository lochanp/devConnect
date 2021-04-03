const express = require('express');
const connectDB = require('./config/db');
const userRoute = require('./routes/api/users');
const postRoute = require('./routes/api/posts');
const authRoute = require('./routes/api/auth');
const profileRoute = require('./routes/api/profile');


const app = express();

//connect database
connectDB();

//Initialize middleware
app.use(express.json({
    extended: false
}));

app.get('/', (req, res) => {
    res.send('API running')
})
//Define Routes
app.use('/api/users', userRoute)
app.use('/api/posts', postRoute)
app.use('/api/auth', authRoute)
app.use('/api/profile', profileRoute)

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`))