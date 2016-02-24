import React from 'react';
import Relay from 'react-relay';
import {NewPostRelay} from './newpost';
import {EditPostRelay} from './editpost';
import {TestsListRelay} from './tests'

class Post extends React.Component{
  constructor(props){
    super(props);
    this.state={
      editable:false
    }
  }

  _triggerEdit=(event)=>{

    this.setState({
      editable:true
    });
  };
  _onFinished=()=>{
    this.setState({
      editable:false
    });
  };

  render(){
    let {post}=this.props;
    console.dir(this.props);
    console.log("Post reRender")
    return (
      <div>
        {(()=>{
          if(this.state.editable){

            return <EditPostRelay post={this.props.post} onFinished={this._onFinished}/>;
          }else {
            return (
              <div>
                <h2>{post.user}</h2>
                <p>{post.content}</p>
                <button onClick={this._triggerEdit}>Edit</button>
              </div>
            )
          }
        })()}
      </div>
    );
  }
}


var RelayPost=Relay.createContainer(Post,{
    fragments:{
        post:()=>Relay.QL`fragment on Post{
        id
        user
        content
        ${EditPostRelay.getFragment('post')}
        }
        `,
    }
});

class UserList extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    let {postlist} = this.props;
    console.dir(postlist);
    console.dir(this.props);
    return (
      <ul>
        {postlist&&postlist.edges.map(edge=>{
          return (
            <li>{edge.node.user}</li>
          );
        })}
      </ul>
    );
  }
}

var UserListRelay=Relay.createContainer(UserList, {
  fragments:{
    postlist:()=>Relay.QL`
    fragment on PostConnection{
      edges{
        node{
          ... on Post{
            user
          }
        }
      }
    }
    `,
  }
});

class Page extends React.Component{
    render(){
        let {posts} = this.props;
        console.dir("-------");
        console.dir(this.props);
        return (
            <div>
             <p>hello!</p>
                {posts&&posts.postList.edges.map(edge=>{
                   return ( <RelayPost post={edge.node} />);
                })}
              <br/>
                <NewPostRelay posts={posts}/>
              <br/>
            </div>
        );
    }
}
//              <UserListRelay postlist={posts.postList}/>

export var RelayPage=Relay.createContainer(Page,{
    fragments:{
        posts:()=>Relay.QL`
        fragment on Posts{
          postList(first:5){
                edges{
                    node{
                        ${RelayPost.getFragment('post')}
                    }
                }
                ${UserListRelay.getFragment('postlist')}
            }
           ${NewPostRelay.getFragment('posts')}
        }`,
    }
});

/*
class Page extends React.Component{
    render(){
        let {posts,tests} = this.props;
        
        return (
            <div>
                <RelayPagePost posts={posts}/>

            </div>
        );
    }
}
//                 <p>------------TestsListRelay--------------</p>
 //               <TestsListRelay tests={tests}/>
//
//        tests:()=>Relay.QL`
//        fragment on Posts{
//            ${TestsListRelay.getFragment('tests')}
//        }`,
//

export var RelayPage=Relay.createContainer(Page,{
    fragments:{
        posts:()=>Relay.QL`
        fragment on Posts{
            ${RelayPagePost.getFragment('posts')}
        }`,

    }
});
*/