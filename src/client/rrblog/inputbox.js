/**
 * Created by iamchenxin on 1/26/16.
 */
import React from 'react';
import Relay from 'react-relay';

class InputBox extends React.Component{
  constructor(props){
    super(props);
    this.state={
      inputUser:this.props.user||"",
      inputContent:this.props.content||""
    }
  }
  /*
  static propTypes = {
    className: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    user:PropTypes.string,
    content:PropTypes.string,
  };
*/
  _bindInput(bindState){
    return {
      value:this.state[bindState],
      onChange: (event)=>{
        this.setState({
          [bindState]:event.target.value
        })
      }
    };
  }

  render(){

    return(
        <form onSubmit={this._onSubmit}>
          <b>User:</b><input type="text" {...this._bindInput('inputUser')} /><br/>
          <textarea {...this._bindInput('inputContent')} />
          <button>Send</button>
        </form>
    );
  }

  _onSubmit=(event)=>{
    event.preventDefault();
    this.props.onSubmit({
      user:this.state.inputUser,
      content:this.state.inputContent,
    });
  };

}

export {
InputBox
}