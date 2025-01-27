import React, { useState, useEffect } from "react";
import abcjs from "abcjs";

const Sheet = () => {
  const [abcNotationPages, setAbcNotationPages] = useState(["X:1\nT:Transcription\nM:4/4\nL:1/4\nK:C\n"]);
  const [currentPage, setCurrentPage] = useState(0);
  const [midiNotes, setMidiNotes] = useState([]);
  const [defaultNoteLength, setDefaultNoteLength] = useState("1/4");
  const MAX_LINES = 4;
  const NOTES_PER_LINE = 16; // Adjust based on how many notes fit in a line

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    } else {
      alert("Web MIDI API not supported in this browser.");
    }
  }, []);

  useEffect(() => {
    // Update the sheet music when MIDI notes change
    if (midiNotes.length > 0) {
      const pages = [];
      let currentPageNotes = [];

      midiNotes.forEach((note, index) => {
        currentPageNotes.push(noteToAbc(note));
        if ((index + 1) % (NOTES_PER_LINE * MAX_LINES) === 0) {
          pages.push(formatAbcPage(currentPageNotes));
          currentPageNotes = [];
        }
      });

      if (currentPageNotes.length > 0) {
        pages.push(formatAbcPage(currentPageNotes));
      }

      setAbcNotationPages(pages);
      setCurrentPage(pages.length - 1); // Automatically turn to the latest page
    }
  }, [midiNotes]);

  useEffect(() => {
    // Render the current page of sheet music using abcjs
    if (abcNotationPages.length > 0) {
      abcjs.renderAbc("sheet-music", abcNotationPages[currentPage]);
    }
  }, [abcNotationPages, currentPage]);

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
      setMidiNotes((prev) => [...prev, { note, length: defaultNoteLength }]);
    }
  };

  const noteToAbc = ({ note, length }) => {
    const abcDict = ['2','4','8','[',']','(3','z','|',' ',
        'C,,','_D,,','D,,','_E,,','E,,','F,,','^F,,','G,,','_A,,','A,,','_B,,','B,,',
        'C,','_D,','D,','_E,','E,','F,','^F,','G,','_A,','A,','_B,','B,',
        'C','_D','D','_E','E','F','^F','G','_A','A','_B','B',
        'c','_d','d','_e','e','f','^f','g','_a','a','_b','b',
        'c\'','_d\'','d\'','_e\'','e\'','f\'','^f\'','g\'','_a\'','a\'','_b\'','b\''
    ];
    const noteAbc = abcDict[note - 27];
    return `${noteAbc}${length === "1/4" ? "" : length}`;
  };

  const formatAbcPage = (notes) => {
    const lines = [];
    for (let i = 0; i < notes.length; i += NOTES_PER_LINE) {
      lines.push(notes.slice(i, i + NOTES_PER_LINE).join(" "));
    }
    return `X:1\nT:Transcription\nM:4/4\nL:1/4\nK:C\n${lines.join("\n")}`;
  };


  const handleDefaultNoteLengthChange = (event) => {
    setDefaultNoteLength(event.target.value);
  };

  const handleNextPage = () => {
    if (currentPage < abcNotationPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>MIDI to Sheet Music</h1>
      <div id="sheet-music" style={{ border: "1px solid black", margin: "20px", padding: "10px" }}></div>
      <div style={{ marginTop: "20px" }}>
        <label htmlFor="default-note-length">Default Note Length: </label>
        <select id="default-note-length" value={defaultNoteLength} onChange={handleDefaultNoteLengthChange}>
          <option value="1/16">1/16</option>
          <option value="1/8">1/8</option>
          <option value="1/4">1/4</option>
          <option value="1/2">1/2</option>
          <option value="1">1</option>
        </select>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={handlePreviousPage} disabled={currentPage === 0}>
          Previous Page
        </button>
        <span style={{ margin: "0 10px" }}>Page {currentPage + 1} of {abcNotationPages.length}</span>
        <button onClick={handleNextPage} disabled={currentPage === abcNotationPages.length - 1}>
          Next Page
        </button>
      </div>
    </div>
  );
};

export default Sheet;