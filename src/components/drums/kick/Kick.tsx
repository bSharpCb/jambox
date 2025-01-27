// @ts-nocheck
import React, { useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Button, ButtonGroup, Accordion, AccordionSummary, AccordionDetails, Typography, Tooltip } from '@mui/material';
import Icon from '@mdi/react';
import { mdiMusicNoteEighth, mdiMusicNoteHalf, mdiMusicNoteQuarter, mdiMusicNoteWhole, mdiMusicNoteSixteenth } from '@mdi/js';

const play = (audioContext, volume) => {
    const now = audioContext.current.currentTime;
    const kOsc = audioContext.current.createOscillator();
    const kOsc2 = audioContext.current.createOscillator();
    const kGainOsc = audioContext.current.createGain();
    const kGainOsc2 = audioContext.current.createGain();

    kOsc.type = "triangle";
    kOsc2.type = "sine";
    kGainOsc.gain.setValueAtTime(volume, now); // Use the passed volume
    kGainOsc.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    kGainOsc2.gain.setValueAtTime(volume, now); // Use the passed volume
    kGainOsc2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    kOsc.frequency.setValueAtTime(120, now);
    kOsc.frequency.exponentialRampToValueAtTime(0.001, now + 0.5);
    kOsc2.frequency.setValueAtTime(50, now);
    kOsc2.frequency.exponentialRampToValueAtTime(0.001, now + 0.5);

    kOsc.connect(kGainOsc);
    kOsc2.connect(kGainOsc2);
    kGainOsc.connect(audioContext.current.destination);
    kGainOsc2.connect(audioContext.current.destination);

    kOsc.start(now);
    kOsc2.start(now);
    kOsc.stop(now + 0.5);
    kOsc2.stop(now + 0.5);
};

const Kick = ({ activeSteps, toggleStep, audioContext, volume, onVolumeChange, toggleEveryOtherStep, currentIndicator }) => {
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
            Kick
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
                    <Button onClick={() => toggleEveryOtherStep('kick',2)}><Icon path={mdiMusicNoteEighth} size={1} /></Button>
                </Tooltip>
                <Tooltip title="Fill 1/4 notes">
                    <Button onClick={() => toggleEveryOtherStep('kick',4)}><Icon path={mdiMusicNoteQuarter} size={1} /></Button>
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

Kick.play = play;
export default Kick;
