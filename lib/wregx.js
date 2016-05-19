/*
  * The common regexes we will use throughout the backend to verify that
  * we have the data we are looking for. These methods cannot be used to sanitize
  * input -- there is no point as users will always come up with crazy daya to
  * bust your security open. Therefore we provide methods that will help app logic
  * make the decision to accept or reject the type and cancel the request
*/

var Wregx = {
  alpha: /^[a-z]+$/i,
  alphanum: /^[a-z0-9]+$/i,
  num: /^[0-9]+$/i,
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

  isAlpha: function(str) {
    return ((str.match(this.alpha)) ? 1 : 0);
  },

  isAlphanum: function(str) {
    return ((str.match(this.alphanum)) ? 1 : 0);
  },

  isNum: function(str) {
    return ((str.match(this.num)) ? 1 : 0);
  },

  isEmail: function(str) {
    return ((str.match(this.email)) ? 1 : 0);
  }

} // end Wregx class

module.exports = Wregx;
