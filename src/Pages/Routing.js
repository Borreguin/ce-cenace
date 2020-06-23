import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import { Formulario } from './Formulario/Formulario'
import { Consulta } from './Consulta/Consulta'
import Home from './Home/Home'

export const routing = (
    <Router>
      <Route exact path="/" component={Home} />
      <Route path="/formulario" component={Formulario} />
      <Route path="/consulta" component={Consulta} />
    </Router>
  )