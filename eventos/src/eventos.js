import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Form, Modal, Button } from 'react-bootstrap';

class Eventos extends Component {
    constructor(props){
        super(props);
        this.state = {
            redirect: false,
            tuplas: [],
            show: false,
            form: {}
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.displayEvents();
    }

    handleShow = (e) => {
        this.setState({
            show: true
        })
        if (e.target.id.startsWith('edit_')){
            fetch(process.env.REACT_APP_BACKEND + 'eventos/'+e.target.id.replace('edit_',''), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("token")}` }
            })
            .then(res => res.json())
            .then(response => {
                this.setState({
                    form: response
                })
            })
            .catch(error => console.error('Error:', error));
        }
    }

    handleClose = () => {
        this.setState({
            show: false,
            form: {}
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        var data = { 
            nombre: document.getElementById("nombre").value, 
            categoria: document.getElementById("cat").value,
            lugar: document.getElementById("lugar").value,
            direccion: document.getElementById("dir").value,
            fechaInicio: document.getElementById("ini").value,
            fechaFin: document.getElementById("fin").value,
            forma: document.getElementById("for").value,
        };

        if(Object.keys(this.state.form).length !== 0){
            fetch(process.env.REACT_APP_BACKEND + 'eventos/' + this.state.form.id, {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("token")}` }
            })
            .then(res => res.json())
            .then(response => {
                toast.info("Actualizado con éxito", {position: toast.POSITION.TOP_RIGHT});   
                this.handleClose();
                this.displayEvents();
            })
            .catch(error => console.error('Error:', error));
        }
        else {
            fetch(process.env.REACT_APP_BACKEND + 'eventos', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("token")}` }
            })
            .then(res => res.json())
            .then(response => {
                toast.info("Creado con éxito", {position: toast.POSITION.TOP_RIGHT});   
                this.handleClose();
                this.displayEvents();
            })
            .catch(error => console.error('Error:', error));
        }
        
    }
    
    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/'/>
        }
    }

    displayEvents = () => {
        let tuplas = [];
        fetch(process.env.REACT_APP_BACKEND + 'eventos', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("token")}` }
        })
        .then(res => res.json())
        .then(response => {
            if(response.hasOwnProperty("msg")){
                this.setState({redirect:true});
                return;
            }
            else{
                for (let i of response){
                    tuplas.push(
                        <tr key={i.id}>
                            <th scope="row">{i.id}</th>
                            <td>{i.nombre}</td>
                            <td>{i.categoria}</td>
                            <td>{i.lugar}</td>
                            <td>{i.direccion}</td>
                            <td>{i.fechaInicio}</td>
                            <td>{i.fechaFin}</td>
                            <td>{i.forma}</td>
                            <td><button type="button" id={`edit_${i.id}`} onClick={this.handleShow} className="btn btn-info">/</button></td>
                            <td><button type="button" id={`delete_${i.id}`} onClick={this.handleDelete} className="btn btn-danger">-</button></td>
                        </tr>
                    );
                }
                this.setState({tuplas: tuplas});
            }
        })
        .catch(error => console.error('Error:', error));
    }

    handleDelete = (e) => {
        e.preventDefault();
        let val = e.target.id.replace('delete_','');
        fetch(process.env.REACT_APP_BACKEND + 'eventos/' + val, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => {
            toast.info("Eliminado exitosamente", {position: toast.POSITION.TOP_RIGHT});
            this.displayEvents();
        })
        .catch(error => console.error('Error:', error));
    }

    validateToken = () => {
        if(localStorage.getItem("token") === null){
            return <Redirect to="/"/>
        }
    }

    deployForm = () => {
        return <>
            <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Crea un Grupo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group controlId="nombre">
                            <Form.Label>Nombre:</Form.Label>
                            <Form.Control type="text" defaultValue={this.state.form.nombre}/>
                        </Form.Group>
                        <Form.Group controlId="cat">
                            <Form.Label>Categoría (CONFERENCIA|SEMINARIO|CONGRESO|CURSO):</Form.Label>
                            <Form.Control type="text" defaultValue={this.state.form.categoria}/>
                        </Form.Group>
                        <Form.Group controlId="lugar">
                            <Form.Label>Lugar:</Form.Label>
                            <Form.Control type="text" defaultValue={this.state.form.lugar}/>
                        </Form.Group>
                        <Form.Group controlId="dir">
                            <Form.Label>Dirección:</Form.Label>
                            <Form.Control type="text" defaultValue={this.state.form.direccion}/>
                        </Form.Group>
                        <Form.Group controlId="ini">
                            <Form.Label>Fecha Inicio (Formato 'YYYY-MM-DD HH:MM:SS'):</Form.Label>
                            <Form.Control type="text" defaultValue={this.state.form.fechaInicio}/>
                        </Form.Group>
                        <Form.Group controlId="fin">
                            <Form.Label>Fecha Fin (Formato 'YYYY-MM-DD HH:MM:SS'):</Form.Label>
                            <Form.Control type="text" defaultValue={this.state.form.fechaFin}/>
                        </Form.Group>
                        <Form.Group controlId="for">
                            <Form.Label>Forma (PRESENCIAL|VIRTUAL):</Form.Label>
                            <Form.Control type="text" defaultValue={this.state.form.forma}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>Cancelar</Button>
                    <Button variant="success" onClick={this.handleSubmit}>Crear</Button>
                </Modal.Footer>
            </Modal>
        </>;
    }

    render() {
        return (
            <div className="container">
                <ToastContainer/>
                {this.renderRedirect()}
                {this.validateToken()}
                {this.deployForm()}
                <table className="table table-stripped">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Categoria</th>
                        <th scope="col">Lugar</th>
                        <th scope="col">Dirección</th>
                        <th scope="col">Inicio</th>
                        <th scope="col">Fin</th>
                        <th scope="col">Forma</th>
                        <th scope="col">Editar</th>
                        <th scope="col">Borrar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.tuplas.map((e) => {
                            return e;
                        })}
                    </tbody>
                </table>
                <button type="button" onClick={this.handleShow} className="btn btn-primary">Crear evento</button>
            </div>
        );
    }
}

export default Eventos;