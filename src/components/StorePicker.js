import React from 'react';
import { getFunName } from '../helpers';
//need to import react into very single file

//only can return one element
// capital because it can be used more then once
 class StorePicker extends React.Component {
 	// basic Component, needs at least one method, which is the render method. It asks which HTML to display, similar to 
 	// create a method, remember no commas after ES6 classes do not require, inside the store we will first grab the text from the box then ssecond we will transition from urls
 	// constructor(){
 	// 	super();
 	// 	this.goToStore = this.goToStore.bind(this);
 	// }
 	goToStore(event){
 		event.preventDefault(); 
 		//stopped form from submitting
 		const storeId = (this.storeInput.value);
 		// it is null, this is not binded to the storePicker
 		// this is actually null
 		// two main ways to change the page
 		// everything you want to do is done via a component
 		// you can render out a a redirect component ORR
 		// AN INPERATIVE API .transitionTo
 		//need access to the router first
 		// because BrowserRouter is the parent of the app you can feed it through the children
 		// need to surface the Router and make it available to the child
 		//
 		this.context.router.transitionTo(`/store/${storeId}`);
 	}
 	render(){
 		return (
 			<form className="store-selector" onSubmit={(e) => this.goToStore(e)} >
 				{/*can only go inside */}
 				<h2> Please enter a store </h2>
 				<input type="text" required placeholder="Store Name" defaultValue={getFunName()} ref={(input) => { this.storeInput = input}} />
 				<button type="submit">Visit Store</button> 
 			</form>
 		)
 	}
}

StorePicker.contextTypes = {
	router: React.PropTypes.object
}

export default StorePicker;

