/**
 * Created by iamchenxin on 1/25/16.
 */
import React from 'react';
import Relay from 'react-relay';
import {InputBox} from './inputbox';

class NewPost extends React.Component{
    constructor(props) {
        super(props);
    }

    _onSubmit=(data)=>{
        let newpost={
            user:data.user,
            content:data.content,
        };
        console.dir(this.props);
      Relay.Store.commitUpdate(new NewPostMutation({posts:this.props.posts,newpost})) ;
    };

    render(){
        return(
          <div>
              <InputBox
                onSubmit={this._onSubmit}
                user="D"
                content="C"
              />
          </div>
        );
    }

}

// posts , newpost
class NewPostMutation extends Relay.Mutation{
    getMutation(){
        return Relay.QL`mutation{newPost}`;
    }

    getVariables(){
        return {
            user:this.props.newpost.user,
            content:this.props.newpost.content,
        };
    }

    getFatQuery(){
        return Relay.QL`
        fragment on NewPostPayload{
            postEdge
            posts{
              postList
            }
        }`;
    }

    static fragments= {
        posts: ()=>Relay.QL`
        fragment on Posts{
          id
        }
      `,
    };

    getConfigs() {
        console.log("newpost..");
        console.dir(this.props);
        return [{
            type: 'RANGE_ADD',
            parentName:'posts',
            parentID:this.props.posts.id,
            connectionName:'postList',
            edgeName:'postEdge',
            rangeBehaviors:{
                '': 'append',
                'status(any)': 'append',
                'status(active)': 'append',
                'status(completed)': null,
            }
        }];
    }
}

var NewPostRelay = Relay.createContainer(NewPost,{
    fragments:{
        posts:()=>Relay.QL`
            fragment on Posts{
              ${NewPostMutation.getFragment('posts')}
            }
        `,
    },
});

export {
    NewPostRelay
}