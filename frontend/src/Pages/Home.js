import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'reactstrap'
import "../Styles/Home.css"
import { Row,Col } from 'reactstrap'
import anna from "../Images/symbolanna.png"
import withAuthentication from "../LoginPages/withAuthentication"
 class Home extends Component {
  render() {
    return (
      <div>
         <Card className='outer'style={{height:"700px"}}>
         <div className="containers">
        <br/><br/>
         
          <Card className='innerlogo'>
        <div>
          <Row>
            <Col className='annaimagecol'>
        <img src={anna}  className="annaimag"/>
        </Col><Col className='annaformat'>
          <br/>
      <h3>COLLEGE OF ENGINEERING GUINDY,</h3>
      <h3>ANNA UNIVERSITY , CHENNAI-600 025</h3></Col>
      </Row>
      </div>
      </Card>

      <Card className='centercard' style={{backgroundColor:"rgb(237, 233, 233)"}}>
        <br/>
     <ul>
      <li><button class="btn btn-primary" ><Link className='link' to ="/Bonafide">Bonanpfide certificate</Link></button></li>
      <li><button class="btn btn-primary"><Link className='link'>Admin Panel</Link></button></li>
     </ul>
     <br/>
     <button  class="btn btn-danger" style={{width: "15%",
                                             marginLeft: "70%",
                                             marginTop: "20px"}}>
      <Link className='link' to="/Logout" >logout</Link></button>
     <br/>
      </Card>
</div>
</Card>
      </div>
    )
  }
}
export default withAuthentication(Home);