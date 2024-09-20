import React, { useEffect, useState } from 'react'
import { Button, Container, Table } from 'react-bootstrap'
import ApiService from '../../helpers/ApiServices'
import { Link } from 'react-router-dom'

export default function DeviceList() {
    const [state, setState] = useState([])

    const findAllDocument = () => {
        ApiService.get(`device`).then(response => {
            if (response.data.isSuccess) {
                setState(response.data.documents)
            }
        }).catch(err => {
            console.log("FLEX_GRID_DATA_ERR", err);
        })
    }

    useEffect(() => {
        findAllDocument();

    }, [])




    return (
        <Container>
            <Table striped>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                    </tr>
                </thead>
                <tbody>
                    {state?.map(device => {
                        return <tr>
                            <td>
                                <Button as={Link} to={`/devices/${device?._id}?mode=edit`} size='sm'>Edit</Button>
                            </td>
                            <td>{device?.documentId}</td>
                            <td>{device?.name}</td>

                        </tr>
                    })}
                </tbody>
            </Table>

        </Container>
    )
}
