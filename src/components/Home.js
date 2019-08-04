import React, { Component, Fragment } from 'react'
import { updateForm, getProData } from '../reducers/home'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Rating from './cards/ratingCard'
import 'semantic-ui-css/components/dimmer.min.css'
import 'semantic-ui-css/components/loader.min.css'
import 'semantic-ui-css/components/segment.min.css'
import 'semantic-ui-css/components/message.min.css'
import './../assets/css/index.css'

const mapProNameProId = {
  Electician: 1,
  Plumber: 2,
  Carpenter: 3,
  Archtect: 4
}

class Home extends Component {
  constructor () {
    super()
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (event) {
    let newState = {}
    newState[event.target.name] = event.target.value
    if (event.target.name === 'proName') {
      newState['proId'] = mapProNameProId[event.target.value]
    }
    this.props.updateForm(newState)
  }

  handleSubmit (event) {
    event.preventDefault()
    this.props.getProData(this.props)
  }
  render () {
    if (!this.props.isSubmitting && !this.props.hasSubmitted) {
      return (
        <div>
          <section className="login-block">
            <div className="container">
              <div className="row">
                <div className="col-md-4 login-sec">
                  <h2 className="text-center">Find a DIFM Professional</h2>
                  <form className="login-form" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1" className="text-uppercase">Looking for</label>
                      <select name="proName" className="form-control" placeholder="" onChange={this.handleChange} required>
                        <option>Electician</option>
                        <option>Plumber</option>
                        <option>Carpenter</option>
                        <option>Archtect</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="exampleInputPassword1" className="text-uppercase">Address</label>
                      <input type="text" name="address" className="form-control" placeholder="" onChange={this.handleChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="exampleInputPassword1" className="text-uppercase">City</label>
                      <input type="text" name="city" className="form-control" placeholder="" onChange={this.handleChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="exampleInputPassword1" className="text-uppercase">Describe the job</label>
                      <textarea name="description" className="form-control" onChange={this.handleChange} required></textarea>
                    </div>
                    <div className="form-check">
                      <button type="submit" className="btn btn-login float-right">Submit</button>
                    </div>
                  </form>
                  <div className="copy-text"> follow <a href="http://grafreez.com">DIFM on </a><i className="fa fa-facebook"></i> <i className="fa fa-instagram"></i> <i className="fa fa-twitter"></i></div>
                </div>
                <div className="col-md-8 banner-sec">
                  <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                    <ol className="carousel-indicators">
                      <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                      <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                      <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                    </ol>
                    <div className="carousel-inner" role="listbox">
                      <div className="carousel-item active">
                        <img className="d-block img-fluid" src="https://static.pexels.com/photos/33972/pexels-photo.jpg" alt="First slide" />
                        <div className="carousel-caption d-none d-md-block">
                          <div className="banner-text">
                            <h2>This is Heaven</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation</p>
                          </div>	
                        </div>
                      </div>
                      <div className="carousel-item">
                        <img className="d-block img-fluid" src="https://images.pexels.com/photos/7097/people-coffee-tea-meeting.jpg" alt="First slide" />
                        <div className="carousel-caption d-none d-md-block">
                          <div className="banner-text">
                            <h2>This is Heaven</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation</p>
                          </div>
                        </div>	
                      </div>
                    </div>
                    <div className="carousel-item">
                      <img className="d-block img-fluid" src="https://images.pexels.com/photos/872957/pexels-photo-872957.jpeg" alt="First slide" />
                      <div className="carousel-caption d-none d-md-block">
                        <div className="banner-text">
                          <h2>This is Heaven</h2>
                          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation</p>
                        </div>	
                      </div>
                    </div>
                  </div>	   
                </div>
              </div>
            </div>
          </section>
        </div>
      )
    } else if (this.props.isSubmitting && !this.props.hasSubmitted) {
      return (
        <Fragment>
          <div id='circle'>
            <div className='loader' />
          </div>
        </Fragment>
      )
    } else if (this.props.hasSubmitted) {
      return (
        <section id="team" className="pb-5">
          <div className="container">
            <h5 className="section-title h3">{this.props.proName + 's near you'}</h5>
            <div className="row">
            {(this.props.content.data && this.props.content.data.length > 0) &&
            this.props.content.data.map(vendor => {
              return (
                <div className="col-xs-12 col-sm-6 col-md-4">
                  <div className="image-flip" ontouchstart="this.classList.toggle('hover');">
                    <div className="mainflip">
                        <div className="frontside">
                          <div className="card">
                            <div className="card-body text-center">
                              <p><img className=" img-fluid" src="https://sunlimetech.com/portfolio/boot4menu/assets/imgs/team/img_02.png" alt="card image" /></p>
                              <p className="card-title">{vendor.firstname.substr(0,1).toUpperCase() + vendor.firstname.substr(1) + ' ' + vendor.surname.substr(0,1).toUpperCase() + vendor.surname.substr(1)}</p>
                              <ul className="contact-list">
                                <li><small><b>Address:</b> {vendor.address}</small></li>
                                <li><small><b>Telephone:</b> {vendor.telephone}</small></li>
                                <li><small><b>Email:</b> {vendor.email}</small></li>
                                <li><small><b>Age:</b> {new Date().getFullYear() - parseInt(vendor.dateOfBirth.split('-')[0])}</small></li>
                                <li><small><b>Rating: </b><Rating rating={vendor.averageRating} /></small></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="backside">
                          <div className="card">
                          <div className="card-body text-center mt-4">
                            <h4 className="card-title">{vendor.firstname.substr(0,1).toUpperCase() + vendor.firstname.substr(1) + ' ' + vendor.surname.substr(0,1).toUpperCase() + vendor.surname.substr(1)}</h4>
                            <p className="card-text">{vendor.description}</p>
                            <a href="#" className="">View more...</a>                            
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )})
            }
            {(this.props.content.data && this.props.content.data.length == 0) &&
              <div>No content</div>
            }
            </div>
          </div>
        </section>
      )
    }
  }
}

const mapStateToProps = (state) => (state.home)
const mapDispatchToProps = (dispatch) => bindActionCreators({ updateForm, getProData }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Home)
