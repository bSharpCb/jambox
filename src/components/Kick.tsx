import React, { useState, useEffect } from "react";

const Kick = () => {

    const [activeNotes, setActiveNotes] = useState([
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ]);
    
    var context = new AudioContext();
    
    const playKick = (when) => {
        var oscillator = context.createOscillator();
        var gain = context.createGain();
        oscillator.connect(gain);
        gain.connect(context.destination);
        
        oscillator.frequency.setValueAtTime(150, when);
        gain.gain.setValueAtTime(1, when);
        oscillator.frequency.exponentialRampToValueAtTime(0.001, when + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, when + 0.5);
        
        oscillator.start(when);
        oscillator.stop(when + 0.5);
    }
    

    const dittyData = {
        0: { key: "1"},
        1: { key: "1e"},
        2: { key: "1and"},
        3: { key: "1a"},
        4: { key: "2"},
        5: { key: "2e"},
        6: { key: "2and"},
        7: { key: "2a"},
        8: { key: "3"},
        9: { key: "3e"},
        10: { key: "3and"},
        11: { key: "3a"},
        12: { key: "4"},
        13: { key: "4e"},
        14: { key: "4and"},
        15: { key: "4a"}
    }

    function squareClick(i) {

        const nextActive = activeNotes.map(note => {
            if (note == 0) {
                return 1;
            } else {
                return 0;
            }
        });
        setActiveNotes(nextActive);
    }
    
    const squares = [];    
    for (var i = 0; i < 16; i++) {
        //this *always* loops
        // however, check the index against a JSON that describes the active state of the grid

        /**
         * e.g.
         * json = {
         *  kick = [0,8]
         *  hh = [0...15]
         *  snare = [4,12]
         * }
         * 
         * if (json.kick.includes(i)) {
         *  kick.synth()
         * }
         * 
         * if (json.hh.includes(i)) {
         *  hh.synth()
         * }
         * 
         * if (json.snare.includes(i)) {
         *  snare.synth()
         * }
         * 
         */
        const isActive = activeNotes[i];
        const squareData = dittyData[i] || {};
        squares.push(
            <div
            key={i}
            style={{
              flex: "0 0 50px",
              height: "50px",
              backgroundColor: isActive ? "lightblue" : "black",
              color: "white",
              border: "1px solid black",
              borderRadius: "25%",
              margin:  "0 -25px",
              zIndex: 1,
              position: "relative"
            }}
            >
            <button onClick={()=> {
                setActiveNotes(activeNotes[i] = );
            }} >
            {squareData.key || ""}
          </div>
        )
        playKick(i * 0.5); // Sounds fine with multiplier set to 1
    }


    return (
        <div style={{ textAlign: "center" }}>
      <h1>MIDI Piano Visualizer</h1>
      <div style={{ display: "flex", flexWrap: "nowrap", position: "relative" }}>{renderPianoKeys()}</div>
    </div>
  );
}