/**
 * Created by iamchenxin on 1/26/16.
 */
import React from 'react';
import Relay from 'react-relay';

class EditPostMutation extends Relay.Mutation{
  getMutation(){
    return Relay.QL`mutation{editPost}`;
  }

  getVariables(){
    console.log(this.props);
    return {
      user:this.props.user,
      content:this.props.content,
      id:this.props.id
    };
  }

  getConfigs(){
    return [{
      type:'FIELDS_CHANGE',
      fieldIDs:{
        post:this.props.id
      }
    }];
  }

  getFatQuery(){
    return Relay.QL`
    fragment on EditPostPayload{
      post{
        user
        content
      }
    }`;
  }

  static fragments= {
    post:()=>Relay.QL`
    fragment on Post{
      id
    }`
  };
}

export {
  EditPostMutation
}