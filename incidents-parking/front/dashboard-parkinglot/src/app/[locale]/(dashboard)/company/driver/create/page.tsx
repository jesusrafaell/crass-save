'use client'
import React, { FC, useState } from "react";
import { Card, CardHeader, Input, Button } from "@nextui-org/react";
import { Data } from "@/interfaces/truck";
import truckService from "@/services/truck.service";



const CreatePage = () => {
    const [formData, setFormData] = useState<Data>({
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        distance_radius: 0,
        utc: "",
        fcm_token: "",
        guest: false,
        id_roles: [],
        roles: [],
        id_os: "",
        id_status: "",
        status: { id: "", name: "" },
        id_transport_type: "",
        transportType: { id: "", key: 0, name: "" },
        created_time: "",
        updated_time: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    
const handleCreate = async () => {
    try {
        const companyId = 'ID_DE_LA_COMPANIA';
        const { email } = formData;
        await truckService.addTruck(email, companyId);
    } catch (error) {
    }
};

    return (
        <Card className="w-full p-8">
            <CardHeader className="text-center mb-8">
                <h1 className="text-4xl mb-4">Crear conductor</h1>
            </CardHeader>
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Nombre"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                />
                <Input
                    label="Apellido"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                />
                <Input
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <Input
                    label="Móvil"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                />
                <Input
                    label="Radio de distancia"
                    name="distance_radius"
                    type="number"
                    value={formData.distance_radius.toString()}
                    onChange={handleChange}
                />
                <Input
                    label="UTC"
                    name="utc"
                    value={formData.utc}
                    onChange={handleChange}
                />
                <Input
                    label="Token FCM"
                    name="fcm_token"
                    value={formData.fcm_token}
                    onChange={handleChange}
                />
            </div>
            <div className="text-center mt-8">
                <Button color="success" onClick={handleCreate}>Crear</Button>
            </div>
        </Card>
    );
};

export default CreatePage;