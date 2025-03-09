import { Container, styled } from "@mui/material"

export const AuthContainer = styled('div')({
    
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
})

export const AuthCard = styled(Container)(({theme}) => ({
    backgroundImage: 'linear-gradient(120deg, #a6c0fe 0%, #f68084 100%)',
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    textAlign: 'center',
    maxWidth: '400px',
}))
    
    