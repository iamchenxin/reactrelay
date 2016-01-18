/**
 * Created by iamchenxin on 1/12/16.
 */
var EventEmitter = require('events');

function log(txt){
    console.log(txt);
}

class ExtendableError extends Error{
    constructor(message){
        super(message);
        this.name=this.constructor.name;
        this.message=message||"Task error default";
        if( typeof Error.captureStackTrace === 'function'){
            Error.captureStackTrace(this, this.constructor.name);
        }else{
            this.stack = (new Error(message)).stack;
        }
    }
}

class TASKERROR extends ExtendableError{
    constructor(message){
        super(message);
    }
}

class CTask{
    constructor(){
        log("task create");
        this.taskList=new Map();
        this.event = new EventEmitter();

        this.flowList=new Map();
    }


    check(name,list){
        if(list.get(name)){
            let msg = `(${name}) is already reged`;
            log(msg);
            throw new TASKERROR(msg);
        }
    }

    emit(name,data){
        this.event.emit(name,data);
    }

    task(name,callback){
        this.check(name,this.taskList);

        this.taskList.set(name,callback);
        this.event.on(name,callback);
    }

    dataflow(clientName,action){
        this.check(clientName,this.flowList);
        this.flowList.set(clientName,action);

    }

    outPut(clientName,data){

        this.flowList.get(clientName).call(this,data);
    }
}

class Data{

}

export var Task = new CTask();
