var React = require('react')

module.exports = React.createClass({
  render: function() {
    return (
      <canvas
        id={this.props.id}
        width={this.props.width}
        height={this.props.height}
      >
      </canvas>
    )
  }
})
