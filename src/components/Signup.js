import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
// import { Message } from 'semantic-ui-react/dist/commonjs'
// import { PulseLoader } from 'react-spinners'
import 'semantic-ui-css/components/dimmer.min.css'
import 'semantic-ui-css/components/loader.min.css'
import 'semantic-ui-css/components/segment.min.css'
import 'semantic-ui-css/components/message.min.css'
// import Helmet from 'react-helmet'
import { updateForm, reinitialise, submitData } from '../reducers/signup'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import './../assets/css/login.css'

class Signup extends Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.salt = process.env.RAZZLE_CIPHER_KEY
    // this.loadData = this.loadData.bind(this)
  }
  handleChange (event) {
    let newState = {}
    newState[event.target.name] =  event.target.name === 'password' || event.target.name === 'confirm' ? this.cipher(this.salt)(event.target.value) : event.target.value
    this.props.updateForm(newState)
  }

  validateEmail (email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  validateDate (date) {
    let dates = date.split('-')
    if (dates.length !== 3) {
      return false
    }
    if ((parseInt(dates[0]) > new Date().getFullYear() - 18) || (parseInt(dates[1]) > 12) || (parseInt(dates[2]) > 31)) {
      return false
    }
    if ((parseInt(dates[1]) === 2) && (parseInt(dates[2]) > 29)) {
      return false
    }
    return true
  }

  validatePassword (password, confirm) { 
    const format = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/
    if (!password.match(format) || password !== confirm) { 
      return false
    } else { 
      return true
    }
  }

  validateNames (name) {
    if (name.length < 3) {
      return false
    }
    return true
  }

  handleSubmit (event) {
    event.preventDefault()
    this.props.updateForm({ errorMessage: '', hasError: false, field: '' })
    let decipherer = this.decipher(this.salt)
    if (!this.validateEmail(this.props.email)) {
      this.props.updateForm({ errorMessage: 'Invalid email entered.', hasError: true, field: 'email' })
    } else if (!this.validateDate(this.props.dateOfBirth)){
      this.props.updateForm({ errorMessage: 'You must be over 16 years old to register and please insure that your date of birth is in this format yyyy/mm/dd.', hasError: true, field: 'dateOfBirth' })
    } else if (!this.validatePassword(decipherer(this.props.password), decipherer(this.props.confirm))) {
      this.props.updateForm({ errorMessage: 'Both password must match, have at least 8 characters and your password must have the following characters: at least one uppercase letter, one lowercase letter, one digit (0 t0 9) and one special character(#, %, $, &, @ ...).', hasError: true, field: 'password' })
    } else if (!this.validateNames(this.props.firstname)) {
      this.props.updateForm({ errorMessage: 'The firstname is required.', hasError: true, field: 'firstname' })
    } else if (!this.validateNames(this.props.surname)) {
      this.props.updateForm({ errorMessage: 'The surname is required.', hasError: true, field: 'surname' })
    } else {
      this.props.submitData(this.props)
    }
  }

  cipher = salt =>{
    let textToChars = text => text.split('').map(c => c.charCodeAt(0))
    let byteHex = n => ("0" + Number(n).toString(16)).substr(-2)
    let applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code)    

    return text => text.split('')
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join('')
  }

  decipher (salt) {
    let textToChars = text => text.split('').map(c => c.charCodeAt(0))
    let saltChars = textToChars(salt)
    let applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code)
    return encoded => encoded.match(/.{1,2}/g)
      .map(hex => parseInt(hex, 16))
      .map(applySaltToChar)
      .map(charCode => String.fromCharCode(charCode))
      .join('')
  }
  render () {
    if (!this.props.isSubmitting && !this.props.hasSubmitted) {
      return (
          <div className="col-4 login-box">
            <div className="login-dark p-3 shadow-lg rounded">
              <div className="pt-3">
                <h2 className="text-white ">Sign Up | DIFM</h2>
              </div>
              <form className="mt-5" onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <input type="text" name="login" className="form-control form-control-sm bg-light" placeholder="Login" onChange={this.handleChange} value={this.props.login} />
                  {(this.props.hasError && this.props.field === 'login') && <small className="error">{this.props.errorMessage}</small>}
                </div>
                <div className="form-group">
                  <input type="password" name="password" className="form-control form-control-sm bg-light" placeholder="Password" onChange={this.handleChange} />
                  {(this.props.hasError && this.props.field === 'password') && <small className="error">{this.props.errorMessage}</small>}
                </div>
                <div className="form-group">
                  <input type="password" name="confirm" className="form-control form-control-sm bg-light" placeholder="Re-type Password" onChange={this.handleChange} />
                </div>
                <div className="form-group">
                  <input type="text" name="firstname" className="form-control form-control-sm bg-light" placeholder="Firstname" onChange={this.handleChange} value={this.props.firstname} />
                  {(this.props.hasError && this.props.field === 'firstname') && <small className="error">{this.props.errorMessage}</small>}
                </div>
                <div className="form-group">
                  <input type="text" name="surname" className="form-control form-control-sm bg-light" placeholder="Surname" onChange={this.handleChange} value={this.props.surname} />
                  {(this.props.hasError && this.props.field === 'surname') && <small className="error">{this.props.errorMessage}</small>}
                </div>
                <div className="form-group">
                  <input type="date" className="form-control form-control-sm bg-light" name="dateOfBirth" placeholder="Date of Birth" onChange={this.handleChange} value={this.props.dateOfBirth} />
                  {(this.props.hasError && this.props.field === 'dateOfBirth') && <small className="error">{this.props.errorMessage}</small>}
                </div>
                <div className="form-group">
                  <input type="email" className="form-control form-control-sm bg-light" name="email" placeholder="Email" onChange={this.handleChange} value={this.props.email} />
                  {(this.props.hasError && this.props.field === 'email') && <small className="error">{this.props.errorMessage}</small>}
                </div>
                <div className="form-group">
                  <input type="text" className="form-control form-control-sm bg-light" name="telephone" placeholder="Telephone" onChange={this.handleChange} value={this.props.telephone} />
                  {(this.props.hasError && this.props.field === 'telephone') && <small className="error">{this.props.errorMessage}</small>}
                </div>
                <div className="mt-5">
                  <button className="btn btn-sm btn-success col"> <strong>Sign up</strong> </button>
                </div>
                <div className="mt-5">
                  <p className="text-white text-center">
                    Don't have an account?
                    <Link className="text-warning" to="/login">Click here to register</Link>
                  </p>
                </div>
              </form>
          </div>
        </div>
      )
    } else if (this.props.isSubmitting && !this.props.hasSubmitted) {
      return (
        <Fragment>
          <div id='circle'>
            <div class='loader' />
          </div>
        </Fragment>
      )
    } else if (this.props.hasSubmitted) {
      return (
        <Redirect to='/' />
      )
    }
  }
}

const mapStateToProps = (state) => (state.signup)
const mapDispatchToProps = (dispatch) => bindActionCreators({ updateForm, reinitialise, submitData }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Signup)


