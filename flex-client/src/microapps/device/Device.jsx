import { React, useEffect, useState } from 'react'
import { Link, useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom'
import ApiService from '../../helpers/ApiServices';
import { Container, ListGroup } from 'react-bootstrap';

export default function Device() {
    const [state, setState] = useState([])

    const { id } = useParams();
    const isAddMode = !id;

    const findOneDocument = () => {
        ApiService.setHeader();
        return ApiService.get(`device/${id}`).then(response => {
            if (response.data.isSuccess) {
                setState(response.data.document)
            }
        }).catch(err => {
            console.log("FLEX_GRID_DATA_ERR", err);
        })

    }

    useEffect(() => {
        findOneDocument();
    }, [])



    return (
        <Container>
            <ListGroup>
                <ListGroup.Item>{state?._id}</ListGroup.Item>
                <ListGroup.Item>{state?.documentId}</ListGroup.Item>
                <ListGroup.Item>{state?.name}</ListGroup.Item>
            </ListGroup>



        </Container>
    )
}
