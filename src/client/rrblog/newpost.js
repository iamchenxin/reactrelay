/**
 * Created by iamchenxin on 1/25/16.
 */
import React from 'react';
import Relay from 'react-relay';

class NewPost extends React.Component{
    constructor(props){
        super(props);
        this.state={
            inputUser:"",
            inputContent:""
        }
    }

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

    _onSubmit=(event)=>{
        event.preventDefault();
        console.log('..');
        console.log(this.props.posts);
        Relay.Store.commitUpdate(new NewPostMutation(
            {
                user:this.state.inputUser,
                content:this.state.inputContent,
                posts:this.props.posts
            }));
    };

    render(){

        return(
            <div>
              <form onSubmit={this._onSubmit}>
                  <textarea {...this._bindInput('inputContent')} /><br/>
                  <b>User:</b><input type="text" {...this._bindInput('inputUser')}/>
                  <button>Send</button>
              </form>
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
            fieldIDs: {posts: this.props.posts.id},
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