/**
 * Created by iamchenxin on 1/20/16.
 */
import updateSchema from './updateSchema';

function ts(subdir){
    updateSchema('../data/'+subdir+'/schema.js','../data/'+subdir+'/');
}

ts('testInterface');