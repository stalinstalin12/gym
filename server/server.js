const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path=require('path')

const cors=require('cors');
app.use(cors({ origin: 'http://localhost:5173' }))
dotenv.config();
const mongoConnect = require('./db/connect');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes=require('./routes/productRoutes')

app.get('/test', (req, res) => {
    res.status(200).send("Test successful");
});

//Serving static files
app.use(express.static( "../client"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

//Database connection
mongoConnect();

app.use(express.json())
//Parse JSON Datas
app.use(express.json({limit : "2000mb"}));

//Parse form datas
app.use(express.urlencoded({extended : true}));

//userRoutes
app.use(userRoutes);

//authRoutes
app.use(authRoutes);
app.use(productRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
});