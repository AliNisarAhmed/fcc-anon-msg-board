import React from 'react'
import AlertModal from './AlertModal';

export default function AlertBox({ error, success }) {
  return (
    <React.Fragment>
    {
      error ? (
        <AlertModal classProp="red">
          {error}
        </AlertModal>
      ) : null
    }
    {
      success ? (
        <AlertModal classProp="green">
          {success}
        </AlertModal>
      ): null
    }
    </React.Fragment>
  )
}
