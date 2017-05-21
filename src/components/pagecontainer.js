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

	get _contentHeight() {
		const pageHeight = 300;
		return pageHeight * this.totalRows + (12 * (this.totalRows + 1)) + this._contentInsetTop + this._contentInsetBottom;
	}

	get _contentInsetTop() {
		return this.props.containerHeight * 0.5;
	}
	get _contentInsetBottom() {
		return this.props.containerHeight;
	}

	_actualTotalColumns(row) {
		if (row === this.lastRow) {
			return this.lastColumn + 1;
		}
		return this.props.layout[row] || this.props.defaultColumns;
	}

	render() {
		let _row = 0;
		let _column = 0;

		this.props.pages.forEach((page, index) => {
			page._row = _row;
			page._column = _column;

			_column += 1;
			const totalColumns = this.props.layout[_row] || this.props.defaultColumns;
			if (_column >= totalColumns) {
				_row += 1;
				_column = 0;
			}
		});

		this.lastRow = _row;
		this.lastColumn = _column - 1;

		this.totalRows = _row + 1;

		const x = this.state.x;

		const pageHeight = 300;
		const pageWidth = 200;
		const topPadding = 12;

		const containerWidth = this.props.containerWidth;
		const containerHeight = this.props.containerHeight;

		const scrollYOffset = x * -(this._contentHeight - containerHeight);

		const pages = this.props.pages.map((page, index) => {
			if (page._y == null) {
				page._y = Math.random();
			}
			const row = page._row;
			const totalColumns = this._actualTotalColumns(row);
			const contentWidth = pageWidth * totalColumns + 12 * (totalColumns - 1);
			const centerOffsetX = (containerWidth - contentWidth) / 2;
			const column = page._column;
			
			const offsetX = (row + totalColumns) % 2 === 0 ? pageWidth / 4 : -pageWidth / 4;

			const top = row * (pageHeight + 12) + topPadding + scrollYOffset + this._contentInsetTop;
			let yPercentage = top / containerHeight;
			yPercentage -= 0.5;
			yPercentage += column / totalColumns;

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
						<Page />
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
	scrollHeight: 8000,
	layout: [ 2, 3, 4, 5, 6, 7 ],
	defaultColumns: 2
};

export default Dimensions()(PageContainer);