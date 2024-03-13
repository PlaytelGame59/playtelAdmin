import React from 'react'
import { useAuthContext } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthContext()
  console.log("user", user)

  return (
    <>
      {children}
    </>
  )
}

export default ProtectedRoute