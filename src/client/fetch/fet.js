/**
 * Created by iamchenxin on 1/19/16.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {Task} from '../../common/scripts/task.js';



function Show(props){
    return (
        <div>{props.result}</div>
    );
}

class ShowBox extends React.Component{
    constructor(props){
        super(props);
        this.state={
            result:""
        };
    }

    _testFetch=()=>{
        fetch("/graphql?query=query%7B%0A%20%20user(id%3A1)%7B%0A%20%20%20%20id%0A%20%20%20%20name%0A%20%20%7D%0A%7D",{
            method:"GET"
        }).then(res=>{
            let result = "";
           if(res.ok){
               res.text().then(text=>{
                   this.setState({
                       result:text
                   });
                   console.dir(JSON.parse(text));
               });
           }else {

               this.setState({
                   result:"some thing wrong"
               });
               result="some thing wrong";
           }

        });
    };

    render(){
        return(
            <div>
                <Show {...this.state}/>
                <button onClick={this._testFetch} >Show</button>
            </div>

        );
    }
}

export function Render(data){
    ReactDOM.render(<ShowBox  />, document.getElementById("contain") );
}