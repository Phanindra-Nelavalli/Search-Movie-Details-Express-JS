const express = require('express');
const path = require('path');
const bodypraser = require("body-parser");
const session = require("express-session");
const{v4:uuidv4} = require("uuid");
const axios = require('axios');

const router = require('./router');

const app = express();


const port = process.env.PORT||3000;

app.use(bodypraser.json())
app.use(bodypraser.urlencoded({extended:true}))


app.set('view engine','ejs');

app.use('/static',express.static(path.join(__dirname,'public')))

app.use(session({
    secret:uuidv4(),
    resave:false,
    saveUninitialized:true
}));

app.use('/route',router)

app.get('/',function(req,res){
    res.render('base',{title:"Login System"})
});

const apiKey = 'ded85971';

// Function to fetch movie details from the OMDB API
async function fetchMovieDetails(query) {
    try {
        const apiUrl = `http://www.omdbapi.com/?t=${query}&apikey=${apiKey}`;
        const response = await axios.get(apiUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching movie data:', error);
        return null;
    }
}

app.post('/search', async (req, res) => {
    try {
        const movie = await fetchMovieDetails(req.body.movieTitle);
        if (movie && movie.Response === "True") {
            res.render('movieDetails', { movie });
        } else {
            res.render('movieDetails', { movie: null });
        }
    } catch (error) {
        res.status(500).send('Error fetching movie data');
    }
});


app.listen(port,function(){
    console.log("This program is running on http://localhost:3000")
});
