//funciones graphql
import { Collection, ObjectId } from "mongodb";
import { X,Y } from "./types.ts";
import { validar } from "./utils.ts";
import { GraphQLError } from "graphql";

//siempre hay que ponerlo, proporciona acceso
type Context = {
    
}

type MutationArgsX = {
    
}



//resolvers se divide por asi decirlo en 3. lo que lleva los valores, query y mutation
export const resolvers = {

    X: 
    {
       
        
    },
    

    //los gets
    Query: {
        
       
    },
    Mutation: {

    }
}
