import React, { Component } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ingreso.css';
import sha256 from 'js-sha256';
import { Redirect } from 'react-router-dom';

class Ingreso extends Component {

    constructor(props) {
        super(props);
        this.state = {
            register: false,
            email: "",
            pw: "",
            pwc: "",
            redirect: false
        };

        if(localStorage.getItem("token") !== null){
            this.state.redirect = true;
        }

        this.handleChangeUser = this.handleChangeUser.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
    }

    handleChangeUser = (e) => {
        this.setState({
            email: e.target.value
        });
    }

    handleChangePw = (e) => {
        this.setState({
            pw: e.target.value
        });
    }

    handleChangePwc = (e) => {
        this.setState({
            pwc: e.target.value
        });
    }

    handleRegister = (e, reg) => {
        e.preventDefault();
        this.setState({
            register: reg,
            email:'',
            pw:'',
            pwc:''
        });
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/eventos'/>
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        var data = { email: this.state.email, pw: sha256(this.state.pw) };
        if (this.state.register === false) {
            fetch(process.env.REACT_APP_BACKEND + 'login', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(res => res.json())
            .then(response => {
                if (response.hasOwnProperty("access_token")){
                    localStorage.setItem("token", response.access_token);
                    this.setState({redirect: true});
                }
                else {
                    toast.info(response.message, {position: toast.POSITION.TOP_RIGHT});
                }
            })
            .catch(error => console.error('Error:', error));   
        } else {
            if (this.state.pw !== this.state.pwc){
                toast.info("Las contraseñas no concuerdan", {position: toast.POSITION.TOP_RIGHT});
                return;
            }
            fetch(process.env.REACT_APP_BACKEND + 'registrar', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(res => res.json())
            .then(response => {
                if (response.hasOwnProperty("access_token")){
                    localStorage.setItem("token", response.access_token);
                    this.setState({redirect: true});
                }
                else {
                    toast.info(response.message, {position: toast.POSITION.TOP_RIGHT});
                }
            })
            .catch(error => console.error('Error:', error));   
        }
    }

    displayForm = () => {
        if (this.state.register === false) {
            return <form onSubmit={this.handleSubmit}>
                <legend>Ingresa</legend>
                <div className="form-row mb-2">
                    <div className="col-lg-7">
                        <input type="email" value={this.state.email} onChange={this.handleChangeUser} placeholder="Dirección de correo" className="form-control" />
                    </div>
                </div>
                <div className="form-row mb-2">
                    <div className="col-lg-7">
                        <input type="password" value={this.state.pw} onChange={this.handleChangePw} placeholder="Contraseña" className="form-control" />
                    </div>
                </div>
                <div className="form-row mb-2">
                    <div className="col-lg-7">
                        <button type="submit" className="btn btn-primary">Ingresar</button>
                    </div>
                </div>
                <p>No tiene cuenta? <a href="" onClick={(e) => this.handleRegister(e, true)}>Registrese</a></p>
            </form>;
        }
        else {
            return <form onSubmit={this.handleSubmit}>
                <legend>Registrate</legend>
                <div className="form-row mb-2">
                    <div className="col-lg-7">
                        <input type="email" value={this.state.email} onChange={this.handleChangeUser} placeholder="Dirección de correo" className="form-control" />
                    </div>
                </div>
                <div className="form-row mb-2">
                    <div className="col-lg-7">
                        <input type="password" value={this.state.pw} onChange={this.handleChangePw} placeholder="Contraseña" className="form-control" />
                    </div>
                </div>
                <div className="form-row mb-2">
                    <div className="col-lg-7">
                        <input type="password"  value={this.state.pwc} onChange={this.handleChangePwc} placeholder="Confirmar" className="form-control" />
                    </div>
                </div>
                <div className="form-row mb-2">
                    <div className="col-lg-7">
                        <button type="submit" className="btn btn-primary">Ingresar</button>
                    </div>
                </div>
                <p>Ya tiene cuenta? <a href="" onClick={(e) => this.handleRegister(e, false)}>Ingrese</a></p>
            </form>;
        }
    }

    render() {
        return (
            <div className="container d-flex align-items-center justify-content-center flex-column centerAll">
                <div className="card w-25 shadow-lg">
                    <div className="card-body">
                            <ToastContainer/>
                            {this.renderRedirect()}
                            <div className="container">
                                {this.displayForm()}
                            </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Ingreso;
