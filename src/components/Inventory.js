import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../base';

class Inventory extends React.Component {
	constructor(){
		super();
		this.renderInventory = this.renderInventory.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.renderLogin = this.renderLogin.bind(this);
		this.authenticate = this.authenticate.bind(this);
		this.authHandler = this.authHandler.bind(this);
		this.logout = this.logout.bind(this);

		this.state = {
			uid: null, 
			owner: null
		}
	}

	//react doesnt want you to put state in an input without actually updating it, 
	//when we did the storepicker we used default value , instead of value.
	// if you put state in an input box, then we need an instruction on how to update the state
	// ONE core area where the state is coming from , to update the box we need to update the state, keeps them in sync , we need to listen for a change on each of these inputs.

	componentDidMount(){
		base.onAuth((user) => {
			if (user) {
				this.authHandler(null, { user });
			}
		});
	}

	handleChange(e, key){
		//copy of one single fish
		const fish = this.props.fishes[key];
		console.log(fish);
		// take a copy of the fish and updated with new data
		// to copy an object you could go Object.assign({}, fish)
		//or fish spread and overlay the new properties on top of it
		//since you cant say if and if this was changed, we need a computed property, the property we are changing is called [property]: value; 
		//COMPUTEDDDDDDD PROPRTY
		//e.target.name is the name of the of the property we are changing
		const updatedFish = {
			...fish,
			[e.target.name]:e.target.value
		}
		// e.target gives the actual element itself
		// console.log(e.target.name, e.target.value);
		this.props.updateFish(key, updatedFish); 
		// pass updatefish that lives on the app.js
	}

	authenticate(provider) {
		console.log(`trying to log in ${provider}`);
		base.authWithOAuthPopup(provider, this.authHandler);
	}
	
	logout() {
		base.unauth();
		this.setState({uid :null })
	}

	authHandler(err, authData) {
		console.log(authData);
		if (err) {
			console.log('err', err);
			return;
		}
		//grab the store info
		const storeRef = base.database().ref(this.props.storeId);
		//snapshot is object of all the data
		storeRef.once('value',(snapshot) => {
			const data = snapshot.val() || {};

			//claim it if no owner
			if (!data.owner) {
				storeRef.set({
					owner:authData.user.uid
				});
			}

			this.setState({
				uid:authData.user.uid,
				owner: data.owner || authData.user.uid
			})
		});
	}

	renderLogin(){
		return (
			<nav className="login">
				<h2>Inventory</h2>
				<p>Sign in to manage your store's inventory</p>
				<button className="github" onClick= {() => this.authenticate('github')}> Log in with Github</button>
				<button className="facebook" onClick= {() => this.authenticate('facebook')}> Log in with Facebook</button>
				<button className="twitter" onClick= {() => this.authenticate('twitter')}> Log in with Twitter</button>
			</nav>
		)
	}
	//specify an onclick event listener , pass the even and handleChange , pass event and key for the fish --
	renderInventory(key){
		const fish = this.props.fishes[key];
		return (
			<div className="fish-edit" key={key}>
				<input type="text" name="name" value={fish.name} placeholder="Fish name" onChange={(e) => this.handleChange(e, key)}/>
				<input type="text" name="price" value={fish.price} placeholder="Fish price" onChange={(e) => this.handleChange(e, key)}/>
				<select type="text" name="status" value={fish.status} placeholder="Fish status" onChange={(e) => this.handleChange(e, key)}>
					<option value="available">Fresh!</option>
					<option value="unavailable">Sold Out!</option>
				</select>
				<textarea type="text" name="desc" value={fish.desc} placeholder="Fish desc" onChange={(e) => this.handleChange(e, key)}>
				</textarea>
				<input type="text" name="image" value={fish.image} placeholder="Fish image" onChange={(e) => this.handleChange(e, key)}/>
				<button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
			</div>
		)
	}

	render(){
		const logout = <button className='logout' onClick={this.logout}> Log Out!</button>
		//check if they are not logged in at all then return a div 
		if(!this.state.uid) {
			return (
				<div>{this.renderLogin()}</div>
			)
		}

		//check if they are the owner 
		if (this.state.uid !== this.state.owner) {
			return (
				<div>
					<p> You are not the owner of this store</p>
					{logout}
				</div>
			)
		}
		//need to loop over every fish
		return (
			<div>
				<h2>Inventory</h2>
				{logout}
				{Object.keys(this.props.fishes).map(this.renderInventory)}
				<AddFishForm addFish={this.props.addFish}/>
				<button onClick={this.props.loadSamples}> Load Sample Fishes </button>
			</div>	
		)
	}
}

Inventory.propTypes = {
	fishes: React.PropTypes.object.isRequired,
	updateFish: React.PropTypes.func.isRequired,
	removeFish: React.PropTypes.func.isRequired,
	addFish: React.PropTypes.func.isRequired,
	loadSamples: React.PropTypes.func.isRequired,
	storeId: React.PropTypes.string.isRequired
};

export default Inventory