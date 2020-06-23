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
    navData: [{ route: "/consulta", name: "Consultar estado de trámite" }],
    id_forma: null,
    path: null,
    upload_files: [],
    captcha_ok: false,
    all_is_ok: false,
    forma: {
      id_forma: "",
      ci: "",
      nombre_apellidos: "",
      correo_electronico: "(Aún no ingresa correo electrónico válido)",
      cargo: "",
      tipo_tramite: "Denuncia",
      telefono: 0,
      detalle_tramite: "",
    },
    valid: {
      ci: false,
      nombre_apellidos: false,
      correo_electronico: false,
      cargo: false,
      telefono: false,
      detalle_tramite: false,
      captcha_ok: false
    },

    msg: {
      ci: "",
      nombre_apellidos: "",
      correo_electronico: "",
      cargo: "",
      telefono: "",
      detalle_tramite: "",
      captcha_ok: "",
      final: "Llene todos los campos requeridos para poder enviar su trámite"
    }
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
    this._validate_all();
  };

  // Traer validación de captcha
  handle_captcha_change = (captcha_ok) => {
    let valid = this.state.valid;
    valid.captcha_ok = captcha_ok
    this.setState({ valid: valid });
    this._validate_all();
  };

  _validate_all = () => {
    let ok = true;
    Object.keys(this.state.valid).forEach((key) => {
      ok = ok && this.state.valid[key];
    });
    let msg = this.state.msg;
    if (ok) {
      msg.final = "Su trámite esta listo para ser enviado"
    } else { 
      msg.final = "Revise algunos campos aún no han sido llenados"
    }
    console.log(this.state.valid);
    this.setState({ msg: msg, all_is_ok: ok})
  };

  _updateNombre = (e) => {
    let forma = this.state.forma;
    let valid = this.state.valid;
    let msg = this.state.msg;
    forma["nombre_apellidos"] = e.target.value;
    if (e.target.value.length > 8) {
      valid["nombre_apellidos"] = true;
      msg.nombre_apellidos = "";
    } else { 
      valid["nombre_apellidos"] = false;
      msg.nombre_apellidos = "Ingrese nombre y apellidos válidos";
    }
    this.setState({ forma: forma, valid: valid, msg: msg });
    this._validate_all();
  };

  _updateCI = (e) => {
    const forma = this.state.forma;
    let valid = this.state.valid;
    let msg = this.state.msg;
    if (e.target.validity.valid && e.target.value.length === 10) {
      forma["ci"] = e.target.value;
      valid.ci = true;
      msg.ci = ""
    } else { 
      valid.ci = false;
      msg.ci = "Ingrese un número de cédula válido"
    }
    this.setState({ forma: forma, valid: valid, msg: msg });
    this._validate_all();
  };

  _updateEmail = (e) => {
    console.log("correo elec", e.target.validity.valid);
    const forma = this.state.forma;
    let valid = this.state.valid;
    let msg = this.state.msg;
    if (e.target.validity.valid) {
      forma["correo_electronico"] = e.target.value;
      valid.correo_electronico = true;
      msg.correo_electronico = ""
    } else { 
      valid.correo_electronico = false;
      msg.correo_electronico = "Ingrese un correo electrónico válido"
    }
    this.setState({ forma: forma, valid: valid, msg: msg });
    this._validate_all();
  };

  _updateCargo = (e) => {
    let forma = this.state.forma;
    let valid = this.state.valid;
    let msg = this.state.msg;
    forma.cargo = e.target.value;
    if (e.target.value.length > 5) {
      valid.cargo = true;
      msg.cargo = "";
    } else { 
      valid.cargo = false;
      msg.cargo = "Ingrese un cargo válido";
    }
    this.setState({ forma: forma, valid: valid, msg: msg });
    this._validate_all();
  };

  _updateTramite = (e) => {
    const forma = this.state.forma;
    forma["tipo_tramite"] = e.target.value;
    this.setState({ forma: forma });
    this._validate_all();
  };

  _updateDetalle = (e) => {
    const forma = this.state.forma;
    let valid = this.state.valid;
    let msg = this.state.msg;
    forma["detalle_tramite"] = e.target.value;
    if (e.target.value.length > 20) {
      valid.detalle_tramite = true;
      msg.detalle_tramite = "";
    } else { 
      valid.detalle_tramite = false;
      msg.detalle_tramite = "Por favor especifique con detalle suficiente su trámite";
    }
    this.setState({ forma: forma, valid: valid, msg: msg });
    this._validate_all();
  };

  _updateTelephone = (e) => {
    const forma = this.state.forma;
    let valid = this.state.valid;
    let msg = this.state.msg;
    if (e.target.validity.valid && e.target.value.length === 10) {
      forma["telefono"] = e.target.value;
      valid.telefono = true;
      msg.telefono = ""
    } else { 
      valid.telefono = false;
      msg.telefono = "Ingrese un número de teléfono válido"
    }
    this.setState({ forma: forma, valid: valid, msg: msg });
    this._validate_all();
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
    let n_path = "api/formularios/forma/" + this.state.id_forma + "/evidencias";
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
            <Form.Label>
              <span className="obligatorio">*</span> Nombres y apellidos <span className="notify">{this.state.msg.nombre_apellidos}</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese nombres y apellidos"
              className="dn-input-names"
              onChange={this._updateNombre}
            />
            <Form>
              <Row>
                <Col>
                  <Form.Label>
                    {" "}
                    <span className="obligatorio">*</span> C. de ciudadanía <span className="notify">{this.state.msg.ci}</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ingrese CI"
                    onChange={this._updateCI}
                    pattern="[0-9]*"
                  />
                </Col>
                <Col>
                  <Form.Label>
                    {" "}
                    <span className="obligatorio">*</span> Correo electrónico <span className="notify">{this.state.msg.correo_electronico}</span>
                  </Form.Label>
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
                  <Form.Label>
                    {" "}
                    <span className="obligatorio">*</span> Cargo <span className="notify">{this.state.msg.cargo}</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Cargo del funcionario"
                    onChange={this._updateCargo}
                  />
                </Col>
                <Col>
                  <Form.Label>
                    <span className="obligatorio">*</span> Teléfono <span className="notify">{this.state.msg.telefono}</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese teléfono de contacto"
                    onChange={this._updateTelephone}
                  ></Form.Control>
                </Col>
              </Row>
            </Form>
            <br></br>
            <div className="dn-subtitle">Detalles del Requerimiento</div>
            <Form.Label>
              <span className="obligatorio">*</span> Tipo de trámite
            </Form.Label>
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
              <span className="obligatorio">*</span> Ingrese con claridad los
              detalles de su trámite    <span className="notify">{this.state.msg.detalle_tramite}</span>
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
                Los campos marcados con asterisco (
                <span className="obligatorio">*</span>) son de caracter
                obligatorio, asegurese de llenar todos los campos. Al presionar
                "Enviar" usted está de acuerdo con todos los datos ingresados.
                Un correo electrónico de confirmación será enviado al siguiente
                correo:
                <span className="correo">
                  {" "}
                  {this.state.forma.correo_electronico}{" "}
                </span>
              </Form.Label>
              <p></p>
              <div className="dn-final">
                <Button
                  onClick={() => this.confirm_and_send()}
                  variant="warning"
                  disabled={!this.state.all_is_ok}
                >
                  {" "}
                  Enviar{" "}
                </Button>
                <div>{this.state.msg.final}</div>
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
