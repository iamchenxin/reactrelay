import updateSchema from './updateSchema';

function ts(subdir){
    updateSchema('../data/'+subdir+'/schema.js','../data/'+subdir+'/');
}

ts('rblog');