import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'
import Spinner from './Spinner'


const showForm = (props) => {
    
    return(
      <Tabs defaultActiveKey="buy" className="bg-dark text-white">
  
        <Tab eventKey="buy" title="Buy" className="bg-dark">
        
        </Tab>
        
        <Tab eventKey="sell" title="Sell" className="bg-dark text-white">

        </Tab>
    </Tabs>         
            
    )
}

class NewOrder extends Component {
  
    
  render() {
    return (
      <div className="card bg-dark text-white">
        <div className="card-header">
          New Order
        </div>
        <div className="card-body">
          { showForm(this.props) }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  

return {
   // TO DO
  }
}

export default connect(mapStateToProps)(NewOrder)