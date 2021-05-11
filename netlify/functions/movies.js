// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  console.log(moviesFromCsv)


  // 🔥 hw6: your recipe and code starts here!
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre

   // create a new object to hold the numResults and movies data
  let MoviestoReturn = {}

  // start with an empty Array for the movies
  MoviestoReturn.movies = []

  //check if year and genre have been correctly inputted. Return error message if not
  if (year == undefined || genre == undefined || year == `` || genre ==``) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Nope!` // a string of data
    }
  }
  else {
    let returnValue = {
      numResults: 0,
      movies: []
    }

    // loop through all movies
    for (let i=0; i < moviesFromCsv.length; i++) {
    // store each movie in memory
      let MovieReview = moviesFromCsv[i]
    // create new object ot store relevant movie data
      let movieObject = {
        primaryTitle: MovieReview.primaryTitle,
        startYear: MovieReview.startYear,
        genres: MovieReview.genres
      }
    // check the movies for matching years and genres to inputs, also check there are run times and genres in the data
      if (year==MovieReview.startYear && MovieReview.genres.includes(genre) && MovieReview.genres !== `\\N` && MovieReview.runtimeMinutes !== `\\N`) {
    // add the movie to the Array of movies to return
      MoviestoReturn.movies.push(movieObject)
      }

    }
    // count the total number of movies that match the criteria
    MoviestoReturn.numResults = MoviestoReturn.movies.length


    // a lambda function returns a status code and a string of data
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: JSON.stringify(MoviestoReturn) // a string of data
    }
  }
}