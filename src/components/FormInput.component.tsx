import React from "react";
import { Control, Controller } from "react-hook-form";
import styled from "styled-components";

type FormInputFields = "displayName" | "email" | "password" | "confirmPassword";

export type FormData = {
  email: string;
  password: string;
  displayName?: string;
  confirmPassword?: string;
};

type FormInputComponentProps = {
  control: Control<FormData, any>;
  name: FormInputFields;
  type: React.HTMLInputTypeAttribute;
  required?: boolean;
  label?: string;
};

const FormInputComponent: React.FC<FormInputComponentProps> = ({
  label,
  control,
  name,
  type,
  required,
}) => {
  return (
    <FormInputWrapper>
      {label && <FormInputLabel>{label}</FormInputLabel>}
      <Controller
        render={({ field }) => (
          <FormInput {...field} type={type} required={required} />
        )}
        name={name}
        control={control}
        defaultValue=""
      />
    </FormInputWrapper>
  );
};

const FormInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const FormInputLabel = styled.label`
  margin-bottom: 15px;
`;

const FormInput = styled.input`
  max-width: 180px;
  width: 100%;
  margin: 0 auto;
`;

export default FormInputComponent;
