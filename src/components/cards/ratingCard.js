import React from 'react'

export default class Rating extends React.Component {
  getStar (stars) {
    let listStars = []
    for (var i = 0; i < stars; i++) {
      listStars[i] = <i className="fa fa-star rating"></i>
    }
    return listStars
  }
  render () {
    let listStars = this.getStar(this.props.rating)
    return (
      <span>{listStars.map(star => star)}</span>
    )
  }
}