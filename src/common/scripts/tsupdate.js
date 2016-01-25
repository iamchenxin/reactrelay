import updateSchema from './updateSchema';
import path from 'path';

function ts(srcdir){
    updateSchema(path.join(srcdir,'schema.js'),srcdir);
}

ts(path.resolve( './dst/common/data/rblog'));