import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { routing } from './Pages/Routing'

// <Route exact path="/about" component={About} />
// <Route path="/Pages/sCentral" component={SCManage}/>

ReactDOM.render(
  <React.StrictMode>
    {routing}
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
