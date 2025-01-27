import React, { useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Button, ButtonGroup, Accordion, AccordionSummary, AccordionDetails, Typography, Tooltip } from '@mui/material';
import Icon from '@mdi/react';
import { mdiMusicNoteEighth, mdiMusicNoteHalf, mdiMusicNoteQuarter, mdiMusicNoteWhole, mdiMusicNoteSixteenth } from '@mdi/js';

const play = (audioContext, volume) => {
    const now = audioContext.current.currentTime;

    // Noise generator
    const noiseBuffer = audioContext.current.createBuffer(1, 4096, audioContext.current.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < 4096; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    const noiseSource = audioContext.current.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    // High-pass filter
    const filter = audioContext.current.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(100, now);
    filter.frequency.linearRampToValueAtTime(1000, now + 0.2);

    // Gain for noise
    const noiseGain = audioContext.current.createGain();
    noiseGain.gain.setValueAtTime(volume, now); // Use the passed volume
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(audioContext.current.destination);

    noiseSource.start(now);
    noiseSource.stop(now + 0.2);
};

const Snare = ({ activeSteps, toggleStep, audioContext, volume, onVolumeChange, toggleEveryOtherStep, currentIndicator }) => {
    return (
        <div className="track">
                        <Accordion className="instrument-name">
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
            Snare
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
                    <Button onClick={() => toggleEveryOtherStep('snare',2)}><Icon path={mdiMusicNoteEighth} size={1} /></Button>
                </Tooltip>
                <Tooltip title="Fill 1/4 notes">
                    <Button onClick={() => toggleEveryOtherStep('snare',4)}><Icon path={mdiMusicNoteQuarter} size={1} /></Button>
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

Snare.play = play;
export default Snare;
