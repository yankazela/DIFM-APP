import React, { Component, Fragment } from 'react'
// import { PulseLoader } from 'react-spinners'
import 'semantic-ui-css/components/dimmer.min.css'
import 'semantic-ui-css/components/loader.min.css'
import 'semantic-ui-css/components/segment.min.css'
import 'semantic-ui-css/components/message.min.css'
// import Helmet from 'react-helmet'
import { updateForm, submitData } from '../reducers/login'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import './../assets/css/login.css'

class Login extends Component {
  constructor () {
    super()
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.salt = process.env.RAZZLE_CIPHER_KEY
  }

  handleChange (event) {
    let newState = {}
    newState[event.target.name] =  event.target.name === 'password' ? this.cipher(this.salt)(event.target.value) : event.target.value
    this.props.updateForm(newState)
  }

  handleSubmit (event) {
    event.preventDefault()
    this.props.updateForm({ errorMessage: '', hasError: false, field: '' })
    this.props.submitData(this.props)
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

  render () {
    if (!this.props.isSubmitting && !this.props.hasSubmitted) {
      return (
          <div className="col-4 login-box">
            <div className="login-dark p-3 shadow-lg rounded">
              <div className="pt-3">
                <h2 className="text-white ">Sign in | DIFM</h2>
              </div>
                <form className="mt-5" onSubmit={this.handleSubmit}>
                  {this.props.hasError && <p className="error">{this.props.errorMessage}</p>}
                  <div className="form-group">
                    <input type="text" name="login" className="form-control form-control-sm" placeholder="Login" value={this.props.login} onChange={this.handleChange} />
                  </div>
                  <div className="form-group">
                    <input type="password" name="password" className="form-control form-control-sm" placeholder="Password" onChange={this.handleChange} />
                  </div>
                  <div className="form-group">
                    <select className="form-control form-control-sm" name="userType" onChange={this.handleChange}>
                      <option>I am a ...</option>
                      <option value="vendor">Professional</option>
                      <option value="customer">Client</option>
                    </select>
                  </div>
                  <div className="form-group form-check">
                    <input type="checkbox" className="form-check-input" id="rememberCheckBox" />
                    <label className="form-check-label text-dark" htmlFor="rememberCheckBox">Remember me?</label>
                  </div>
                  <div className="mt-5">
                    <button className="btn btn-sm btn-success col"> Login </button>
                  </div>
                  <div className="text-center mt-2">
                    <Link to="/forgot" className="text-warning">Forgot Password?</Link>
                  </div>
                  <div className="mt-5">
                    <p className="text-white text-center">
                      Don't have an account?
                      <Link className="text-warning" to="/signup"> Click here to register</Link>
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
      if (this.props.userType === 'customer') {
        return (
          <Redirect to='/' />
        )
      } else {
        return (
          <Redirect to={{
            pathname: '/vendor',
            state: {login: this.props.login}
          }} />
        )
      }
    }
  }
}

const mapStateToProps = (state) => (state.login)
const mapDispatchToProps = (dispatch) => bindActionCreators({ updateForm, submitData }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Login)

