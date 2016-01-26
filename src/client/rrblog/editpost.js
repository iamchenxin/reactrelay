/**
 * Created by iamchenxin on 1/26/16.
 */
import React from 'react';
import Relay from 'react-relay';
import {EditPostMutation} from './mutation/editpost-m';
import {InputBox} from './inputbox';

class EditPost extends React.Component{
  constructor(props){
    super(props);
  }


  _onSubmit=(data)=>{
    this.props.onFinished&&this.props.onFinished();

    let post={
      id:this.props.post.id,
      user:data.user,
      content:data.content,
    };
    Relay.Store.commitUpdate(new EditPostMutation(post));

  };

  render(){
    console.log("iam render");
    return(
      <div>
        <InputBox
          user={this.props.post.user}
          content={this.props.post.content}
          onSubmit={this._onSubmit}
        />
      </div>
    );
  }
}

export {
  EditPost
}