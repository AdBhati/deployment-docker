import React from 'react'
import { Button, Modal } from "react-bootstrap";

const ConfirmationModel = ({showPopup,handleCancel, handleDelete, headingName, bodyMessage, handleUpdate}) => {

  const handleClose = () =>{
    handleCancel(false)
  }

  const handleButton = () =>{
    if(headingName === 'Delete Lead'){
      handleDelete();
    }else if(headingName === 'Update Password'){
      handleUpdate();
      handleCancel(false)
    }
  }


  return (
    <div>
       <Modal 
        show={showPopup}
       >
        <Modal.Header closeButton 
                       onClick={handleClose}
                      >
          <Modal.Title>{headingName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bodyMessage}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" 
                  onClick={handleClose}
          >
            No
          </Button>

                    <Button
                        variant="dark"
                        onClick={() => handleButton()}

                    >
                        Yes

                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ConfirmationModel
