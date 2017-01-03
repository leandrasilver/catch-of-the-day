import React from 'react';
import Header from './Header';
import Inventory from './Inventory';
import Order from './Order';
import sampleFishes from '../sample-fishes';
import Fish from './Fish';
import base from '../base';

class App extends React.Component {
	constructor(){
		super();
		this.addFish = this.addFish.bind(this);
		this.updateFish =this.updateFish.bind(this);
		this.removeFish =this.removeFish.bind(this);
		this.loadSamples =this.loadSamples.bind(this);
		this.addToOrder =this.addToOrder.bind(this);
		this.removeOrder =this.removeOrder.bind(this);

		//get initial state
		this.state = {
			fishes:{},
			order:{}
		}
	}
	 
	componentWillMount() {
		//this runs right before the app is rendered, hock into firebase, and check if there is any order in local storage
		this.ref= base.syncState(`${this.props.params.storeId}/fishes`,
		{
			context:this,
			state:'fishes'
		});
	//stop syncing when you move to other pages

	//check if there is any order in localStorage
		const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);
		if(localStorageRef){
			//update our App com. order state
			this.setState({
				order:JSON.parse(localStorageRef)
				//turns th string in local storage to an object
			})
		}
	}

	componentWillUnmount(){
		base.removedBinding(this.ref);
	}

	//local storage
	//setItem the set the key, then the value is going to be the next state.order
	//object object shows up because you can only store strings no objects in local storage
	componentWillUpdate(nextProps, nextState){
		console.log('something changed', {nextProps}, {nextState});
		localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order))
		//stringify makes a string of JSON so it can be stored;
		// but when you refresh it doesn't reinstate the order as we need to go to willmount, 
	}

	//must do this where the state lives
	loadSamples(){
		this.setState({
			fishes: sampleFishes
		});
	};

	addFish(fish) {
		//update our state
		const fishes = {...this.state.fishes};
		//take all our existing fishes and spread them into another object
		const timeStamp = Date.now();
		// number of milisecs from jan 1970, always unique
		fishes[`fish-${timeStamp}`] = fish;
		//set state, telling React the state of fishes is changing fishes:fishes => ES6
		this.setState({fishes});
	}

	updateFish(key, updatedFish) {
		//takes in the key and the updated fish object, 
		//we copy of all the fishes which we always do when we update the state
		//overwrite the one updatedfish
		//then we set the state
		const fishes = {...this.state.fishes};
		fishes[key] = updatedFish;
		this.setState({ fishes });
	}

	removeFish(key) {
		const fishes = {...this.state.fishes};
		//we have a copy now we want to remove it 
		// can't do delete fishes[key]
		// as we are hooked to firebase, you have to set it to null
		fishes[key] = null;
		this.setState({ fishes });
	}

	addToOrder(key) {
		//take a copy of the state
		const order = {...this.state.order};
		//update or add the new number of fish ordered
		order[key] = order[key] + 1 || 1;
		// update the state
		this.setState({order});
	}
	// pass it down via props

	removeOrder(key) {
		const order = {...this.state.order};
		delete order[key];
		this.setState({ order})
	}

	render() {
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh seafood" />
					<ul className="list-of-fishes">
						{
							Object.keys(this.state.fishes)
							.map(key => <Fish key={key} index={key} details = {this.state.fishes[key]} addToOrder={this.addToOrder}/> )
						}
					</ul>
				</div>
				<Order fishes={this.state.fishes} order={this.state.order} params={this.props.params} removeOrder = {this.removeOrder}/>
				<Inventory loadSamples={this.loadSamples} addFish={this.addFish} fishes={this.state.fishes} updateFish={this.updateFish} removeFish={this.removeFish} storeId={this.props.params.storeId} />
			</div>	
		)
	}
}

App.propTypes = {
	params:React.PropTypes.object.isRequired
}

export default App