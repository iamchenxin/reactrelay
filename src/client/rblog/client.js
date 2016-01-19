/**
 * Created by iamchenxin on 1/19/16.
 */
import {Task} from '../../common/scripts/task.js';

function getPosts(num){
    num=num||0;
    let url=`/graphql?query=query{%0A  page(num%3A0){%0A    user%0A    content%0A  }%0A}&raw`;
    fetch(url,{
        method:'GET',
        headers:{
            Accept: 'application/json'
        }
    }).then(response=>{
        response.json().then(v=>{
            console.log(v.data);
            console.dir(v);
            Task.outPut('client.getPosts',v.data);
        });
    });
}

function newPost(user,content){

    let url =`/graphql?query=mutation{newpost(user%3A"${user}"%2Ccontent%3A"${content}")}&raw`;
    fetch(url,{
        method:'POST',
        body:`query=mutation{newpost(user%3A"${user}"%2Ccontent%3A"${content}")}`
    }).then(response=>{
        response.text().then(v=>{
            console.log(v);
        })
    });
}

export {
getPosts,
newPost
}