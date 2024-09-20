import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Device from './Device';
import DeviceList from './DeviceList';


export default function DeviceApp() {

    return (
        <Routes>
            <Route path={'/'} element={<DeviceList />} />
            <Route path={'/list'} element={<DeviceList />} />
            <Route path={'/add'} element={<Device />} />
            <Route path={'/:id'} element={<Device />} />
        </Routes>
    )
}