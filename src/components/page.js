import React from 'react';

class Page extends React.Component {
	constructor(props) {
		super(props);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);

		this.state = {
			hover: false,
			x: 0
		}

		this._timeout = null;
		this._startTime = 0;
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.hover !== this.state.hover) {
			if (this.state.hover) {
				if (this._timeout != null) {
					clearTimeout(this._timeout);
				}
				this._startTime = new Date().getTime();
				this.tick();
			} else {
				if (this._timeout != null) {
					clearTimeout(this._timeout);
				}
			}	
		}
	}

	tick() {
		const x = Math.sin((new Date().getTime() - this._startTime) / 500);
		this.setState({
			x: x
		});
		this._timeout = setTimeout(this.tick.bind(this), 1000 / 60);
	}

	onMouseMove() {
		this.setState({
			hover: true
		});
	}

	onMouseLeave() {
		this.setState({
			hover: false,
			x: 0
		});
	}

	onClick() {
		console.log('click');
	}

	render() {
		const x = this.state.x;

		return (
			<div className='Page' style={{
				width: '100%',
				height: '100%',
				pointerEvents: 'all'
			}} 
			onMouseMove={this.onMouseMove}
			onMouseLeave={this.onMouseLeave} 
			onClick={this.onClick}>
				<div style={{
					width: '100%',
					height: '100%',
					backgroundColor: '#777',
					position: 'absolute',
					left: (-x * 3.0) + (this.state.hover ? -3 : 0),
					top: (x * 3.0) + (this.state.hover ? 3 : 0)
				}}>

				</div>
			</div>
		);
	}
}

export default Page;