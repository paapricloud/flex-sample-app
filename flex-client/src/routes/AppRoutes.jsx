import { React, useState, useEffect, useContext } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ApiService from '../helpers/ApiServices';
import DeviceApp from '../microapps/device/Index';


export default function ModuleRoutes() {


    return (
        <Routes>
            <Route path='' element={<AppCenter />} />
            <Route path='/devices/*' element={<DeviceApp />} />

        </Routes>
    )
}


const AppCenter = () => {

    return <div>
        <Link to={`/flex/departments`} state={{ nci: "111" }} >App</Link>
    </div>
}