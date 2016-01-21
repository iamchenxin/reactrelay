/**
 * Created by iamchenxin on 1/18/16.
 */
import {MinMax0,MakeMinMax} from '../../scripts/util.js';



class Data{
    constructor(){
        let samplePost={
            id:0,
            user:"test",
            content:"i am content",
            commit:0
        };

        this.postList=[];
    }

    clipValue(v){
        if(v<=0||v>this.postList.length){
            v=this.postList.length;
        }
        return v;
    }

    getPosts(num){
        let clipNum=this.clipValue(num);
        return this.postList.slice(0,clipNum);
    }

    getAll(){
        return this.postList;
    }

    getPost(id){
        return this.postList[id];
    }

    newPost(user,content){
        let id=this.postList.length;
        this.postList.push({
            id:id,
            user:user,
            content:content,
            commit:0
        });
        return id;
    }
}

var database = new Data();

export {
database
}