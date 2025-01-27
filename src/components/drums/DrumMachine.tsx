import React, { useState, useEffect } from 'react';
import './DrumMachine.css'; // Import styles
import Hihat from './hihat/Hihat';
import Kick from './kick/Kick';
import Snare from './snare/Snare';
import { Paper, Typography, Button } from '@mui/material';
import { AccessTime, Speed, PlayArrowIcon, StopIcon } from '@mui/icons-material';


const DrumMachine = () => {
    const [bpm, setBpm] = useState(95);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeSteps, setActiveSteps] = useState({
        hihat: Array(16).fill(false),
        kick: Array(16).fill(false),
        snare: Array(16).fill(false),
    });

    const [volumes, setVolumes] = useState({
        hihat: 0.5,
        kick: 0.5,
        snare: 0.5,
    });

    const audioContext = React.useRef<AudioContext | null>(null);
    const intervalRef = React.useRef<number | null>(null);
    const currentStep = React.useRef(0);
    
    const [currentIndicator, setCurrentIndicator] = useState(-1);

    useEffect(() => {
        audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
        return () => {
            if (audioContext.current) {
                audioContext.current.close();
            }
        };
    }, []);

    const toggleStep = (instrument: string, index: number) => {
        const updatedSteps = { ...activeSteps };
        updatedSteps[instrument][index] = !updatedSteps[instrument][index];
        setActiveSteps(updatedSteps);
    };

    const handleVolumeChange = (instrument: string, value: number) => {
        if (isPlaying) {
            stopPlayback();
        }
        setVolumes((prevVolumes) => ({
            ...prevVolumes,
            [instrument]: value,
        }));
    };

    const toggleEveryOtherStep = (instrument,delimiter) => {
        stopPlayback();
        const updatedSteps = { ...activeSteps };
        updatedSteps[instrument] = updatedSteps[instrument].map((step, index) => index % delimiter === 0);
        setActiveSteps(updatedSteps);
        //startPlayback();
    };

    const startPlayback = () => {
        if (!isPlaying) {
            currentStep.current = 0;
            intervalRef.current = window.setInterval(() => {
                setCurrentIndicator(currentStep.current);
                ['hihat', 'kick', 'snare'].forEach((instrument) => {
                    if (activeSteps[instrument][currentStep.current]) {
                        switch (instrument) {
                            case 'hihat':
                                Hihat.play(audioContext, volumes.hihat);
                                break;
                            case 'kick':
                                Kick.play(audioContext, volumes.kick);
                                break;
                            case 'snare':
                                Snare.play(audioContext, volumes.snare);
                                break;
                            default:
                                break;
                        }
                    }
                });
                currentStep.current = (currentStep.current + 1) % 16;
            }, (60000 / bpm) / 4);
            setIsPlaying(true);
        }
    };

    const stopPlayback = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            setCurrentIndicator(-1);
            setIsPlaying(false);
        }
    };

    const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBpm(Number(e.target.value));
    };

    return (
        <div >
            <Paper 
                elevation={8} 
                className="drum-machine"
                sx={{
                    bgcolor:'lightslategrey'
                }}
                >
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
                        b# Drum Machine
                </Paper>
            <div className="bpm-control">
                
                    <Paper elevation={2} sx={{color:'whitesmoke', bgcolor:'lightseagreen', width:'80px',fontSize:'1.2rem',padding:'4px'}}>
                        <Speed sx={{fontSize:'3rem', color:'black'}}/>
                        BPM:
                        <input
                            className="bpm-input"
                            type="number"
                            value={bpm}
                            onChange={handleBpmChange}
                            min="40"
                            max="240"
                        />
                    </Paper>
                
                
            </div>



            <div className="tracks">          
                <Hihat
                    activeSteps={activeSteps.hihat}
                    toggleStep={(index) => toggleStep('hihat', index)}
                    audioContext={audioContext}
                    volume={volumes.hihat}
                    onVolumeChange={(value) => handleVolumeChange('hihat', value)}
                    toggleEveryOtherStep={toggleEveryOtherStep}
                    currentIndicator={currentIndicator}
                />
                <Kick
                    activeSteps={activeSteps.kick}
                    toggleStep={(index) => toggleStep('kick', index)}
                    audioContext={audioContext}
                    volume={volumes.kick}
                    onVolumeChange={(value) => handleVolumeChange('kick', value)}
                    toggleEveryOtherStep={toggleEveryOtherStep}
                    currentIndicator={currentIndicator}
                />
                <Snare
                    activeSteps={activeSteps.snare}
                    toggleStep={(index) => toggleStep('snare', index)}
                    audioContext={audioContext}
                    volume={volumes.snare}
                    onVolumeChange={(value) => handleVolumeChange('snare', value)}
                    toggleEveryOtherStep={toggleEveryOtherStep}
                    currentIndicator={currentIndicator}
                />
            </div>
            <div className="controls">
                <Button variant='contained' onClick={isPlaying ? stopPlayback : startPlayback}>
                    {isPlaying ? 'Stop' : 'Play'}
                </Button>
            </div>
            </Paper>
        </div>
    );
};

export default DrumMachine;
