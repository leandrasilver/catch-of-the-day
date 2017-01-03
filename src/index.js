// let's go!
import React from 'react';
// rather then using scripttags use modules
 // Load everything in the react library into the variable 'react'( in the dependencies as a var too), the library is from the package.json listed as dependencies
 // npm install
 // npm start
 // npm install react --save is how you would add it into the package j son
 //ES lint , comes with minimal ES lint rules
 //div main is the mounting point
import { render } from 'react-dom';
import { BrowserRouter, Match, Miss } from 'react-router';
import'./css/style.css';
//just need that one render method from the react Dom 

// class StorePicker extends React.Component {
// 	render(){
// 		return <p> Hello </p>
// 	}
// }
// need to grab the react from the DOM , there is a canvas render or android apps, so we need to import the render method from a package called React dom
 //import one of the methods from react
 //react can render to other things then HTML , like ioS
import StorePicker from './components/StorePicker';
import App from './components/App';
import NotFound from './components/NotFound';

const Root = () => {
	return (
		<BrowserRouter>
			<div>
				<Match exactly pattern="/" component= {StorePicker} />
				{/* WHen you are on the homepage / will work */}
				<Match exactly pattern="/store/:storeId" component={App} />
				<Miss component={NotFound} />
			</div>
		</BrowserRouter>
	)
}

//best practice to maintain each components in their own files.
// now calling Root which will indirectly call App and storepicker
render (<Root/>, document.querySelector('#main'));

// render takes the JSX compenent then where it should bind too

// Notes

// JSX allows us to write HTML right inside the JS.
// otherwise React.createElement ('p', {className:'Testing'}, 'Iloveyou'})