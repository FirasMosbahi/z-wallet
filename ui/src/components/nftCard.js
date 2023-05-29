import React from 'react'
import { Col } from 'react-bootstrap'

function NftCard({ title, description, imgUrl }) {
    const linkStyle = {
        textDecoration: 'none',
        color: '#a1d1bf'
    };
    return (
        <Col sm={6} md={4}>
            <div className='proj-imgbx'>
                <img src={imgUrl} alt="project-iamge" />
                <div className='proj-txtx'>
                    <h3>{title}</h3>
                    <h5>{description}</h5>
                </div>
            </div>
        </Col>
    )
}

export default NftCard
