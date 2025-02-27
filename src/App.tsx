import PianoVisualizer from './components/piano/Piano';
import './App.css'
import DrumMachine from './components/drums/DrumMachine';
import { Paper, Typography } from '@mui/material';
import Footer from './components/footer/Footer';

function App() {

  return (
    <>
      <div className="card">
        <Typography
          variant='h1'
          sx={{
            fontFamily:'cursive',
            letterSpacing:'16px',
            backgroundColor:'lightseagreen'
          }}
        >
          jamBox 
        </Typography>
        <Typography
        sx={{
          fontFamily:'monospace',
          backgroundColor:'lightseagreen'
        }}>
          bSharpCb
        </Typography>
        <Paper 
          elevation={24}
          sx={{
            backgroundColor:'mediumpurple',
            padding:'20px'
          }}>
          <DrumMachine/>
          <PianoVisualizer/>
        </Paper>
        <Footer/>
      </div>
    </>
  )
}

export default App
