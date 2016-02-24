import React from 'react';
import Relay from 'react-relay';
import {NewPostRelay} from './newpost';
import {EditPostRelay} from './editpost';

class Post extends React.Component{
  constructor(props){
    super(props);
    this.state={
      editable:false
    }
  }

  render(){
    let {post}=this.props;
    console.dir(this.props);
    console.log("Post reRender")
    return (
      <div>
        {(()=>{

            return (
              <div>
                <h2>{post.user}</h2>
                <p>{post.content}</p>
              </div>
            );
          
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
        }
        `,
    }
});

class TestsList extends React.Component{
    constructor(props){
        super(props);
    }
    
    render(){
        let {postList} = this.props.posts;
            console.dir(this.props.posts);
        <ul>
                {postList&&postList.edges.map(edge=>{
                   return ( <RelayPost post={edge.node} />);
                })}
        </ul>
    }
}

export var TestsListRelay = Relay.createContainer(TestsList,{
   fragments:{
       tests:()=>Relay.QL`
       fragment on Tests{
           postList(first:5){
            edges{
                node{
                    ${RelayPost.getFragment('post')}
                }
            }
           }
       }
       `,
   } 
});