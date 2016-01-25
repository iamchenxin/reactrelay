import React from 'react';
import Relay from 'react-relay';
import {NewPost} from './newpost';

function Post(props){
    console.log(props);
    let {post}=props;
    return (
        <div>
            <h2>{post.user}</h2>
            <p>{post.content}</p>
        </div>
    );
}

var RelayPost=Relay.createContainer(Post,{
    fragments:{
        post:()=>Relay.QL`fragment on Post{
        user
        content
        }
        `,
    }
});

class Page extends React.Component{
    render(){
        let {posts} = this.props;

        return (
            <div>
                {posts.postList.edges.map(edge=>{
                   return ( <RelayPost post={edge.node} />);
                })}
                <NewPost />
            </div>
        )
    }
}

export var RelayPage=Relay.createContainer(Page,{
    fragments:{
        posts:()=>Relay.QL`
        fragment on Posts{
          postList(first:10){
                edges{
                    node{
                        ${RelayPost.getFragment('post')}
                    }
                }
            }
        }`,
    }
});