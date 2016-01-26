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
        let post={
            user:data.user,
            content:data.content,
            postsID:0
        };
      Relay.Store.commitUpdate(new NewPostMutation(post)) ;
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

class NewPostMutation extends Relay.Mutation{
    getMutation(){
        return Relay.QL`mutation{newPost}`;
    }

    getVariables(){
        return {
            user:this.props.user,
            content:this.props.content,
            clientMutationId: "a",
        };
    }

    getFatQuery(){
        return Relay.QL`
        fragment on NewPostPayload{
            post{
              user
              content
              id
            }
            posts{
              id
            }
            clientMutationId
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
        console.dir(this.props);
        console.log(this.props);
        return [{
            type: 'FIELDS_CHANGE',
            // Correlate the `updatedDocument` field in the response
            // with the DataID of the record we would like updated.
            fieldIDs: {posts: this.props.postsID},
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