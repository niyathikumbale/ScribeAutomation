function myFunction() {
	//alert("111");
window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    let finalTranscript = '';
	var str ="";
    let recognition = new window.SpeechRecognition();
	recognition.lang="en-IN";
    recognition.interimResults = true;
    recognition.maxAlternatives = 10;
    recognition.continuous = true;
    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
        let transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
			finalTranscript += transcript;
			alert(interimTranscript);
			//document.querySelector('#textbox').innerHTML = finalTranscript;
		    
        } 
		else 
			{interimTranscript += transcript;
		//document.querySelector('#textbox').innerHTML = finalTranscript;
		//str=interimTranscript;
		alert(interimTranscript);}
        
      }
	  
	 
    window.document.querySelector('#textbox1').innerHTML = finalTranscript + interimTranscript;
	alert(finalTranscript + interimTranscript);
	//window.document.getElementById('#textbox1').value=finalTranscript + interimTranscript;
	}
    recognition.start();
  
}