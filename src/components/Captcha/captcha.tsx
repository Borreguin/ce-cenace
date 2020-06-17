import React, { Component } from "react";
import { faFileCode, faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./captcha.css";
import { Button, Form } from "react-bootstrap";

export interface CaptchaProps {
  onCaptchaChange: Function  // informs to the parent's component when captcha is ok!
  
}

class Captcha extends React.Component<CaptchaProps> {
  state = { id: "", src: "", valid: false, class: "cp-captcha-input" };
  constructor(props: CaptchaProps) {
    super(props);
  }

  componentDidMount = () => {
    this._get_captcha_code();
  };

  // informs to the parent's component when captcha is ok!
  handle_captcha_change = () => { 
    this.props.onCaptchaChange(this.state.valid);
  }  

  _get_id() {
    let n = new Date();
    let id = n.getTime() + n.getUTCMilliseconds() - Math.random();
    return id.toString();
  }

  _get_captcha_code = async () => {
    let new_id = this._get_id();
    this.setState({ id: new_id });
    await fetch("/api/formularios/captcha/" + new_id, { method: "post" })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then((response) => response.blob())
      .then((blob) => {
        this.setState({
          src: URL.createObjectURL(blob),
        });
      })
      .catch(console.log);
      this.handle_captcha_change();
  };

  _check_captcha_code = async (p) => {
    if (p.target.value.length === 6) {
      let path = "".concat(
        "/api/formularios/captcha/",
        this.state.id,
        "/",
        p.target.value,
        "/verified"
      );
      await fetch(path)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.success) {
            this.setState({ valid: true, class: "cp-captcha-input cp-ok" });
            this.handle_captcha_change();
          } else {
            this.setState({ valid: false, class: "cp-captcha-input cp-fail" });
            this.handle_captcha_change();
          }
        })
        .catch(console.log);
    } else { 
      this.setState({ valid: false, class: "cp-captcha-input" });
    }
  };

  render() {
    return (
      <div className="cp-code-seccion">
        <div className="cp-sc-captcha">
          {this.state.src && (
            <img alt="home" src={this.state.src} height="68px"></img>
          )}
        </div>
        <div className="cp-sc-input">
          <Button
            className="btn-reset-captcha"
            onClick={() => {
              this.setState({ valid: false, class: "cp-captcha-input" });
              this._get_captcha_code();
            }}
          >
            <FontAwesomeIcon inverse icon={faRedoAlt} size="1x" />
            &nbsp; Generar nuevo
          </Button>
          <Form.Control
            type="text"
            placeholder="Ingrese código"
            className={this.state.class}
            onBlur={this._check_captcha_code}
            onMouseLeave={this._check_captcha_code}
          />
        </div>
      </div>
    );
  }
}

export default Captcha;
