/**
 * Created by iamchenxin on 15-12-7.
 */
import fs from 'fs';
import path from 'path';
import { graphql }  from 'graphql';
import { introspectionQuery, printSchema } from 'graphql/utilities';


//
function updateSchema(schemaPath,dst){
    var srcPath=path.resolve(schemaPath);
    var basename=path.basename(srcPath,".js");
    var dstPath_noExt=path.resolve(dst,basename);
    console.log(`srcPath=[${srcPath}] , dstPath_noExt=[${dstPath_noExt}]`);

    var mySchema=require(srcPath).schema;
 //   console.log(mySchema);

    // Save user readable type system shorthand of schema
    fs.writeFileSync(
        dstPath_noExt+".graphql",
        printSchema(mySchema)
    );

    // Save JSON of full schema introspection for Babel Relay Plugin to use
    return graphql(mySchema, introspectionQuery).then(result=>{
        fs.writeFileSync(
            dstPath_noExt+".json",
            JSON.stringify(result, null, 2)
        );
    });

}

module.exports = updateSchema;