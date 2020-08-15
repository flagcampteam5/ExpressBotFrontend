import React, {Component} from 'react';
import {Card, Form, Button, Input, Modal} from 'antd';

class Track extends Component{
    constructor(props){
        super(props);
        this.state = {
            orderNumber : null,
            enteredTrackingNum: false,
            orderTrackingMsg: null
        }
    }

    handleSubmit = e => {
        this.setState({
            enteredTrackingNum : true
        })
    }

    handleChange = e => {
        this.setState({
            orderNumber : e.target.value,
            orderTrackingMsg : 'Tracking Order '+ this.state.orderNumber
        })
    }


    render(){
        if (this.state.enteredTrackingNum === false)  {
            return( 
                
                <Card title="Track Your Package">
                    <Form id = 'orderNumber'>
                        <Form.Item>
                            <Input placeholder="Enter Tracking Number" type='text' onChange={this.handleChange}/>
                        </Form.Item>
                
                        <Form.Item>
                            <Button form='orderNumber' type="primary" htmlType = 'submit' onClick={this.handleSubmit}>Track</Button>
                        </Form.Item>
                    </Form>
                </Card>
         
            )
        } else {

            return(
                <Card title ={this.state.orderTrackingMsg} >
                    <div>progress bar UI goes here</div>
                </Card>
            )
        }
        
    }
}
export default Track