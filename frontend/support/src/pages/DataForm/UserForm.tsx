import React from "react";
import Input from "../../components/Form/Input";
import { FormDataProps } from "./model";

const UserForm = ({ data, setData }: FormDataProps) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setData({ ...data, [e.target.name]: e.target.value });

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2>Formulario del usuario</h2>
        <form>
          <Input
            label="Nombre completo"
            type="text"
            name="fullName"
            value={data.fullName.toString()}
            onChange={onChange}
          />
          <Input label="Doc. de identidad" type="text" />
          <Input
            label="Móvil"
            type="tel"
            name="mobile"
            value={data.mobile.toString()}
            onChange={onChange}
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={data.email.toString()}
            onChange={onChange}
          />
          <Input
            label="Foto del Doc. de identidad"
            type="file"
            accept="image/*"
            containerStyle={{ gridColumn: "1 / -1" }}
            style={{ fontSize: ".8em", marginBottom: 30 }}
          />
        </form>
      </div>
    </div>
  );
};

export default UserForm;
