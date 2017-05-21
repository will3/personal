import React from 'react';
import Page from './page';
import $ from 'jquery';
import Dimensions from 'react-dimensions';

class PageContainer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			x: 0
		};

		this.onScroll = this.onScroll.bind(this);
	}

	onScroll() {
		if (this.refs.scroll.scrollTop > this.props.scrollHeight) {
			this.refs.scroll.scrollTop = this.props.scrollHeight;
		}
		this.setState({
			x: this.refs.scroll.scrollTop / this.props.scrollHeight
		});
	}

	componentDidMount() {
		$(this.refs.scroll).on('scroll', this.onScroll);
	}

	componentWillUnmount() {
		$(this.refs.scroll).off('scroll', this.onScroll);	
	}

	_getRow(index) {
		return Math.floor(index / 5) * 2 + ((index % 5) > 1 ? 1 : 0);
	}

	get _contentHeight() {
		const pageHeight = 300;
		const totalRows = this._getRow(this.props.pages.length - 1) + 1;
		return pageHeight * totalRows + (12 * (totalRows + 1)) + this._contentInsetTop + this._contentInsetBottom;
	}

	get _contentInsetTop() {
		return this.props.containerHeight / 2;
	}
	get _contentInsetBottom() {
		return this.props.containerHeight / 2;
	}

	onPageHover(index) {

	}

	render() {
		const x = this.state.x;

		const pageHeight = 300;
		const pageWidth = 200;
		const topPadding = 12;

		const containerWidth = this.props.containerWidth;
		const containerHeight = this.props.containerHeight;

		const contentWidth = pageWidth * 3 + 12 * 2;
		const centerOffsetX = (window.innerWidth - contentWidth) / 2;
		const scrollYOffset = x * -(this._contentHeight - containerHeight);

		const pages = this.props.pages.map((page, index) => {
			if (page._y == null) {
				page._y = Math.random();
			}
			const row = this._getRow(index);
			const totalColumns = row % 2 === 0 ? 2 : 3;
			const column = (index % 5) % 3;
			
			const offsetX = row % 2 === 0 ? pageWidth / 2 : 0;

			const top = row * (pageHeight + 12) + topPadding + scrollYOffset + this._contentInsetTop;
			let yPercentage = top / containerHeight;
			yPercentage -= 0.5;
			yPercentage += column / totalColumns * 1.0;

			if (yPercentage < 0) {
				yPercentage = 0;
			}
			if (yPercentage > 1) {
				yPercentage = 1;
			}

			const dragOffsetY = Math.pow(yPercentage, 1.2) * (containerHeight * 2.0);

			return (
				<div key={index} style={{
					width: pageWidth,
					height: pageHeight,
					position: 'absolute',
					left: column * (pageWidth + 12) + offsetX + centerOffsetX,
					top: top + dragOffsetY
				}}>
					<div style={{
						width: '100%',
						height: '100%',
						backgroundColor: '#CCC',
						position: 'absolute',
						left: -20,
						top: 20,
						zIndex: -1
					}}>,
					</div>
					<div style={{
						width: '100%',
						height: '100%',
						position: 'absolute',
						left: 0,
						top: 0
					}}>
						<Page onHover={ () => {
							this.onPageHover(index);
						}}/>
					</div>
				</div>
			);
		});

		const scrollTop = this.refs.scroll == null ? 0 : this.refs.scroll.scrollTop;

		const hiddenScroll = (
			<div style={{
				position: 'absolute',
				left: 0,
				top: 0,
				overflow: 'auto',
				width: '100%',
				height: '100%'
			}} 
			ref='scroll'>
				<div style={{
					width: '100%',
					height: this.props.scrollHeight,
					overflow: 'hidden',
					position: 'relative'
				}}>

				</div>

				<div style={{
					position: 'absolute',
					width: '100%',
					height: this.props.scrollHeight,
					overflow: 'hidden',
					left: 0,
					top: 0
				}}>
					<div ref='pageContainer' style={{
						position: 'absolute',
						width: containerWidth,
						height: containerHeight,
						left: 0,
						top: scrollTop,
						transform: 'rotateX(-45deg) rotateZ(-45deg)',
						pointerEvents: 'none'
					}}>
						{pages}
					</div>
				</div>
			</div>
		);
				
		return (
			<div style={{
				width: '100%',
				height: '100%'
			}}>

				{hiddenScroll}

			</div>
			
		);
	}
};

PageContainer.defaultProps = {
	aspect: 2 / 3,
	topPadding: 24,
	pageBottomPadding: 24,
	scrollHeight: 8000
};

export default Dimensions()(PageContainer);