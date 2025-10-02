import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
} from "@nextui-org/react";

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDriver: {
        key: string;
        name: string;
        role: string;
        status: string;
    } | null;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, selectedDriver }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("Cambio");
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="text-white flex flex-col gap-1">
                    Editar elemento
                </ModalHeader>
                <ModalBody>
                    {selectedDriver && (
                        <form className="grid grid-cols-1 gap-4">
                            <Input
                                label="Nombre"
                                name="name"
                                value={selectedDriver.name}
                                onChange={handleChange}
                            />
                            <Input
                                label="Rol"
                                name="role"
                                value={selectedDriver.role}
                                onChange={handleChange}
                            />
                            <Input
                                label="Estado"
                                name="status"
                                value={selectedDriver.status}
                                onChange={handleChange}
                            />
                        </form>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button color="primary" onClick={onClose}>
                        Guardar cambios
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default EditModal;