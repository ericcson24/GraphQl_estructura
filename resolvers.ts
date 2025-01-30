//funciones graphql
import { Collection, ObjectId } from "mongodb";
import { Paciente,Cita } from "./types.ts";
import { validar } from "./utils.ts";
import { GraphQLError } from "graphql";

//siempre hay que ponerlo, proporciona acceso
type Context = {
    PacientesCollection: Collection<Paciente>,
    CitasCollection: Collection<Cita>
}

type MutationArgsPaciente = {
    id: string,
    nombre: string, 
    telefono: string, 
    correo: string
}

type MutationArgsCita = {
    id: string,
    Paciente: string,
    fecha: string,
    tipo: string,
}

//resolvers se divide por asi decirlo en 3. lo que lleva los valores, query y mutation
export const resolvers = {

    Paciente: 
    {
        id: (parent: Paciente) => parent._id?.toString()
        
    },
    Cita:
    {
        id: (parent: Cita) => parent._id?.toString(),
        paciente: async(
            parent: Cita,
            _: unknown,
            context: Context
        ) => await context.PacientesCollection.findOne({_id: parent.paciente}),
        fecha: (parent: Cita) => parent.fecha.toString()

    },

    //los gets
    Query: {
        getPacient: async(
            _:unknown,       //esto se pone
            args: MutationArgsPaciente,     //que valores se usan
            context: Context         //en que contexto
        ):Promise<Paciente> => {      //aqui decimos que va a ocurrir
            const { nombre, telefono, correo } = args
            const result = await context.PacientesCollection.findOne({_id: new ObjectId(args.id)}) 
            if(!result) throw new GraphQLError("Contact not found")
            return result
        },

        getAppointments: async(
            _:unknown,
            __:unknown,
            context: Context     
        ):Promise<Cita[]> => await context.CitasCollection.find().toArray()
       
    },
    Mutation: {
        addPatient: async(
            _:unknown,
            args: Paciente,
            context: Context
        ):Promise<Paciente> => {
            const paciente_existe= await context.PacientesCollection.findOne({$or: [
                {correo: args.correo},
                {telefono: args.telefono}
            ]})
            if(paciente_existe) throw new GraphQLError("ya existe el paciente")
                const { insertedId } = await context.PacientesCollection.insertOne({
                    nombre: args.nombre,
                    telefono: args.telefono,
                    correo: args.correo,
                });
                return {
                    _id: insertedId,
                    nombre: args.nombre,
                    telefono: args.telefono,
                    correo: args.correo,
                };
                
        },
        addCitas: async(
            _:unknown,
            args: Cita,
            context: Context
        ):Promise<Cita> =>{
            const { paciente, fecha, tipo } = args

            const cita_existe=await context.CitasCollection.findOne()
            if(cita_existe) throw new GraphQLError("ya existe el paciente")
                const { insertedId } = await context.CitasCollection.insertOne({
                    paciente: new ObjectId(paciente),
                    fecha: new Date(fecha),
                    tipo
                })
                
                return {
                    _id: insertedId,
                    paciente: new ObjectId(paciente),
                    fecha: new Date(fecha),
                    tipo
                }
                

        },
        deleteCita: async(
            _:unknown,
            args: Cita,
            context: Context
        ):Promise<boolean> => {
            const { deletedCount } = await context.CitasCollection.deleteOne({_id: new ObjectId(args._id)})
            if(deletedCount === 0) return false
            return true
        },

        updatePatient: async(
            _:unknown,
            args: Paciente,
            context: Context
        ):Promise<Paciente> => {
            const { _id, telefono } = args


            const paciente_existe= await context.PacientesCollection.findOne({$or: [
                {correo: args.correo},
                {telefono: args.telefono}
            ]})
            if(!paciente_existe) throw new GraphQLError("ya existe el paciente")



            if(telefono) {
                const validadotelefono  = await validar(telefono)
                if (!validadotelefono){
                    throw new GraphQLError("telefono invalido")
                }
            }

            const { ...updateFields } = args;
            const result = await context.PacientesCollection.findOneAndUpdate(
                {_id: new ObjectId(_id)},
                {$set:{...updateFields}},
                {returnDocument: "after"}
            )

            if(!result) throw new GraphQLError("Contact not found")
            return result
        }


    }
}