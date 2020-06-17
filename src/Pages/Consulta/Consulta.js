import React, { Component } from "react";
import DefaultNavBar from "../../components/NavBars/default";
// import LogoHome from '../components/Default/LogoHome'
import DefaultFooter from "../../components/NavBars/footer";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  faBalanceScale,
  faAlignRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Form, Row, Col, Button, Alert } from "react-bootstrap";
import "./Consulta.css";
import Captcha from "../../components/Captcha/captcha";

export class Consulta extends Component {
  state = {
    brand: { route: "./", name: "COMITÉ DE ÉTICA DE CENACE" },
    navData: [
      { route: "/formulario", name: "Formulario de trámites" },
      //{ route: "/Pages/sCentral", name: "Gestión de formularios" },
      //{ route: "/about", name: "Info" },
    ],
    id_forma: "",
    message: "Bienvenido, realice su búsqueda por favor",
    upload_files: [],
    ok: false,
    forma: {
      ci: "",
      nombre_apellidos: "",
      correo_electronico: "",
      cargo: "",
      tipo_tramite: "Denuncia",
      telefono: 0,
      detalle_tramite: "",
      archivos:[]
    },
  };

  // Esto permite conectar el boton del child (upload component)
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }

  _updateIDForm = (e) => {
    this.setState({ id_forma: e.target.value });
  };


  async consulta() {

    this.setState({message:"Empezando búsqueda... ", ok:false})
    if (this.state.id_forma.length === 0) {
      this.setState({ message: "Ingrese un código válido" })
      return;
    }

    let response = await fetch("/api/formularios/forma/" + this.state.id_forma);
    if (response.status === 404) { 
      this.setState({ message: "No se encontró un requerimiento con este código" })
      return;
    }
    if (!response.ok) { 
      this.setState({ message: "Ha ocurrido un error en la consulta" })
      return;
    }
    
    let data = await response.json();
    console.log("ESTO CHECK", data.data);
    this.setState({message:"Detalle encontrado", ok:true, forma: data.data})
  
  }

  render() {
    return (
      <React.Fragment>
        <DefaultNavBar
          bg="dark"
          variant="dark"
          brand={this.state.brand}
          navData={this.state.navData}
        />
        <Card>
          <Card.Header>
            <FontAwesomeIcon icon={faBalanceScale} size="1x" />
            <span className="dn-title">
              CONSULTA DEL ESTADO DE UN REQUERIMIENTO
            </span>
          </Card.Header>
          <Card.Body className="forma-body">
            <div className="dn-subtitle">Datos del Requerimiento </div>
            
            <Form>
              <Row>
                <Col>
                  <Form.Label>Código del Requerimiento</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese código del requerimiento a buscar"
                    onChange={this._updateIDForm}
                  />
                </Col>
                <Col>
                <br></br>
                  <Button onClick={() => this.consulta()}
                    className="btn-buscar"
                  >
                  Buscar
                </Button>
                </Col>
              </Row>
            </Form>
            <br></br>
            <Alert variant="secondary">{this.state.message}</Alert>
            
            <div className="dn-subtitle">Detalles del Requerimiento </div>
            <br></br>
            <div> {this.state.ok? "Está es una prueba funcional, posteriormente se colocará un mejor vista": ""}</div>
            <div> {this.state.ok? "CI: "+ this.state.forma.ci: ""}</div>
            <div> {this.state.ok? "Nombres: "+ this.state.forma.nombre_apellidos: ""}</div>
            <div> {this.state.ok? "Teléfono: "+ this.state.forma.telefono: ""}</div>
            <div> {this.state.ok? "Cargo: "+ this.state.forma.cargo: ""}</div>
            <div> {this.state.ok? "Tipo: "+ this.state.forma.tipo_tramite: ""}</div>
            <div> {this.state.ok? "Detalle: "+ this.state.forma.detalle_tramite: ""}</div>
            <div> {this.state.ok? "Archivos: "+ this.state.forma.archivos: ""}</div>
          
          </Card.Body>
        </Card>
        <DefaultFooter />
        <br></br>
      </React.Fragment>
    );
  }
}
