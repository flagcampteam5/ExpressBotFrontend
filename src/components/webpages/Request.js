import React, { Component } from 'react';
import {Card, Form, Input, Button} from 'antd';
class Request extends Component {
    render(){
        return(
            <Card title="Request Details">
                   <Form>
                        <Form.Item
                            name = 'Your input'
                            rules={[
                                {
                                    type: 'email',
                                    required: true
                                },
                                
                            ]}>
                            <Input placeholder="Enter Your Email"
                                />
                       </Form.Item>
                       <Form.Item>
                           <Input placeholder="Enter Recipient's Email"/>
                       </Form.Item>
                       <Form.Item>
                           <Button type="primary" >
                               Request
                            </Button>
                       </Form.Item>
                   </Form>
               </Card>
        )
    }
}
export default Request;