module.exports = {
  random: function(low, high) {
      return Math.floor(Math.random() * (high - low + 1) + low);
  },

  newVoting: function(req, max) {
    var rand = [];
    for (var i = 0; i <= 1; i++) {
      rand.push( this.random(1, max) );
    }
    req.session.last = rand;
    return rand;
  }
};
