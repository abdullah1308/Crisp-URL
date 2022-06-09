import { Typography } from '@mui/material'
import React from 'react'

const footerStyle = {
  border: 0,
  position: "absolute",
  margin: 0,
  bottom: 0,
  left: 0,
  right: 0,
  padding: 8,
  background: "#1D2731",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

function Footer() {
  return (
    <footer style={footerStyle}>
      <Typography variant="body1" component="p" sx={{color: "#FFF", border: 0}}>&#169; 2022 Built by Abdullah Rafi</Typography>
    </footer>
  )
}

export default Footer