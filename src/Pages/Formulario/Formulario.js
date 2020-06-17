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
import { Card, Form, Row, Col, Button } from "react-bootstrap";
import "./Formulario.css";
import UploadArchivos from "./UploadArchivos";
import Captcha from "../../components/Captcha/captcha";

export class Formulario extends Component {
  state = {
    brand: { route: "./", name: "COMITÉ DE ÉTICA DE CENACE" },
    navData: [
      { route: "/consulta", name: "Consultar estado de trámite" },
    ],
    id_forma: null,
    path: null,
    upload_files: [],
    captcha_ok: false,
    forma: {
      id_forma: "",
      ci: "",
      nombre_apellidos: "",
      correo_electronico: "",
      cargo: "",
      tipo_tramite: "Denuncia",
      telefono: 0,
      detalle_tramite: "",
    },
  };

  // Esto permite conectar el boton del child (upload component)
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }

  // Esta referencia permitirá realizar click desde afuera del componente upload:
  onUpdateFile = () => {
    this.child.current.getUploadFilesClick();
  };

  // Traer informacion desde el hijo:
  handle_files_change = (upload_files) => {
    this.setState({ upload_files: upload_files });
  };

  // Traer validación de captcha
  handle_captcha_change = (captcha_ok) => {
    this.setState({ captcha_ok: captcha_ok });
  };

  _updateNombre = (e) => {
    const temp = this.state.forma;
    temp["nombre_apellidos"] = e.target.value;
    this.setState({ forma: temp });
  };

  _updateCI = (e) => {
    const temp = this.state.forma;
    temp["ci"] = e.target.value;
    this.setState({ forma: temp });
  };

  _updateEmail = (e) => {
    const temp = this.state.forma;
    temp["correo_electronico"] = e.target.value;
    this.setState({ forma: temp });
  };

  _updateCargo = (e) => {
    const temp = this.state.forma;
    temp["cargo"] = e.target.value;
    this.setState({ forma: temp });
  };

  _updateTramite = (e) => {
    const temp = this.state.forma;
    temp["tipo_tramite"] = e.target.value;
    this.setState({ forma: temp });
  };

  _updateDetalle = (e) => {
    const temp = this.state.forma;
    temp["detalle_tramite"] = e.target.value;
    this.setState({ forma: temp });
  };

  _updateTelephone = (e) => {
    const temp = this.state.forma;
    temp["telefono"] = e.target.value;
    this.setState({ forma: temp });
  };

  async confirm_and_send() {
    let detalle_forma = this.state.forma;
    let requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(detalle_forma),
    };
    let response = await fetch("/api/formularios/forma", requestOptions);
    let data = await response.json();
    console.log("ESTO CHECK", data);
    this.setState({ id_forma: data.id_forma });
    let n_path =
      "api/formularios/forma/" + this.state.id_forma + "/evidencias";
    this.setState({ path: n_path });
    this.onUpdateFile();
    // enviar mail:

    detalle_forma["archivos"] = this.state.upload_files;
    detalle_forma["id_forma"] = this.state.id_forma;
    let jsonBody = JSON.stringify(detalle_forma);
    console.log(detalle_forma, jsonBody);
    const requestOptions2 = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonBody,
    };
    let response2 = await fetch("/api/formularios/mail", requestOptions2);
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
              FORMULARIO PARA LA RECEPCIÓN Y TRÁMITE DE REQUERIMIENTOS
            </span>
          </Card.Header>
          <Card.Body className="forma-body">
            <div className="dn-subtitle">Datos Personales </div>
            <Form.Label>Nombres y apellidos</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese nombres y apellidos"
              className="dn-input-names"
              onChange={this._updateNombre}
            />
            <Form>
              <Row>
                <Col>
                  <Form.Label>C. de ciudadanía</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ingrese CI"
                    onChange={this._updateCI}
                  />
                </Col>
                <Col>
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Ingrese email"
                    onChange={this._updateEmail}
                  />
                </Col>
              </Row>
            </Form>

            <Form>
              <Row>
                <Col>
                  <Form.Label>Cargo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Cargo del funcionario"
                    onChange={this._updateCargo}
                  />
                </Col>
                <Col>
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese teléfono de contacto"
                    onChange={this._updateTelephone}
                  ></Form.Control>
                </Col>
              </Row>
            </Form>
            <br></br>
            <div className="dn-subtitle">Detalles del Requerimiento </div>
            <Form.Label>Tipo de trámite</Form.Label>
            <Form.Control
              as="select"
              placeholder="Seleccione"
              onChange={this._updateTramite}
              style={{ maxWidth: "170px" }}
            >
              <option>Denuncia</option>
              <option>Consulta</option>
              <option>Información</option>
              <option>Solicitud de autorización</option>
            </Form.Control>
            <Form.Label>
              Ingrese con claridad los detalles de su trámite
            </Form.Label>
            <Form.Control
              as="textarea"
              rows="5"
              onChange={this._updateDetalle}
            />
            <br></br>
            <Form.Label>Desea incluir archivos? </Form.Label>
            <UploadArchivos
              path={this.state.path}
              ref={this.child}
              uploadButton={false}
              onFilesChange={this.handle_files_change}
            ></UploadArchivos>
            <br></br>
            <Form.Label>Ingrese el código mostrado en la imagen</Form.Label>
            <Captcha onCaptchaChange={this.handle_captcha_change}></Captcha>
            <br></br>
            <Form.Group>
              <Form.Label>
                Presione "Enviar" si está de acuerdo con los datos ingresados:
              </Form.Label>
              <div className="dn-final">
                <Button onClick={() => this.confirm_and_send()}>
                  {" "}
                  Enviar{" "}
                </Button>
              </div>
            </Form.Group>
          </Card.Body>
        </Card>
        <DefaultFooter />
        <br></br>
      </React.Fragment>
    );
  }
}
