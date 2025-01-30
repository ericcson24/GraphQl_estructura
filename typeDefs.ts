export const typeDefs = `#graphql
    type Paciente {
        id: ID!,
        nombre: String!,
        telefono: String!,
        correo: String!
        
    }

    type Cita {
        id: ID!,
        Paciente: Paciente!,
        fecha: String!,
        tipo: String!
        
    }
    
    type Query {
        
        getPacient(id:String!):Paciente!
        getAppointments:[Cita!]!
    }

    type Mutation {
        addPatient(name:String!, telefono:String!,correo:String!):Paciente!
        addAppointment(id:ID!,fecha:String!, tipo:String!):Cita!
        deleteAppointment(id:ID!):boolean!
        updatePacient(id:ID!, nombre:String, telefono:String,correo:String):Paciente!
    }
`