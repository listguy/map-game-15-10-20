import React from "react";
import styled from "styled-components";

//styled components
const ModalHeader = styled.div`
  padding-top: 5px;
  font-size: 2.5rem;
  text-align: center;
  font-weight: bold;
`;

const ModalBody = styled.div`
  padding: 10px 15px;
  text-align: center;
  white-space: pre-wrap;
  font-style: italic;
`;

const ModalFooter = styled.div`
  padding: 2vh 0;
  display: flex;
  justify-content: center;
`;

const ModalButton = styled.div`
  background-color: rgba(230, 25, 25, 0.8);
  border: none;
  cursor: pointer;
  font-weight: bold;
  outline: none;
  margin: 0 1vh;
  padding: 10px;
  border-radius: 10px;
  width: fit-content;
  &:hover {
    filter: brightness(1.4);
  }
`;

export default function Modal({
  actionInfo = {},
  content = { header: "Modal header", body: "Modal body here" },
  onClose,
  show = false,
}) {
  //Modal requires a state on the father component which holds a boolean indicating wether modal is open or closed
  //action = object like {text: 'What will be written on the button', action: someFuncThatWillBeCalled}
  // content = an object like {header: 'Modal Header', body: 'content which will be shown in the modal'}
  // onClose = the closing function
  // show = boolean. If modal should be shown or not

  const Wrapper = styled.div`
    background-color: rgba(42, 42, 42);
    position: fixed;
    left: 50%;
    top: 50%;
    margin: 0 auto;
    color: white;
    border-radius: 15px;
    box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.2), 0 7px 20px 0 rgba(0, 0, 0, 0.17);
    transform: ${show ? "translateY(0vh)" : "translateY(-100vh)"};
    opacity: ${show ? "1" : "0"};
    transform: translate(-50%, -50%);
    transition: all 0.8s;
    width: 30vw;
    z-index: 3;
  `;

  return (
    <Wrapper className="modal-wrapper">
      <ModalHeader className="modal-header">{content.header}</ModalHeader>
      <ModalBody>
        <p>{content.body}</p>
        {content.elements}
      </ModalBody>
      <ModalFooter>
        <ModalButton onClick={onClose}>CLOSE</ModalButton>
        {actionInfo.action && (
          <ModalButton
            style={{ backgroundColor: "rgba(25, 230, 25, 0.5)" }}
            onClick={actionInfo.action}
          >
            {actionInfo.text}
          </ModalButton>
        )}
      </ModalFooter>
    </Wrapper>
  );
}
