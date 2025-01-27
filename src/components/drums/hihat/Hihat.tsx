// @ts-nocheck
import React, { useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Button, ButtonGroup, Accordion, AccordionSummary, AccordionDetails, Typography, Tooltip } from '@mui/material';
import Icon from '@mdi/react';
import { mdiMusicNoteEighth, mdiMusicNoteHalf, mdiMusicNoteQuarter, mdiMusicNoteWhole, mdiMusicNoteSixteenth } from '@mdi/js';


const play = (audioContext, volume) => {
    const now = audioContext.current.currentTime;
    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(8000, now);
    gainNode.gain.setValueAtTime(volume, now); // Use the passed volume
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.05);
};

const Hihat = ({ activeSteps, toggleStep, audioContext, volume, onVolumeChange, toggleEveryOtherStep, currentIndicator }) => {
    return (
        <div className="track">
            <Accordion className='instrument-name'>
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography 
                    component="span"
                    sx={{
                        fontFamily:'monospace',
                        fontSize:'1.1rem'
                    }}
                    
                    >
                        Hihat
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <input
                          className="vol-slider"
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          onChange={(e) => onVolumeChange(Number(e.target.value))}
                      />
                    <ButtonGroup variant="contained" aria-label="Basic button group">
                    <Tooltip title="Fill 1/8 notes">
                        <Button onClick={() => toggleEveryOtherStep('hihat',2)}><Icon path={mdiMusicNoteEighth} size={1} /></Button>
                    </Tooltip>
                    <Tooltip title="Fill 1/4 notes">
                        <Button onClick={() => toggleEveryOtherStep('hihat',4)}><Icon path={mdiMusicNoteQuarter} size={1} /></Button>
                    </Tooltip>
                    </ButtonGroup>
                </AccordionDetails>
            </Accordion>  
            <div className="steps">
                {activeSteps.map((isActive, index) => (
                    <button
                        key={index}
                        className={`step ${isActive ? 'active' : ''} ${index % 2==0 ? 'downbeat' : 'upbeat'} ${index%4==0 ? 'wholebeat' : ''} ${index == currentIndicator ? 'current' : ''}`}
                        onClick={() => toggleStep(index)}
                    ></button>
                ))}
            </div>
        </div>
    );
};

Hihat.play = play;
export default Hihat;
