import Rebase from 're-base';

const base = Rebase.createClass({
	apiKey: "AIzaSyAQPIhcnZwc3fdmeRg2T5WP5pYXZBGMHS8",
    authDomain: "catch-of-the-day-leandra-silv.firebaseapp.com",
    databaseURL: "https://catch-of-the-day-leandra-silv.firebaseio.com"
});

//anytime we need to work with firebase we import the base

export default base

//autheication rules with prevent client side stuff