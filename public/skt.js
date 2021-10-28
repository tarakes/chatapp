  const socket = io();

 
  
   const constraints = {
    'video': true,
    'audio': true
}

   let bd =  document.getElementById("grid");
   navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
        console.log('Got MediaStream:', stream);
       
       bd.srcObject = stream;
  
    })
    .catch(error => {
        console.error('Error accessing media devices.', error);
    });