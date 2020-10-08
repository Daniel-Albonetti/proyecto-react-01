
import { types } from '../types/types';

// {
//     id: new Date().getTime(),
//     title: 'Cumpleaños de jefe',
//     start: moment().toDate(),
//     end: moment().add(2, 'hours').toDate(),
//     bgcolor: '#fafafa',
//     notes: 'Comprar el pastel',
//     user: {
//         _id: '123',
//         name: 'Calestino'
//     }
// }

const initialState = {
    events: [],
    activeEvente: null
};

export const calendarReduce = ( state=initialState, action ) => {

    switch (action.type) {

        case types.eventSetActive:
            return{
                ...state,
                activeEvente: action.payload
            }

        case types.eventAddNew:
            return{
                ...state,
                events: [
                    ...state.events,
                    action.payload
                ]
            }
            
        case types.eventClearActiveEvent:
            return{
                ...state,
                activeEvente: null
            }

        case types.eventUpdated:
            return{
                ...state,
                events: state.events.map(
                    event => (event.id === action.payload.id)
                    ? action.payload
                    : event
                )
            }

        case types.eventDeleted:
            return{
                ...state,
                events: state.events.filter(
                    event => (event.id !== state.activeEvente.id)
                ),
                activeEvente: null
            }
        
        case types.eventLoaded:
            return{
                ...state,
                events: [
                    ...action.payload
                ]
            }

        case types.eventLogout:
            return{
                ...initialState
            }
    
        default:
            return state;
    }

}