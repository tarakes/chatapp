
//io("/");

const socket = io("/");
const peer = new Peer(someid, {
 secure: true,
host: 'peerservertarakes.herokuapp.com',
path: '/myapp'
});
socket.on('connect',()=>{

      socket.emit('joinpersonal',document.cookie);
    socket.emit('search_mycontact_list',document.cookie);//event emit
  
  
    socket.on('take_contact_list',(data)=>{//event get
       // console.log(data);
        for(var i=0;i<data.length;i++)
            {
            var ul = document.getElementsByClassName("contact")[0];
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(data[i]));//user will be data.from if to is me
        ul.appendChild(li);   
        }
        
      
     
    })
  //  setTimeout(() => {
      //console.log( document.querySelectorAll('.contact')[0]);
        document.querySelectorAll('.contact')[0].addEventListener("click",(e)=>{
            document.querySelectorAll('.contact')[0].removeAttribute("id");
            document.querySelectorAll('.contact>li').forEach(element => {
                element.removeAttribute("id");
            });
      
 if(e.target.tagName=="LI")
e.target.setAttribute("id","rec");
//setInterval(() => {
document.getElementsByClassName("chat")[0].innerHTML="";
socket.emit("give_me_messg",document.cookie,e.target.textContent);//event emit
//}, 1000);
              

        })
 socket.on("takefile",(filename,me,from,sender)=>{
   let tmpselect=document.getElementById("rec");
  if(tmpselect!=null  && tmpselect.textContent==from){
var imgt = document.createElement("img");
imgt.src="/img?filename="+filename+"&me="+me;
imgt.width="200";
imgt.height="200";
//console.log(tmpselect.textContent);
if(sender!=me)
imgt.style.float="left";
else
imgt.style.float="right";
var tmpli=document.createElement("li");
tmpli.appendChild(imgt);
tmpli.style.height="200px";
imgt.addEventListener("click",()=>{
  window.open(imgt.src);
})
document.getElementsByClassName("chat")[0].appendChild(tmpli);
document.getElementsByClassName("chat")[0].scrollTo(0, 200);
//document.getElementsByClassName("chat")[0].appendChild(document.createElement("br"));
}
 })
socket.on("call_denied",(person)=>{
  Swal.fire(`${person} rejected the call`, '', 'info');
  setTimeout(()=>{
    location.reload();
  },2000)
 
})
socket.on("nosuchuser",()=>{
  $("#add_new_user").notify('No such user exists',"warn");
})
 socket.on('newmessg',(schema)=>{//event get//just modified
   
 
// document.getElementsByClassName("chat")[0].innerHTML="";
schema.forEach(element=>{
if(element.from==document.getElementById("rec").textContent || element.to==document.getElementById("rec").textContent){
var ul = document.getElementsByClassName("chat")[0];

        var li = document.createElement("li");
        li.appendChild(document.createTextNode(`${element.data}`));//user will be data.from if to is me
       
    if(element.from==document.getElementById("rec").textContent){
 li.className = "other_sender";
 li.style.textAlign="left";  
    }
    else{
        li.className = "myself_sender";
        li.style.textAlign="right";   
    }
  
    ul.appendChild(li);  
 let tmp=   document.getElementsByClassName("chat")[0];
   tmp.scrollTo(0, 200);
}
})
    
 })

 document.getElementById("add_new_user").addEventListener("click",()=>{
    if(document.getElementById("new_contact") != "")
     socket.emit('add_new_user',document.cookie,{to:document.getElementById("new_contact").value});
 }) 
 document.getElementById("sendbutton").addEventListener("click",()=>{
     if(document.getElementById("textbox").value != ""){
         socket.emit('store_messg',document.getElementById("textbox").value,document.cookie,document.getElementById("rec").textContent);
         document.getElementById("textbox").value = "";
        }//event emit
     })
 })
 document.getElementById("vc").addEventListener("click",()=>{
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if(document.getElementById("rec") != null)
    getUserMedia({video: true, audio: true}, function(stream) {
      //document.getElementsBy("H1")[0].setAttribute("class", "democlass");
      document.getElementById("leavebutton").style.display="inline-block";
     document.getElementById("me").removeAttribute("class");
     document.getElementById("you").removeAttribute("class");
      document.getElementById("me").setAttribute("class","vcAfter");
      document.getElementById("you").setAttribute("class","vcAfter");
      var call = peer.call(document.getElementById("rec").textContent, stream);
     document.getElementById("leavebutton").addEventListener("click",()=>{
      
        socket.emit("denied",document.getElementById("rec").textContent,document.cookie);
        // console.log("clicked");
       location.reload();
       }) 
      call.on('stream', function(remoteStream) {
        document.getElementById("me").srcObject=stream;
      document.getElementById("you").srcObject=remoteStream;
      });
      call.on('close', () => {
     console.log("denied");
      })
    }, function(err) {
      console.log('Failed to get local stream' ,err);
    });
    else{
      $("#vc").notify('please select a user',"warn");
    return;
    }
 })


 var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
 try{
peer.on('call', function(call) {

  Swal.fire({
    title: `A call is comming from ${call.peer},Do you want to recieve?`,
  
  showDenyButton: true,
  showCancelButton: true,
  confirmButtonText: 'Yes',
  denyButtonText: `No`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      Swal.fire('Picked!', '', 'success')
      document.getElementById("leavebutton").addEventListener("click",()=>{
      
        socket.emit("denied",call.peer,document.cookie);
        // console.log("clicked");
       location.reload();
       })
      document.getElementById("leavebutton").style.display="inline-block";
      document.getElementById("me").removeAttribute("class");
      document.getElementById("you").removeAttribute("class");
       document.getElementById("me").setAttribute("class","vcAfter");
       document.getElementById("you").setAttribute("class","vcAfter");
      getUserMedia({video: true, audio: true}, function(stream) {
        call.answer(stream); // Answer the call with an A/V stream.
        call.on('stream', function(remoteStream) {
          console.log(call.peer);
        if(!remoteStream){
          Swal.fire(`Call disconnected!`, '', 'info'); 
          return; 
        }
         document.getElementById("me").srcObject=stream;
        document.getElementById("you").srcObject=remoteStream; 
          
        });
        call.on('close', () => {
          document.getElementById("me").srcObject="";
          document.getElementById("you").srcObject="";
        })
      }, function(err) {
        console.log('Failed to get local stream' ,err);
      });
    } else {
      Swal.fire('Call denied!', '', 'info')
      socket.emit("denied",call.peer,document.cookie);
    }
  })
  
  
  








    //console.log(call);
   // window.focus();
  //var bl=  window.confirm("A call is comming...");
  //if(bl)
 


  }
  );

  document.getElementById("submitbt").addEventListener("click",()=>{
    var form = document.getElementById("myform");
    var formData = new FormData(form);
    
    if(document.getElementById("actual-btn").files.length != 0  &&   document.getElementById("rec")!=null){
    fetch(`/submit/?to=${document.getElementById("rec").textContent}`, {
      method: 'POST',
      body: formData
    })
    .then((res)=>{
      document.getElementById("myform").reset();
      socket.emit('new_file',document.getElementById("rec").textContent);
      return res.json();
    })
    .then((data)=>{
      $("#submitbt").notify('File sent successfully','success');
    })
    .catch((err)=>{
      $("#submitbt").notify('File couldnot send!');
    }) }
    else if(document.getElementById("rec")==null){   $("#submitbt").notify('Plz select a user'); }
    else{
      $("#submitbt").notify('No file selected');
    }
    })
}
  catch(err){
    console.log(err);
  }
  document.getElementById("logoutbutton").addEventListener("click",()=>{
    fetch("/logout",{
      method:'GET'
    })
    .then((res)=>{
      $.notify('Logout successfully','success');
      setTimeout(()=>{
        window.open('/','_self');
      },2000)
      
    })
    .catch((err)=>{
      $("#logoutbutton").notify('Couldnot logout!');
    })
  })
  





 

