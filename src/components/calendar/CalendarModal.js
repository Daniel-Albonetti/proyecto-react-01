import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

import moment from 'moment';
import DateTimePicker from 'react-datetime-picker';
import Swal from 'sweetalert2';

import { centerModal } from '../../helpers/center-modal';
import { useDispatch, useSelector } from 'react-redux';
import { uiCloseModal } from '../../actions/ui';
import { eventClearActiveEvent, eventStartAddNew, eventStartUpdate } from '../../actions/events';


Modal.setAppElement('#root');

const now = moment().minutes(0).seconds(0).add(1, 'hours');
const nowPlus1 = now.clone().add(1, 'hours');

const initEvent = {
    title: '',
    notes: '',
    start: moment().toDate(),
    end: moment().add(2, 'hours').toDate()
}

export const CalendarModal = () => {

    const dispatch = useDispatch();

    const { modalOpen } = useSelector(state => state.ui);
    const { activeEvente } = useSelector(state => state.calendar);

    const [dateStart, setDateStart] = useState(now.toDate());
    const [dateEnd, setDateEnd] = useState(nowPlus1.toDate());
    const [titleValid, setTitleValid] = useState(true);

    const [formValues, setFormValues] = useState(initEvent);

    const { notes, title, start, end } = formValues;

    useEffect(() => {
        
        if (activeEvente) {
            setFormValues( activeEvente );
        }else{
            setFormValues( initEvent );
        }
        

    }, [activeEvente, setFormValues])

    const handleInputChange = ({target}) => {

        setFormValues({
            ...formValues,
            [target.name]: target.value
        });

    } 

    const closeModal = () => {
        
        dispatch( uiCloseModal() );
        dispatch( eventClearActiveEvent() );
        setFormValues(initEvent);

    }

    const handleStartDateChange = (e) => {
        
        setDateStart(e);
        setFormValues({
            ...formValues,
            start: e
        })

    }

    const handleEndDateChange = (e) => {

        setDateEnd(e);
        setFormValues({
            ...formValues,
            end: e
        })

    }

    const handleSubmitForm = (e) => {

        e.preventDefault();

        const momentStart = moment(start);
        const momentEnd = moment(end);

        if (momentStart.isSameOrAfter(momentEnd)) {
            
            Swal.fire('Error', 'La fecha fin debe de ser mayor a la fecha de inicio', 'error');
            return;
        }

        if (title.trim().length < 2) {
            return setTitleValid(false);
        }

        
        if (activeEvente) {
            
            dispatch( eventStartUpdate(formValues) );

        }else{

            dispatch( eventStartAddNew(formValues) );

        }

        setTitleValid(true);
        closeModal();

    }

    return (

        <Modal
          isOpen={ modalOpen }
          onRequestClose={ closeModal }
          style={ centerModal }
          closeTimeoutMS={200}
          className="modal"
          overlayClassName="modal-fondo"
        >
            <h1> { (activeEvente) ? 'Editar Evento' : 'Nuevo evento' } </h1>
            <hr />
            <form
                className="container"
                onSubmit= { handleSubmitForm }
            >

                <div className="form-group">
                    <label>Fecha y hora inicio</label>
                    <DateTimePicker
                        onChange={handleStartDateChange}
                        value={ dateStart }
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Fecha y hora fin</label>
                    <DateTimePicker
                        onChange={ handleEndDateChange }
                        value={ dateEnd }
                        minDate = { dateStart }
                        className="form-control"
                    />
                </div>

                <hr />
                <div className="form-group">
                    <label>Titulo y notas</label>
                    <input 
                        type="text" 
                        className={ `form-control ${ !titleValid && 'is-invalid'}` }
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={ title }
                        onChange = { handleInputChange }
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                </div>

                <div className="form-group">
                    <textarea 
                        type="text" 
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={ notes }
                        onChange = { handleInputChange }
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>

            </form>
          

        </Modal>
    )
}
