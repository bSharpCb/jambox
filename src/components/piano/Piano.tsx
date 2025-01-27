import React, { useState, useEffect } from "react";
import { Paper, Typography, Button } from '@mui/material';

// Map MIDI note numbers to corresponding piano key names and audio files

const MIDI_NOTE_TO_KEY = {
  47: { key: "B1"},
  48: { key: "C2"},
  49: { key: "C#2"},
  50: { key: "D2"},
  51: { key: "D#2"},
  52: { key: "E2"},
  53: { key: "F2"},
  54: { key: "F#2"},
  55: { key: "G2"},
  56: { key: "G#2"},
  57: { key: "A2"},
  58: { key: "A#2"},
  59: { key: "B2"},
  60: { key: "C3"},
  61: { key: "C#3"},
  62: { key: "D3"},
  63: { key: "D#3"},
  64: { key: "E3"},
  65: { key: "F3"},
  66: { key: "F#3"},
  67: { key: "G3"},
  68: { key: "G#3"},
  69: { key: "A3"},
  70: { key: "A#3"},
  71: { key: "B3"},
  72: { key: "C4"},
};

function midiNoteToFrequency (note) {
    return Math.pow(2, ((note - 69) / 12)) * 440;
}

let context = new AudioContext(),
oscillators = {};


let gainNode = context.createGain();
gainNode.gain.value = 0.1;

gainNode.connect(context.destination);

const BLACK_KEYS = [49, 51, 54, 56, 58, 61, 63, 66, 68, 70];

const PianoVisualizer = () => {
  const [activeNotes, setActiveNotes] = useState([]);

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    } else {
      alert("Web MIDI API not supported in this browser.");
    }
  }, []);

  const onMIDISuccess = (midiAccess) => {
    const inputs = midiAccess.inputs;
    inputs.forEach((input) => {
      input.onmidimessage = handleMIDIMessage;
    });
  };

  const onMIDIFailure = () => {
    console.error("Could not access MIDI devices.");
  };

  const handleMIDIMessage = (message) => {
    const [command, note, velocity] = message.data;
    if (command === 144 && velocity > 0) {
      console.log(message.data)
        playNoteSound(note);
        setActiveNotes((prev) => [...new Set([...prev, note])]);
    } else if (command === 128 || (command === 144 && velocity === 0)) {
        stopNoteSound(note);
      setActiveNotes((prev) => prev.filter((n) => n !== note));
    }
  };

  const playNoteSound = (note) => {
    oscillators[note] = context.createOscillator();
    oscillators[note].type = "square";
    oscillators[note].frequency.value = midiNoteToFrequency(note);
    oscillators[note].connect(gainNode);
    oscillators[note].start(context.currentTime);
  };
  
  const stopNoteSound = (note) => {
    oscillators[note].stop(context.currentTime);
    oscillators[note].disconnect();
  };

  const renderPianoKeys = () => {
    const keys = [];
    for (let i = 47; i <= 72; i++) {
      const noteData = MIDI_NOTE_TO_KEY[i] || {};
      const isBlackKey = BLACK_KEYS.includes(i);
      const isActive = activeNotes.includes(i);
      keys.push(
        <div
          key={i}
          style={{
            flex: isBlackKey ? "0 0 50px" : "1",
            height: isBlackKey ? "130px" : "200px",
            backgroundColor: isBlackKey ? (isActive ? "yellow" : "black") : (isActive ? "lightblue" : "white"),
            color: isBlackKey ? "white" : "black",
            border: "1px solid black",
            margin: isBlackKey ? "0 -25px" : "0",
            zIndex: isBlackKey ? 1 : 0,
            position: isBlackKey ? "relative" : "static",
          }}
        >
          {noteData.key || ""}
        </div>
      );
    }
    return keys;
  };

  return (
    <div style={{ textAlign: "center" }}>
                  <Paper 
                elevation={8} 
                sx={{
                    bgcolor:'lightslategrey',
                    padding:'20px'
                }}
                >
                  <div style={{ display: "flex", flexWrap: "nowrap", position: "relative" }}>{renderPianoKeys()}</div>
                                    <Paper
                    elevation={10}
                    sx={{color:'goldenrod',
                        fontFamily:'monospace',
                        float:'right',
                        backgroundColor:'blanchedalmond',
                        borderRadius:'2%',
                        padding:'8px',
                        fontSize:'1.2rem'
                    }}>
                        b# jSynth
                </Paper>
      
      </Paper>
    </div>
  );
};

export default PianoVisualizer;
