// @ts-nocheck
import React from 'react';
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Stack,
  Flex,
  Button,
  Typography,
} from '@strapi/design-system';
import ExclamationMarkCircle from '@strapi/icons/ExclamationMarkCircle';
import Trash from '@strapi/icons/Trash';
import { deleteStripeProduct } from '../../utils/apiCalls';

const apiToken = '6bf7a9cc1e60ab5c27309df7a11c1c7b913f20db60438c61143fd25eb604c88e445642c5cfb900960531bd63321add06a54ea7ffbe98f00d1657717318906afa561fa88418af6ec4780abeb798ff2b4aad750e442f4d57751a3c226dfe7848aca439fbebe4122554ad54625cf227bf08a3591f58ee16e3e05a0ae971cfb499c2'; //process.env.STRAPI_ADMIN_API_TOKEN;

const ConfirmDialog = ({
  isConfirmVisible,
  handleCloseModal,
  productId,
  stripeProductId,
  handleDeleteProductClick,
}) => {
  const handleDelete = async () => {
    const response = await deleteStripeProduct(productId, stripeProductId, apiToken);
    if (response.status === 200) {
      handleDeleteProductClick();
      handleCloseModal();
    }
  };
  return (
    <Dialog title="Confirmation" isOpen={isConfirmVisible}>
      <DialogBody icon={<ExclamationMarkCircle />}>
        <Stack spacing={2}>
          <Flex justifyContent="center">
            <Typography id="confirm-description">
              Are you sure you want to delete this ?
              <br />
              This will only delete from the database.
            </Typography>
          </Flex>
        </Stack>
      </DialogBody>
      <DialogFooter
        startAction={
          <Button onClick={handleCloseModal} variant="tertiary">
            Cancel
          </Button>
        }
        endAction={
          <Button variant="danger-light" startIcon={<Trash />} onClick={handleDelete}>
            Confirm
          </Button>
        }
      />
    </Dialog>
  );
};

export default ConfirmDialog;
