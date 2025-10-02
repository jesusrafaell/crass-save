import React, { useRef, useState } from "react";
import styled from "styled-components";
import { Transition, TransitionStatus } from "react-transition-group";
import useClickOutside from "../../hooks/useClickOutside";
import { CustomSelectProps, OptionProps } from "../../pages/DataForm/model";
import { IoIosArrowDown } from "react-icons/io";
const timeout = 100;
const transitionStyle: Record<string, React.CSSProperties> = {
  entering: { opacity: 0, transform: "translateY(-25px)" },
  entered: { opacity: 1, transform: "translateY(4px)" },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  selected,
  options,
  after,
  disabled = false,
  onChange,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<HTMLUListElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  useClickOutside<HTMLDivElement>({
    ref: dropdownRef,
    handler: () => setIsOpen(false),
  });

  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: OptionProps) => {
    onChange(option);
    setIsOpen(false);
  };

  const getColor = (option: OptionProps) => {
    if (after === "color" && option.hex) {
      return {
        backgroundColor: option.hex,
      };
    }
  };

  return (
    <CustomSelectStyled disabled={disabled}>
      <label>{label}</label>
      <div className="select-container" ref={dropdownRef}>
        <button className="select" onClick={toggleDropdown}>
          <span>{selected.name}</span>
          <span className="arrow">
            <IoIosArrowDown />
          </span>
        </button>
        <Transition
          in={isOpen}
          timeout={timeout}
          nodeRef={transitionRef}
          mountOnEnter
          unmountOnExit
          exit={false}
        >
          {(state: TransitionStatus) => (
            <DropdownList
              ref={transitionRef}
              style={{
                transition: `all ${timeout}ms linear`,
                ...transitionStyle[state],
              }}
            >
              {options?.map((option) => (
                <li key={option.id} onClick={() => handleOptionClick(option)}>
                  <span className="check">
                    {option.id === selected.id ? "✓" : ""}
                  </span>
                  {option.name}
                  {after && <span className="after" style={getColor(option)} />}
                </li>
              ))}
            </DropdownList>
          )}
        </Transition>
      </div>
    </CustomSelectStyled>
  );
};

const CustomSelectStyled = styled.div<{ disabled: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  label {
    font-weight: 600;
    font-size: 0.9em;
    user-select: none;
    opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
    transition: opacity 0.25s linear;
  }
  .select-container {
    position: relative;
    height: 100%;

    .select {
      position: relative;
      height: 100%;
      min-height: 43.2px;
      width: 100%;
      padding: 8px 25px 8px 10px;
      border: 2px solid #f3f4f6;
      border-radius: 5px;
      font-weight: 400;
      text-align: left;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
      cursor: ${({ disabled }) => (disabled ? "default" : "cursor")};
      transition: opacity 0.25s linear, border-color 0.25s linear;

      .arrow {
        position: absolute;
        top: 52%;
        transform: translateY(-50%);
        right: 10px;
        svg {
          opacity: 0.4;
          transition: opacity 0.25s linear;
        }
      }

      &:focus {
        border-color: ${({ disabled }) => (disabled ? "#f3f4f6" : "#000")};

        .arrow svg {
          opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
        }
      }
    }
  }
`;

const DropdownList = styled.ul`
  position: absolute;
  max-height: 120px;
  min-width: 100%;
  padding: 8px;
  border-radius: 14px;
  border: 1px solid #f1f1f1;
  background-color: #fff;
  box-shadow: 0px 8px 16px 0 rgba(0, 0, 0, 0.08);
  overflow-y: auto;
  z-index: 1;
  li {
    display: flex;
    align-items: center;
    padding: 6px 5px;
    border-radius: 4px;
    font-size: 0.8em;
    user-select: none;
    line-height: 1.1;

    cursor: pointer;

    &:hover {
      background-color: #f1f1f1;
    }

    .check {
      display: inline-block;
      width: 20px;
      font-weight: 600;
    }

    .after {
      display: inline-block;
      height: 10px;
      width: 10px;
      margin-left: 10px;
      border-radius: 50%;
    }
  }
`;

export default CustomSelect;
