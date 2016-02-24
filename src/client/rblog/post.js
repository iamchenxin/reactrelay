/**
 * Created by iamchenxin on 1/18/16.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {Task} from '../../common/scripts/task.js';
import {getHash} from '../../common/scripts/router.js';

function Title(props){
    return(
      <div>
          <b>[ {props.user} ]</b>
      </div>
    );
}

function Content(props){
    return(
        <div>
            <p>
                {props.content}
            </p>
        </div>
    );
}

function Commit(props){
    return(
        <div>
            <b>{props.commitor} Said: </b>
            <p>{props.content}</p>
        </div>
    );
}

class Post extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        let props=this.props;
        return(
            <div>
                <Title user={props.user}/>
                <Content content={props.content} />
            </div>
        );
    }
}

class NewPostBox extends React.Component{
    constructor(props){
        super(props);
        this.state={
            inputText:"",
            userName:""
        };
    }

    _GenInputHandle(bindState){
        let _onChange= ( (event)=>{
            this.setState({
                [bindState]:event.target.value
            });
        } );
        let _value= this.state[bindState];
        return {value:_value,onChange:_onChange};
    }

    _onSend=(event)=>{
        event.preventDefault();
        Task.emit("blog.post",{
            user:this.state.userName,
            content:this.state.inputText
        });
    };

    render(){
        let props=this.props;
        return (
            <div>
                <form onSubmit={this._onSend}>
                    <textarea value={this.state.inputText} onChange={this._GenInputHandle("inputText")} />
                    <br/>
                    <b>Name : </b>
                    <input value={this.state.userName} onChange={this._GenInputHandle("userName")} />
                    <button>Post</button>
                </form>
            </div>
        );
    }
}

// postList
class Pages extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        let postList=this.props.postList;
        return (
            <div>
                {postList.map(post=>{
                    return( <Post {...post}/> );
                })}
            </div>
        );
    }
}

class Nav extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
                <a href="#posts">Post</a>  |
                <a href="#new_post">New Post</a>
            </div>
        )
    }
}

class Blog extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div>
            <p>hello!!</p>
                <Nav />
                {( ()=>{
                    if(getHash()=='new_post'){
                        return <NewPostBox {...this.props} />
                    }else{
                        return <Pages {...this.props} />
                    }
                } )()}
            </div>
        );
    }
}

export function Render(data){
    if(getHash()!='new_post'){
        data.postList=data.page;
    }
    ReactDOM.render(<Blog {...data} /> , document.getElementById("contain"));
}

