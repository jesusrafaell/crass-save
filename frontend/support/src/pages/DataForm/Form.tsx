import { useRef, useState } from "react";
import gsap from "gsap";
import styled from "styled-components";
import UserForm from "./UserForm";
import VehicleForm from "./VehicleForm";
import Button from "../../components/Button";
import { Transition } from "../../lib/Transition";
import { SwitchTransition } from "react-transition-group";
import { useWindowSize } from "../../hooks/useWindowSize";
import { FormProps, IData, VehicleState } from "./model";

function Form({ userFetchedData, formSelectData }: FormProps) {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const { height, width } = useWindowSize();

  const [step, setStep] = useState(0);
  const [vehicleSelected, setVehicleSelected] = useState<string>(
    userFetchedData.vehicles[0].id
  );

  const [data, setData] = useState<IData>(() => {
    const { user, vehicles } = userFetchedData;

    const _vehicles: VehicleState[] = vehicles.map(
      ({
        id,
        licensePlate,
        color,
        type,
        driveTrainType,
        engineType,
        insurance,
        weight,
        country,
        make,
        model,
      }) => ({
        id,
        licensePlate,
        color,
        type,
        driveTrainType,
        engineType,
        insurance,
        weight,
        country,
        make,
        model,
      })
    );

    return {
      fullName: `${user.firstName} ${user.lastName}`,
      mobile: user.mobile,
      email: user.email,
      vehicles: _vehicles,
    } as IData;
  });

  const onTransition = (done: () => void, status: "entering" | "exiting") => {
    const container = nodeRef.current?.querySelector(".form-container");

    if (container) {
      const isMobile = width <= 549;
      if (status === "entering") {
        const tl = gsap.timeline({ onComplete: done });
        tl.set(container, {
          z: isMobile ? 20 : 200,
        }).to(container, {
          duration: 1,
          y: 0,
          z: 0,
          scale: 1,
          rotateX: 0,
          ease: "expo.out",
        });
      } else {
        const tl = gsap.timeline({ onComplete: done });
        tl.to(container, {
          duration: 0.2,
          y: isMobile ? "30%" : "-30%",
          opacity: 0,
          scaleX: isMobile ? 1 : 0.7,
          rotateX: 5,
          ease: "sine.out",
        });
      }
    }
  };

  return (
    <FormStyled height={height}>
      <SwitchTransition mode="out-in">
        <Transition
          key={step}
          nodeRef={nodeRef}
          appear
          mountOnEnter
          unmountOnExit
          addEndListener={onTransition}
        >
          <div ref={nodeRef} style={{ height: "100%" }}>
            {step === 0 && <UserForm data={data} setData={setData} />}
            {step === 1 && (
              <VehicleForm
                formSelectData={formSelectData}
                data={data}
                vehicleSelected={vehicleSelected}
                setData={setData}
                setVehicleSelected={setVehicleSelected}
              />
            )}
          </div>
        </Transition>
      </SwitchTransition>
      <div className="options">
        <Button onClick={() => setStep(0)} disabled={step === 0}>
          Anterior
        </Button>
        <Button onClick={() => setStep(1)} disabled={step === 1}>
          Siguiente
        </Button>
        <Button disabled>Enviar</Button>
      </div>
    </FormStyled>
  );
}

const FormStyled = styled.section<{ height: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 40px;
  font-size: 16px;
  overflow: hidden;
  transition: all 0.25s linear;
  @media (max-width: 550px) {
    flex-direction: column-reverse;
    gap: 30px;
    padding: 40px 0 0;
  }
  .options {
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    margin-top: auto;
    z-index: 9;
    @media (max-width: 550px) {
      padding: 0 40px 0;
    }
  }
  .form-wrapper {
    position: relative;
    height: 100%;
    margin: auto;
    perspective: 100px;
    z-index: 10;
    transform-style: preserve-3d;
    @media (max-width: 550px) {
      display: flex;
      flex-direction: column;
    }

    .form-container {
      display: flex;
      flex-direction: column;
      max-height: ${({ height }) => `${height * 0.75}px`};
      width: 100%;
      max-width: 550px;
      margin: 0 auto;
      padding: 30px 0 0 30px;
      border-radius: 14px;
      background-color: #fff;
      box-shadow: 0px 25px 32px -10px rgba(0, 0, 0, 0.1);
      transform: translateY(200%) scale(2) rotateX(-20deg);
      overflow: hidden;
      transition: max-height 0.25s linear, border-radius 0.25s linear;
      @media (max-width: 550px) {
        height: 100%;
        max-height: ${({ height }) => `${height * 0.85}px`};
        margin-top: auto;
        border-radius: 14px 14px 0 0;
      }
      form {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        margin-top: 30px;
        padding-right: 30px;
        overflow: auto;
        input,
        select {
          width: 100%;
        }
        @media (max-width: 550px) {
          grid-template-columns: repeat(1, 1fr);
        }
      }

      h2 {
        padding: 0 30px 0 0;
        font-size: 2em;
        font-weight: 700;
        line-height: 0.9;
        text-align: center;
      }
    }
  }
`;

export default Form;
