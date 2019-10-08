try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
} catch (e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
}


var noteTextarea = $('#note-textarea');
var instructions = $('#recording-instructions');
var notesList = $('ul#notes');

var noteContent = '';

// Get all notes from previous sessions and display them.
var notes = getAllNotes();
renderNotes(notes);



/*-----------------------------
      Voice Recognition 
------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses. 
recognition.continuous = true;
// This block is called every time the Speech APi captures a line. 
recognition.onresult = function(event) {

    // event is a SpeechRecognitionEvent object.
    // It holds all the lines we have captured so far. 
    // We only need the current one.
    var current = event.resultIndex;

    // Get a transcript of what was said.
    var transcript = event.results[current][0].transcript;

    // Add the current transcript to the contents of our Note.
    // There is a weird bug on mobile, where everything is repeated twice.
    // There is no official solution so far so we have to handle an edge case.
    var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

    if (!mobileRepeatBug) {
        noteContent += transcript;
        noteTextarea.val(noteContent);
    }
};

recognition.onstart = function() {
    instructions.text('Voice recognition activated. Try speaking into the microphone.');
}

recognition.onspeechend = function() {
    instructions.text('You were quiet for a while so voice recognition turned itself off.');
}

recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
        instructions.text('No speech was detected. Try again.');
    };
}



/*-----------------------------
      App buttons and input 
------------------------------*/
document.body.onkeypress = function(e) {
    if (e.keyCode == 17) {
        if (noteContent.length) {
            noteContent += ' ';
        }
        reread();
    }
}

document.body.onkeydown = function(e) {
    if (e.keyCode == 13) {
        if (noteContent.length) {
            noteContent += ' ';
        }
        speak();
    }
}

document.body.onkeydown = function(e) {
    if (e.keyCode == 32) {
        if (noteContent.length) {
            noteContent += ' ';
        }
        recognition.start();
    }
}

document.addEventListener('keydown', function(e) {
    // This would be triggered by pressing CTRL + A
    if (e.keyCode == 77) {
        instructions.text('Voice recognition paused.');
        recognition.stop();

    }
}, false);


document.addEventListener('keydown', function(e) {
	//Triggered on pressing del key
	//Deletes and clears textbox for the purpose of re-answering a question
    if (e.keyCode == 46) {
        recognition.stop();
        if (!noteContent.length) {
            instructions.text('Empty note. Please answer the above question.');
        } else {
			document.getElementById('note-textarea').value = 'Re-Answer question 1: ';
			instructions.text('Note successfully deleted! Please re-answer the question.');
			noteContent = ' ';
			recognition.start();
		}

    }
}, false);






// Sync the text inside the text area with the noteContent variable.
noteTextarea.on('input', function() {
    noteContent = $(this).val();
})

document.addEventListener('keydown', function(e) {
    // This would be triggered by pressing CTRL + A
    if (e.keyCode == 18) {
        recognition.stop();
		
        if (!noteContent.length) {
            instructions.text('Could not save empty note. Please add a message to your note.');
        } else {
            // Save note to localStorage.
            // The key is the dateTime with seconds, the value is the content of the note.
            saveNote(new Date().toLocaleString(), noteContent);

            // Reset variables and update UI.
            noteContent = '';
            renderNotes(getAllNotes());
            noteTextarea.val('');
            instructions.text('Note saved successfully.');
        }

    }
}, false);

notesList.on('click', function(e) {
    e.preventDefault();
    var target = $(e.target);

    // Listen to the selected note.
    if (target.hasClass('listen-note')) {
        var content = target.closest('.note').find('.content').text();
        readOutLoud(content);
    }

    // Delete note.
    if (target.hasClass('delete-note')) {
        var dateTime = target.siblings('.date').text();
        deleteNote(dateTime);
        target.closest('.note').remove();
    }
});



/*-----------------------------
      Speech Synthesis 
------------------------------*/

function readOutLoud(message) {
    var speech = new SpeechSynthesisUtterance();

    // Set the text and voice attributes.
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}



/*-----------------------------
      Helper Functions 
------------------------------*/

function renderNotes(notes) {
    var html = '';
    if (notes.length) {
        notes.forEach(function(note) {
            html += `<li class="note">
        <p class="header">
          <span class="date">${note.date}</span>
          <a href="#" class="listen-note" title="Listen to Note">Listen to Note</a>
          <a href="#" class="delete-note" title="Delete">Delete</a>
        </p>
        <p class="content">${note.content}</p>
      </li>`;
        });
    } else {
        html = '<li><p class="content">You don\'t have any notes yet.</p></li>';
    }
    notesList.html(html);
}


function saveNote(dateTime, content) {
    localStorage.setItem('note-' + dateTime, content);
}


function getAllNotes() {
    var notes = [];
    var key;
    for (var i = 0; i < localStorage.length; i++) {
        key = localStorage.key(i);

        if (key.substring(0, 5) == 'note-') {
            notes.push({
                date: key.replace('note-', ''),
                content: localStorage.getItem(localStorage.key(i))
            });
        }
    }
    return notes;
}


function deleteNote(dateTime) {
    localStorage.removeItem('note-' + dateTime);
}

function checkCompatibility () {
    if(!('speechSynthesis' in window))
    {
        alert('Your browser is not compatible');
    }
};



var myText = document.getElementById('myText');
var ans = document.getElementById('note-textarea');
var voiceMap = [];
function loadVoices(){
    var voices = speechSynthesis.getVoices;
    for(var i = 0; i < voices.length;i++)
    {
        var voice = voices[i];
        var option = document.createElement('option');
        option.value = voice.name;
        option.innerHTML = voice.name;
        voiceOptions.appendChild(option);
        voiceMap[voice.name]= voice;
    };
};
window.speechSynthesis.onvoiceschanged = function(e){
    loadVoices();
};
function speak () {
    var msg = new SpeechSynthesisUtterance();
    //msg.volume = volumeSlider.value;
    //msg.voice = voiceMap[voiceOptions.value];
    //msg.rate = rateSlider.value;
    //msg.pitch = pitchSlider.value;
    msg.text = myText.value;
    window.speechSynthesis.speak(msg);
};

function reread(){
	var txtmsg= new SpeechSynthesisUtterance();
	txtmsg.text = ans.value;
	window.speechSynthesis.speak(txtmsg);
}