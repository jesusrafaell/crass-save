import React, { useState } from "react";
import useModal from "@/hooks/useModal";
import styled from "styled-components";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import themes from "@/utils/themes";
import { Spinner } from "@nextui-org/react";

function TrashIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

type DeleteModalProps = {
  text?: string;
  description?: string;
  onClick: (param?: any) => Promise<void>;
};

const DeleteModal = ({
  text = "¿Estas seguro?",
  description,
  onClick,
}: DeleteModalProps) => {
  const { Modal, open, ...modalPropsRest } = useModal();

  const [isLoading, setIsLoading] = useState(false);

  const handleRemove = async () => {
    try {
      setIsLoading(true);
      await onClick();
      modalPropsRest.close();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={open}>
            <TrashIcon className="h-4 w-4" />
            <span className="sr-only">Eliminar</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Eliminar</TooltipContent>
      </Tooltip>
      <Modal
        id="delete-modal"
        {...modalPropsRest}
        style={{
          width: "auto",
          height: "auto",
          left: "50%",
          bottom: "50%",
          borderRadius: "15px",
        }}
        transitionType="small"
      >
        <DeleteModalStyled>
          <h2 className="title">{text}</h2>
          {description && <p className="description my-3">{description}</p>}
          <CardFooter className="flex justify-end gap-2 p-0 mt-5">
            <Button
              variant="outline"
              style={{ color: "#000" }}
              disabled={isLoading}
              onClick={modalPropsRest.close}
            >
              Cancelar
            </Button>
            <Button
              style={{ backgroundColor: themes.light.colors.primary }}
              type="submit"
              onClick={handleRemove}
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" /> : "Eliminar"}
            </Button>
          </CardFooter>
        </DeleteModalStyled>
      </Modal>
    </>
  );
};

const DeleteModalStyled = styled.div`
  padding: 10px;
  .title {
    text-align: center;
    font-size: 1em;
  }
  .description {
    font-size: 0.8em;
    color: ${({ theme }) => theme.disabledColor};
  }
`;

export default DeleteModal;
