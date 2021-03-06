import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import { Navbar } from '../ui/Navbar';
import { messages } from '../../helpers/calendar-messages-es';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/es';

import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';
import { useDispatch, useSelector } from 'react-redux';
import { uiOpenModal } from '../../actions/ui';
import { eventClearActiveEvent, eventSetActive, eventStartLoading } from '../../actions/events';
import { AddNewFab } from '../ui/AddNewFab';
import { DeleteEventFab } from '../ui/DeleteEventFab';

moment.locale('es');
const localizer = momentLocalizer(moment);

// const events = [{
//     title: 'Cumpleaños de jefe',
//     start: moment().toDate(),
//     end: moment().add(2, 'hours').toDate(),
//     bgcolor: '#fafafa',
//     notes: 'Comprar el pastel',
//     user: {
//         _id: '123',
//         name: 'Calestino'
//     }
// }]

export const CalendarScreen = () => {

    const dispatch = useDispatch();

    const { events, activeEvente } = useSelector(state => state.calendar);

    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month');

    useEffect(() => {
        
        dispatch( eventStartLoading() )

    }, [dispatch])

    const onDoubleClick = (e) => {

        dispatch( uiOpenModal() );

    }

    const onSelectEvent = (e) => {
        
        dispatch( eventSetActive(e) );

    }

    const onViewChange = (e) => {
        setLastView(e);
        localStorage.setItem('lastView', e);
    }

    const onSelectSlot = (e) => {

        // console.log('e', e);
        dispatch( eventClearActiveEvent() );

    }

    const eventStyleGetter = (event, start, end, isSelected) => {

        const style = {
            backgroundColor: '#367cf7',
            borderRadius: '0',
            opacity: 0.8,
            display: 'block',
            color: 'white',
        }

        return{

            style

        }

    };

    return (
        <div className="calendar-screen">
            
            <Navbar />

            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                messages={ messages }
                eventPropGetter={ eventStyleGetter }
                onDoubleClickEvent= { onDoubleClick }
                onSelectEvent= { onSelectEvent }
                onView = { onViewChange }
                onSelectSlot = { onSelectSlot }
                selectable = { true }
                view = { lastView }
                components={{ event: CalendarEvent }}
            />

            <AddNewFab />

            {
                (activeEvente) && <DeleteEventFab />
            }

            <CalendarModal />

        </div>
    )
}
