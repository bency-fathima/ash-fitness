import { isAuthenticated } from '@/utils/auth'
import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoutes = ({children}) => {
  if(!isAuthenticated()){
    return <Navigate to="/login" replace/>
  }
  return children
}

export default ProtectedRoutes
