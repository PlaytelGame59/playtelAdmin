
import { Button, Form, Modal } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import Swal from 'sweetalert2';
import { base_url, update_notice } from "../api/Constants";

const NoticeForm = ({ showNoticeForm, setShowNoticeForm, noticeId, getNoticeData, onEdit, editData }) => {

    const [formData, setFormData] = useState({
        message: '', 
        // noticeId:noticeId,
    })

    useEffect(() => {
        // debugger
        if(editData) {
            setFormData(editData)
        }
    }, [editData])

    const handleChange = (e) => {
        setFormData((pre)=>{ 
            return({
            ...pre,
            [e.target.name]: e.target.value 
        })})
    }

    const onFinish = async () => {
        try {
            // debugger;
            if(formData._id) {
                // debugger
                const dataToSend = { ...formData, noticeId: formData._id }
                const response = await axios.post(`${base_url}${update_notice}`, dataToSend, {});
                if(response) {
                    if(response.data.status === "success") {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: response.data.msg,
                        });
                    } else {    
                        Swal.fire({
                            icon: 'Error',
                            title: 'Error!',
                            text: response.data.msg,
                        });
                    }
                }
                setShowNoticeForm(false);
                getNoticeData();
            }
        } catch (error) {
            console.log('Error:', error.response.data)
            Swal.fire({
                icon: 'Error',
                title: 'Error!',
                text: error,
            });
        }
    }

    return (
        <>
            <p>Notice form</p>
            <Modal 
                width={800}
                title='create Notice' 
                visible={showNoticeForm}
                onCancel={() => setShowNoticeForm(false)}
                footer={false}
            >
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item label='message:' name='message'>
                        <input 
                            type="text" 
                            name='message'
                            value={formData?.message} 
                            onChange={handleChange}
                        />
                    </Form.Item>
                
                    <div>
                        <Form.Item>
                            <Button htmlType="submit" type="primary">save</Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </>
    )
}

export default NoticeForm




