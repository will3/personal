import React, { Component } from 'react';
import PageContainer from './components/pagecontainer';
import $ from 'jquery';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.onResize = this.onResize.bind(this);
  }

  onResize() {
    this.forceUpdate();
  }

  componentDidMount() {
    $(window).on('resize', this.onResize);
  }

  componentWillUnmount() {
    $(window).off('resize', this.onResize); 
  }

  render() {
    const pages = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
    const navBarHeight = 44;

    return (
      <div className="App">
        <nav className="App-nav" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1
        }}>
        </nav>        
        <div style={{
          position: 'absolute',
          top: navBarHeight,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden'
        }}>
          <PageContainer pages={pages} />
        </div>
      </div>
    );
  }
}

export default App;
