function CustomRandom(){
} 

// Returns a random integer between min (included) and max (included)
CustomRandom.get = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}