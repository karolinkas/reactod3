var React = require('react'),
	d3 = require('d3');

var Histogram = React.createClass({

	componentWillMount: function () {
		this.histogram = d3.layout.histogram();
		this.widthScale = d3.scale.linear();
		this.yScale = d3.scale.linear();
		this.update_d3(this.props);
	},

	componentWillReceiveProps: function (newProps) {
		this.update_d3(newProps);
	},

	update_d3: function (props) {
		this.histogram
			.bins(props.bins)
			.value(this.props.value);
		var bars = this.histogram(props.data),
			counts = bars.map(function (d) { return d.y; });
		this.setState({bars: bars});
		this.widthScale
			.domain([d3.min(counts), d3.max(counts)])
			.range([9, props.width-props.axisMargin]);
		this.yScale
			.domain([0, d3.max(bars.map(function (d) { return d.x+d.dx; }))])
			.range([0, props.height-props.topMargin-props.bottomMargin]);
				},

	makeBar: function (bar) {
		var percent = bar.y/this.props.data.length*100;
		var props = {percent: percent,
			x: this.props.axisMargin,
			y: this.yScale(bar.x),
			width: this.widthScale(bar.y),
			height: this.yScale(bar.dx),
			key: "histogram-bar-"+bar.x+"-"+bar.y}
		return (
			<HistogramBar {...props} />
		);
	},

	render: function () {
			var translate = "translate(0, "+this.props.topMargin+")";

			return (
				<g className="histogram" transform={translate}>
					<g className="bars">
						{this.state.bars.map(this.makeBar)}
					</g>
				</g>
			);
		}
	});

var HistogramBar = React.createClass({
	render: function () {
		var translate = "translate(" + this.props.x + "," + this.props.y + ")",
			label = this.props.percent.toFixed(0)+'%';
			if (this.props.percent < 1) {
				label = this.props.percent.toFixed(2)+"%";
			}
			if (this.props.width < 20) {
					label = label.replace("%", "");
			}
					if (this.props.width < 10) {
					label = "";
			}
			
			return (
				<g transform={translate} className="bar">
					<rect width={this.props.width}
						height={this.props.height-2}
						transform="translate(0, 1)">
					</rect>
					<text textAnchor="end"
						x={this.props.width-5}
						y={this.props.height/2+3}>
						{label}
					</text>
				</g>
		);
	}
});

module.exports = {
	Histogram: Histogram
};