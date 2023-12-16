import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Card, List } from 'reactstrap'
import "../Styles/BonafidePage.css"
import { Row,Col } from 'reactstrap'
import anna from "../Images/symbolanna.png"
import Passportrenewnal from './Passportrenewnal'
import withAuthentication from "../LoginPages/withAuthentication"
class BonafidePage extends Component {
  render() {
    return (
      <div>
         <Card className='outerpage'style={{height:"700px"}}>
         <div className="containers">
        <br/><br/>
         
          <Card className='innerlogopage'>
        <div>
          <Row>
            <Col className='annaimagecolpage'>
        <img src={anna}  className="annaimag"/>
        </Col><Col className='annaformat2'>
          <br/>
      <h3>COLLEGE OF ENGINEERING GUINDY,</h3>
      <h3>ANNA UNIVERSITY , CHENNAI-600 025</h3></Col>
      </Row>
      </div>
      </Card>

      <Card className='centercardpage' style={{backgroundColor:"rgb(237, 233, 233)",height: "100%"}}>
        <br/>
        <div >
        <ul>
          <li><Link className='linklist'to='/bankloan'>Bank Educational Loan</Link></li>
          <li><Link className='linklist'to="/Passport">Passport</Link></li>
          <li><Link className='linklist' to="/Passportrenewnal">Passport Renewal</Link></li>
          <li><Link className='linklist' to="/Visa">Visa</Link></li>
          <li><Link className='linklist' to='/Income'>Income Tax</Link></li>
          <li><Link className='linklist'to='/Personalstuding'>Person Studying Medium</Link></li>
          <li><Link className='linklist' to="/Bus">Bus pass</Link></li>
          <li><Link className='linklist' to="/Trainpass">Train pass</Link></li>
          <li><Link className='linklist' to="/Scholarship">Scholarship</Link></li>
          <li><Link className='linklist'to="/Awards">Awards</Link></li>
          <li><Link className='linklist' to="/Others">Others</Link></li>
          <li><Link className='linklist' to="/Parent">Special(with parent name)</Link></li>
          <li><Link className='linklist'to="/Jobapply">Job Apply</Link></li>
                </ul>
                <button  class="btn btn-danger" style={{width: "15%",
                                             marginLeft: "70%",
                                             marginTop: "20px"}}>
      <Link className='link' to="/Logout" >logout</Link></button>
        </div>
     
      
      
     <br/>
     
      </Card>
</div>
</Card>
      </div>
    )
  }
}
export default withAuthentication(BonafidePage);