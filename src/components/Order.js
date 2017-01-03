import React from 'react';
import { formatPrice } from '../helpers';
import CSSTransitionGroup from 'react-addons-css-transition-group';

class Order extends React.Component {

	constructor(){
		super();
		this.renderOrder = this.renderOrder.bind(this);
	}
	//a render function , instead of a separate component , sometimes it doesnt make sense to make an entirely new component, but you also know it is a lot to put too much in one render function and gets overwhelming.
	// if you use this inside another method other then render you need to bind this.
	renderOrder(key){
		const fish = this.props.fishes[key];
		const count = this.props.order[key];
		const removeButton = <button onClick={() => this.props.removeOrder(key)}>x</button>

		if( !fish || fish.status === 'unavailable') {
			return <li key={key}> Sorry, {fish ? fish.name : 'fish'} no longer available {removeButton} </li>
		}
		// if there is a fish then give the name, if someone deletes the fish then we wont know the name of the fish

		return (
			<li key={key}>
				<span>
					<CSSTransitionGroup 
						component="span"
						className="count"
						transitionName="count"
						transitionEnterTimeout={250}
						transitionLeaveTimeout={250}>
						<span key={count}>{count}</span>
					</CSSTransitionGroup>
					lbs {fish.name} {removeButton}
				</span>
				<span className="price">{formatPrice(count * fish.price)}</span>
			</li>
		)
	}
	render(){
		const orderIds = Object.keys(this.props.order);
		// the order got passed down via props and we want an array of all the keys
		console.log (orderIds);
		// order ids is an array of the fishes numbers in the order
		const total = orderIds.reduce((prevTotal, key) => {
			//allows you to loop over an array and return a new something, object or array. Adding up things in this case. 
			const fish = this.props.fishes[key];
			console.log('fish', fish);//fish object
			const count = this.props.order[key];
			console.log('count', count);//number of fish
			// if is there a fish, and if the status is available then add 
			const isAvailable = fish && fish.status === 'available';
			//then return the previous total and the count times the price or 0, 0 BECAUSE sometimes the fish will be in the order and then deleted
			if (isAvailable) {
				return prevTotal + ( count * fish.price || 0 )
			}
			return prevTotal;
		},0);//need to start at a starting value and then we should have a value called total
		//orderIds.map(this.renderOrder), this runs renderorder order for each
		return (
			<div className="order-wrap">
				<h2>Your order</h2>
				<CSSTransitionGroup 
					className="order"
					component="ul"
					transitionName="order"
					transitionEnterTimeout={500}
					transitionLeaveTimeout={500}
					>
					{orderIds.map(this.renderOrder)}
					<li className="total">
						<strong>Total:</strong>{formatPrice(total)}
					</li>
				</CSSTransitionGroup>
			</div>
		)
	}
}
Order.propTypes= {
	fishes: React.PropTypes.object.isRequired,
	order: React.PropTypes.object.isRequired,
	removeOrder: React.PropTypes.func.isRequired,
}
export default Order