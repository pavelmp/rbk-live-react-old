import React, { Component } from 'react';
import './App.css';

const SignUp = function(props){
  return (
    <div>
      <p>Sign Up</p>
      <input className="signupInput" type='text' placeholder='username' value={props.username} onChange={event => props.onChange('username', event.target.value)}/>
      <input className="signupInput" type='text' placeholder='password' value={props.password} onChange={event => props.onChange('password', event.target.value)}/>
      <button onClick={() => props.signUp()}>Sign Up</button>
      <button onClick={() => props.onChange('whatPageToShow', 'signin')}>Already signed up? Log in here</button>
    </div>
  );
};

const SignIn = function(props){
  return (
    <div>
      <p>Sign In</p>
      <input className="signupInput" type='text' placeholder='username' value={props.username} onChange={event => props.onChange('username', event.target.value)}/>
      <input className="signupInput" type='text' placeholder='password' value={props.password} onChange={event => props.onChange('password', event.target.value)}/>
      <button onClick={() => props.signIn()}>Sign In</button>
      <button onClick={() => props.onChange('whatPageToShow', 'signup')}>Don't have an account? Sign up here</button>
    </div>
  );
};

const Places = function(props){
  return (
    <div>
      <p>Places</p>
      { props.places && props.places.map(place => {
        return <p>{place.location}- {place.distance}</p>
      })}
    </div>
  );
};

class App extends Component {
  constructor(props){
    super(props);
    this.onChange = this.onChange.bind(this);
    this.getPlaces = this.getPlaces.bind(this);
    this.state = {
      whatPageToShow: 'signup',
      username: '',
      password: '',
      token: '',
      places: []
    };
  }

  onChange(field, value){
    this.setState({[field]: value});
  }

  signUp(){
    //Make API call to server to sign up
    const that = this;
    const user = {username: this.state.username, 
                  password: this.state.password};
    fetch('http://localhost:5000/signup', {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(user)
    }).then(function(response) {
      if(response.status == 201){
        that.setState({whatPageToShow: 'signin', password: '', username: '', errorMessage: ''});
      } else {
        response.text().then(value => {
          that.setState({errorMessage: value});
        });
      }
    })
  }

  signIn(){
    //Make API call to server to sign in
    const that = this;
    const user = {username: this.state.username, 
                  password: this.state.password};
    fetch('http://localhost:5000/signin', {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(user)
    }).then(function(response) {
      if(response.status == 200){
        response.json().then(body => {
          that.setState({whatPageToShow: 'places', token: body.token, password: '', username: '', errorMessage: ''}, () => {
            that.getPlaces(that);
          });
        });
      } else {
        response.text().then(value => {
          that.setState({errorMessage: value});
        });
      }
    })
  }

  getPlaces(that){
    fetch('http://localhost:5000/places', {
      method: 'get',
      headers: {"x-access-token": that.state.token}
    }).then(function(response){
      if(response.status == 200){
        response.json().then(places => {
          that.setState({places: places});
        })
      } else {
        response.text().then(error => {
          that.setState({errorMessage: error});
        });
      }
    });
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <h1>My favorite places</h1>
          { this.state.whatPageToShow == 'signup'
            ? <SignUp username={this.state.username} 
                      password={this.state.password}
                      signUp={() => this.signUp()}
                      onChange={this.onChange}/>
            : this.state.whatPageToShow == 'signin'
              ? <SignIn username={this.state.username} 
                        password={this.state.password} 
                        onChange={this.onChange}
                        signIn={() => this.signIn()}/> 
              : this.state.whatPageToShow == 'places'
                ? <Places places={this.state.places}/>
                : null
          }
          <h3>{this.state.errorMessage}</h3>
        </header>
      </div>
    );
  }
};

export default App;
